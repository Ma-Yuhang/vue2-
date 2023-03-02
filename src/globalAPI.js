import { mergeOptions } from "./utils"

export function initGlobalAPI(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    // 合并mixin 其他属性以后边的为准 而生命周期函数需要都保存起来
    // 例如：{a: 1, created: f1} {a:2, created: f2} => {a: 2, created: [f1,f2]}
    this.options = mergeOptions(this.options, mixin)
    return this
  }


}