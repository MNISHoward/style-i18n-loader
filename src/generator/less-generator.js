function getLessLangCommonSelector(lang, iden, space, urlString) {
  return `
${space}html[lang='${lang}'] & {
${space}  ${iden}: ${urlString};
${space}}
`;
}

function getLessRtlSingleSelector(lang, iden, opposite, space, value) {
  return `
${space}html[lang='${lang}'] & {
${space}  ${iden}: unset;
${space}  ${opposite}: ${value} !important;
${space}}
`
}

export {
  getLessLangCommonSelector,
  getLessRtlSingleSelector
};
