const path = require('path');
const { DllReferencePlugin } = require('webpack');

const { configs } = require('@codecademy/webpack-config');

// https://github.com/storybookjs/storybook/issues/12262#issuecomment-681953346
// make a shallow copy of an object, rejecting keys that match /emotion/
function emotionless(object) {
  let result = {};
  for (let key in object) {
    if (!/emotion/.test(key)) {
      result[key] = object[key];
    }
  }
  return result;
}

module.exports = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs/register',
  ],
  stories: ['../stories/**/*.stories.(mdx|tsx)'],

  babel: (config) => {
    config.plugins = config.plugins.map((plugin) => {
      if (/emotion/.test(plugin[0])) {
        return [
          require('@emotion/babel-plugin'),
          {
            sourceMap: true,
            autoLabel: 'always',
            labelFormat: '[local]',
            cssPropOptimization: true,
          },
        ];
      }

      return plugin;
    });
    return config;
  },
  webpackFinal: (config) => {
    config.module.rules = config.module.rules.concat(
      configs.css().module.rules
    );

    config.resolve = {
      ...config.resolve,
      alias: {
        ...emotionless(config.resolve.alias),
        '~styleguide/blocks': path.resolve(__dirname, './Blocks/'),
      },
    };

    config.plugins = config.plugins.map((plugin) => {
      // clone the config of the DllReferencePlugin and remove references to emotion libs
      if (plugin instanceof DllReferencePlugin) {
        const { name, content } = require(plugin.options.manifest);

        return new DllReferencePlugin({
          context: plugin.options.context,
          name,
          content: emotionless(content),
        });
      } else {
        return plugin;
      }
    });

    return config;
  },
};
