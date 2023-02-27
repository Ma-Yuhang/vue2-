import { observe } from "./observe/index"

export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

// 当用户访问vm.xxx时 实际访问的是vm._data.xxx
// 用户代理
function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key] // vm.name => vm._data.name
    },
    set(newValue) {
      vm[target][key] = newValue
    }
  })
}
// 初始化data
function initData(vm) {
  let data = vm.$options.data

  data = typeof data === 'function' ? data.call(vm) : data

  vm._data = data
  observe(data)

  for (const key in data) {
    proxy(vm, '_data', key) // 用户代理
  }
}