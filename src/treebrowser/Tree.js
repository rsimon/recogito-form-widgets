const normalizeLabels = labels => {
  if (Array.isArray(labels)) {
    // Array of strings or { label, lang }
    return labels.map(l => l.label ? l : { label: l });
  } else {
    // String
    return [ { label: labels }];
  }
}

export class TreeNode {

  constructor(uri, labels, parent) {
    this.uri = uri;
    
    // Array of { label, lang } (lang may be null)
    this.labels = normalizeLabels(labels);

    // URI
    this.parent = parent;
  }

  get label(optLang) {
    return this.labels.find(l => l.lang === optLang);
  } 

}

export class Tree {

  constructor(nodes) {
    this.rootNodes = nodes.filter(n => !n.parent);
    this.leafNodes = nodes.filter(n => n.parent);
  }

  getChildren = uri =>
    this.leafNodes.filter(n => n.parent === uri);

}