import getImageSelector from './generator';

const gonzales = require('gonzales-pe');

function walkType(parseTree, nodeType, callback) {
  const parent = parseTree;
  parseTree.forEach((childNode, index) => {
    if (childNode.is(nodeType)) {
      callback(childNode, parent, index);
    }
    walkType(childNode, nodeType, callback);
  })
}

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

function generateI18nAst(iden, names, space, langConfig) {
  let content = '';
  const keys = Object.keys(langConfig);
  keys.forEach((lang) => {
    const path = langConfig[lang];
    const isEndsWithSlash = path.endsWith('/');
    const prevString = `url(${path}${isEndsWithSlash ? '' : '/'}${names[0]})`;
    const urlString = names.slice(1).reduce((prev, name) =>
      `${prev} url(${path}${isEndsWithSlash ? '' : '/'}${name})`
      , prevString);
    content += getImageSelector({ lang, iden, space, urlString }, global.i18nSyntax);
  })
  if (content === '') {
    return null;
  }
  return gonzales.parse(content, { syntax: global.i18nSyntax }).content;
}

export {
  walkType,
  walkValue,
  containsValue,
  generateI18nAst,
}