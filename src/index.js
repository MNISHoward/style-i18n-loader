import fs from 'fs';
import path from 'path';

import loaderUtils from 'loader-utils';

import { transfrom } from './utils';

const configJsPath = path.resolve(process.cwd(), 'i18n.config.js');
const configJsonPath = path.resolve(process.cwd(), 'i18n.config.json');
const exsitJs = fs.existsSync(configJsPath);
let exsitJson;
let rootConfig = {};
if (exsitJs) {
  rootConfig = require(configJsPath)
} else {
  exsitJson = fs.existsSync(configJsonPath);
  if (exsitJson) {
    rootConfig = require(configJsonPath);
  }
}


export default (content) => {
  const options = Object.assign(
    {},
    loaderUtils.getOptions(this),
    rootConfig
  );
  if (!options || options.paths == null) {
    this.callback(new Error(`
      Please designate the options.paths for image path:
        Example:
          options: {
            paths: {
              'zh-CN': '~@/assets/lang/zh-Hans',
              'zh-TW': '~@/assets/lang/zh-Hant-TW',
              'th': '~@/assets/lang/th',
              'id': '~@/assets/lang/id',
              'en': '~@/assets/lang/en',
              'ar': '~@/assets/lang/ar',
            }
          }
      or
        create a i18n.config.js in root
        module.exports = {
          paths: {
            'zh-CN': '~@/assets/lang/zh-Hans',
            'zh-TW': '~@/assets/lang/zh-Hant-TW',
            'th': '~@/assets/lang/th',
            'id': '~@/assets/lang/id',
            'en': '~@/assets/lang/en',
            'ar': '~@/assets/lang/ar',
          }
        }
    `))
    return;
  } else if (options.syntax == null) {
    this.callback(new Error(`Please designate the options.syntax: scss, less, css`))
    return;
  }
  if (exsitJs) {
    this.addDependency(configJsPath)
  } else if (exsitJson) {
    this.addDependency(configJsonPath)
  }
  const { paths, sourceMap, syntax } = options;
  global.i18nSyntax = syntax;
  const newContent = transfrom(content, paths);
  this.callback(null, newContent, sourceMap);
}