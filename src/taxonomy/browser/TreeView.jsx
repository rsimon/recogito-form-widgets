import React, { useState } from 'react';
import { AiOutlineLine, AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';

// Shorthand
const toTreeNode = (taxonomy, node, openStates, onSelect, onSetOpen) =>
  <TreeNode
    key={node.uri} 
    taxonomy={taxonomy} 
    node={node} 
    openStates={openStates}
    onSelect={onSelect}
    onSetOpen={onSetOpen} /> 

const TreeNode = props => {

  const uri = props.node.uri;

  const label = props.node.getPrefLabel().label;

  const isOpen = props.openStates.find(u => u === uri);

  const childNodes = props.taxonomy.getChildren(props.node.uri)
    .map(n => toTreeNode(
      props.taxonomy, 
      n,
      props.openStates,
      props.onSelect,
      props.onSetOpen));

  // Shorthand
  const hasChildNodes = childNodes.length > 0;

  const onSelect = () => 
    props.onSelect(props.node);

  return (
    <li>
      <AiOutlineLine
        className="vertical-line" />

      {hasChildNodes && isOpen &&
        <AiOutlineMinusCircle
          className="expand"
          onClick={() => props.onSetOpen(uri, false)} />
      }

      {hasChildNodes && !isOpen &&
        <AiOutlinePlusCircle
          className="expand"
          onClick={() => props.onSetOpen(uri, true)} />
      }

      <label onClick={onSelect}>{label}</label>

      {hasChildNodes && isOpen &&
        <ul>{childNodes}</ul>
      }
    </li>
  );

}

const TreeView = props => {

  // Lazy records which leaves are in open state
  const [ openLeaves, setOpenLeaves ] = useState([]);

  const onSetLeafState = (uri, open) => {
    if (open && !openLeaves.includes(uri)) {
      setOpenLeaves([...openLeaves, uri]);
    } else {
      setOpenLeaves(openLeaves.filter(l => l !== uri));
    }
  }

  const rootNodes = props.taxonomy.rootTerms
    .map(n => toTreeNode(
      props.taxonomy, 
      n, 
      openLeaves,
      props.onSelect,
      onSetLeafState));

  return (
    <ul>
      {rootNodes}
    </ul>
  ) 

}

export default TreeView;