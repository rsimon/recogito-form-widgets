import React from 'react';
import ReactDOM from 'react-dom';
import { Rnd } from 'react-rnd';
import { RiCloseFill } from 'react-icons/ri';
import TreeView from './TreeView';

const TaxonomyBrowser = props => {

  return ReactDOM.createPortal(
    <Rnd 
      default={{
        x: Math.min(props.openAt.x, window.innerWidth - 470),
        y: props.openAt.y + window.scrollY,
        width:440,
        height:340
      }}
      dragHandleClassName="handle">
      <div className="r6o-taxonomy r6o-taxonomybrowser">
        <div className="r6o-taxonomy r6o-taxonomybrowser-wrapper">
          <header className="handle">
            <h1>Taxonomy</h1>
            <RiCloseFill
              className="icon close" 
              onClick={props.onClose} />
          </header>

          <main>
            <TreeView 
              config={props.config}
              taxonomy={props.taxonomy}
              onSelect={props.onSelectTerm} />
          </main>
        </div>
      </div>
    </Rnd>,

    document.body
  );

}

export default TaxonomyBrowser;