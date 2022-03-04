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
${space}  ${iden}: unset;
${space}  ${opposite}: ${value} !important;
${space}}
`
}

function getScssLangSelector(lang, block, space) {
  return `
${space}@at-root #{selector-nest('html[lang=${lang}]', &)} ${block}
`
}

export {
  getScssLangCommonSelector,
  getScssRtlSingleSelector,
  getScssLangSelector
}
