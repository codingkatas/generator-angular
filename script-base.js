'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var angularUtils = require('./util.js');
var AngularAppNamedBase = require('./angular-app-named-base');

var Generator = module.exports = function Generator() {
  AngularAppNamedBase.apply(this, arguments);

  this.cameledName = this._.camelize(this.name);
  this.classedName = this._.classify(this.name);

  if (this._.str.include(this.name, '/')) {
    //clean the name for all slashes and only take the name to the right of the last slash
    var cleanedName = this._.strRightBack(this.name, '/');
    this.cameledName = this._.camelize(cleanedName);
    //Make the cameledName classified.
    this.cameledName = this._.classify(this.cameledName);

    this.classedName = angularUtils.replaceSlashesWithDots(this.name);
  }

  this.env.options.coffee = this.options.coffee;

  if (typeof this.env.options.minsafe === 'undefined') {
    this.option('minsafe');
    this.env.options.minsafe = this.options.minsafe;
  }

  var sourceRoot = '/templates/javascript';
  this.scriptSuffix = '.js';

  if (this.env.options.coffee) {
    sourceRoot = '/templates/coffeescript';
    this.scriptSuffix = '.coffee';
  }

  if (this.env.options.minsafe) {
    sourceRoot += '-min';
  }

  this.fileNameSuffix = '';
  this.sourceRoot(path.join(__dirname, sourceRoot));
};

util.inherits(Generator, AngularAppNamedBase);

Generator.prototype.appTemplate = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src + this.scriptSuffix,
    dest + this.scriptSuffix
  ]);
};

Generator.prototype.testTemplate = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src + this.scriptSuffix,
    dest + this.scriptSuffix
  ]);
};

Generator.prototype.htmlTemplate = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src,
    path.join(this.appName, dest.toLowerCase())
  ]);
};

Generator.prototype.addScriptToIndex = function (script) {
  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee');

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
        this.expandFiles(path.join(this.appPath, this.scriptsPath, '/**/*.coffee'), {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }

  try {
    var fullPath = path.join(this.appPath, this.viewsPath, 'index.html');
    angularUtils.rewriteFile({
      file: fullPath,
      needle: '<!-- endbuild -->',
      splicable: [
        //replace backslash with slash...
        '<script src="scripts/' + script.replace(/\\/g, '/') + '.js"></script>'
      ]
    });
  } catch (e) {
    console.log('\nUnable to find '.yellow + fullPath + '. Reference to '.yellow + script + '.js ' + 'not added.\n'.yellow);
  }
};

Generator.prototype.generateSourceAndTest = function (appTemplate, testTemplate, targetDirectory, skipAdd) {
  this.appTemplate(appTemplate, path.join(this.appPath, this.scriptsPath, targetDirectory, this.name));
  this.testTemplate(testTemplate, path.join(this.appTestPath, targetDirectory, this.name));
  if (!skipAdd) {
    this.addScriptToIndex(path.join(this.appPath, targetDirectory, this.name));
  }
};
