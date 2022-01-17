import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { RiCloseFill } from 'react-icons/ri';
import TreeView from './TreeView';

const TaxonomyBrowser = props => {

  return ReactDOM.createPortal(
    <Draggable handle="header">
      <div className="r6o-taxonomy r6o-taxonomybrowser">
        <header>
          <label>Taxonomy</label>
          <RiCloseFill
            className="icon close" 
            onClick={props.onClose} />
        </header>

        <main>
          <TreeView 
            config={props.config}
            taxonomy={props.taxonomy} />
        </main>
      </div>
    </Draggable>,

    document.body
  );

}

export default TaxonomyBrowser;