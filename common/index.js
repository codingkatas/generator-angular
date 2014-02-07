'use strict';
var path = require('path');
var util = require('util');
var angularUtils = require('../util.js');
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
  // Copies the contents of the generator `templates`
  // directory into your users new application path

  this.sourceRoot(path.join(__dirname, '../templates/common'));

  this.directory('root', '.', true);
//  this.directory('app', this.appPath, true);
//  console.log('a:' + this.appPath + ':b:' + this.viewsPath);
//  this.directory('views', path.join(this.appPath, this.viewsPath), true);
  this.copy('gitignore', '.gitignore');
};
