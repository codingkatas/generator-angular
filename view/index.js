'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.whichModuleToPutInto = function askWhichModuleToPutInto() {
  console.log('MainIndexWhichModule');
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
      this.name.toLowerCase() + '.html'
    )
  );
};
