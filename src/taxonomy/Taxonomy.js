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
  }

  getChildren = uri =>
    this.leafTerms.filter(n => n.parent === uri);

  listTerms = () =>
    this.allTermsSorted;

}