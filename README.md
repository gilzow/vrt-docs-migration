# Visual Regression Testing for docs migration

## Usage
###
First, run:
```shell
npm install
```

### Your Paths
Next, you need to update the `./tests/template-paths.js` file to include all the changed paths that need to  be 
tested. For example, when I changed the security section, I needed to update the file to include the
following paths:

```json
scenarioPaths.paths = [
    {
      "label":"Security index",
      "path": "security/"
    },
    {
      "label":"Security backups",
      "path": "security/backups/"
    },
    {
      "label":"Security Data Retention",
      "path": "security/data-retention/"
    },
    {
      "label":"Security Project Isolation",
      "path": "security/project-isolation/"
    },  
];
```

It's important that each `path` does **NOT** start with a leading `/`. 

### PR URL
Grab the PR Url as indicated in the PR comments or grab it from the platform CLI tool. You only need
the main environment URL, not the one for upsun. 

### Run the tests
To kick it off run:
```shell
./run-tests.sh
```

It should ask you for the PR Url, and then double-check to make sure you've updated the 
template-paths.js file. It will then create reference files for docs.platform.sh, then run tests
against the PR version. If there are issues, it will let you know and ask if you want to see the 
VRT report. Then it'll prompt you to continue to the Upsun test.

### Example:
```shell
❯ ./run-tests.sh
PR environment URL for docs.platform.sh? https://upsun-migrate-glossary-y6u355a-ucq44jg6ofare.eu-5.platformsh.site/
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