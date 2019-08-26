This is a browser extension project for [Deneb](https://github.com/lordfriend/Deneb). It must work with Deneb 3.0.0 and above together to get work.

Currently support Chrome, Firefox and Edge.

## Overview

This project add some magic bridge between Deneb and bgm.tv, which allow Deneb project add a lot of social features by
using a bgm.tv account.

## Requirement

Nodejs 8.5 and above.

## Development

1. Clone this project

2. `yarn install`

3. rename `env.example.js` to `env.js`, edit values to match your production environment.

4. development

- Chrome: `npm start`

- Firefox: `npm run start:firefox`

5. publish

run `build.sh` will build all extensions to zip files. upload your extension to each browser's distribution platform.

Note for Firefox extension: Due to Albireo service is private and AMO policy, you need self-distribute your extension. the building script
will help you generate an proper update manifest. you need create the following files in order to work with `build.sh` script.

a. copy and modify `sign-env.example.sh`, rename it to sign-env.sh. the environment variable will be used by `web-ext` to sign the extension
you need visit your [Developer Hub at AMO](https://addons.mozilla.org/en-US/developers/addon/api/key/) to acquire `api key` and `api secret`

b. setup your static file server, and make sure your can access static file via the `firefox_update_link` in the env.js prod section.

c. After run build.sh, upload your update.json and newest built firefox extension zip file resided in the web-ext-artifacts directory.
