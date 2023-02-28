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
    if (!this.depsId.has(id)) {
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
    this.get() // 重新渲染
  }
}
// 需要给每个属性增加一个dep 目的就是收集watcher
// 一个组件中 有多个属性 （n个属性对应一个视图） n个dep对应一个watcher
// 1个属性 对应着多个组价 1个dep对应多个watcher
// dep(属性) 与 watcher(视图) 是多对多的关系
export default Watcher