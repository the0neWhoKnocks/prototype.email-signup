window.utils = {
  buildQuery: function(form){
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
};
  

// App specific code below =====================================================

function initApp(){
  //var riotStore = new RiotStore();
  //RiotControl.addStore(riotStore);
  
  riot.mount('*');
}

window.addEventListener('load', initApp);