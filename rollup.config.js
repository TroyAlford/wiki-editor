import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'
import npm from 'rollup-plugin-node-resolve'

const bundle = {
  input:    'source/WikiEditor.js',
  external: ['react', 'react-dom'],
  plugins:  [
    commonjs({
      include:      ['node_modules/**'],
      namedExports: {
        'node_modules/immutable/dist/immutable.js': ['Map'],
      },
    }),
    npm({
      module:  true,
      jsnext:  true,
      main:    true,
      browser: true,
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
  ],
}

export default [
  Object.assign({}, bundle, {
    output: {
      file:   'lib/wiki-editor.js',
      format: 'cjs',
    },
    sourcemap: true,
  }),
  Object.assign({}, bundle, {
    output: {
      file:   'lib/wiki-editor.min.js',
      format: 'cjs',
    },
    plugins: [...bundle.plugins, uglify()],
  }),

  Object.assign({}, bundle, {
    input:  'examples/source/example.js',
    output: {
      file:   'examples/lib/example.js',
      format: 'cjs',
    },
  }),
]
