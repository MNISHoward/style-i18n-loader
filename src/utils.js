import gonzales from 'gonzales-pe';

import getImageSelector from './generator';

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

function generateI18nAst(iden, names, space, langConfig, selector) {
  let content = '';
  const keys = Object.keys(langConfig);
  keys.forEach((lang) => {
    const path = langConfig[lang];
    const isEndsWithSlash = path.endsWith('/');
    const prevString = `url(${path}${isEndsWithSlash ? '' : '/'}${names[0]})`;
    const urlString = names.slice(1).reduce((prev, name) =>
      `${prev} url(${path}${isEndsWithSlash ? '' : '/'}${name})`
      , prevString);
    content += getImageSelector({ lang, iden, space, urlString, selector }, global.i18nSyntax);
  })
  if (content === '') {
    return null;
  }
  return gonzales.parse(content, { syntax: global.i18nSyntax }).content;
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

export {
  walkValue,
  containsValue,
  generateI18nAst,
  getSelector,
  getParent
}