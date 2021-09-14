import getScssImageSelector from './scss-generator';

function getImageSelector({lang, iden, space, urlString}, type) {
  switch (type) {
    case 'scss':
      return getScssImageSelector(lang, iden, space, urlString);
    default:
      return () => {};
  }
}

export default getImageSelector
