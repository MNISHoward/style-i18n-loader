function getScssImageSelector(lang, iden, space, urlString) {
  return `
${space}@at-root #{selector-nest('html[lang=${lang}]', &)} {
${space}  ${iden}: ${urlString};
${space}}
`;
}

export default getScssImageSelector;
