/**
 * ## NOTE ##
 * 
 * This file should contain app specific functionality. For now it contains all
 * Email Signup functionality, but that should be extracted out into it's own
 * module code, utilizing whatever framework you choose.
 */

 

function buildQuery(form){
  var field, l, s = [];
  
  if(
    typeof form == 'object' 
    && form.nodeName == "FORM"
  ){
    var len = form.elements.length;
    
    for (var i=0; i<len; i++) {
      field = form.elements[i];
      
      if(
        !field.disabled
        && field.name 
        && field.type != 'file' 
        && field.type != 'reset' 
        && field.type != 'submit' 
        && field.type != 'button'
      ){
        if(field.type == 'select-multiple'){
          l = form.elements[i].options.length;
          
          for(var j=0; j<l; j++){
            if(field.options[j].selected){
              s[s.length] = field.name +'='+ field.options[j].value;
            }
          }
        }else if((field.type != 'checkbox' && field.type != 'radio') || field.checked){
          s[s.length] = field.name +'='+ field.value;
        }
      }
    }
  }
  
  return s.join('&');
}

function EmailSignup(opts){
  this.selectors = {
    EMAIL_SIGNUP_CTA: '.js-emailSignupCTA',
    EMAIL_SIGNUP_MODAL: '.js-emailSignupModal',
    EMAIL_SIGNUP_MODAL_MASK: '.js-emailSignupModalMask',
    EMAIL_SIGNUP_SUBMIT_BTN: '.js-emailSignupSubmitBtn',
    EMAIL_SIGNUP_RESP_MSG: '.js-emailSignupRespMsg',
    DOB_INPUT: '.js-dobInput'
  };
  this.cssModifiers = {
    IS_HIDDEN: 'is--hidden',
    HAS_SUBMITTED: 'has--submitted',
    HAS_ERROR: 'has--error',
    WAS_SUCCESSFUL: 'was--successful',
  };
  this.els = {
    emailSignupCTA: document.querySelector(this.selectors.EMAIL_SIGNUP_CTA),
    emailSignupModal: document.querySelector(this.selectors.EMAIL_SIGNUP_MODAL),
    emailSignupModalMask: document.querySelector(this.selectors.EMAIL_SIGNUP_MODAL_MASK),
    emailSignupSubmitBtn: document.querySelector(this.selectors.EMAIL_SIGNUP_SUBMIT_BTN),
    emailSignupRespMsg: document.querySelector(this.selectors.EMAIL_SIGNUP_RESP_MSG)
  };
  this.events = {
    CLICK: 'click',
    SUBMIT: 'submit'
  };
  
  if( opts.SUBMIT_ENDPOINT ){
    this.els.emailSignupModal.action = opts.SUBMIT_ENDPOINT;
  }
  
  this.addListeners();
}
EmailSignup.prototype = {
  addListeners: function(){
    this.els.emailSignupCTA.addEventListener(this.events.CLICK, this.openModal.bind(this));
    pickmeup(this.selectors.DOB_INPUT, {
      default_date: false,
      format: 'Y-m-d',
      hide_on_select: true
    });
  },
  
  openModal: function(ev){
    this.boundSubmitEmail = this.submitEmail.bind(this);
    this.boundCloseModal = this.closeModal.bind(this);
    
    this.els.emailSignupModal.classList.remove(this.cssModifiers.IS_HIDDEN);
    this.els.emailSignupModalMask.classList.remove(this.cssModifiers.IS_HIDDEN);
    this.els.emailSignupModal.addEventListener(this.events.SUBMIT, this.boundSubmitEmail);
    this.els.emailSignupModalMask.addEventListener(this.events.CLICK, this.boundCloseModal);
  },
  
  closeModal: function(ev){
    this.els.emailSignupModal.classList.add(this.cssModifiers.IS_HIDDEN);
    this.els.emailSignupModalMask.classList.add(this.cssModifiers.IS_HIDDEN);
    this.els.emailSignupModal.removeEventListener(this.events.SUBMIT, this.boundSubmitEmail);
    this.els.emailSignupModalMask.removeEventListener(this.events.CLICK, this.boundCloseModal);
    
    this.els.emailSignupRespMsg.classList.add(this.cssModifiers.IS_HIDDEN);
    this.els.emailSignupRespMsg.innerHTML = '';
    this.els.emailSignupRespMsg.classList.remove(
      this.cssModifiers.WAS_SUCCESSFUL,
      this.cssModifiers.HAS_ERROR
    );
    
    this.els.emailSignupModal.querySelector('[name="email"]').value = '';
    this.els.emailSignupModal.querySelector('[name="dob"]').value = '';
    this.els.emailSignupModal.querySelectorAll('[name="gender"]').forEach(function(item){
      item.checked = false;
    }); 
    
    delete this.boundSubmitEmail;
    delete this.boundCloseModal;
  },
  
  submitEmail: function(ev){
    ev.preventDefault();
    
    var _self = this;
    
    if( window.fetch ){
      var form = ev.currentTarget;
      var formData = buildQuery(form);
      var headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      });
      var requestOpts = {
        method: 'POST',
        headers: headers,
        body: formData
      };
      
      console.log('[ SUBMIT ] email info');
      this.els.emailSignupSubmitBtn.classList.add(this.cssModifiers.HAS_SUBMITTED);
      this.els.emailSignupSubmitBtn.disabled = true;
      
      fetch(form.action, requestOpts)
      .then(function(resp){
        if( status === 500 ) throw Error(resp.statusText);
        
        return resp.json();
      })
      .then(function(resp){
        _self.els.emailSignupSubmitBtn.classList.remove(_self.cssModifiers.HAS_SUBMITTED);
        _self.els.emailSignupSubmitBtn.disabled = false;
        _self.els.emailSignupRespMsg.classList.remove(_self.cssModifiers.IS_HIDDEN);
        _self.els.emailSignupRespMsg.innerHTML = resp.msg;
        
        switch(resp.status){
          case 200 :
            _self.els.emailSignupRespMsg.classList.add(_self.cssModifiers.WAS_SUCCESSFUL);
            setTimeout(function(){          
              _self.closeModal();
            }, 2000);
            break;
          
          default :
            _self.els.emailSignupRespMsg.classList.add(_self.cssModifiers.HAS_ERROR);
        }
      })
      .catch(function(err){
        console.error(err);
        _self.els.emailSignupSubmitBtn.classList.remove(_self.cssModifiers.HAS_SUBMITTED);
        _self.els.emailSignupSubmitBtn.disabled = false;
        _self.els.emailSignupRespMsg.classList.add(_self.cssModifiers.HAS_ERROR);
      });
    }else{
      alert('Sorry `fetch` is unsupported in your browser');
    }
  }
};

// App specific code below =====================================================

var emailSignup;

function initApp(){
  emailSignup = new EmailSignup({
    SUBMIT_ENDPOINT: appData.endpoints.SAVE_EMAIL
  });
}

window.addEventListener('load', initApp);