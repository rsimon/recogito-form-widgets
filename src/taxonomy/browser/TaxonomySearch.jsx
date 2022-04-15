import React, { useEffect, useRef, useState } from 'react';
import { MdSearch, MdClear } from 'react-icons/md';

const TaxonomySearch = props => {

  const el = useRef();

  const [ search, setSearch ] = useState('');

  const [ results, setResults ] = useState([]);

  const [ highlightedIndex, setHighlightedIndex ] = useState(-1);

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

  const onKeyDown = evt => {
    if (evt.key === 'Tab') {
      evt.preventDefault();

      if (results.length > 0)
        setHighlightedIndex((highlightedIndex + 1) % results.length);
    } else if (evt.key === 'ArrowDown') {
      evt.preventDefault();

      if (results.length > 0 && highlightedIndex < results.length - 1)
        setHighlightedIndex(Math.min(highlightedIndex + 1, results.length - 1));
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault();

      if (results.length > 0 && highlightedIndex > 0)
        setHighlightedIndex(Math.max(highlightedIndex - 1, 0));
    } else if (evt.key === 'Enter') {
      evt.preventDefault();

      const selected = results.find(r => r.getPrefLabel().label.toLowerCase() === search.toLowerCase());
      if (selected) {
        props.onSelect(selected);
      } else if (highlightedIndex >= 0) {
        setSearch(results[highlightedIndex].getPrefLabel().label);
      }
    }
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
          onKeyDown={onKeyDown}
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
          {results.map((term, idx) => (
            <li 
              className={highlightedIndex === idx ? 'highlighted' : null}
              key={term.uri}
              onClick={() => props.onSelect(term)}>{term.getPrefLabel().label}</li>
          ))}
        </ul>
      </div>
    </div>
  )

}

export default TaxonomySearch;