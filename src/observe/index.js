class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) { // 循环对象 对属性依次劫持
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }
}

export function defineReactive(target, key, value) {
  observe(value) // 递归调用 多层结构添加getter setter
  // 重新定义每个属性 对每个属性添加getter setter
  Object.defineProperty(target, key, {
    get() {
      return value
    },
    set(newValue) {
      if (value === newValue) return
      value = newValue
    }
  })
}

export function observe(data) {

  // 对这个对象进行劫持
  if (typeof data !== 'object' || data == null) {
    return
  }
  return new Observer(data)
}