'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  this.fileNameSuffix = 'Filter';
};

util.inherits(Generator, ScriptBase);

Generator.prototype.askModule = function askModule() {
  if (!this.appPath) {
    this.askWhichModule();
  }
}

Generator.prototype.createFilterFiles = function createFilterFiles() {
  this.generateSourceAndTest(
    'filter',
    'spec/filter',
    'filters',
    this.options['skip-add'] || false
  );
};
