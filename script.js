/* ===== SETTINGS ===== */
const CFG={
  // Enquiries are sent to the server-side send-enquiry.php endpoint. Never put mail credentials in this file.
  ENDPOINT:'send-enquiry.php',
  PHONE:'919651455758',
  BROCHURE:'brochure/aman-bhardwaj-lic-brochure.pdf'
};
const INTERESTS=['Child Education Planning','Marriage Planning','Retirement / Pension','Money-Back Plan','Endowment / Savings','Term Insurance','Whole Life Plan','Other'];
const GOALS=[
['Child Education Planning','Bachon ki padhai ke liye savings aur protection ke options samjhein.'],
['Marriage Planning','Beti/beta ki shaadi ke liye planning ke tareeke.'],
['Retirement / Pension','Retirement ke baad regular income ke liye pension plans.'],
['Money-Back Plan','Beech-beech mein payouts wale plans.'],
['Endowment / Savings','Savings ke saath life cover.'],
['Term Insurance','Family protection ke liye pure risk cover.'],
['Whole Life Plan','Lambi avadhi ka cover aur planning.'],
['Other','Kuch aur poochna hai? Bata dijiye.']];
const PLANS={'Endowment':['New Endowment','New Jeevan Anand','Jeevan Lakshya','Jeevan Labh','New Bima Jyoti','Nav Jeevan Shree','New Jeevan Sathi','Bima Platinum'],'Mahila':['Bima Lakshmi'],'Micro':['Micro Bachat','Jan Suraksha'],'Money Back':['New MoneyBack (20 yrs)','New MoneyBack (25 yrs)','Bima Shree'],'Children':['New Children MoneyBack','Jeevan Tarun','Amrit Baal'],'Whole Life':['Jeevan Umang','Jeevan Utsav'],'Pension':['Jeevan Shanti','Jeevan Akshay','Smart Pension'],'Term':['Jeevan Raksha','New Jeevan Amar','Yuva Term','Bima Kavach']};
const $=(s,r=document)=>r.querySelector(s);

/* ===== Shared lead form ===== */
function formHTML(id){return `<form class="lead" novalidate data-id="${id}">
<div class="msg" role="alert"></div>
<div><label for="n${id}">Full name *</label><input id="n${id}" name="name" autocomplete="name"><span class="err"></span></div>
<div><label for="m${id}">Mobile number *</label><input id="m${id}" name="mobile" inputmode="tel" autocomplete="tel" placeholder="10-digit number"><span class="err"></span></div>
<div><label for="c${id}">City *</label><input id="c${id}" name="city" autocomplete="address-level2"><span class="err"></span></div>
<div><label for="i${id}">Interested in *</label><select id="i${id}" name="interest"><option value="">Select</option>${INTERESTS.map(o=>`<option>${o}</option>`).join('')}</select><span class="err"></span></div>
<div><label for="e${id}">Email (optional)</label><input id="e${id}" name="email" type="email" autocomplete="email"><span class="err"></span></div>
<div><label for="g${id}">Message (optional)</label><textarea id="g${id}" name="message" rows="3"></textarea></div>
<input class="hp" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">
<label class="ck"><input type="checkbox" name="consent"><span>Main apni details is liye de raha/rahi hoon ki Aman Bhardwaj mujhse meri enquiry ke baare mein contact kar sakein. <a href="legal.html#privacy" target="_blank">Privacy notice</a> | <a href="legal.html#disclaimer" target="_blank">Disclaimer</a></span></label><span class="err"></span>
<p class="note">OTP, password, Aadhaar, payment ya policy documents is form mein na bhejein.</p>
<button class="btn" type="submit"><span class="bt"></span></button></form>`}

function mobileOK(v){v=v.replace(/[\s-]/g,'').replace(/^(\+91|91|0)(?=\d{10}$)/,'');return /^[6-9]\d{9}$/.test(v)?v:null}

