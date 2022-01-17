import React, { useEffect, useState } from 'react';

import TaxonomyWidget from './TaxonomyWidget';

import { load as loadJSKOS } from './load/jskos';

import './index.scss';

let CACHED_TAXONOMY = null;

const loadTaxonomy = async config => {
  let loadFn;

  if (config.format.toLowerCase() === 'jskos')
    loadFn = loadJSKOS;
  else 
    throw new `Unsupported taxonomy format: ${config.format}`

  // Switch between different formats based on config later!
  return fetch(config.src)
    .then(response => response.json())
    .then(result => {
      const taxonomy = loadFn(result);

      CACHED_TAXONOMY = taxonomy;
      return taxonomy;
    });
}

export default config => () => {

  const [ taxonomy, setTaxonomy ] = useState();

  useEffect(() => {
    // We don't want to reload every time the editor opens!
    if (CACHED_TAXONOMY) {
      setTaxonomy(CACHED_TAXONOMY);
    } else {
      loadTaxonomy(config).then(setTaxonomy);
    } 
  }, []);

  return taxonomy ?
    <TaxonomyWidget 
      config={config}
      taxonomy={taxonomy} />    
    :

    <div>LOADING</div>;

}