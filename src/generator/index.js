import gonzales from 'gonzales-pe';

import { getScssLangCommonSelector, getScssRtlSingleSelector } from './scss-generator';
import getLessLangCommonSelector from './less-generator';
import getCssLangCommonSelector from './css-generator';
import { getOpposite } from '../utils';

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

function getRtlCollectionSelector({ lang, iden, space, dimensionValues }, type) {
  switch (type) {
    case 'scss':
      return getScssLangCommonSelector(lang, iden, space, dimensionValues);
    default:
      return null;
  }
}
function getRtlSingleSelector({ lang, iden, opposite, space, dimensionValue }, type) {
  switch (type) {
    case 'scss':
      return getScssRtlSingleSelector(lang, iden, opposite, space, dimensionValue);
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
  return gonzales.parse(content, { syntax: global.i18nSyntax }).content;
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

function genernateRtlCollectionAst(iden, node, space, rtl) {
  const dimensions = getDimensions(node);
  // generate current content without at-rule
  const originalDimensionValues = dimensions.reduce((prev, curr, index) =>
    prev + curr.number + curr.unit + (index !== dimensions.length - 1 ? ' ' : '')
    , '');
  let content = `
${space}${iden}: ${originalDimensionValues};
`;
  const { length } = dimensions;
  if (length === 4 && (dimensions[1].number !== dimensions[3].number || dimensions[1].unit !== dimensions[3].unit)) {
    // swap left and right;
    [dimensions[1], dimensions[3]] = [dimensions[3], dimensions[1]];
    const dimensionValues = dimensions.reduce((prev, curr, index) =>
      prev + curr.number + curr.unit + (index !== dimensions.length - 1 ? ' ' : '')
      , '');

    content += rtl.reduce((prev, lang) =>
      prev + getRtlCollectionSelector({ lang, iden, space, dimensionValues }, global.i18nSyntax)
      , '');
  }
  // less than 4 dimensions or second value equal fourth value, do nothing.
  return gonzales.parse(content, { syntax: global.i18nSyntax }).content;
}

function genernateRtlSingleAst(iden, node, space, rtl) {
  const [dimensions] = getDimensions(node);
  let content = `
${space}${iden}: ${dimensions.number}${dimensions.unit};
`;
  const opposite = getOpposite(iden);
  content += rtl.reduce((prev, lang) =>
    prev + getRtlSingleSelector({ lang, iden, opposite, space, dimensionValue: dimensions.number + dimensions.unit }, global.i18nSyntax)
    , '');
  return gonzales.parse(content, { syntax: global.i18nSyntax }).content;
}

export {
  getImageSelector,
  getRtlCollectionSelector,
  generateI18nAst,
  genernateRtlCollectionAst,
  genernateRtlSingleAst,
  getRtlSingleSelector
}
