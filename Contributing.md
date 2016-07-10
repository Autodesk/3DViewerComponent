# Contributing to 3DViewerComponent

You are free to enhance, extend, and modify 3DViewerComponent. 

## Submission Guidelines

### Timing

We will attempt to address all issues and pull requests within one week. It may a bit longer before pull requests are actually merged, as they must be inspected and tested. 

### Issues

If your issue appears to be a bug, and hasn't been reported, open a new issue.
Help us to maximize the effort we can spend fixing issues and adding new
features, by not reporting duplicate issues.  Providing the following information will increase the
chances of your issue being dealt with quickly:

* **Overview of the Issue** - Description of the bug, any errors that you encounter.
* **Motivation for or Use Case** - Explain why this is a bug for you.
* **Browsers and Operating System** - Is this a problem with all browsers or a specific one?
* **Reproduce the Error** - Provide a live example (using [Plunker][plunker] or
  [JSFiddle][jsfiddle]) or an unambiguous set of steps.
* **Related Issues** - Has a similar issue been reported before?
* **Suggest a Fix** - If you can't fix the bug yourself, perhaps you can point to what might be
  causing the problem (line of code or commit)

### Pull Requests

Before you submit your pull request consider the following guidelines:

* Search GitHub for an open or closed Pull Request that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch master
     ```

* Create your patch. Code is written in ES6 in `three-d-viewer.es6.js` or ES5 in other JS files under the `js` folder. 
To run the project, run:

    ```shell
     grunt build
     ```
     
* Commit your changes using a descriptive commit message.

     ```shell
     git commit -a
     ```
  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

* In GitHub, send a pull request to `3DViewerComponent:master`.

### Coding Rules

* Please maintain a code style similar to that of the rest of the project.
* Please document all public methods.
