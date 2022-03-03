function getCssLangCommonSelector(lang, iden, space, urlString, selector) {
  return `
html[lang='${lang}'] ${selector} {
  ${iden}: ${urlString};
}
`;
}

export default getCssLangCommonSelector;
