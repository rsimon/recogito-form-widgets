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
    const urls = Array.isArray(config.src) ? config.src : [ config.src ];

    const tryOne = url => {
      return fetch(url)
        .then(response => response.json())
        .then(result => {
          const taxonomy = loadFn(result);
          CACHED_TAXONOMY = taxonomy;
          return taxonomy;
        }).catch(err => {
          console.log(`Failed to load taxonomy from ${url}`);
          if (urls.length > 0)
            return tryOne(urls.shift());
        });
    }

    return tryOne(urls.shift());
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
    <TaxonomyWidget 
      {...props}
      config={config}
      taxonomy={taxonomy} />    
    :

    <div>LOADING</div>;

}