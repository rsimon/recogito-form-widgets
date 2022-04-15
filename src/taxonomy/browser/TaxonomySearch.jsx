import React, { useEffect, useRef, useState } from 'react';
import { MdSearch, MdClear } from 'react-icons/md';

const TaxonomySearch = props => {

  const el = useRef();

  const [ search, setSearch ] = useState('');

  const [ results, setResults ] = useState([]);

  useEffect(() => {
    if (el.current)
      el.current.querySelector('input').focus();
  }, []);

  const onChange = evt => {
    const { value } = evt.target;
    setSearch(value);

    const results = props.taxonomy.search(value);
    setResults(results);
  } 

  const onClear = () => {
    setSearch('');
    setResults([]); 
  }

  return (
    <div 
      ref={el}
      className="r6o-taxonomy r6o-taxonomysearch">

      <div className="r6o-taxonomy r6o-taxonomysearch-input">
        <input
          type="text" 
          value={search}
          onChange={onChange} />

        {search.length > 0 ? 
          <button onClick={onClear}>
            <MdClear />
          </button> :
          
          <button>
            <MdSearch />            
          </button>
        }
      </div>  
      <div className="r6o-taxonomy r6o-taxonomysearch-results">
        <ul>
          {results.map(term => (
            <li 
              key={term.uri}
              onClick={() => props.onSelect(term)}>{term.getPrefLabel().label}</li>
          ))}
        </ul>
      </div>
    </div>
  )

}

export default TaxonomySearch;