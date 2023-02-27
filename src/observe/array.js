// 重写数组的7个变异方法，并且保留数组原来的方法

let oldArrayPrototype = Array.prototype

export let newArrayPrototype = Object.create(oldArrayPrototype)

let methods = [
  'push',
  'pop',
  'unshift',
  'shift',
  'reverse',
  'sort',
  'replace'
]

methods.forEach(method => {
  // 重写这7个方法
  newArrayPrototype[method] = function (...args) {
    const res = oldArrayPrototype[method].call(this, ...args)
    console.log('调用了' + method);

    let inserted
    let ob = this.__ob__
    // 监测用户用push、unshift、splice方法添加数据
    switch (method) {
      case 'push':
      case 'unshift':  // arr.push({a:1})
        inserted = args
        break;
      case 'splice': // arr.splice(0,1,{a:1},{b:2})
        inserted = args.slice(2)
        break
      default:
        break;
    }
    if (inserted) {
      ob.observeArray(inserted)
    }

    return res
  }
})