import React, { useEffect, useState } from 'react';

import TaxonomyWidget from './TaxonomyWidget';

import { load as loadJSKOS } from './load/jskos';

import './index.scss';

let CACHED_TAXONOMY = null;

const determineLoader = config => {
  // Loader is either the user-defined crosswalk, or defined by the format
  if (config.crosswalk)
    return json => loadJSKOS(config.crosswalk(json));

  // Default taxonomy format is JSKOS
  const format = config.format?.toLowerCase() || 'jskos';

  if (format === 'jskos')
    return loadJSKOS;
  else 
    throw new `Unsupported taxonomy format: ${config.format}`
}

const loadTaxonomy = async config => {
  const loadFn = determineLoader(config);

  if (config.src) {
    // Remote fetch
    return fetch(config.src)
      .then(response => response.json())
      .then(result => {
        const taxonomy = loadFn(result);
        CACHED_TAXONOMY = taxonomy;
        return taxonomy;
      });
  } else if (config.taxonomy) {
    // Local parse
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