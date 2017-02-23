var path = require('path');

module.exports = {
  PORT: 8081,
  paths: {
    ROOT: path.resolve(`${__dirname}/`),
    PUBLIC: path.resolve(`${__dirname}/public`),
    COMPILED_TAGS: path.resolve(`${__dirname}/public/js/tags`),
    SOURCE_TAGS: path.resolve(`${__dirname}/dev/tags`)
  }
};