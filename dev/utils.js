var color = require('cli-color');
var cP = require('child_process');
var path = require('path');
var process = require('process');
var appConfig = require('../conf.app.js');

module.exports = {
  /**
   * Once the Riot tags have been compiled, this outputs the results to the terminal.
   * 
   * @param {function} callback - Called once tags have compiled.
   * @param {string} error - Error message if something went wrong.
   * @param {string} stdout - The standard output from `riot` command.
   * @param {string} stderr - The standard error from the `riot` command.
   */
  _handleCompileComplete: function(callback, error, stdout, stderr){
    if( error ) throw Error(error);
    
    var i;
    var lines = stdout.split(/\r\n|\n/);
    lines.pop(); // last item is just a new line.
    
    // filter out new lines
    lines = lines.filter(function(val){
      if( val.trim() !== '' ) return true;
    });
    
    for(i=0; i<lines.length; i++){
      var line = lines[i];
      var branch = ( i === lines.length-1 ) ? '└─' : '├─';
      
      if( line.indexOf('->') > -1 ){
        line = line.replace(/\\/g, '/').split(' -> ');
        var srcPath = line[0].replace(appConfig.paths.ROOT.replace(/\\/g, '/'), '');
        var outPath = line[1].replace(appConfig.paths.ROOT.replace(/\\/g, '/'), '');
        
        lines[i] = `  ${color.green.bold(branch)} ${ srcPath } ${ color.cyan('➜') } ${ outPath }`;
      }else{
        if( line.indexOf('Watching') > -1 ){
          line = line.replace(appConfig.paths.ROOT, '').replace(/\\/g, '/');
          lines[i] = `  ${color.green.bold(branch)} ${ line }`;
        }else{
          // handles errors or messages from the riot config
          lines[i] = `  ${color.red.bold(branch)} ${line}`;
        }
      }
    }
    
    console.log(`${ color.green.bold('──┬──────────') }\n${ lines.join("\n") }\n`);
    
    if( callback ) callback();
  },
  
  /**
   * Compiles all Riot tags into a bundle or individual JS files.
   *
   * @param {object} opts - Configuration for the `riot` command.
   * @param {function} [callback] - Will be called once the command has completed/failed.
   * @param {boolean} [watch] - Compiles the tags, and watches for future changes.
   */
  compileRiotTags: function(opts, callback, watch){
    var _self = this;
    var config, cmdArgs;
    
    if(
      !opts.paths
      || (!opts.paths.sourceTags || !opts.paths.sourceTags.length)
      || (!opts.paths.compiledTags || !opts.paths.compiledTags.length)
    ){
      var msg = 'Input and output paths are required to compile Riot tags.';
      ( callback )
        ? callback(new Error(msg))
        : console.log(`${color.red.bold('[ ERROR ]')} ${msg}`);
      return;
    }
    
    if( opts.paths.config ) config = `--config ${opts.paths.config}`;
    
    cmdArgs = ( !opts.bundle )
      ? `${opts.paths.sourceTags}/ ${opts.paths.compiledTags}/`
      : `${opts.paths.sourceTags}/ ${opts.paths.compiledTags}/tags.js`;
    
    console.log(`${color.green.bold('[ COMPILING ]')} Riot tags for client-side rendering.`);
    
    if( watch ){
      var riotArg = ( process.platform === "win32" ) ? "riot.cmd" : "riot";
      var watchOpts = `-w ${config} ${cmdArgs}`;
      var riotWatch = cP.spawn(riotArg, watchOpts.split(' '));
      var prevMessage = '';
      var compileMessages = '';
      var firstCompleted = false;
      var timeout;
      
      riotWatch.stdout.on('data', function(data){
        var compiled = data.toString();
        
        if( compiled !== prevMessage ){
          compileMessages += `\r\n${compiled}`;
        }
        prevMessage = compiled;
        
        /**
         * Stagger the execution to filter out duplicate messages. On start of
         * the watch it'll output the 'watching' message at the end, and 
         * every message after will be a duplicate.
         */
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          if( firstCompleted ) console.log(`${color.green.bold('[ COMPILED ]')} Riot tags`);
          
          _self._handleCompileComplete(callback, null, compileMessages);
          prevMessage = compileMessages = '';
          firstCompleted = true;
        }, 100);
      });
      
      riotWatch.stderr.on('data', function(data){
        console.log(`${color.red.bold('[ ERROR ]')} ${ data.toString() }`);
        process.exit(1);
      });
      
      riotWatch.on('exit', function(code){
        console.log(`riot watch exited with code ${code}`);
      });
    }else{
      cP.exec(`riot ${config} ${cmdArgs}`, this._handleCompileComplete.bind(this, callback));
    }
  },
  
  /**
   * Ensures a function doesn't run too often.
   *
   * @param {function} func - Function that shouldn't be called too often.
   * @param {number} delay - Time to wait between function calls in milliseconds.
   * @param {boolean} [immediate] - No delay, call the function now.
   * @returns {function}
   * @example
   * debounce(callback);
   *
   * debounce(function(){
   *   // your code
   * }, 500);
   */
  debounce: function(func, delay, immediate){
    var timeout;
    
    return function(){
      var context = this;
      var args = arguments;
      var later = function(){
        timeout = null;
        if( !immediate ) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      
      clearTimeout(timeout);
      timeout = setTimeout(later, delay);
      
      if( callNow ) func.apply(context, args);
    };
  }
};