<emailSignup>
  <div>
    <button class="cta" ref="emailSignupCTA" type="button" title="Click to open email signup">Email Signup</button>
    <div class="modal-mask is--hidden" ref="emailSignupModalMask" title="Click to close"></div>
    <form class="modal is--hidden" ref="emailSignupModal" action="" method="POST">
      <div class="input-container">
        <label class="input-label is--required">Email</label>
        <input class="input" type="email" name="email" required>
      </div>
      
      <div class="input-container">
        <label class="input-label is--required">Date of Birth</label>
        <input class="input" ref="dobInput" type="text" name="dob" required>
      </div>
      
      <div class="input-container">
        <label class="input-label is--required">Gender</label>
        <input type="radio" name="gender" value="male" id="genderMale" required>
        <label for="genderMale">Male</label>
        <input type="radio" name="gender" value="female" id="genderFemale" required>
        <label for="genderFemale">Female</label>
      </div>
      
      <div class="btn-container">
        <div class="resp-msg is--hidden" ref="emailSignupRespMsg"></div>
        <button class="submit-btn" ref="emailSignupSubmitBtn" type="submit">Submit</button>
      </div>
    </form>
  </div>
  
  <style scoped>
    :scope,
    input,
    button, 
    *::after, 
    *::before {
      font: 20px Helvetica, Arial, sans-serif;
    }
    
    .cta {
      font-size: 1.25em;
      padding: 0.25em 0.5em;
      border: solid 1px #666;
      border-radius: 0.15em;
      background: #eee;
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      
      &:hover,
      &:focus {
        color: #eee;
        background: #666;
      }
    }

    .modal {
      width: 12em;
      padding: 1em;
      border: solid 1px #666;
      border-radius: 0.5em;
      box-shadow: 0px 8px 20px 2px rgba(0,0,0,0.05);
      background: #fff;
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      
      &-mask {
        background: rgba(0,0,0,0.25);
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }
    }

    .input {
      padding: 0.25em;
      border: solid 1px #666;
      
      &-container {
        margin-top: 0.75em;
        
        &:first-of-type {
          margin-top: 0;
        }
      }
      
      &-label {
        display: block;
      }
    }
    
    .btn-container {
      margin-top: 1em;
    }

    .resp-msg {
      font-family: monospace;
      text-align: center;
      padding: 0.25em;
      margin: 0.25em 0;
      background: #eee;
      
      &.has--error {
        background: #ff9e9e;
      }
      
      &.was--successful {
        background: #78f9a1;
      }
    }

    .submit-btn {
      width: 100%;
      padding: 0.25em 0.5em;
      border: solid 1px #666;
      border-radius: 0.15em;
      background: #eee;
      cursor: pointer;
      display: block;
      position: relative;
      
      &:hover,
      &:focus {
        color: #eee;
        background: #666;
      }
      
      &.has--submitted::after {
        content: '';
        width: 1em;
        height: 1em;
        border: dotted;
        border-radius: 100%;
        display: inline-block;
        position: absolute;
        top: 50%;
        right: 0.25em;
        animation-name: spin;
        animation-duration: 2000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
    }

    .is--hidden {
      display: none;
    }

    .is--required::after {
      content: '*';
      color: orange;
    }

    @keyframes spin { 
      from { 
        transform: translateY(-50%) rotate(0deg); 
      } to { 
        transform: translateY(-50%) rotate(-360deg); 
      }
    }
  </style>
  
  <script>
    const _self = this;
    
    this.cssModifiers = {
      IS_HIDDEN: 'is--hidden',
      HAS_SUBMITTED: 'has--submitted',
      HAS_ERROR: 'has--error',
      WAS_SUCCESSFUL: 'was--successful',
    };
    this.events = {
      CLICK: 'click',
      SUBMIT: 'submit'
    };
    
    this.handleMount = function(ev){
      if( appData.endpoints.SAVE_EMAIL ){
        _self.refs.emailSignupModal.action = appData.endpoints.SAVE_EMAIL;
      }
      
      _self.addListeners();
    };
  
    this.addListeners = function(){
      this.refs.emailSignupCTA.addEventListener(this.events.CLICK, this.openModal.bind(this));
      pickmeup(this.refs.dobInput, {
        default_date: false,
        format: 'Y-m-d',
        hide_on_select: true
      });
    };
    
    this.openModal = function(ev){
      this.boundSubmitEmail = this.submitEmail.bind(this);
      this.boundCloseModal = this.closeModal.bind(this);
      
      this.refs.emailSignupModal.classList.remove(this.cssModifiers.IS_HIDDEN);
      this.refs.emailSignupModalMask.classList.remove(this.cssModifiers.IS_HIDDEN);
      this.refs.emailSignupModal.addEventListener(this.events.SUBMIT, this.boundSubmitEmail);
      this.refs.emailSignupModalMask.addEventListener(this.events.CLICK, this.boundCloseModal);
    };
    
    this.closeModal = function(ev){
      this.refs.emailSignupModal.classList.add(this.cssModifiers.IS_HIDDEN);
      this.refs.emailSignupModalMask.classList.add(this.cssModifiers.IS_HIDDEN);
      this.refs.emailSignupModal.removeEventListener(this.events.SUBMIT, this.boundSubmitEmail);
      this.refs.emailSignupModalMask.removeEventListener(this.events.CLICK, this.boundCloseModal);
      
      this.refs.emailSignupRespMsg.classList.add(this.cssModifiers.IS_HIDDEN);
      this.refs.emailSignupRespMsg.innerHTML = '';
      this.refs.emailSignupRespMsg.classList.remove(
        this.cssModifiers.WAS_SUCCESSFUL,
        this.cssModifiers.HAS_ERROR
      );
      
      this.refs.emailSignupModal.querySelector('[name="email"]').value = '';
      this.refs.emailSignupModal.querySelector('[name="dob"]').value = '';
      this.refs.emailSignupModal.querySelectorAll('[name="gender"]').forEach(function(item){
        item.checked = false;
      }); 
      
      delete this.boundSubmitEmail;
      delete this.boundCloseModal;
    };
    
    this.submitEmail = function(ev){
      ev.preventDefault();
      
      if( window.fetch ){
        const form = ev.currentTarget;
        const formData = window.utils.buildQuery(form);
        const headers = new Headers({
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        });
        const requestOpts = {
          method: 'POST',
          headers: headers,
          body: formData
        };
        
        console.log('[ SUBMIT ] email info');
        this.refs.emailSignupSubmitBtn.classList.add(this.cssModifiers.HAS_SUBMITTED);
        this.refs.emailSignupSubmitBtn.disabled = true;
        
        fetch(form.action, requestOpts)
        .then(function(resp){
          if( status === 500 ) throw Error(resp.statusText);
          
          return resp.json();
        })
        .then(function(resp){
          _self.refs.emailSignupSubmitBtn.classList.remove(_self.cssModifiers.HAS_SUBMITTED);
          _self.refs.emailSignupSubmitBtn.disabled = false;
          _self.refs.emailSignupRespMsg.classList.remove(_self.cssModifiers.IS_HIDDEN);
          _self.refs.emailSignupRespMsg.innerHTML = resp.msg;
          
          switch(resp.status){
            case 200 :
              _self.refs.emailSignupRespMsg.classList.add(_self.cssModifiers.WAS_SUCCESSFUL);
              setTimeout(function(){          
                _self.closeModal();
              }, 2000);
              break;
            
            default :
              _self.refs.emailSignupRespMsg.classList.add(_self.cssModifiers.HAS_ERROR);
          }
        })
        .catch(function(err){
          console.error(err);
          _self.refs.emailSignupSubmitBtn.classList.remove(_self.cssModifiers.HAS_SUBMITTED);
          _self.refs.emailSignupSubmitBtn.disabled = false;
          _self.refs.emailSignupRespMsg.classList.add(_self.cssModifiers.HAS_ERROR);
        });
      }else{
        alert('Sorry `fetch` is unsupported in your browser');
      }
    };
    
    // doesn't get hoisted so it has to be at the bottom
    this.on('mount', this.handleMount);
  </script>
</emailSignup>