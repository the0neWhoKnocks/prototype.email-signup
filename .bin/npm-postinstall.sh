#!/bin/zsh

# adds vendor assets from installed modules
echo "[ COPYING ] vendor resources"

mkdir -p "./public/js/vendor"
mkdir -p "./public/css/vendor"

cp "./node_modules/pickmeup/dist/pickmeup.min.js" "./public/js/vendor/"
cp "./node_modules/pickmeup/css/pickmeup.css" "./public/css/vendor/"

echo "[ COPY ] complete"
