/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
  });

  app.import('vendor/bootstrap.css');
  app.import('vendor/fonts.css');
  app.import('vendor/normalize.css');
  app.import('vendor/sweet-alert.css');

  return app.toTree();
};
