import { newArrayPrototype } from "./array"
import Dep from "./dep"

class Observer {
  constructor(data) {
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false // 不可枚举
    })
    if (Array.isArray(data)) {
      // 在这里重写数组中的7中变异方法
      data.__proto__ = newArrayPrototype
      this.observeArray(data) // 如果数组中有对象，可以监测到变化
    } else {
      this.walk(data)
    }
  }
  walk(data) { // 循环对象 对属性依次劫持
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }
  observeArray(data) { // 对数组进行处理
    data.forEach(item => observe(item))
  }
}

export function defineReactive(target, key, value) {
  observe(value) // 递归调用 多层结构添加getter setter
  let dep = new Dep()  // 每一个属性都有一个dep
  // 重新定义每个属性 对每个属性添加getter setter
  Object.defineProperty(target, key, {
    get() {
      if(Dep.target) {
        dep.depend() // 让这个属性的收集器记住当前的watcher
      }
      return value
    },
    set(newValue) {
      if (value === newValue) return
      observe(newValue) // 用户可能修改一整个对象 vm.adds = {}
      value = newValue
      dep.notify() // 通知更新
    }
  })
}

export function observe(data) {

  // 对这个对象进行劫持
  if (typeof data !== 'object' || data == null) {
    return
  }
  if (data.__ob__ instanceof Observer) { // 说明被观测过了
    return data.__ob__
  }
  return new Observer(data)
}