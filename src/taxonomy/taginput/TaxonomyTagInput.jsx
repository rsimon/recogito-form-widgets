import React, { useState } from 'react';
import { BiNetworkChart } from 'react-icons/bi';
import { RiNodeTree } from 'react-icons/ri';
import { CSSTransition } from 'react-transition-group';

import Autocomplete from '@recogito/recogito-client-core/src/editor/widgets/Autocomplete';
import { CloseIcon } from '@recogito/recogito-client-core/src/Icons';

const TaxonomyTagInput = props => {

  const [ showDelete, setShowDelete ] = useState(false);

  const tags = props.annotation.bodies.filter(b => b.purpose === 'identifying');

  const toggle = tag => () => {
    if (showDelete === tag) // Removes delete button
      setShowDelete(false);
    else
      setShowDelete(tag); // Sets delete button on a different tag
  }

  const onDelete = tag => evt => {
    evt.stopPropagation();
    props.onRemoveBody(tag);
  }

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
            <li key={tag.source.id} onClick={toggle(tag)}>
              <span className="r6o-label">{tag.source.label}</span>

              <CSSTransition in={showDelete === tag} timeout={200} classNames="r6o-delete">
                <span className="r6o-delete-wrapper" onClick={onDelete(tag)}>
                  <span className="r6o-delete">
                    <CloseIcon width={12} />
                  </span>
                </span>
              </CSSTransition>
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