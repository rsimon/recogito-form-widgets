import React from 'react';
import { BiNetworkChart } from 'react-icons/bi';
import { RiNodeTree } from 'react-icons/ri';

import Autocomplete from '@recogito/recogito-client-core/src/editor/widgets/Autocomplete';

const TaxonomyTagInput = props => {

  const tags = props.annotation.bodies.filter(b => b.purpose === 'identifying');

  const onInputSubmit = ({ uri }) => {
    const term = props.taxonomy.findByURI(uri);
    props.onAddTerm(term);
  }

  const vocabulary = props.taxonomy.listTerms().map(term =>
    ({ uri: term.uri, label: term.getPrefLabel().label }));

  return (
    <div className="r6o-widget r6o-taxonomy r6o-tag">
      {tags.length === 0 &&
        <div 
          className="r6o-taxonomy-input-placeholder">
          <BiNetworkChart />
        </div>
      }

      {tags.length > 0 &&
        <ul className="r6o-taglist">
          {tags.map(tag =>
            <li key={tag.source.id}>
              <span className="r6o-label">{tag.source.label}</span>
            </li>
          )}
        </ul>
      }

      {!props.readOnly &&
        <Autocomplete 
          focus={props.focus}
          placeholder="Taxonomie durchsuchen..."
          vocabulary={vocabulary}
          onSubmit={onInputSubmit}/>
      }

      <button
        className="r6o-taxonomy-open-treebrowser"
        onClick={props.onToggleTreebrowser}>
        <RiNodeTree />
      </button>
    </div>
  )

}

export default TaxonomyTagInput;