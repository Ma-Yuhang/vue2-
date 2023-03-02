import { initGlobalAPI } from "./globalAPI"
import { initMixin } from "./init"
import { initLifeCycle } from "./lifecycle"
import { nextTick } from "./observe/watcher"

function Vue(options) {
  this._init(options)
}


Vue.prototype.$nextTick = nextTick
initMixin(Vue) // 扩展init方法
initLifeCycle(Vue) // 
initGlobalAPI(Vue)

export default Vue