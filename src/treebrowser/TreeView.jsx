import React, { useState } from 'react';

// Shorthand
const toTreeNode = (tree, node, openStates, onSetOpen) =>
  <TreeNode
    key={node.uri} 
    tree={tree} 
    node={node} 
    openStates={openStates}
    onSetOpen={onSetOpen} /> 

const TreeNode = props => {

  const uri = props.node.uri;

  const label = props.node.getPrefLabel().label;

  const isOpen = props.openStates.find(u => u === uri);

  const childNodes = props.tree.getChildren(props.node.uri)
    .map(n => toTreeNode(
      props.tree, 
      n,
      props.openStates,
      props.onSetOpen));

  // Shorthand
  const hasChildNodes = childNodes.length > 0;

  return (
    <li>
      {hasChildNodes && isOpen &&
        <span onClick={() => props.onSetOpen(uri, false)} className="icon">-</span>
      }

      {hasChildNodes && !isOpen &&
        <span onClick={() => props.onSetOpen(uri, true)} className="icon">+</span>
      }

      {label}

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

  const rootNodes = props.tree.rootNodes
    .map(n => toTreeNode(
      props.tree, 
      n, 
      openLeaves,
      onSetLeafState));

  return (
    <ul>
      {rootNodes}
    </ul>
  ) 

}

export default TreeView;