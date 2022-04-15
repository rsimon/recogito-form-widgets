import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Rnd } from 'react-rnd';
import { RiCloseFill } from 'react-icons/ri';

import TreeView from './TreeView';
import TaxonomySearch from './TaxonomySearch';

const TaxonomyBrowser = props => {

  const [ preselected, setPreselected ] = useState(null);
  
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

          <TaxonomySearch 
              taxonomy={props.taxonomy} 
              onPreSelect={setPreselected}
              onSelect={props.onSelectTerm} />

          <main>
            <TreeView 
              taxonomy={props.taxonomy}
              highlighted={preselected}
              onSelect={props.onSelectTerm} />
          </main>
        </div>
      </div>
    </Rnd>,

    document.body
  );

}

export default TaxonomyBrowser;