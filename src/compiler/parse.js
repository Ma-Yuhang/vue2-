const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpan = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/
const startTagClose = /^\s*(\/?)>/

// 对模板进行编译处理
export function parseHTML(html) {
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = [] // 用于存放元素的栈
  let currentParent // 指向的是栈中的最后一个
  let root

  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs)
    if (!root) { // 一上来没有root时
      root = node
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node) // 添加到栈中
    currentParent = node // currentParent为栈中的最后一个
  }
  function chars(text) {
    text = text.replace(/\s/g, '')
    text && currentParent.children.push({
      type: TEXT_TYPE,
      text,
      parent: currentParent
    })
  }
  function end(tag) {
    stack.pop() // 弹出最后一个
    currentParent = stack[stack.length - 1]
  }
  function advance(n) {
    html = html.slice(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpan)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // <div
      // console.log(match, html);
      let attr, end
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || true })
      }
      if (end) {
        advance(end[0].length)
      }
      // console.log(match);
      return match
    }
    return false
  }
  while (html) {
    // 如果textend等于0说明是开始标签
    // 如果textend > 0说明文本结束
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      const startTagMatch = parseStartTag() // 开始标签的匹配结果
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd) // 文本内容
      if (text) {
        chars(text)
        advance(text.length)
      }
    }
  }
  return root
}