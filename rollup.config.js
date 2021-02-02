import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import svgr from '@svgr/rollup'
import url from '@rollup/plugin-url'
import postcss from 'rollup-plugin-postcss'
import json from '@rollup/plugin-json'
const lessToJs = require('less-vars-to-js')

const path = require('path')
const fs = require('fs')

const themeVariables = lessToJs(
  fs.readFileSync(path.join(__dirname, 'src/styles/variables.less'), 'utf8'),
  { resolveVariables: true, stripPrefix: true },
)

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  // All the used libs needs to be here
  external: ['react', 'react-proptypes'],
  plugins: [
    json(),
    nodeResolve(),
    postcss({
      extract: true,
      use: [
        'sass',
        [
          'less',
          {
            javascriptEnabled: true,
            modifyVars: themeVariables,
          },
        ],
      ],
    }),
    babel({
      plugins: [['import', { libraryName: 'antd', style: true }]],
      exclude: ['node_modules/**', 'public/**'],
    }),
    url(),
    svgr({ svgo: false }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
}
