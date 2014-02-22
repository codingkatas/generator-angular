var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');

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

  try {
    this.modulesConfig = require(path.join(process.cwd(), 'modulesConfig.json'));
  } catch (e) {
    this.modulesConfig = {};
  }

  var defaultSrcPath = "/modules/\<moduleName\>";
  var defaultTestPath = "/modules/\<moduleName\>/scripts/test";

  if (!this.modulesConfig.srcPath) {
    this.option('srcPath', {
      desc: 'Subdirectory to place generated source module into.',
      defaults: defaultSrcPath
    });
    if (!this.options.srcPath || (this.options.srcPath === defaultSrcPath)) {
      this.srcPath = "modules";
    } else {
      this.srcPath = this.options.srcPath;
    }
  } else {
    this.srcPath = this.modulesConfig.srcPath;
  }

  if (!this.modulesConfig.testPath) {
    this.option('testPath', {
      desc: 'Subdirectory to place generated test scripts into.',
      defaults: defaultTestPath
    });
    if (!this.options.testPath || (this.options.testPath === defaultTestPath)) {
      this.testPath = "modules";
    } else {
      this.testPath = this.options.testPath;
    }
  } else {
    this.testPath = this.modulesConfig.testPath;
  }

  this.resolveModule = function resolveModule(appName) {
    if (typeof appName !== 'string' || !appName) {
      throw new Error("Cannot generate anything without module name.");
    }

    this.appName = this._.camelize(this._.slugify(this._.humanize(appName)));
    this.scriptModuleName = this.appName + "Module";
    console.log('this.srcPath:' + this.srcPath);
    console.log('this.appName:' + this.appName);
    this.appPath = path.join(this.srcPath, this.appName);
    this.appTestPath = path.join(this.testPath, this.appName, this.scriptsTestPath)
  }

  if (this.env.options.appName) {
    this.resolveModule(this.env.options.appName);
  }
}

util.inherits(Generator, yeoman.generators.Base);
