const path = require('path')
const fs = require('fs')
const lessToJs = require('less-vars-to-js')

const themeVariables = lessToJs(
  fs.readFileSync(path.join(__dirname, '../src/styles/variables.less'), 'utf8'),
  { resolveVariables: true, stripPrefix: true },
)

module.exports = {
  stories: ['../src/**/**/*.stories.js', '../src/**/**/*.stories.mdx'],
  addons: [
    {
      name: '@storybook/preset-create-react-app',
      options: {
        craOverrides: {
          fileLoaderExcludes: ['less'],
        },
      },
    },
    '@storybook/addon-docs',
    '@storybook/addon-knobs',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
        {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            lessOptions: {
              // If you are using less-loader@5 please spread the lessOptions to options directly
              modifyVars: themeVariables,
              javascriptEnabled: true,
            },
          },
        },
      ],
    })

    // Return the altered config
    return config
  },
}
