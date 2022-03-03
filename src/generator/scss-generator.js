function getScssLangCommonSelector(lang, iden, space, value) {
  return `
${space}@at-root #{selector-nest('html[lang=${lang}]', &)} {
${space}  ${iden}: ${value};
${space}}
`;
}

function getScssRtlSingleSelector(lang, iden, opposite, space, value) {
  return `
${space}@at-root #{selector-nest('html[lang=${lang}]', &)} {
${space}  ${iden}: ${value} !important;
${space}  ${opposite}: unset;
${space}}
`
}

export {
  getScssLangCommonSelector,
  getScssRtlSingleSelector
}
