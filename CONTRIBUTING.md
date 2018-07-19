# Contributing

## What can I contribute?

- Fix a bug you found or already reported on the GitHub Issues Tracker.
- Add new features to the project.
- Add new test cases.
- Add documentation.
- Add a demo page.

## How to contribute code?

Here are the basic steps to get started contributing code:

1.  Fork the repository and get development running on your computer.
2.  Install the npm development dependencies by the command `npm install` on the project folder (Assumes you already have NodeJS installed).
3.  Replicate the issue you're trying to fix or spec out the feature you're trying to add.
4.  Change the code to fix the bug or add the feature. All changes should happen in the relevant `src/js/*.js` and `src/scss/*.css` files.
5.  Build the code by running `gulp`.
6.  Verify that your fix or feature works.
7.  Commit your changes with an informative description.
8.  Open a pull request to the repository with your new commit and a descriptive message about what the PR does.

## Reporting bugs

### Make sure it is a bug related to this project

Before reporting the bug, please make sure that the bug is in the project and not from your own code or any other library used.

### Try the latest version

Bugs in the older versions of the project may have already been fixed.
In order to avoid reporting known issues, make sure you are always testing against the latest release.
Also make sure the problem hasn't already been reported on the GitHub Issues Tracker.
If not, create a new issue there and include your test case.

### Notes for pull request

- Follow the same code style as the library.
- Don't modify any files in the `dist` directory.
- Don't alter the licence headers.
