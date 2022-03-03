

const opposites = {
  'margin-left': 'margin-right',
  'padding-left': 'padding-right',
  'left': 'right',
  'border-left': 'border-right'
}

const rtlCollectionProperties = [
  'margin',
  'padding',
  'border',
  'inset'
];

const rtlSingleProperties = [...Object.keys(opposites), ...Object.values(opposites)];

function walkValue(parseTree, nodeValue, callback) {
  const parent = parseTree;
  parseTree.forEach((childNode, index) => {
    if (childNode.content === nodeValue) {
      callback(childNode, parent, index);
    } else {
      walkValue(childNode, nodeValue, callback);
    }
  });
}

function containsValue(parseTree, nodeValue) {
  let contained = false;
  walkValue(parseTree, nodeValue, () => {
    contained = true;
  })
  return contained;
}

function removeChildByNode(parent, node) {
  let idx = 0;
  parent.forEach((n, i) => {
    if (node === n) {
      idx = i;
      parent.removeChild(i);
    }
  })
  return idx;
}

function getParent(parseTree, node) {
  let p = [];
  parseTree.traverse((n, i, parent) => {
    if (p.length > 0) return;
    if (n === node) {
      p = [parent, i];
    }
  })
  return p;
}

function getSelector(parseTree, parent) {
  let selector = [];
  parseTree.traverseByType('selector', (node, i, p) => {
    if (selector.length > 0) return;
    let n = p.get(i + 1);
    if (n.is('space')) {
      n = p.get(i + 2);
    }
    if (n === parent) {
      selector = [node, p];
    }
  })
  return selector;
}

function getOpposite(key) {
  if (Object.hasOwnProperty.call(opposites, key)) {
    return opposites[key];
  }
  return Object.keys(opposites).find(k => opposites[k] === key);
}

export {
  walkValue,
  containsValue,
  getSelector,
  getParent,
  rtlCollectionProperties,
  rtlSingleProperties,
  getOpposite,
  removeChildByNode
}