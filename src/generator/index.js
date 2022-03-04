import { getOpposite, parseContent } from '../utils';

import { getScssLangCommonSelector, getScssLangSelector, getScssRtlSingleSelector } from './scss-generator';
import { getLessLangCommonSelector, getLessLangSelector, getLessRtlSingleSelector } from './less-generator';
import { getCssLangCommonSelector, getCssLangSelector, getCssRtlSingleSelector } from './css-generator';


function getImageSelector({ lang, iden, space, urlString, selector }, type) {
  switch (type) {
    case 'scss':
      return getScssLangCommonSelector(lang, iden, space, urlString);
    case 'less':
      return getLessLangCommonSelector(lang, iden, space, urlString);
    case 'css':
      return getCssLangCommonSelector(lang, iden, space, urlString, selector);
    default:
      return null;
  }
}

function getRtlCollectionSelector({ lang, iden, space, dimensionValues, selector }, type) {
  switch (type) {
    case 'scss':
      return getScssLangCommonSelector(lang, iden, space, dimensionValues);
    case 'less':
      return getLessLangCommonSelector(lang, iden, space, dimensionValues);
    case 'css':
      return getCssLangCommonSelector(lang, iden, space, dimensionValues, selector)
    default:
      return null;
  }
}
function getRtlSingleSelector({ lang, iden, opposite, space, dimensionValue, selector }, type) {
  switch (type) {
    case 'scss':
      return getScssRtlSingleSelector(lang, iden, opposite, space, dimensionValue);
    case 'less':
      return getLessRtlSingleSelector(lang, iden, opposite, space, dimensionValue);
    case 'css':
      return getCssRtlSingleSelector(lang, iden, opposite, space, dimensionValue, selector)
    default:
      return null;
  }
}
function getLangSelector({ lang, block, space, selector }, type) {
  switch (type) {
    case 'scss':
      return getScssLangSelector(lang, block, space);
    case 'less':
      return getLessLangSelector(lang, block, space);
    case 'css':
      return getCssLangSelector(lang, block, selector);
    default:
      return null;
  }
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
  return parseContent(content);
}


function getDimensions(node) {
  const dimensions = [];
  node.forEach(n => {
    if (n.type === 'dimension') {
      const dimension = {};
      n.forEach(no => {
        if (no.type === 'number') {
          dimension.number = no.content;
        }
        if (no.type === 'ident') {
          dimension.unit = no.content;
        }
      })
      dimensions.push(dimension);
    }
  })
  return dimensions;
}

function genernateRtlCollectionAst(iden, node, space, rtl, selector) {
  const dimensions = getDimensions(node);
  // generate current content without at-rule
  const originalDimensionValues = dimensions.reduce((prev, curr, index) =>
    prev + curr.number + curr.unit + (index !== dimensions.length - 1 ? ' ' : '')
    , '');
  const originContent = global.i18nSyntax !== 'css' ? `
${space}${iden}: ${originalDimensionValues};
` : `
${selector} {
${space}${iden}: ${originalDimensionValues};
}
`;
  let newContent = '';
  const { length } = dimensions;
  if (length === 4 && (dimensions[1].number !== dimensions[3].number || dimensions[1].unit !== dimensions[3].unit)) {
    // swap left and right;
    [dimensions[1], dimensions[3]] = [dimensions[3], dimensions[1]];
    const dimensionValues = dimensions.reduce((prev, curr, index) =>
      prev + curr.number + curr.unit + (index !== dimensions.length - 1 ? ' ' : '')
      , '');

    newContent = rtl.reduce((prev, lang) =>
      prev + getRtlCollectionSelector({ lang, iden, space, dimensionValues, selector }, global.i18nSyntax)
      , '');
  }
  if (global.i18nSyntax === 'css') {
    return [parseContent(newContent), parseContent(originContent)];
  }
  // less than 4 dimensions or second value equal fourth value, do nothing.
  return [parseContent(originContent + newContent)];
}

function genernateRtlSingleAst(iden, node, space, rtl, selector) {
  const [dimensions] = getDimensions(node);
  const originContent = global.i18nSyntax !== 'css' ? `
${space}${iden}: ${dimensions.number}${dimensions.unit};
` : `
${selector} {
${space}${iden}: ${dimensions.number}${dimensions.unit};
}
`;
  const opposite = getOpposite(iden);
  const newContent = rtl.reduce((prev, lang) =>
    prev + getRtlSingleSelector({ lang, iden, opposite, space, dimensionValue: dimensions.number + dimensions.unit, selector }, global.i18nSyntax)
    , '');
  if (global.i18nSyntax === 'css') {
    return [parseContent(newContent), parseContent(originContent)];
  }
  return [parseContent(originContent + newContent)];
}

function generateLangAst(lang, block, space, selector) {
  const newContent = getLangSelector({ lang, block, space, selector }, global.i18nSyntax);
  return parseContent(newContent);
}

export {
  getImageSelector,
  getRtlCollectionSelector,
  generateI18nAst,
  genernateRtlCollectionAst,
  genernateRtlSingleAst,
  getRtlSingleSelector,
  generateLangAst
}
