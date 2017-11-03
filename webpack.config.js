/* eslint-disable */
const path = require('path')
const webpack = require('webpack')

const ENVIRONMENT = process.env.NODE_ENV || 'development'
const PRODUCTION = ENVIRONMENT === 'production'

const library = 'wiki-editor'
const component = 'WikiEditor'

const filename = PRODUCTION ? `${library}.min.js` : `${library}.js`

const PLACEHOLDER = 'PLACEHOLDER'

const bundle = {
  entry: PLACEHOLDER,
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    loaders: [{
      test:    /\.js$/,
      loader:  'babel-loader',
      exclude: /node_modules/,
      query: {
        plugins: ['transform-object-rest-spread', 'transform-class-properties'],
        presets: ['env', 'react'],
      },
    }],
  },
  output: {
    filename: PLACEHOLDER,
    library:  PLACEHOLDER,
    path:     PLACEHOLDER,
    libraryTarget:  'umd',
    umdNamedDefine: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENVIRONMENT),
    }),
  ]
}

if (PRODUCTION) bundle.plugins.push(
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.optimize.ModuleConcatenationPlugin()
)

module.exports = [
  Object.assign({}, bundle, {
    /* Main JS Bundle */
    devtool: 'source-map',
    entry: `${__dirname}/source/${component}.js`,
    output: Object.assign({}, bundle.output, {
      filename: `${library}.js`,
      library,
      path: `${__dirname}/lib`,
    }),
  }),

  Object.assign({}, bundle, {
    /* Examples */
    entry: `${__dirname}/examples/source/example.js`,
    externals: {}, // Include react/react-dom
    output: Object.assign({}, bundle.output, {
      filename: 'example.js',
      library: 'example',
      path: `${__dirname}/examples/lib`,
    }),
  })
]

if (PRODUCTION) {
  module.exports.push(
    Object.assign({}, bundle, {
      /* Main JS Bundle, minified */
      entry: `${__dirname}/source/${component}.js`,
      output: Object.assign({}, bundle.output, {
        filename: `${library}.min.js`,
        library,
        path: `${__dirname}/lib`,
      }),
    })
  )
}
