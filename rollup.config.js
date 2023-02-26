// rollup 默认可以导出一个对象 作为打包的配置文件
import babel from 'rollup-plugin-babel'
export default {
  input: './src/index.js', // 入口文件
  output: {
    file: './dist/vue.js', // 出口文件
    name: 'Vue', // global.Vue
    format: 'umd', // esm es6模块 commonjs模块 iife自执行函数 umd（commonjs amd）
    sourcemap: true, // 希望可以调试源代码
  },
  plugins: [
    babel({
      exclude: 'node_modelus/**' // 排除node_modules下的文件 不进行打包
    })
  ]
}