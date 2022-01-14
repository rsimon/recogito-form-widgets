import React, { useEffect, useState } from 'react';

import { load as loadJSKOS } from './jskos';

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

export default config => props => {

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
    <div>Hello World</div> : <div>LOADING</div>;

}