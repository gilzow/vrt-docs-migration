# Visual Regression Testing for docs migration

## Usage
### Your Paths
You need to update the `./tests/template-paths.js` file to include all the changed paths that need to  be 
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
      "path": "security/backups"
    },
    {
      "label":"Security Data Retention",
      "path": "security/data-retention"
    },
    {
      "label":"Security Project Isolation",
      "path": "security/project-isolation"
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
