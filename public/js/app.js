/**
 * ## NOTE ##
 * 
 * This file should contain app specific functionality. For now it contains all
 * Email Signup functionality, but that should be extracted out into it's own
 * module code, utilizing whatever framework you choose.
 */

function EmailSignup(opts){
  this.selectors = {
    EMAIL_SIGNUP_CTA: '.js-emailSignupCTA',
    EMAIL_SIGNUP_MODAL: '.js-emailSignupModal',
    EMAIL_SIGNUP_MODAL_MASK: '.js-emailSignupModalMask',
    EMAIL_SIGNUP_SUBMIT_BTN: '.js-emailSignupSubmitBtn',
    DOB_INPUT: '.js-dobInput'
  };
  this.cssModifiers = {
    IS_HIDDEN: 'is--hidden',
    HAS_SUBMITTED: 'has--submitted'
  };
  this.els = {
    emailSignupCTA: document.querySelector(this.selectors.EMAIL_SIGNUP_CTA),
    emailSignupModal: document.querySelector(this.selectors.EMAIL_SIGNUP_MODAL),
    emailSignupModalMask: document.querySelector(this.selectors.EMAIL_SIGNUP_MODAL_MASK),
    emailSignupSubmitBtn: document.querySelector(this.selectors.EMAIL_SIGNUP_SUBMIT_BTN)
  };
  this.events = {
    CLICK: 'click',
    SUBMIT: 'submit'
  };
  
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
    
    delete this.boundSubmitEmail;
    delete this.boundCloseModal;
  },
  
  submitEmail: function(ev){
    ev.preventDefault();
    
    var _self = this;
    
    if( window.fetch ){
      var requestOpts = {
        method: 'POST'
      };
      
      console.log('[ SUBMIT ] email info');
      this.els.emailSignupSubmitBtn.classList.add(this.cssModifiers.HAS_SUBMITTED);
      this.els.emailSignupSubmitBtn.disabled = true;
      
      fetch('http://___', requestOpts)
      .then(function(resp){
        console.log(resp);
        
        setTimeout(function(){          
          _self.closeModal();
        }, 2000);
      })
      .catch(function(err){
        console.error(err);
        _self.els.emailSignupSubmitBtn.classList.remove(_self.cssModifiers.HAS_SUBMITTED);
        _self.els.emailSignupSubmitBtn.disabled = false;
      });
    }else{
      alert('Sorry `fetch` is unsupported in your browser');
    }
  }
};

// App specific code below =====================================================

var emailSignup;

function initApp(){
  emailSignup = new EmailSignup();
}

window.addEventListener('load', initApp);