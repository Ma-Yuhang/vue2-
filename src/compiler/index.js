import { parseHTML } from "./parse";

function genProps(attrs) {
  // console.log(attrs, '1');
  let str = ''
  attrs.forEach(attr => {
    if (attr.name == 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        if (!item) return
        let [key, value] = item.split(':')
        obj[key] = value.trim()
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  })
  return `{${str.slice(0, -1)}}`
}
// 匹配{{}}
const defaultTagClose = /\{\{((?:.|\r?\n)+?)\}\}/g
function gen(child) {
  if (child.type === 1) { // 是元素节点继续生成code
    return codegen(child)
  } else {
    // console.log(child);
    let text = child.text
    if (!defaultTagClose.test(text)) {
      return `_v(${JSON.stringify(text)})`
    } else {
      let tokens = []
      let match
      defaultTagClose.lastIndex = 0
      let lastIndex = 0
      while (match = defaultTagClose.exec(text)) {
        let index = match.index // 匹配的位置 {{name}} hello  {{name}}  hello
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(text.slice(lastIndex))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}
function genChildren(children) {
  return children.map(child => gen(child)).join(',')
}
function codegen(ast) {
  let children = genChildren(ast.children)
  let code = `_c('${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : null}${ast.children.length > 0 ? `,${children}` : ''})`
  return code
}
export function compileToFunction(template) {
  // 1.将template转换成ast语法树
  let ast = parseHTML(template)
  // console.log(ast);
  // 2.根据ast生成render函数（render函数执行后的结果就是虚拟DOM）
  let code = codegen(ast)
  // console.log(code);
  code = `with(this){return ${code}}`
  let render = new Function(code) // 根据代码生成render函数
  return render
}