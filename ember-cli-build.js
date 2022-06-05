'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const { optionsEmberComposableHelpers } = require('./options-addons');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    ...optionsEmberComposableHelpers,
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
