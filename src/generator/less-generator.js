function getLessImageSelector(lang, iden, space, urlString) {
  return `
${space}html[lang='${lang}'] & {
${space}  ${iden}: ${urlString};
${space}}
`;
}

export default getLessImageSelector;
