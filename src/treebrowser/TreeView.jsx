import React, { useState } from 'react';

// Shorthand
const toTreeNode = (tree, node) =>
  <TreeNode
    key={node.uri} 
    tree={tree} 
    node={node} /> 

const TreeNode = props => {

  const [ isOpen, setOpen ] = useState();

  const label = props.node.getPrefLabel().label;

  const childNodes = props.tree.getChildren(props.node.uri)
    .map(n => toTreeNode(props.tree, n));

  // Shorthand
  const hasChildNodes = childNodes.length > 0;

  return (
    <li>
      {hasChildNodes && isOpen &&
        <span onClick={() => setOpen(false)} className="icon">-</span>
      }

      {hasChildNodes && !isOpen &&
        <span onClick={() => setOpen(true)} className="icon">+</span>
      }

      {label}

      {hasChildNodes && isOpen &&
        <ul>{childNodes}</ul>
      }
    </li>
  );

}

const TreeView = props => {

  const rootNodes = props.tree.rootNodes
    .map(n => toTreeNode(props.tree, n));

  return (
    <ul>
      {rootNodes}
    </ul>
  ) 

}

export default TreeView;