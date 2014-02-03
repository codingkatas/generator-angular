'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
  // Copies the contents of the generator `templates`
  // directory into your users new application path
  console.log("__dirname:"+__dirname);

  // TODO ignore common files for NOW (in templates/common/root)
  this.sourceRoot(path.join(__dirname, '../templates/common'));
  this.directory('root', '.', true);
  this.copy('gitignore', '.gitignore');
};
