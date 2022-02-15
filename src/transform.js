import gonzales from "gonzales-pe";

import { containsValue, generateI18nAst, getParent, getSelector } from "./utils";

function transfrom(content, paths) {
  const parseTree = gonzales.parse(content, { syntax: global.i18nSyntax });
  const cbList = [];
  parseTree.traverseByType('atrule', (node, index, parent) => {
    if (containsValue(node, 'i18n')) {
      const beforeSpaceNode = parent.get(index - 1);
      const space = beforeSpaceNode.content.replace(/[\n]/, "");
      let ident = null;
      let names = null;
      node.forEach((no) => {
        if (no.type === 'ident') {
          ident = no.content
        }
        if (no.type === 'uri') {
          names = no.content.map((n) =>
            n.content.replace(/("|')/g, "")
          )
        }
      })
      if (ident == null || names == null) return;
      const cb = () => {
        const [selector, pselector] = getSelector(parseTree, parent);
        const insertContent = generateI18nAst(ident, names, space, paths, selector);
        // remove custom rule, delimiter
        parent.removeChild(index);
        const delimiterNode = parent.get(index);
        if (delimiterNode && delimiterNode.is('declarationDelimiter')) {
          parent.removeChild(index);
        }
        if (global.i18nSyntax === 'csss') {
          parent.content.splice(index, 0, ...insertContent);
        } else {
          const [p, pi] = getParent(parseTree, pselector);
          p.content.splice(pi + 1, 0, gonzales.createNode({ type: 'space', content: '\n' }))
          p.content.splice(pi + 1, 0, gonzales.createNode({ type: 'ruleset', content: insertContent }));
        }
      }
      cbList.push(cb);
    }
  })
  cbList.forEach((cb) => cb());
  return parseTree.toString();
}

export default transfrom;