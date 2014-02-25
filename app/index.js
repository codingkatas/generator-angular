var fs = require('fs');
var path = require('path');
var util = require('util');
var angularUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var wiredep = require('wiredep');
var AngularAppBase = require('../angular-app-base.js');


var Generator = module.exports = function Generator(args, options) {
  AngularAppBase.apply(this, arguments);
  this.argument('appName', { type: String, required: false });

  args = ['main'];

  if (typeof this.env.options.minsafe === 'undefined') {
    this.option('minsafe', {
      desc: 'Generate AngularJS minification safe code'
    });
    this.env.options.minsafe = this.options.minsafe;
    args.push('--minsafe');
  }


  this.hookFor('angular:main', {
    args: args
  });

  this.hookFor('angular:controller', {
    args: args
  });

  this.on('end', function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      callback: this._injectDependencies.bind(this)
    });

    var enabledComponents = [];

    if (this.resourceModule) {
      enabledComponents.push('angular-resource/angular-resource.js');
    }

    if (this.cookiesModule) {
      enabledComponents.push('angular-cookies/angular-cookies.js');
    }

    if (this.sanitizeModule) {
      enabledComponents.push('angular-sanitize/angular-sanitize.js');
    }

    if (this.routeModule) {
      enabledComponents.push('angular-route/angular-route.js');
    }

    this.invoke('karma:app', {
      options: {
        coffee: this.options.coffee,
        travis: true,
        'skip-install': this.options['skip-install'],
        components: [
          'angular/angular.js',
          'angular-mocks/angular-mocks.js'
        ].concat(enabledComponents)
      }
    });

  });

  this.pkg = require('../package.json');
};

util.inherits(Generator, AngularAppBase);

Generator.prototype.welcome = function welcome() {
  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(
        'Out of the box I include Bootstrap and some AngularJS recommended modules.\n'
    );

    // Deprecation notice for minsafe
    if (this.options.minsafe) {
      console.warn(
          '\n** The --minsafe flag is being deprecated in 0.7.0 and removed in ' +
              '0.8.0. For more information, see ' +
              'https://github.com/yeoman/generator-angular#minification-safe. **\n'
      );
    }
  }
};

Generator.prototype.requireAppName = function askForAppName() {
  if (typeof this.appName === 'undefined' || !this.appName) {
    var cb = this.async();

    this.prompt([
      {
        type: 'input',
        name: 'appName',
        message: 'Please enter the module name:'
      }
    ], function (props) {
      if (!props.appName) {
        this.requireAppName();
      } else {
        this.appName = props.appName;
        this.resolveModule(this.appName);
        this.env.options.appName = this.appName;
        this.modules = this.modulesConfig.modules || {};
        this.modules[this.appName] = this.appPath;
        this.modulesAsJSON = JSON.stringify(this.modules);
        cb();
      }
    }.bind(this));
  }
};

Generator.prototype.ensureNewModule = function ensureNewModule() {
  var modulePath = this.modules[this.appName];
  if (modulePath && fs.existsSync(modulePath)) {
    var cb = this.async();
    this.prompt([
      {
        type: 'confirm',
        name: 'reEnterModuleName',
        message: 'You have already generated a module with the name [' + chalk.bold(chalk.red(this.appName)) + '] in the past.\n' +
            'Would you like to enter a new module name \n' +
            chalk.bold(chalk.red('(instead of overwriting the files in the existing module)?')),
        default: true
      }
    ], function (props) {
      this.reEnterModuleName = props.reEnterModuleName;
      cb();
    }.bind(this));
  }
}

Generator.prototype.moduleOverwriteChoice = function moduleOverwriteChoice() {
  if (this.reEnterModuleName) {
    this.appName = '';
    this.requireAppName();
  }
}

Generator.prototype.resolveCoffee = function resolveCoffee() {
  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee', {
      desc: 'Generate CoffeeScript instead of JavaScript'
    });

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
        this.expandFiles(path.join(this.appPath, this.scriptsPath, '/**/*.coffee'), {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }
}


Generator.prototype.askForCompass = function askForCompass() {
  var cb = this.async();
  this.prompt([
    {
      type: 'confirm',
      name: 'compass',
      message: 'Would you like to use Sass (with Compass)?',
      default: true
    }
  ], function (props) {
    this.compass = props.compass;

    cb();
  }.bind(this));
};

Generator.prototype.askForBootstrap = function askForBootstrap() {
  var compass = this.compass;
  var cb = this.async();

  this.prompt([
    {
      type: 'confirm',
      name: 'bootstrap',
      message: 'Would you like to include Twitter Bootstrap?',
      default: true
    },
    {
      type: 'confirm',
      name: 'compassBootstrap',
      message: 'Would you like to use the Sass version of Twitter Bootstrap?',
      default: true,
      when: function (props) {
        return props.bootstrap && compass;
      }
    }
  ], function (props) {
    this.bootstrap = props.bootstrap;
    this.compassBootstrap = props.compassBootstrap;

    cb();
  }.bind(this));
};

