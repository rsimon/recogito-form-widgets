import { Tree, TreeNode } from '../Tree';

const parseLabels = obj => {

  // Merge pref and altLabels
  const allLabels = {
    ...obj.altLabel,
    ...obj.prefLabel
  };

  const normalized = Object.keys(allLabels).map(lang => {
    return { label: allLabels[lang], lang };
  });

  return normalized;
}

/**
 * Loads a taxonomy tree from a JSKOS data object.
 * @param {object} json 
 * 
 */
export const load = json => {

  const nodes = json.map(obj => {
    const parent = obj.broader &&
      (Array.isArray(obj.broader) ? obj.broader[0].uri : obj.broader.uri);

    return new TreeNode(
      obj.uri,
      parseLabels(obj),
      parent
    )
  });

  return new Tree(nodes);

}