# Visual Regression Testing for docs migration

## Usage
###
First, run:
```shell
npm install
```

### YQ
You'll need yq in order for the script to deal with the sitemap xml files when it dynamically builds your testing paths for you:
```shell
brew install yq
```

### Your Paths
You only need to update the `./tests/template-paths.js` file if there are changes you have made that are outside the area you indicate 
as the base path. Make sure each object has a `label` and a `path` property. The label should be unique; the path should be the 
path to the URL endpoint that should be tested and should **not** start with a `/`.

```json
scenarioPaths.paths = [
    {
      "label":"Security Project Isolation",
      "path": "security/project-isolation/"
    } 
];
```

It's important that each `path` does **NOT** start with a leading `/`.  If you dont have any extra 
testing locations, you can make `scenarioPaths.paths` an empty array:

```json
scenarioPaths.paths = [];
```

### PR URL
Grab the PR Url as indicated in the PR comments or grab it from the platform CLI tool. You only need
the main environment URL, not the one for upsun. 

## Base path
The section you have updated and need to test. If we were updating the content under the https://docs.platform.sh/learn/ area
of the docs, then the base path you enter would be `learn`

### Run the tests
To kick it off run:
```shell
./run-tests.sh
```

It should ask you for the PR Url, the base path of the site that should be tested, and then 
double-check to make sure you've updated the 
template-paths.js file. It will then create reference files for docs.platform.sh, then run tests
against the PR version. If there are issues, it will let you know and ask if you want to see the 
VRT report. Then it'll prompt you to continue to the Upsun test.

### Example:
```shell
❯ ./run-tests.sh
PR environment URL for docs.platform.sh? https://upsun-migrate-glossary-y6u355a-ucq44jg6ofare.eu-5.platformsh.site/
What is the base path we are updating? learn
Have you updated the template-paths.js file in the tests directory? Y/n: y
looking at platform 
Creating Backstop VRT reference for https://docs.platform.sh/... 
<snip>
Running tests against https://upsun-migrate-glossary-y6u355a-ucq44jg6ofare.eu-5.platformsh.site/
The test for platform failed. Would you like for me to open the report? Y/n: y
Would you like me to continue to the next test? Y/n: y
looking at upsun 
<snip>
```