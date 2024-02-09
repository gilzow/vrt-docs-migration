/**
 * @file
 * Backstop configuration.
 */

/**
 * Arguments passed into backstop
 * @type {{_: []}}
 */
const args = require('minimist')(process.argv.slice(2));
/**
 *
 */
const {scenarios,paths} = require(`./backstop_scenarios`);

//console.log("testURL given to backstop is " + args.testURL);
//console.log("refURL given to backstop is " + args.refURL);

module.exports = {
  id: 'visual_test',
  viewports: [
    {
      label: 'phone',
      width: 320,
      height: 480,
    },
    {
      label: 'tablet-portrait',
      width: 700,
      height: 1024,
    },
    {
      label: 'desktop',
      width: 1280,
      height: 1024,
    },
  ],
  onBeforeScript: 'puppet/onBefore.js',
  onReadyScript: 'puppet/onReady.js',
  scenarios: scenarios,
  paths: paths,
  report: ['CI'],
  engine: 'puppeteer',
  engineOptions: {
    args: ['--no-sandbox'],
  },
  asyncCaptureLimit: 1,
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false,
};
