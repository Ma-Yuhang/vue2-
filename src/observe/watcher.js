import Dep from "./dep"


let id = 0

// 1.当我们创建渲染watcher时我们会把当前的渲染watcher放到Dep.target上
// 2.调用_render() 会取值 走到get上


class Watcher {
  constructor(vm, fn, options) { // 不同的组件有不同的watcher
    this.id = id++
    this.renderWatcher = options // true表示是一个渲染过程
    this.getter = fn
    this.deps = [] // 记住dep 后边实现计算属性和清理工作需要用到
    this.depsId = new Set()
    this.get()
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) { // 这里是为了去重dep {{name}} {{name}}只收集一次
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this) // 让dep记住watcher
    }
  }
  get() {
    Dep.target = this // 静态属性只有一份
    this.getter()  // 会去vm上取值
    Dep.target = null
  }
  update() {
    // this.get() // 重新渲染
    // 把当前的watcher暂存起来 异步更新
    queueWatcher(this)
  }
  run() {
    console.log('更新了');
    this.get()
  }
}
let queue = []
let watchers = new Set()
let pending = false
function flushSchedulerQueue() {
  let flushQueue = [...queue]
  queue = []
  watchers.clear()
  pending = false
  flushQueue.forEach(q => q.run())  // 更新的时候可能有新的watcher产生，重新放到queue中

}
function queueWatcher(watcher) {
  let id = watcher.id
  if (!watchers.has(id)) {
    queue.push(watcher)
    watchers.add(id)
    // 不管update执行多少次，最终只执行一次更新操作
    if (!pending) {
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}
// 优雅降级
function timerFunc(flushCallbacks) {
  if (window.Promise) {
    Promise.resolve().then(flushCallbacks)
  } else if (window.MutationObserver) { // 也是微任务
    // let observer = new MutationObserver(flushCallbacks)
    // let textNode = document.createTextNode(1)
    // observer.observe(textNode,{
    //   characterData: true
    // })
  } else if (window.setImmediate) {
    setImmediate(flushCallbacks)
  } else {
    setTimeout(flushCallbacks)
  }
}
let callbacks = []
let waiting = false
function flushCallbacks() {
  let cbs = [...callbacks]
  waiting = false
  callbacks = []
  cbs.forEach(cb => cb())
}
export function nextTick(cb) {
  callbacks.push(cb)
  if (!waiting) {
    // setTimeout(flushCallbacks, 0);
    timerFunc(flushCallbacks)  // 实现优雅降级策略
    waiting = true
  }
}
// 需要给每个属性增加一个dep 目的就是收集watcher
// 一个组件中 有多个属性 （n个属性对应一个视图） n个dep对应一个watcher
// 1个属性 对应着多个组价 1个dep对应多个watcher
// dep(属性) 与 watcher(视图) 是多对多的关系
export default Watcher