'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var AngularAppNamedBase = require('../angular-app-named-base');


var Generator = module.exports = function Generator() {
  AngularAppNamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

};

util.inherits(Generator, AngularAppNamedBase);

Generator.prototype.askModule = function askModule() {
  if (!this.appPath) {
    this.askWhichModule();
  }
}

Generator.prototype.createViewFiles = function createViewFiles() {
  this.template(
    'common/view.html',
    path.join(
      this.appPath,
      'views',
      this.name + '.html'
    )
  );
};
