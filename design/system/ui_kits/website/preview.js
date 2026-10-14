// Preview helpers for the UI kit. Not part of the production site.
// ?theme=light|dark forces a scheme. ?state=invalid|sending|success|error|ratelimit shows a contact form state.
(function(){
  var q=new URLSearchParams(location.search);
  var t=q.get('theme');
  if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);
  function keep(a){
    if(!t)return;
    document.querySelectorAll('a[href$=".html"]').forEach(function(l){l.href=l.getAttribute('href')+'?theme='+t;});
  }
  var MSG={error:'Something went wrong. Please try again.',ratelimit:'Too many messages have been sent recently. Please try again in an hour.'};
  var FIELD_ERR={name:'Enter your name',email:'Enter a valid email',message:'Enter a message'};
  function setFieldError(f,msg){
    var wrap=f.parentElement,id=f.id+'-error',p=document.getElementById(id);
    if(msg){
      f.setAttribute('aria-invalid','true');f.setAttribute('aria-describedby',id);
      if(!p){p=document.createElement('p');p.id=id;wrap.appendChild(p);}p.textContent=msg;
    }else{f.removeAttribute('aria-invalid');f.removeAttribute('aria-describedby');if(p)p.remove();}
  }
  function formAlert(form,msg){
    var a=form.querySelector('[role="alert"]');
    if(!msg){if(a)a.remove();return;}
    if(!a){a=document.createElement('p');a.setAttribute('role','alert');form.prepend(a);}
    a.textContent=msg;
  }
  function success(form){
    var s=document.createElement('p');s.setAttribute('role','status');
    s.textContent='Thanks, your message is on its way. I will reply by email.';
    form.replaceWith(s);
  }
  function sending(btn,on){
    btn.disabled=on;btn.setAttribute('aria-busy',on?'true':'false');btn.textContent=on?'Sending…':'Send message';
  }
  function validate(form){
    var ok=true;
    ['name','email','message'].forEach(function(n){
      var f=form.elements[n],v=f.value.trim(),bad=!v||(n==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      setFieldError(f,bad?FIELD_ERR[n]:null);if(bad&&ok){ok=false;f.focus();}
    });
    return ok;
  }
  document.addEventListener('DOMContentLoaded',function(){
    keep();
    if(t)document.querySelectorAll('picture').forEach(function(pc){var s=pc.querySelector('source[media*="color-scheme"]'),i=pc.querySelector('img');if(!s)return;if(t==='dark')i.src=s.getAttribute('srcset');s.remove();});
    var form=document.querySelector('form');if(!form)return;
    var btn=form.querySelector('button[type="submit"]'),st=q.get('state');
    if(st==='invalid'){['name','email','message'].forEach(function(n){setFieldError(form.elements[n],FIELD_ERR[n]);});form.elements.email.value='nathan@';}
    if(st==='sending'){form.elements.name.value='Dana';form.elements.email.value='dana@example.com';form.elements.message.value='Our queue has 400 open tickets.';sending(btn,true);}
    if(st==='success')success(form);
    if(MSG[st])formAlert(form,MSG[st]);
    form.addEventListener('submit',function(e){
      e.preventDefault();formAlert(form,null);
      if(!validate(form))return;
      sending(btn,true);
      setTimeout(function(){
        var m=form.elements.message.value.toLowerCase();
        if(m.indexOf('fail')>-1){sending(btn,false);formAlert(form,MSG.error);return;}
        if(m.indexOf('limit')>-1){sending(btn,false);formAlert(form,MSG.ratelimit);return;}
        success(document.querySelector('form'));
      },1200);
    });
  });
})();
