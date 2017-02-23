var color = require('cli-color');
var exec = require('child_process').exec;
var path = require('path');

var debounceTimeout;

module.exports = {
  /**
   * Compiles all Riot tags into a bundle or individual JS files.
   *
   * @param {object} opts - Configuration for the `riot` command.
   * @param {function} callback - Will be called once the command has completed/failed.
   */
  compileRiotTags: function(opts, callback){
    var config, cmdArgs;
    
    // compile tags for client-side viewing
    console.log(`${color.green.bold('[COMPILING]')} Riot tags for client-side rendering.`);
    
    if(
      !opts.paths
      || (!opts.paths.sourceTags || !opts.paths.sourceTags.length)
      || (!opts.paths.compiledTags || !opts.paths.compiledTags.length)
    ){
      callback(new Error('Input and output paths are required to compile Riot tags.'));
      return;
    }
    
    if( opts.paths.config ) config = `--config ${opts.paths.config}`;
    
    cmdArgs = ( !opts.bundle )
      ? `${opts.paths.sourceTags}/ ${opts.paths.compiledTags}/`
      : `${opts.paths.sourceTags}/ ${opts.paths.compiledTags}/tags.js`;
    
    exec(`riot ${config} ${cmdArgs}`, function(error, stdout, stderr){
      if( error ) throw Error(error);
      
      var i;
      var lines = stdout.split(/\r\n|\n/);
      lines.pop(); // last item is just a new line.
      
      for(i=0; i<lines.length; i++){
        var line = lines[i];
        
        if( line.indexOf('->') > -1 ){
          line = line.split(' -> ');
          lines[i] = '  '+ path.basename(line[0]).replace('.tag', '') +' '+ color.cyan('➜') +' '+ path.basename(line[1]);
        }else{
          // handles errors or messages from the riot config
          lines[i] = `  [?] ${line}`;
        }
      }
      
      console.log(lines.join("\n"));
      
      callback();
    });
  },
  
  /**
   * Ensures a function doesn't run too often.
   *
   * @param {function} func - Function that shouldn't be called too often.
   * @param {number} delay - Time to wait between function calls in milliseconds.
   * @returns {function}
   * @example
   * debounce(callback);
   *
   * debounce(function(){
   *   // your code
   * }, 500);
   */
  debounce: function(func, delay){
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay || 100);
  }
};