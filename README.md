# Chrome Extension Boilerplate with Manifest 3
It helps users create a few reminders. The reminder should appear on the page at the time the user has specified.
possibility rewriting reminder;
possibility of changing the time for the reminder;
possibility cancelling reminder;

## Folder Structure
The folder structure is as follows:

```
my-extension/
├── extension/
│   ├── background.js
│   ├── content.js
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon32.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   ├── popup/
│   │   ├── popup.html
│   │   └── popup.js
│   └── manifest.json
├── src/
│   └── // source files for the extension
├── webpack.config.js
├── babel.config.js
├── package.json
└── node_modules/
    └── // dependencies installed by npm

```

## Getting Started
To use this boilerplate, follow these steps:

- Clone the repository or download the ZIP file.
- Load the extension in Chrome by navigating to chrome://extensions, enabling "Developer mode" in the top right corner, and then clicking on "Load unpacked" and selecting the folder that contains the extension files.

## NPM Scripts

This also includes a set of npm scripts that you can use to manage your extension. The following scripts are available:

- `npm run build-dev`: Builds the extension in development mode, using Webpack's development settings.
- `npm run build-prod`: Builds the extension in production mode, using Webpack's production settings for code optimization and minification.
- `npm run clean`: Removes the content.js file. All the other files of the extension are not removed.
- `npm run watch`: Starts a Webpack watch process, automatically rebuilding the extension whenever changes are made to the source files.



# extensionChrome
