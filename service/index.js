'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  this.fileNameSuffix = 'Service';

  this.name = this._.classify(this.name);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createServiceFiles = function createServiceFiles() {
  this.generateSourceAndTest(
    'service/service',
    'spec/service',
    'services',
    this.options['skip-add'] || false
  );
};
