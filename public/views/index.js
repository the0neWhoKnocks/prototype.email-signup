function browserSyncScript(dev){
  if( !dev ) return '';
  
  return `
    <script id="__bs_script__">
      document.write("<script async src='http://HOST:8082/browser-sync/browser-sync-client.js?v=2.18.7'><\\/script>".replace("HOST", location.hostname) );
    </script>
  `;
}

module.exports = function(model){
  return `
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <title>Email Signup</title>
        <link rel="stylesheet" type="text/css" href="/css/vendor/pickmeup.css">
        <link rel="stylesheet" type="text/css" href="/css/app.css">
        <script>window.appData = ${ JSON.stringify(model.appData) };</script>
        <script language="javascript" type="text/javascript" src="/js/vendor/riot.min.js"></script>
        <script language="javascript" type="text/javascript" src="/js/vendor/riotcontrol.js"></script>
        <script language="javascript" type="text/javascript" src="/js/vendor/pickmeup.min.js"></script>
        
        <script src="/js/tags/emailSignup.js"></script>
        <script language="javascript" type="text/javascript" src="/js/app.js"></script>
      </head>
      <body>
        <emailSignup />
        
        ${ browserSyncScript(model.dev) }
      </body>
    </html>
  `;
};