/**
 * This file manages the merging of the default-paths and any theme specific paths into on scenarios collection to give
 * to backstop
 *
 */
/**
 *
 * @type {NodeJS.Process}
 */
const process = require('process');
/**
 * Arguments/options passed into backstop
 * @type {{_: []}}
 */
const args = require('minimist')(process.argv.slice(2));
/**
 * System path
 * @type {path.PlatformPath | path}
 */
const path = require('path');
/**
 * The URL we want to test against
 * @type {string}
 */
const testURL = args.testURL;
/**
 * The URL that we will use to create the baseline
 * @type {string}
 */
const baselineURL = args.refURL;

//console.log('scenarios file has been called');

const marker = args.marker;

const vendor = args.vendor;

/**
 * Path where our template path file is located
 * default is project root path + ./.github/tests/vrt/
 * This SHOULD be set by the github action before it gets to us. If not, try again
 * @type {string}
 */
const test_path = args.testPath ? args.testPath : path.resolve(process.env.GITHUB_WORKSPACE,'.github','tests','vrt') + path.sep;
//console.log('test_path is set to ' + test_path);

/**
 * TIL node doesn't let you require files with an absolute path. Seems odd, but we'll need to add our test_path to Node's
 * list of paths it searches, and then just try to require the template-paths.js file
 */
//require('app-module-path').addPath(test_path);
/**
 * The name of the template-paths.js file
 * @type {string}
 */
const pathFile = test_path+'template-paths.js';
console.log('pathFile is ' + pathFile);

console.log("testURL is " + testURL);
console.log("baseline is " + baselineURL);
console.log("marker is " + marker);
console.log("vendor is " + vendor);

/**
 * Our default paths that (almost) every template should test
 * @type {{}}
 */
let defaultPaths= require(__dirname+path.sep+'default-paths.js');

/**
 * The collection of new scenarios objects that we'll have backstop test
 * @type {*[]}
 */
let newScenarios = [];
/**
 * Our collection of path objects after merging defaults and template paths
 * @type {*[]}
 */
let scenarioPaths;


try {
  //console.log("Going to try and require " + pathFile);
  const templatePaths = require(pathFile);
  scenarioPaths = [...defaultPaths.paths, ...templatePaths.paths];
} catch (e) {
  //console.error(e)
  //console.log('pathfile didnt work so we\'re going to use ' + __dirname+path.sep+'default-paths.js');
  scenarioPaths = defaultPaths.paths;
}

//now that we have our initial collection of paths, we need to merge any that are duplicates
newScenarios = scenarioPaths.reduce((accumulator, currentValue) => {
  //have we already processed a path with this label?
  let alreadyExists = accumulator.findIndex(item => item.label === currentValue.label);
  if ( alreadyExists != -1 ) {
    //we've already processed this path, so let's merge this one in with the existing one
    accumulator[parseInt(alreadyExists)] = {...accumulator[parseInt(alreadyExists)], ...currentValue};
  } else {
    accumulator.push(currentValue);
  }

  return accumulator;

// now that we've merged all the paths down into a unique (by label) collection, append our urls to the paths
}, []).map(function(element,index) {
  element.referenceUrl = `${this.ref}${element.path}`;
  element.url = `${this.test}${element.path}`;
  //we no longer need the path property
  delete element.path;
  return element;
},{"ref":baselineURL,"test":testURL});

let newPaths = {
  bitmaps_reference: 'backstop_data/bitmaps_reference' + '-' + vendor + '-' + marker ,
  bitmaps_test: 'backstop_data/bitmaps_test' + '-' + vendor + '-' + marker,
  engine_scripts: 'backstop_data/engine_scripts',
  html_report: 'backstop_data/html_report' + '-' + vendor + '-' + marker,
  ci_report: 'backstop_data/ci_report' + '-' + vendor + '-' + marker,
}

module.exports = {
  scenarios:newScenarios,
  paths:newPaths,
}