function bindForm(f,source,next,label){
  f.querySelector('.bt').textContent=label;
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(f)),errs=f.querySelectorAll('.err'),box=$('.msg',f);
    errs.forEach(x=>x.textContent='');box.textContent='';
    let first;const set=(n,t)=>{const el=f.elements[n];first=first||el;(n==='consent'?el.closest('label').nextElementSibling:el.parentElement.querySelector('.err')).textContent=t};
    let bad=0;
    if(d.name.trim().length<2){set('name','Apna poora naam likhein.');bad=1}
    const mob=mobileOK(d.mobile);if(!mob){set('mobile','Sahi 10-digit Indian mobile number likhein (6-9 se shuru).');bad=1}
    if(!d.city.trim()){set('city','City likhein.');bad=1}
    if(!d.interest){set('interest','Ek option chunein.');bad=1}
    if(d.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)){set('email','Sahi email likhein ya khali chhod dein.');bad=1}
    if(!d.consent){set('consent','Aage badhne ke liye consent zaroori hai.');bad=1}
    if(bad){first.focus();return}
    if(d.botcheck)return;
    const btn=f.querySelector('button');btn.disabled=true;
    const oldLabel=f.querySelector('.bt').textContent;f.querySelector('.bt').textContent='Submitting…';
    try{
      const r=await fetch(CFG.ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({name:d.name.trim(),mobile:mob,city:d.city.trim(),interest:d.interest,email:(d.email||'').trim(),message:(d.message||'').trim(),source,botcheck:d.botcheck||''})});
      const j=await r.json().catch(()=>({success:false,message:'Server se valid response nahi mila.'}));
      if(!r.ok||!j.success)throw new Error(j.message||'Email notification send nahi ho saki.');
      sessionStorage.setItem('lead_ok',source);sessionStorage.setItem('popup_done','1');
      location.href=next;
    }catch(err){box.textContent=(err&&err.message)||'Submit nahi ho paya. Hosting par PHP/email configuration check karein, ya seedha call/WhatsApp karein. Aapki bhari hui details yahin hain.';btn.disabled=false;f.querySelector('.bt').textContent=oldLabel}
  });
}

/* ===== Dialog (popup + brochure share one) ===== */
let dlg;
function openLead(source,title,sub,next,label){
  dlg=dlg||document.body.appendChild(Object.assign(document.createElement('dialog'),{id:'dlg'}));
  dlg.setAttribute('aria-labelledby','dt');
  dlg.innerHTML=`<button class="x" aria-label="Close">&times;</button><h2 id="dt">${title}</h2><p>${sub}</p><div id="df"></div>`;
  $('#df',dlg).innerHTML=formHTML('d');bindForm($('form',dlg),source,next,label);
  $('.x',dlg).onclick=()=>dlg.close();
  dlg.onclose=()=>{if(source==='Homepage Popup')sessionStorage.setItem('popup_done','1')};
  dlg.showModal();
}
const openBrochure=()=>openLead('Brochure Download','Brochure paane ke liye details bharein','Details submit karne ke baad brochure download page khulega. Aap se enquiry ke baare mein contact kiya ja sakta hai.','brochure-download.html','Get my brochure');

/* ===== Page init ===== */
document.addEventListener('DOMContentLoaded',()=>{
  const page=document.body.dataset.page;

  // Responsive navigation works on desktop/tablet widths where the full menu is hidden.
  const menuButton=$('.menu-toggle'), nav=$('.nav nav');
  if(menuButton && nav){
    menuButton.addEventListener('click',()=>{
      const opened=nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded',String(opened));
      menuButton.setAttribute('aria-label',opened?'Close navigation':'Open navigation');
      menuButton.textContent=opened?'×':'☰';
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');
      menuButton.setAttribute('aria-label','Open navigation');menuButton.textContent='☰';
    }));
  }

  // Shared brochure lead form entry point. The actual PDF is served only after the form flow.
  document.querySelectorAll('[data-brochure]').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();
    if(page==='home') openBrochure();
    else location.href='index.html#brochure';
  }));

  const cf=$('#contactForm');
  if(cf){cf.innerHTML=formHTML('c');bindForm($('form',cf),'Contact Page','thank-you.html','Request a consultation')}

  document.querySelectorAll('[data-consult]').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();openLead('Consultation CTA','Let’s discuss your insurance goals','Share a few details and Aman can contact you about your enquiry.','thank-you.html','Request a consultation');
  }));

  const wa=`https://wa.me/${CFG.PHONE}?text=${encodeURIComponent('Namaste Aman ji, mujhe LIC plans ke baare mein jaankari chahiye.')}`;
  document.querySelectorAll('.wa,[data-whatsapp]').forEach(a=>a.href=wa);

  // Home-only popup. Other page templates intentionally do not run home widgets.
  if(page==='home'){
    if(!sessionStorage.getItem('popup_done'))setTimeout(()=>{
      if(!(dlg&&dlg.open))openLead('Homepage Popup',"Let’s discuss your insurance goals",'Share your details to request a consultation about your financial goals.','thank-you.html','Request a consultation');
    },3000);
    if(location.hash==='#brochure')openBrochure();
  }

  if(page==='brochure'){
    const ok=sessionStorage.getItem('lead_ok')==='Brochure Download';
    const download=$('#bd'), denied=$('#nb');
    if(download)download.hidden=!ok;
    if(denied)denied.hidden=ok;
    if(ok)document.querySelectorAll('.dl').forEach(a=>a.href=CFG.BROCHURE);
  }
});
