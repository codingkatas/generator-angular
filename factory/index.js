'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  this.fileNameSuffix = 'Factory';
};

util.inherits(Generator, ScriptBase);

Generator.prototype.askModule = function askModule() {
  if (!this.appPath) {
    this.askWhichModule();
  }
}

Generator.prototype.createServiceFiles = function createServiceFiles() {
  this.generateSourceAndTest(
    'service/factory',
    'spec/service',
    'services',
    this.options['skip-add'] || false
  );
};
