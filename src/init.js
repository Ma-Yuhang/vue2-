import { compileToFunction } from "./compiler"
import { callHook, mountComponent } from "./lifecycle"
import { initState } from "./state"
import { mergeOptions } from "./utils"

export function initMixin(Vue) { // 给Vue添加init方法
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(this.constructor.options, options) // 将用户的选项挂载到实例上
    callHook(vm, 'beforeCreate') // 调用beforeCreate生命周期钩子

    // 初始化数据
    initState(vm)

    callHook(vm, 'created')  // 调用created生命周期钩子
    if (options.el) {
      vm.$mount(options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(el)
    if (!el) {
      console.log('没有el');
    }
    const opts = vm.$options
    if (!opts.render) { // 如果没有写render函数
      let template
      if (!opts.template && el) { // 没有写template但是写了el
        template = el.outerHTML
      } else if (opts.template && el) {
        template = opts.template
      }
      const render = compileToFunction(template)
      opts.render = render
    }
    mountComponent(vm, el) // 组件挂载 调用render
  }
}