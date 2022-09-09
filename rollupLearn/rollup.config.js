import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload'
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.cjs.js',//输出的文件路径和文件名
    format: 'cjs',//五种输出的格式 amd/es/iife/umd/cjs
    name: 'bundleName',//当format格式为iife和umd的时候必须提供变量名
    globals: {
      lodash: '_',
      jquery: '$'
    }
  },
  external: ['lodash', 'jquery'],//告诉rollup不要将此lodash打包，而作为外部依赖
  plugins: [
    babel({
     exclude: /node_modules/
    }),
    nodeResolve(),//作用是可以加载node_modules里有的模块
    commonjs(),//可以支持commonjs语法
    //typescript(),
    // terser(),// 压缩代码
    postcss(),
    livereload(),
    serve({
      open: true,
      port: 8080,
      contentBase: './dist'
    })
  ]
}