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

  if (config.src) {
    return fetch(config.src)
      .then(response => response.json())
      .then(result => {
        const taxonomy = loadFn(result);

        CACHED_TAXONOMY = taxonomy;
        return taxonomy;
      });
  } else if (config.taxonomy) {
    return new Promise(resolve => {
      const taxonomy = loadFn(config.taxonomy);
      CACHED_TAXONOMY = taxonomy;
      resolve(taxonomy);
    });
  } else {
    throw new "No taxonomy defined. Please provide a taxonomy object or source URL";
  }
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