Generator.prototype.askForModules = function askForModules() {
  var cb = this.async();

  var prompts = [
    {
      type: 'checkbox',
      name: 'modules',
      message: 'Which modules would you like to include?',
      choices: [
        {
          value: 'resourceModule',
          name: 'angular-resource.js',
          checked: true
        },
        {
          value: 'cookiesModule',
          name: 'angular-cookies.js',
          checked: true
        },
        {
          value: 'sanitizeModule',
          name: 'angular-sanitize.js',
          checked: true
        },
        {
          value: 'routeModule',
          name: 'angular-route.js',
          checked: true
        }
      ]
    }
  ];

  this.prompt(prompts, function (props) {
    var hasMod = function (mod) {
      return props.modules.indexOf(mod) !== -1;
    };
    this.resourceModule = hasMod('resourceModule');
    this.cookiesModule = hasMod('cookiesModule');
    this.sanitizeModule = hasMod('sanitizeModule');
    this.routeModule = hasMod('routeModule');

    var angMods = [];

    if (this.cookiesModule) {
      angMods.push("'ngCookies'");
    }

    if (this.resourceModule) {
      angMods.push("'ngResource'");
    }
    if (this.sanitizeModule) {
      angMods.push("'ngSanitize'");
    }
    if (this.routeModule) {
      angMods.push("'ngRoute'");
      this.env.options.ngRoute = true;
    }

    if (angMods.length) {
      this.env.options.angularDeps = "\n  " + angMods.join(",\n  ") + "\n";
    }

    cb();
  }.bind(this));
};

Generator.prototype.readIndex = function readIndex() {
  this.ngRoute = this.env.options.ngRoute;
  this.indexFile = this.engine(this.read('../../templates/common/index.html'), this);
};

Generator.prototype.bootstrapFiles = function bootstrapFiles() {
  var sass = this.compass;
  var mainFile = 'main.' + (sass ? 's' : '') + 'css';

  if (this.bootstrap && !sass) {
    this.copy('fonts/glyphicons-halflings-regular.eot', path.join(this.appPath, 'fonts/glyphicons-halflings-regular.eot'));
    this.copy('fonts/glyphicons-halflings-regular.ttf', path.join(this.appPath, 'fonts/glyphicons-halflings-regular.ttf'));
    this.copy('fonts/glyphicons-halflings-regular.svg', path.join(this.appPath, 'fonts/glyphicons-halflings-regular.svg'));
    this.copy('fonts/glyphicons-halflings-regular.woff', path.join(this.appPath, 'fonts/glyphicons-halflings-regular.woff'));
  }

  this.copy('styles/' + mainFile, this.appPath + '/styles/' + mainFile);
};

Generator.prototype.appJs = function appJs() {
  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/scripts.js',
    sourceFileList: [angularUtils.replaceBackSlashesWithSlashes(path.join(this.scriptsPath, 'app.js')),
      angularUtils.replaceBackSlashesWithSlashes(path.join(this.scriptsPath, 'controllers/main.js'))],
    searchPath: ['.tmp', this.appPath]
  });
};

Generator.prototype.createIndexHtml = function createIndexHtml() {
  this.indexFile = this.indexFile.replace(/&apos;/g, "'");
  this.write(path.join(this.appPath, 'index.html'), this.indexFile);
};

Generator.prototype.packageFiles = function () {
  this.coffee = this.env.options.coffee;
  this.template('../../templates/common/modulesConfig.json', 'modulesConfig.json');
  this.template('../../templates/common/_bower.json', 'bower.json');
  this.template('../../templates/common/_package.json', 'package.json');

  this.template('../../templates/common/_bower.json', path.join(this.appPath, 'bower.json'));
  this.template('../../templates/common/Gruntfile.js', 'Gruntfile.js');

};

Generator.prototype.commonModuleFiles = function () {
  this.sourceRoot(path.join(__dirname, '../templates/common'));
  this.directory('app', path.join(this.appPath), true);
  this.directory('root', '.', true);
  this.directory('views', path.join(this.appPath, this.viewsPath), true);
  this.copy('gitignore', '.gitignore');
};

Generator.prototype.imageFiles = function () {
  this.sourceRoot(path.join(__dirname, 'templates'));
  this.directory('images', path.join(this.appPath, 'images'), true);
};

Generator.prototype._injectDependencies = function _injectDependencies() {
  var howToInstall =
      '\nAfter running `npm install & bower install`, inject your front end dependencies into' +
          '\nyour HTML by running:' +
          '\n' +
          chalk.yellow.bold('\n  grunt bower-install');

  if (this.options['skip-install']) {
    console.log(howToInstall);
  } else {
    process.chdir(this.appPath);
    wiredep({
      directory: '../../' + this.scriptsPath, // the bower scripts are always installed two directories up from the appPath
      bowerJson: JSON.parse(fs.readFileSync('./bower.json')),
      htmlFile: 'index.html',
      cssPattern: '<link rel="stylesheet" href="{{filePath}}">'
    });
  }
};
