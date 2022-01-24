import React, { useState } from 'react';

import TaxonomyTagInput from './taginput/TaxonomyTagInput';
import TaxonomyBrowser from './browser/TaxonomyBrowser';

/**
 * Tests if the annotation already contains this
 * taxonomy tag. 
 */
const includes = (annotation, tag) => {
  const tags = annotation.bodies.filter(b => b.purpose === 'identifying');
  return tags.find(t => t.source?.id === tag.uri);
}

const TaxonomyWidget = props => {

  const [ treebrowserOpenAt, setTreebrowserOpen ] = useState(false);

  const onCloseTreebrowser = () => 
    setTreebrowserOpen(false);

  const onToggleTreebrowser = evt => {
    if (treebrowserOpenAt)
      setTreebrowserOpen(false);
    else
      setTreebrowserOpen({ x: evt.clientX, y: evt.clientY });
  }

  const onAddTerm = term => {
    // Don't add more than once!
    if (!includes(props.annotation, term)) {
      const body = {
        type: 'SpecificResource',
        purpose: 'identifying',
        source: {
          id: term.uri,
          label: term.getPrefLabel().label
        }
      }

      props.onAppendBody(body);
      setTreebrowserOpen(false);
    }
  }

  return (
    <>
      <TaxonomyTagInput 
        {...props}
        onAddTerm={onAddTerm}
        onToggleTreebrowser={onToggleTreebrowser} />

      {treebrowserOpenAt && 
        <TaxonomyBrowser
          openAt={treebrowserOpenAt}
          {...props}
          onSelectTerm={onAddTerm}
          onClose={onCloseTreebrowser} /> 
      }
    </>
  )

}

export default TaxonomyWidget;