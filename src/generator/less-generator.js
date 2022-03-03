function getLessLangCommonSelector(lang, iden, space, urlString) {
  return `
${space}html[lang='${lang}'] & {
${space}  ${iden}: ${urlString};
${space}}
`;
}

export default getLessLangCommonSelector;
