var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var angularUtils = require('./util.js');

/**
 * Common properties we need for our generator.
 *
 * @param {String|Array} args [description]
 * @param {Object} options [description]
 */

var Generator = module.exports = function AngularAppBase(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.scriptsPath = "scripts";
  this.scriptsTestPath = "scripts/test";
  this.viewsPath = "views";
  this.modulesPath = "modules";

  try {
    this.modulesConfig = require(path.join(process.cwd(), 'modulesConfig.json'));
  } catch (e) {
    this.modulesConfig = {};
  }

  var defaultSrcPath = ".";
  var defaultTestPath = ".";

  if (!this.modulesConfig.srcPath) {
    this.option('srcPath', {
      desc: 'Prefix before the "/modules" folder. Files will be placed in "srcPath/modules folder."',
      defaults: defaultSrcPath
    });
    this.srcPath = this.options.srcPath;
  } else {
    this.srcPath = this.modulesConfig.srcPath;
  }

  if (!this.modulesConfig.testPath) {
    this.option('testPath', {
      desc: 'Prefix before the "/modules" folder. Files will be placed in "testPath/modules folder."',
      defaults: defaultTestPath
    });
    this.testPath = this.options.testPath;
  } else {
    this.testPath = this.modulesConfig.testPath;
  }

  this.resolveModule = function resolveModule(appName) {
    if (typeof appName !== 'string' || !appName) {
      throw new Error("Cannot generate anything without module name.");
    }

    this.appName = this._.camelize(this._.slugify(this._.humanize(appName)));
    this.scriptModuleName = this.appName + "Module";
    this.appPath = angularUtils.replaceBackSlashesWithSlashes(path.join(this.srcPath, this.modulesPath, this.appName));
    this.bowerDependenciesLocation = angularUtils.replaceBackSlashesWithSlashes(path.join(this.srcPath, this.scriptsPath));
    this.appScriptsTestPath = angularUtils.replaceBackSlashesWithSlashes(path.join(this.testPath, this.modulesPath, this.appName, this.scriptsTestPath));
    this.env.options.appName = this.appName;
    this.modules = this.modulesConfig.modules || {};
    this.modules[this.appName] = this.appPath;
    this.modulesAsJSON = JSON.stringify(this.modules);
  }

  if (this.env.options.appName) {
    this.resolveModule(this.env.options.appName);
  }
}

util.inherits(Generator, yeoman.generators.Base);
