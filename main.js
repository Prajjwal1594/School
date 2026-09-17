/* ========================================
   St. Saviour School — Shared JS
   ======================================== */
(function(){
  "use strict";

  /* ---------- Theme toggle ---------- */
  var root=document.documentElement, themeBtn=document.getElementById('themeToggle');
  function applyTheme(t){
    root.setAttribute('data-theme', t);
    themeBtn.textContent = t==='dark' ? '☀ Switch to Light' : '🌙 Switch to Dark';
    themeBtn.setAttribute('aria-pressed', t==='dark');
    try{ localStorage.setItem('ss_theme', t); }catch(e){}
  }
  var saved = null;
  try{ saved = localStorage.getItem('ss_theme'); }catch(e){}
  applyTheme(saved === 'dark' || saved === 'light' ? saved : 'light');
  themeBtn.addEventListener('click', function(){
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Mobile nav ---------- */
  var hamburger=document.getElementById('hamburger'), nav=document.getElementById('primaryNav');
  hamburger.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });

  /* Close mobile nav on link click */
  nav.querySelectorAll('a:not(.dd-trigger)').forEach(function(a){
    a.addEventListener('click', function(){
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded','false');
    });
  });

  /* Mobile dropdown toggles */
  nav.querySelectorAll('.dd-trigger').forEach(function(trigger){
    trigger.addEventListener('click', function(e){
      if(window.innerWidth <= 960){
        e.preventDefault();
        trigger.closest('.nav-dropdown').classList.toggle('open');
      }
    });
  });

  /* ---------- Hero slider (only if present) ---------- */
  var slides = document.querySelectorAll('.hero-slide');
  if(slides.length){
    slides = Array.prototype.slice.call(slides);
    var dotsWrap = document.getElementById('heroDots');
    var current = 0, heroTimer;
    slides.forEach(function(_, i){
      var d = document.createElement('button');
      if(i===0) d.classList.add('active');
      d.setAttribute('aria-label','Go to slide '+(i+1));
      d.addEventListener('click', function(){ heroShow(i); heroReset(); });
      dotsWrap.appendChild(d);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);
    function heroShow(i){
      slides[current].classList.remove('active'); dots[current].classList.remove('active');
      current = (i+slides.length)%slides.length;
      slides[current].classList.add('active'); dots[current].classList.add('active');
    }
    function heroReset(){ clearInterval(heroTimer); heroTimer=setInterval(function(){heroShow(current+1);},6000); }
    var prevBtn=document.getElementById('heroPrev'), nextBtn=document.getElementById('heroNext');
    if(prevBtn) prevBtn.addEventListener('click', function(){ heroShow(current-1); heroReset(); });
    if(nextBtn) nextBtn.addEventListener('click', function(){ heroShow(current+1); heroReset(); });
    heroReset();
  }

  /* ---------- Stat counters (only if present) ---------- */
  var statEls = document.querySelectorAll('.stat b[data-count]');
  if(statEls.length){
    var counted = false;
    function runCounters(){
      if(counted) return; counted = true;
      statEls.forEach(function(el){
        var target = parseInt(el.getAttribute('data-count'),10), dur=1200, t0=null;
        function step(ts){
          if(!t0) t0=ts;
          var p = Math.min((ts-t0)/dur,1);
          el.textContent = Math.floor(p*target);
          if(p<1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
      });
    }
    var statsSection = document.querySelector('.stats');
    if(statsSection && 'IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting) runCounters(); });
      },{threshold:.4});
      io.observe(statsSection);
    } else { runCounters(); }
  }

  /* ---------- Academic tabs (only if present) ---------- */
  var tabBtns = document.querySelectorAll('.tab-btn');
  if(tabBtns.length){
    tabBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        tabBtns.forEach(function(b){b.classList.remove('active');});
        document.querySelectorAll('.tab-panel').forEach(function(p){p.classList.remove('active');});
        btn.classList.add('active');
        var panel = document.getElementById('tab-'+btn.dataset.tab);
        if(panel) panel.classList.add('active');
      });
    });
  }

  /* ---------- Testimonials (only if present) ---------- */
  var testiSlides = document.querySelectorAll('.testi-slide');
  if(testiSlides.length){
    var testiNavWrap = document.getElementById('testiNav');
    var tCurrent = 0, tTimer;
    testiSlides.forEach(function(_,i){
      var d=document.createElement('button');
      if(i===0) d.classList.add('active');
      d.setAttribute('aria-label','Testimonial '+(i+1));
      d.addEventListener('click', function(){ tShow(i); tReset(); });
      testiNavWrap.appendChild(d);
    });
    var tDots = Array.prototype.slice.call(testiNavWrap.children);
    function tShow(i){
      testiSlides[tCurrent].classList.remove('active'); tDots[tCurrent].classList.remove('active');
      tCurrent=(i+testiSlides.length)%testiSlides.length;
      testiSlides[tCurrent].classList.add('active'); tDots[tCurrent].classList.add('active');
    }
    function tReset(){ clearInterval(tTimer); tTimer=setInterval(function(){tShow(tCurrent+1);},5500); }
    tReset();
  }

  /* ---------- Events grid (only if #eventsGrid present) ---------- */
  var grid = document.getElementById('eventsGrid');
  if(grid && !grid.children.length){
    var events = [
      {title:'Water Park Tour', date:'20 Sep', color:'#e0b862', category:'events'},
      {title:'Art & Craft Workshop', date:'26 Apr', color:'#3f6b4a', category:'cultural'},
      {title:'Annual Sports Day', date:'13 Oct', color:'#c69a3f', category:'sports'},
      {title:'Health Check-up Programme', date:'16 Oct', color:'#1f3355', category:'events'},
      {title:'Science Exhibition', date:'02 Nov', color:'#5a4526', category:'cultural'},
      {title:'Independence Day Celebration', date:'15 Aug', color:'#2f5233', category:'events'},
      {title:'Annual Day Function', date:'20 Dec', color:'#152238', category:'cultural'},
      {title:'Investiture Ceremony', date:'05 Jul', color:'#8a5a20', category:'events'},
      {title:'Inter-House Cricket', date:'18 Aug', color:'#3f6b4a', category:'sports'},
      {title:'Yoga Day Celebration', date:'21 Jun', color:'#1f3355', category:'sports'},
      {title:'Diwali Mela', date:'28 Oct', color:'#c69a3f', category:'cultural'},
      {title:'Republic Day Parade', date:'26 Jan', color:'#152238', category:'events'}
    ];
    events.forEach(function(ev){
      var card=document.createElement('div');
      card.className='event-card';
      card.setAttribute('data-category', ev.category);
      card.innerHTML =
        '<div class="event-thumb illus" style="background:linear-gradient(155deg,'+ev.color+',var(--navy));border-radius:0;">'+
          '<span class="event-date">'+ev.date+'</span>'+
        '</div>'+
        '<div class="event-body"><h4>'+ev.title+'</h4><span>'+ev.category.charAt(0).toUpperCase()+ev.category.slice(1)+'</span></div>';
      card.addEventListener('click', function(){ openLightbox(ev); });
      grid.appendChild(card);
    });
  }

  /* ---------- Gallery filter (only if filter buttons present) ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  if(filterBtns.length && grid){
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
        var cat = btn.dataset.filter;
        Array.prototype.slice.call(grid.children).forEach(function(card){
          if(cat === 'all' || card.getAttribute('data-category') === cat){
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox=document.getElementById('lightbox');
  if(lightbox){
    function openLightbox(ev){
      document.getElementById('lightboxTitle').textContent = ev.title;
      document.getElementById('lightboxDate').textContent = ev.date + ' · St. Saviour School';
      document.getElementById('lightboxMedia').style.background = 'linear-gradient(155deg,'+ev.color+',var(--navy))';
      lightbox.classList.add('open');
    }
    var lbClose = document.getElementById('lightboxClose');
    if(lbClose) lbClose.addEventListener('click', function(){ lightbox.classList.remove('open'); });
    lightbox.addEventListener('click', function(e){ if(e.target===lightbox) lightbox.classList.remove('open'); });
    // expose for inline usage
    window.openLightbox = openLightbox;
  }

  /* ---------- FAQ accordion (only if present) ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q=item.querySelector('.faq-q'), a=item.querySelector('.faq-a');
    if(!q||!a) return;
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i){
        i.classList.remove('open'); var ia=i.querySelector('.faq-a'); if(ia) ia.style.maxHeight=null;
      });
      if(!isOpen){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight+'px'; }
    });
  });

  /* ---------- Modals ---------- */
  document.querySelectorAll('[data-open-modal]').forEach(function(trigger){
    trigger.addEventListener('click', function(e){
      e.preventDefault();
      var m = document.getElementById('modal-'+trigger.dataset.openModal);
      if(m) m.classList.add('open');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(function(overlay){
    overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.classList.remove('open'); });
    var closeBtn = overlay.querySelector('[data-close-modal]');
    if(closeBtn) closeBtn.addEventListener('click', function(){ overlay.classList.remove('open'); });
  });

  /* ---------- Validation helpers ---------- */
  function showMsg(el, text, ok){
    el.textContent = text; el.className = 'form-msg show ' + (ok?'ok':'bad');
  }
  function setInvalid(field, invalid){
    field.classList.toggle('invalid', invalid);
  }

  /* Contact form */
  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name=document.getElementById('cName'), email=document.getElementById('cEmail'),
          phone=document.getElementById('cPhone'), msg=document.getElementById('cMessage');
      var ok=true;
      setInvalid(name.closest('.field'), !name.value.trim()); if(!name.value.trim()) ok=false;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      setInvalid(email.closest('.field'), !emailOk); if(!emailOk) ok=false;
      var phoneOk = /^\d{10}$/.test(phone.value.replace(/\D/g,''));
      setInvalid(phone.closest('.field'), !phoneOk); if(!phoneOk) ok=false;
      setInvalid(msg.closest('.field'), !msg.value.trim()); if(!msg.value.trim()) ok=false;
      var out = document.getElementById('contactMsg');
      if(!ok){ showMsg(out, 'Please fix the highlighted fields.', false); return; }
      showMsg(out, 'Thanks, ' + name.value.trim().split(' ')[0] + ' — your message has been recorded. The office will reach out within one working day.', true);
      contactForm.reset();
    });
  }

  /* Admission form (modal) */
  var admissionForm = document.getElementById('admissionForm');
  if(admissionForm){
    admissionForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name=document.getElementById('aName'), phone=document.getElementById('aPhone'), grade=document.getElementById('aGrade');
      var ok=true;
      setInvalid(name.closest('.field'), !name.value.trim()); if(!name.value.trim()) ok=false;
      var phoneOk=/^\d{10}$/.test(phone.value.replace(/\D/g,''));
      setInvalid(phone.closest('.field'), !phoneOk); if(!phoneOk) ok=false;
      setInvalid(grade.closest('.field'), !grade.value); if(!grade.value) ok=false;
      var out=document.getElementById('admissionMsg');
      if(!ok){ showMsg(out,'Please fix the highlighted fields.', false); return; }
      // Save to localStorage
      try{
        var enquiries = JSON.parse(localStorage.getItem('ss_enquiries')||'[]');
        enquiries.push({name:name.value.trim(),phone:phone.value.trim(),grade:grade.value,date:new Date().toISOString()});
        localStorage.setItem('ss_enquiries', JSON.stringify(enquiries));
      }catch(err){}
      showMsg(out, 'Enquiry received for ' + grade.value + '. Our admissions office will call ' + phone.value + ' shortly.', true);
      admissionForm.reset();
      setTimeout(function(){ document.getElementById('modal-admission').classList.remove('open'); }, 1800);
    });
  }

  /* Inline admission form (admission page) */
  var inlineAdmForm = document.getElementById('inlineAdmissionForm');
  if(inlineAdmForm){
    inlineAdmForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name=document.getElementById('iaName'), phone=document.getElementById('iaPhone'),
          email=document.getElementById('iaEmail'), grade=document.getElementById('iaGrade'),
          child=document.getElementById('iaChild');
      var ok=true;
      setInvalid(name.closest('.field'), !name.value.trim()); if(!name.value.trim()) ok=false;
      var phoneOk=/^\d{10}$/.test(phone.value.replace(/\D/g,''));
      setInvalid(phone.closest('.field'), !phoneOk); if(!phoneOk) ok=false;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      setInvalid(email.closest('.field'), !emailOk); if(!emailOk) ok=false;
      setInvalid(grade.closest('.field'), !grade.value); if(!grade.value) ok=false;
      setInvalid(child.closest('.field'), !child.value.trim()); if(!child.value.trim()) ok=false;
      var out=document.getElementById('inlineAdmMsg');
      if(!ok){ showMsg(out,'Please fix the highlighted fields.', false); return; }
      try{
        var enquiries = JSON.parse(localStorage.getItem('ss_enquiries')||'[]');
        enquiries.push({parent:name.value.trim(),child:child.value.trim(),phone:phone.value.trim(),email:email.value.trim(),grade:grade.value,date:new Date().toISOString()});
        localStorage.setItem('ss_enquiries', JSON.stringify(enquiries));
      }catch(err){}
      showMsg(out, 'Enquiry received for ' + child.value.trim() + ' ('+grade.value+'). We will contact you at ' + phone.value + ' within one working day.', true);
      inlineAdmForm.reset();
    });
  }

  /* Tour form */
  var tourForm = document.getElementById('tourForm');
  if(tourForm){
    tourForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name=document.getElementById('tName'), phone=document.getElementById('tPhone'), date=document.getElementById('tDate');
      var ok=true;
      setInvalid(name.closest('.field'), !name.value.trim()); if(!name.value.trim()) ok=false;
      var phoneOk=/^\d{10}$/.test(phone.value.replace(/\D/g,''));
      setInvalid(phone.closest('.field'), !phoneOk); if(!phoneOk) ok=false;
      setInvalid(date.closest('.field'), !date.value); if(!date.value) ok=false;
      var out=document.getElementById('tourMsg');
      if(!ok){ showMsg(out,'Please fix the highlighted fields.', false); return; }
      showMsg(out, 'Tour requested for ' + date.value + '. We\'ll confirm a time slot by calling ' + phone.value + '.', true);
      tourForm.reset();
      setTimeout(function(){ document.getElementById('modal-tour').classList.remove('open'); }, 1800);
    });
  }

  /* Newsletter */
  var newsletterForm = document.getElementById('newsletterForm');
  if(newsletterForm){
    newsletterForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = document.getElementById('newsletterEmail');
      var out = document.getElementById('newsletterMsg');
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if(!emailOk){ showMsg(out, 'Please enter a valid email address.', false); return; }
      try{
        var list = JSON.parse(localStorage.getItem('ss_newsletter')||'[]');
        if(list.indexOf(email.value.trim())===-1) list.push(email.value.trim());
        localStorage.setItem('ss_newsletter', JSON.stringify(list));
      }catch(err){}
      showMsg(out, 'Signed up — ' + email.value.trim() + ' will receive circulars and updates.', true);
      newsletterForm.reset();
    });
  }

  /* ---------- Back to top ---------- */
  var backTop = document.getElementById('backTop');
  if(backTop){
    window.addEventListener('scroll', function(){
      backTop.classList.toggle('show', window.scrollY > 500);
    });
    backTop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });
  }

})();
