#!/bin/zsh

# adds vendor assets from installed modules
echo "[ COPYING ] vendor resources"

mkdir -p "./public/js/vendor"
mkdir -p "./public/css/vendor"

cp -v "./node_modules/pickmeup/dist/pickmeup.min.js" "./public/js/vendor/"
cp -v "./node_modules/pickmeup/css/pickmeup.css" "./public/css/vendor/"
cp -v "./node_modules/riot/riot.min.js" "./public/js/vendor/"
cp -v "./node_modules/riotcontrol/riotcontrol.js" "./public/js/vendor/"

echo -e "\n[ COPY ] complete"
