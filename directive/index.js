'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  this.fileNameSuffix = 'Directive';
};

util.inherits(Generator, ScriptBase);

Generator.prototype.askModule = function askModule() {
  if (!this.appPath) {
    this.askWhichModule();
  }
}

Generator.prototype.createDirectiveFiles = function createDirectiveFiles() {
  this.generateSourceAndTest(
    'directive',
    'spec/directive',
    'directives',
    this.options['skip-add'] || false
  );
};
