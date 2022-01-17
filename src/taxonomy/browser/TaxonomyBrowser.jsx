import React from 'react';
import ReactDOM from 'react-dom';

const TaxonomyBrowser = props => {

  return ReactDOM.createPortal(
    <div className="r6o-taxonomy r6o-taxonomybrowser">
      Treebrowser...
    </div>,
    document.body
  );

}

export default TaxonomyBrowser;