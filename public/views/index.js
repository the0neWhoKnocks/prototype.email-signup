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
        <script language="javascript" type="text/javascript" src="/js/vendor/pickmeup.min.js"></script>
        <script language="javascript" type="text/javascript" src="/js/app.js"></script>
      </head>
      <body>
        <div class="email-signup">
          <button class="email-signup__cta js-emailSignupCTA" type="button" title="Click to open email signup">Email Signup</button>
          <div class="email-signup__modal-mask is--hidden js-emailSignupModalMask" title="Click to close"></div>
          <form class="email-signup__modal is--hidden js-emailSignupModal" action="" method="POST">
            <div class="email-signup__input-container">
              <label class="email-signup__input-label is--required">Email</label>
              <input class="email-signup__input" type="email" name="email" required>
            </div>
            
            <div class="email-signup__input-container">
              <label class="email-signup__input-label is--required">Date of Birth</label>
              <input class="email-signup__input js-dobInput" type="text" name="dob" required>
            </div>
            
            <div class="email-signup__input-container">
              <label class="email-signup__input-label is--required">Gender</label>
              <input type="radio" name="gender" value="male" id="genderMale" required>
              <label for="genderMale">Male</label>
              <input type="radio" name="gender" value="female" id="genderFemale" required>
              <label for="genderFemale">Female</label>
            </div>
            
            <div class="email-signup__btn-container">
              <div class="email-signup__resp-msg is--hidden js-emailSignupRespMsg"></div>
              <button class="email-signup__submit-btn js-emailSignupSubmitBtn" type="submit">Submit</button>
            </div>
          </form>
        </div>
        
        ${ browserSyncScript(model.dev) }
      </body>
    </html>
  `;
};