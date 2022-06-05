'use strict';

const { optionsEmberComposableHelpers } = require('./options-addons');

module.exports = {
  name: require('./package').name,

  options: {
    ...optionsEmberComposableHelpers,
  },

  included: function (/* app */) {
    this._super.included.apply(this, arguments);
  },
};
