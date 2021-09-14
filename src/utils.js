import getImageSelector from './generator';

const gonzales = require('gonzales-pe');

function walkType(parseTree, nodeType, callback) {
  const parent = parseTree;
  parseTree.forEach((childNode, index) => {
    if (childNode.is(nodeType)) {
      callback(childNode, parent, index);
    } else {
      walkType(childNode, nodeType, callback);
    }
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
    content += getImageSelector({lang, iden, space, urlString}, global.i18nSyntax);
  })
  if (content === '') {
    return null;
  }
  return gonzales.parse(content, { syntax: global.i18nSyntax }).content;
}

function transfrom(content, paths) {
  const parseTree = gonzales.parse(content, { syntax: global.i18nSyntax });
  walkType(parseTree, 'atrule', (node, parent, index) => {
    if (containsValue(node, 'i18n')) {
      const beforeSpaceNode = parent.get(index - 1);
      const space = beforeSpaceNode.content.replace(/[\n]/, "");
      let ident = null;
      let names = null;
      node.forEach((node) => {
        if (node.type === 'ident') {
          ident = node.content
        }
        if (node.type === 'uri') {
          names = node.content.map((n) => 
            n.content.replace(/("|')/g, "")
          )
        }
      })
      if (ident == null || names == null) return;
      const insertContent = generateI18nAst(ident, names, space, paths)
      // remove custom rule, delimiter
      parent.removeChild(index);
      const delimiterNode = parent.get(index);
      if (delimiterNode && delimiterNode.is('declarationDelimiter')) {
        parent.removeChild(index);
      }
      parent.content.splice(index, 0, ...insertContent);
    }
  })
  return parseTree.toString();
}

export {
  walkType,
  walkValue,
  containsValue,
  generateI18nAst,
  transfrom
}