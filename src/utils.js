let strats = {}
let LIFECYCLE = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
]
LIFECYCLE.forEach(hook => {
  strats[hook] = function (p, c) {
    if (c) {
      if (p) {
        return p.concat(c)
      } else {
        return [c]
      }
    } else {
      return p
    }
  }
})
export function mergeOptions(parent, child) { // 合并两个对象
  let options = {}
  for (const key in parent) {
    mergeField(key)
  }
  for (const key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    if (strats[key]) { // 证明是生命周期钩子 需要合并成数组
      options[key] = strats[key](parent[key], child[key])
    } else {
      options[key] = child[key] || parent[key]
    }
  }
  return options
}