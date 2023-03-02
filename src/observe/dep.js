

let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = [] // 这里对应着当前属性对应的watcher有哪些
  }
  depend() {
    // 不希望记录重复的watcher，而且刚才值是一个单向的关系 dep -> watcher
    // watcher 记录 dep
    // this.subs.push(Dep.target)

    Dep.target.addDep(this) // 让watcher记住dep
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    // console.log(this.subs);
    this.subs.forEach(watcher => watcher.update())
  }
}

Dep.target = null

export default Dep