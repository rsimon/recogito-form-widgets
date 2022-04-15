import React, { useState } from 'react';
import { MdSearch } from 'react-icons/md';

const TaxonomySearch = props => {

  const [ search, setSearch ] = useState('');

  const [ results, setResults ] = useState([]);

  const onChange = evt => {
    const { value } = evt.target;
    setSearch(value);

    const results = props.taxonomy.search(value);
    setResults(results);
  } 

  return (
    <div className="r6o-taxonomy r6o-taxonomysearch">
      <div classNAme="r6o-taxonomy r6o-taxonomysearch-input">
        <input
          type="text" 
          value={search}
          onChange={onChange} />

        <MdSearch />
      </div>  
      <div className="r6o-taxonomy r6o-taxonomysearch-results">
        <ul>
          {results.map(term => (
            <li key={term.uri}>{term.getPrefLabel().label}</li>
          ))}
        </ul>
      </div>
    </div>
  )

}

export default TaxonomySearch;