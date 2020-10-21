# Deneb

Deneb is a browser extension for [Altair](https://github.com/ProjectSummerTriangle/Altair).

Only Altair ^3.0.0 supports integration with Deneb.

Deneb support Chrome, Firefox and Edge.

## Overview

Deneb provides an API bridge between Altair and bgm.tv, which allows Altair to provide social features from bgm.tv.

## Requirement

Nodejs 8.5 and above.

## Development

1. Clone this project

2. `yarn install`

3. rename `env.example.js` to `env.js`, edit values to match your development environment.

4. development

- Chrome: `npm start`

- Firefox: `npm run start:firefox`

## Publish

Running `build.sh` will build extensions for each browser to zip files. Upload your extension zip to each browser's plugin publishing platform.

Note for Firefox extension: Due to Mozilla AMO's policy, you need self-distribute your extension. The building script will
help you to generate a proper update manifest. You need to create the following files in order to work with `build.sh` script.

a. Create a copy of `sign-env.example.sh`, rename it to `sign-env.sh`. These environment variables will be used by `web-ext` to sign the extension.
You need to obtain your visit your `api key` and `api secret` at [AMO Developer Hub](https://addons.mozilla.org/en-US/developers/addon/api/key/).

b. Setup your file server, and make sure your can access the static files via the `firefox_update_link` in the `env.js` prod section.

c. After running `build.sh`, upload your `update.json` and generated Firefox extension zip in the web-ext-artifacts directory.
