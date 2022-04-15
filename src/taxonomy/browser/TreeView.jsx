import React, { useState } from 'react';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';

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

  const children = props.taxonomy.getChildren(props.node.uri);

  const childNodes = children.map((n, idx) => 
      <TreeNode
        key={n.uri} 
        isLast={idx === children.length - 1}
        taxonomy={props.taxonomy} 
        node={n} 
        openStates={props.openStates}
        onSelect={props.onSelect}
        onSetOpen={props.onSetOpen} />); 

  // Shorthand
  const hasChildNodes = childNodes.length > 0;

  const onSelect = () => 
    props.onSelect(props.node);

  return (
    <li className={props.isLast && 'last'}>
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
    .map((n,idx) => 
      <TreeNode
        key={n.uri} 
        isLast={idx === props.taxonomy.rootTerms.length - 1}
        taxonomy={props.taxonomy} 
        node={n} 
        openStates={openLeaves}
        onSelect={props.onSelect}
        onSetOpen={onSetLeafState} />);

  return (
    <div className="r6o-taxonomy r6o-taxonomytree">
      <ul>
        {rootNodes}
      </ul>
    </div>
  ) 

}

export default TreeView;