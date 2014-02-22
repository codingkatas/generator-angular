var util = require('util');
var path = require('path');
var AngularAppBase = require('./angular-app-base.js');

/**
 * Common properties we need for our generator.
 *
 * @param {String|Array} args [description]
 * @param {Object} options [description]
 */

var Generator = module.exports = function AngularAppNamedBase(args, options) {
  AngularAppBase.apply(this, arguments);
  this.argument('name', { type: String, required: true });
  var who = this;
  this.on('start', function () {

    this.askWhichModule();
  });
};

util.inherits(Generator, AngularAppBase);

Generator.prototype.askWhichModule = function askWhichModule() {
  var messageListOfModules = '';

  var modules = this.modulesConfig.modules;
  var modulesExist = false;
  for (var module in modules) {
    messageListOfModules += module + ' ';
    modulesExist = true;
  }

  if (modulesExist) {

    var message = 'Existing modules: \n';
    message += messageListOfModules + '\n';
    message += 'Enter a module name from above to generate this file into:';

    var cb = this.async();
    this.prompt([
      {
        type: 'input',
        name: 'moduleName',
        message: message,
        default: ''
      }
    ], function (props) {
      if (props.moduleName) {
        this.resolveModule(props.moduleName);
        cb();
      } else {
        this.askWhichModule();
      }
    }.bind(this));
  } else {
    throw new Error('Generate an app scaffolding first using yo angular or yo:angular app');
  }
}


