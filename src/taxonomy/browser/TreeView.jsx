import React, { useEffect, useRef, useState } from 'react';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';

const TreeNode = props => {

  const el = useRef();

  const uri = props.node.uri;

  const label = props.node.getPrefLabel().label;

  const isOpen = props.openStates.find(u => u === uri);

  const children = props.taxonomy.getChildren(props.node.uri);

  useEffect(() => {
    if (el.current && props.highlighted === uri)
      el.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const childNodes = children.map((n, idx) => 
      <TreeNode
        key={n.uri} 
        isLast={idx === children.length - 1}
        taxonomy={props.taxonomy} 
        node={n} 
        openStates={props.openStates}
        highlighted={props.highlighted}
        onSelect={props.onSelect}
        onSetOpen={props.onSetOpen} />); 

  // Shorthand
  const hasChildNodes = childNodes.length > 0;

  const onSelect = () => 
    props.onSelect(props.node);

  return (
    <li
      ref={el} 
      className={props.isLast && 'last'}>
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

      <label
        className={props.highlighted === uri ? 'highlighted' : null} 
        onClick={onSelect}>{label}</label>

      {hasChildNodes && isOpen &&
        <ul>{childNodes}</ul>
      }
    </li>
  );

}

const TreeView = props => {

  // Lazy records which leaves are in open state
  const [ openLeaves, setOpenLeaves ] = useState([]);

  useEffect(() => {
    if (props.highlighted) {
      const openLeaves = 
        props.taxonomy.getParents(props.highlighted.uri).map(term => term.uri);

      setOpenLeaves(openLeaves);
    }
  }, [ props.highlighted ]);

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
        highlighted={props.highlighted?.uri}
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