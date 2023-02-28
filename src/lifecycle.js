import Watcher from "./observe/watcher"
import { createElementVNode, createTextVNode } from "./vdom"

function patchProps(el, props) {
  for (const key in props) {
    if (key === 'style') {
      for (const styleName in props.style) {
        el.style[styleName] = props.style[styleName]
      }
    } else {
      el.setAttribute(key, props[key])
      // el[key] = props[key]
    }
  }
}
// 创建真实DOM
function createElm(vnode) {
  let { tag, data, children, text } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag) // 这里将真实节点和虚拟节点对应起来
    patchProps(vnode.el, data)
    children.forEach(item => {
      vnode.el.appendChild(createElm(item))
    });
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
function patch(oldVNode, vnode) {
  // 判断是不是初始 是不是真实DOM
  const isRealElement = oldVNode.nodeType
  if (isRealElement) {
    const parentElm = oldVNode.parentNode // 拿到旧的真实DOM的父元素
    // 创建新的真实DOM
    const newElm = createElm(vnode)
    parentElm.removeChild(oldVNode)
    parentElm.insertBefore(newElm, oldVNode.nextsibiling)
    console.log(vnode);
    console.log(newElm);
    return newElm
  } else {
    // diff算法
  }
}
export function initLifeCycle(Vue) {
  Vue.prototype._c = function (...args) { // createElementVNode
    return createElementVNode(this, ...args)
  }
  Vue.prototype._v = function (...args) { // createTextVNode
    return createTextVNode(this, ...args)
  }
  Vue.prototype._s = function (value) {  // 变成字符串
    if (typeof value !== 'object') return value
    return JSON.stringify(value)
  }
  Vue.prototype._render = function () {
    return this.$options.render.call(this)
  }
  Vue.prototype._update = function (vnode) {
    const el = this.$el
    // console.log(vnode, el);

    // 既有初始化的功能，又有更新的功能
    this.$el = patch(el, vnode)
  }
}


export function mountComponent(vm, el) {
  vm.$el = el
  // 1.调用render函数 生成虚拟节点 vm._render()调用的就是vm.$options
  // 2.根据虚拟DOM生成真实DOM vm._update()
  const updateComponent = () => {
    vm._update(vm._render())
  }
  const watcher = new Watcher(vm, updateComponent, true)
  console.log(watcher);
}