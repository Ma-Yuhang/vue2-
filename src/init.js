import { initState } from "./state"

export function initMixin(Vue) { // 给Vue添加init方法
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options // 将用户的选项挂载到实例上

    // 初始化数据
    initState(vm)

  }
}