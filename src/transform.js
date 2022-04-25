import gonzales from "gonzales-pe";

import { generateI18nAst, generateLangAst, genernateRtlCollectionAst, genernateRtlSingleAst } from './generator';

import {
  containsValue,
  getParent,
  getSelector,
  removeChildByNode,
  rtlCollectionProperties,
  rtlSingleProperties
} from "./utils";

function removeCustomRule(parent, customNode) {
  const index = removeChildByNode(parent, customNode);
  const delimiterNode = parent.get(index);
  if (delimiterNode && delimiterNode.is('declarationDelimiter')) {
    removeChildByNode(parent, delimiterNode);
  }
}

function getSpace(parent, index) {
  const beforeSpaceNode = parent.get(index - 1);
  return beforeSpaceNode.content.replace(/[\n]/, "");
}

function insertToContent(parent, index, parseTree, pselector, insertContent) {
  if (global.i18nSyntax !== 'css') {
    parent.content.splice(index, 0, ...insertContent);
  } else {
    const [p, pi] = getParent(parseTree, pselector);
    p.content.splice(pi + 1, 0, gonzales.createNode({ type: 'space', content: '\n' }))
    p.content.splice(pi + 1, 0, gonzales.createNode({ type: 'ruleset', content: insertContent }));
  }
}

function transfromI18n(parseTree, paths, node, index, parent, cbList) {
  const space = getSpace(parent, index);
  let ident = null;
  let names = null;
  node.forEach((no) => {
    if (no.is('ident')) {
      ident = no.content
    }
    if (no.is('uri')) {
      names = no.content.map((n) =>
        n.content.replace(/("|')/g, "")
      )
    }
  })
  if (ident == null || names == null) return;
  const cb = () => {
    const [selector, pselector] = getSelector(parseTree, parent);
    const insertContent = generateI18nAst(ident, names, space, paths, selector);
    removeCustomRule(parent, node);
    insertToContent(parent, index, parseTree, pselector, insertContent);
  }
  cbList.push(cb);
}

function transformRtl(parseTree, rtl, node, index, parent, cbList) {
  const space = getSpace(parent, index);
  let ident = null;
  node.forEach((no) => {
    if (no.is('ident')) {
      ident = no.content
    }
  })
  if (ident == null) return;
  const cb = () => {
    const isCollection = rtlCollectionProperties.includes(ident);
    const isRtlSingle = rtlSingleProperties.includes(ident);
    if (isCollection || isRtlSingle) {
      const [selector, pselector] = getSelector(parseTree, parent);
      removeCustomRule(parent, node);
      const [insertContent, cssOrigin] = isCollection ?
        genernateRtlCollectionAst(ident, node, space, rtl, selector) :
        genernateRtlSingleAst(ident, node, space, rtl, selector);
      insertToContent(parent, index, parseTree, pselector, insertContent);
      if (global.i18nSyntax === 'css') {
        insertToContent(parent, index, parseTree, pselector, cssOrigin);
      }
    } else {
      throw new Error(`the @rtl rule only support {${[...rtlCollectionProperties, ...rtlSingleProperties].join(',')}} now`)
    }

  }
  cbList.push(cb);
}

function transformLang(parseTree, node, index, parent, cbList) {
  const space = getSpace(parent, index);
  let lang = null;
  let block = null;
  let isLang = true;
  node.forEach(no => {
    if (no.is('atkeyword')) {
      if (no.content[0].content !== 'lang') {
        isLang = false;
      }
    }
    if (no.is('parentheses')) {
      lang = no.content[0].content;
    }
    if (no.is('block')) {
      block = no;
    }
  })
  if (lang == null || block == null || !isLang) return;
  const cb = () => {
    removeCustomRule(parent, node);
    const [selector, pselector] = getSelector(parseTree, parent);
    const insertContent = generateLangAst(lang, block, space, selector);
    insertToContent(parent, index, parseTree, pselector, insertContent)
  }
  cbList.push(cb);
}

function transform(content, config) {
  const parseTree = gonzales.parse(content, { syntax: global.i18nSyntax });
  const cbList = [];
  parseTree.traverseByType('atrule', (node, index, parent) => {
    if (containsValue(node, 'i18n')) {
      transfromI18n(parseTree, config.paths, node, index, parent, cbList);
    }
    if (containsValue(node, 'rtl')) {
      if (config.rtl == null) {
        throw new Error('Please designate rtl property in configuration');
      }
      transformRtl(parseTree, config.rtl, node, index, parent, cbList);
    }
    if (containsValue(node, 'lang')) {
      transformLang(parseTree, node, index, parent, cbList)
    }
  })
  cbList.forEach((cb) => cb());
  return parseTree.toString();
}

export default transform;