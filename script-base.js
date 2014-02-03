'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var angularUtils = require('./util.js');

var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  try {
    this.appname = require(path.join(process.cwd(), 'bower.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = this._.slugify(this._.humanize(this.appname));

    if (typeof this.env.options.appNameSuffix === 'undefined') {
        try {
            this.env.options.appNameSuffix = require(path.join(process.cwd(), 'bower.json')).appNameSuffix;
        } catch (e) {
            this.env.options.appNameSuffix = "";
        }
    }
  this.scriptAppName = this._.camelize(this.appname) + this.env.options.appNameSuffix;

  this.cameledName = this._.camelize(this.name);
  this.classedName = this._.classify(this.name);

    if(this._.str.include(this.name, '/')) {
        //clean the name for all slashes and only take the name to the right of the last slash
        var cleanedName = this._.strRightBack(this.name, '/');
        this.cameledName =  this._.camelize(cleanedName);
        //Make the cameledName classified.
        this.cameledName = this._.classify(this.cameledName);

        this.classedName = angularUtils.replaceSlashesWithDots(this.name);
    }

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'app';
  }

  if (typeof this.env.options.testPath === 'undefined') {
    try {
      this.env.options.testPath = require(path.join(process.cwd(), 'bower.json')).testPath;
    } catch (e) {}
    this.env.options.testPath = this.env.options.testPath || 'test/spec';
  }

  this.env.options.coffee = this.options.coffee;
  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee');

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
      this.expandFiles(path.join(this.env.options.appPath, this.appname, '/scripts/**/*.coffee'), {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }

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

  this.scriptsPath = 'scripts';
  this.viewsPath = 'views';
  this.fileNameSuffix = '';

  this.sourceRoot(path.join(__dirname, sourceRoot));
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.generatedSourceFilePath = function(dest) {
    return this.generatedFilePath(this.appPath, dest);
}

Generator.prototype.generatedTestFilePath = function(dest) {
    return this.generatedFilePath(this.appPath, dest);
}

Generator.prototype.generatedFilePath = function(appPath, dest) {
    return path.join(appPath, dest.toLowerCase()) + this.fileNameSuffix + this.scriptSuffix;
}

Generator.prototype.appTemplate = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src + this.scriptSuffix,
    this.generatedSourceFilePath(dest)
  ]);
};

Generator.prototype.testTemplate = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src + this.scriptSuffix,
    this.generatedTestFilePath(dest)
  ]);
};

Generator.prototype.htmlTemplate = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src,
    path.join(this.env.options.appPath, dest.toLowerCase())
  ]);
};

Generator.prototype.addScriptToIndex = function (script) {
  try {
    var appPath = this.env.options.appPath;
    var appName = this.appname;
    var viewsPath = this.viewsPath;
    var fullPath = path.join(appPath, appName, viewsPath, 'index.html');
    angularUtils.rewriteFile({
      file: fullPath,
      needle: '<!-- endbuild, this is where yeoman generated components are automatically placed. DO NOT EDIT. -->',
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
  var dir = path.join(this._.camelize(this.appname), this.scriptsPath, targetDirectory, this.name);
  this.appTemplate(appTemplate, dir);
  this.testTemplate(testTemplate, dir);
  if (!skipAdd) {
    this.addScriptToIndex(dir);
  }
};
