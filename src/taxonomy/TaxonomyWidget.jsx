import React, { useState } from 'react';

import TaxonomyTagInput from './taginput/TaxonomyTagInput';
import TaxonomyBrowser from './browser/TaxonomyBrowser';

const TaxonomyWidget = props => {

  const [ isTreebrowserOpen, setTreebrowserOpen ] = useState(false);

  const onCloseTreebrowser = () => 
    setTreebrowserOpen(false);

  const onToggleTreebrowser = () =>
    setTreebrowserOpen(!isTreebrowserOpen);

  const onSelectTerm = term => {
    console.log('selected term', term);
  }

  return (
    <>
      <TaxonomyTagInput 
        config={props.config}
        taxonomy={props.taxonomy} 
        onToggleTreebrowser={onToggleTreebrowser} />

      {isTreebrowserOpen && 
        <TaxonomyBrowser
          config={props.config} 
          taxonomy={props.taxonomy} 
          onSelectTerm={onSelectTerm}
          onClose={onCloseTreebrowser} /> 
      }
    </>
  )

}

export default TaxonomyWidget;