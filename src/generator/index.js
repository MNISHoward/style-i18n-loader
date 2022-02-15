import getScssImageSelector from './scss-generator';
import getLessImageSelector from './less-generator';
import getCssImageSelector from './css-generator';

function getImageSelector({ lang, iden, space, urlString, selector }, type) {
  switch (type) {
    case 'scss':
      return getScssImageSelector(lang, iden, space, urlString);
    case 'less':
      return getLessImageSelector(lang, iden, space, urlString);
    case 'css':
      return getCssImageSelector(lang, iden, space, urlString, selector);
    default:
      return () => { };
  }
}

export default getImageSelector
