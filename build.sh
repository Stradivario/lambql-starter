#!/bin/sh
cd ${SRC_PKG}

# npm install --legacy-peer-deps

cp -r ${SRC_PKG} ${DEPLOY_PKG}

# npx @gapi/gcli build

echo SUCCESS