import gonzales from "gonzales-pe";

import { containsValue, generateI18nAst, walkType } from "./utils";

function transfrom(content, paths) {
  const parseTree = gonzales.parse(content, { syntax: global.i18nSyntax });
  walkType(parseTree, 'atrule', (node, parent, index) => {
    if (containsValue(node, 'i18n')) {
      const beforeSpaceNode = parent.get(index - 1);
      const space = beforeSpaceNode.content.replace(/[\n]/, "");
      let ident = null;
      let names = null;
      node.forEach((node) => {
        if (node.type === 'ident') {
          ident = node.content
        }
        if (node.type === 'uri') {
          names = node.content.map((n) =>
            n.content.replace(/("|')/g, "")
          )
        }
      })
      if (ident == null || names == null) return;
      const insertContent = generateI18nAst(ident, names, space, paths)
      // remove custom rule, delimiter
      parent.removeChild(index);
      const delimiterNode = parent.get(index);
      if (delimiterNode && delimiterNode.is('declarationDelimiter')) {
        parent.removeChild(index);
      }
      parent.content.splice(index, 0, ...insertContent);
    }
  })
  return parseTree.toString();
}

export default transfrom;
