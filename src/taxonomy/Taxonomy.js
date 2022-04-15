import FlexSearch from 'flexsearch';

const termToDocument = term => ({
  id: term.uri,
  labels: term.labels.map(l => l.label).join(' ')
});

const normalizeLabels = labels => {
  if (Array.isArray(labels)) {
    // Array of strings or { label, lang }
    return labels.map(l => l.label ? l : { label: l });
  } else {
    // String
    return [ { label: labels }];
  }
}

export class Term {

  constructor(uri, labels, parent) {
    this.uri = uri;
    
    // Array of { label, lang } (lang may be null)
    this.labels = normalizeLabels(labels);

    // URI
    this.parent = parent;
  }

  getPrefLabel = optLang => {
    // Exact match for language or optLang === null
    const exactMatch = this.labels.find(l => l.lang === optLang);

    if (exactMatch)
      return exactMatch;

    // Fallbacks
    if (optLang) {
      // There is no match for this language - use first in list
      return this.labels[0];
    } else {
      // There is no match without language - use EN or first
      // TODO use browser locale instead of EN?
      const fallback = this.labels.find(l => l.lang.toLowerCase() === 'en');
      return fallback ? fallback : this.labels[0];
    }
    
  } 

}

export class Taxonomy {

  constructor(terms) {
    this.rootTerms = terms.filter(n => !n.parent);
    this.leafTerms = terms.filter(n => n.parent);

    this.allTermsSorted = [...this.rootTerms, ...this.leafTerms];
    this.allTermsSorted.sort((a, b) => {
      const labelA = a.getPrefLabel();
      const labelB = b.getPrefLabel();

      return labelB - labelA;
    });

    // Fulltext search, using term URI as primary key
    this.searchIndex = new FlexSearch.Document({
      document: {
        id: 'id',
        index: [
          'labels',
        ]
      },
      tokenize: 'full'
    });

    this.allTermsSorted.forEach(term =>
      this.searchIndex.add(termToDocument(term)));
  }

  findByURI = uri =>
    this.allTermsSorted.find(t => t.uri === uri);

  getChildren = uri =>
    this.leafTerms.filter(n => n.parent === uri);

  listTerms = () =>
    this.allTermsSorted;

  search = query => {
    const r = this.searchIndex.search(query);

    // Resolve awkward flexsearch result
    return Array.from(
      r.reduce((ids, r) =>
        new Set([...ids, ...r.result]), new Set())
    ).map(id => this.findByURI(id));
  }

}