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

  var prototype = Object.getPrototypeOf(this);

  // re-order such that our 'askWhichModule' is called first
  var methodKeys = Object.keys(prototype);
  var methodMapping = {};

  methodKeys.map(function (methodKey) {
    methodMapping[methodKey]= prototype[methodKey];
    delete prototype[methodKey];
  });

  prototype.askWhichModule = Generator.prototype.askWhichModule;

  //re-add the methods
  for (var method in methodMapping) {
    prototype[method] = methodMapping[method];
  }
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
      if (props.moduleName && modules[props.moduleName]) {
        this.resolveModule(props.moduleName);
        cb();
      } else {
        console.log("Invalid Module Name.");
        this.askWhichModule();
      }
    }.bind(this));
  } else {
    throw new Error('Generate an app scaffolding first using yo angular or yo:angular app');
  }
}

// run this property at the start always...
// Object.defineProperty(Generator.prototype, 'askWhichModule', {value: function() {Generator.prototype.askWhichModule();}, enumerable: true});





