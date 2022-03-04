function getCssLangCommonSelector(lang, iden, space, urlString, selector) {
  return `
html[lang='${lang}'] ${selector} {
  ${iden}: ${urlString};
}
`;
}

function getCssRtlSingleSelector(lang, iden, opposite, space, value, selector) {
  return `
html[lang='${lang}'] ${selector} {
  ${iden}: unset;
  ${opposite}: ${value} !important;
}
`
}

export { getCssLangCommonSelector, getCssRtlSingleSelector };
