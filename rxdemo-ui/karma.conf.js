"use strict";
const path = require('path');
const project = require('./aurelia_project/aurelia.json');

let testSrc = [
  { pattern: project.unitTestRunner.source, included: false },
  'test/aurelia-karma.js'
];

let output = project.platform.output;
let appSrc = project.build.bundles.map(x => path.join(output, x.name));
let entryIndex = appSrc.indexOf(path.join(output, project.build.loader.configTarget));
let entryBundle = appSrc.splice(entryIndex, 1)[0];
let files = [entryBundle].concat(testSrc).concat(appSrc);

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: [project.testFramework.id],
    files: files,
    exclude: [],
    preprocessors: {
      [project.unitTestRunner.source]: [project.transpiler.id]
    },
    'babelPreprocessor': { options: project.transpiler.options },
    reporters: ['progress', 'junit'],
    junitReporter: {
      useBrowserName: false
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    plugins: [
     require('karma-jasmine'),
     require('karma-firefox-launcher'),
     require('karma-jasmine-html-reporter'),
     require('karma-coverage-istanbul-reporter'),
     require('@angular-devkit/build-angular/plugins/karma')
   ],
    browsers: ['Firefox'],
    singleRun: false,
    // client.args must be a array of string.
    // Leave 'aurelia-root', project.paths.root in this order so we can find
    // the root of the aurelia project.
    client: {
      args: ['aurelia-root', project.paths.root]
    }
  });
};
