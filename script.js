const galleryImgs = ['ay1.jpg','ay2.jpg','ay3.jpg','ay4.jpg','ay5.jpg','ay6.jpg','ay7.jpg','ay8.jpg','ay9.jpg','ay10.jpg'];
const irisShots = Array.from({length:25}, (_, index) => `${index + 1}.jpg`);
const hrisShots = ['hris.jpg', ...Array.from({length:10}, (_, index) => `hris${index + 1}.png`)];


const introLoader = document.getElementById('introLoader');
const introLoaderLogo = document.getElementById('introLoaderLogo');
window.addEventListener('load', ()=>{
  const progressBar = introLoader?.querySelector('.intro-loader-line');
  progressBar?.classList.add('is-complete');
  progressBar?.setAttribute('aria-valuenow', '100');
  const finishIntro = ()=>{
    introLoader?.classList.add('is-hidden');
    document.body.classList.remove('intro-active');
    document.body.classList.add('page-entering');
    setTimeout(()=>document.body.classList.remove('page-entering'), 2200);
  };
  setTimeout(()=>{
    if(!introLoader){ finishIntro(); return; }
    introLoader.classList.add('is-logo-ready');
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      setTimeout(finishIntro, 500);
      return;
    }
    setTimeout(()=>{
      const brandLogo = document.getElementById('themeLogo');
      if(brandLogo && introLoaderLogo){
        const target = brandLogo.getBoundingClientRect();
        introLoader.style.setProperty('--intro-x', `${target.left + target.width / 2 - window.innerWidth / 2}px`);
        introLoader.style.setProperty('--intro-y', `${target.top + target.height / 2 - window.innerHeight / 2}px`);
        introLoader.classList.add('is-logo-flying');
      }
      setTimeout(finishIntro, 1000);
    }, 750);
  }, 1700);
});


const roles = ['Mobile Application Developer','Front-End Developer','UI/UX Designer','IT Tech'];
let ri=0, ci=0, deleting=false;
const roleEl = document.getElementById('typingRole');
function typeLoop(){
  const current = roles[ri];
  if(!deleting){
    ci++;
    roleEl.innerHTML = current.slice(0,ci) + '<span class="cursor">▌</span>';
    if(ci===current.length){ deleting=true; setTimeout(typeLoop,1300); return; }
  } else {
    ci--;
    roleEl.innerHTML = current.slice(0,ci) + '<span class="cursor">▌</span>';
    if(ci===0){ deleting=false; ri=(ri+1)%roles.length; }
  }
  setTimeout(typeLoop, deleting?40:70);
}
typeLoop();


const burgerBtn=document.getElementById('burgerBtn'), mobileMenu=document.getElementById('mobileMenu');
const mobileOverlay=document.getElementById('mobileOverlay'), mobileClose=document.getElementById('mobileClose');
function openMenu(){mobileMenu.classList.add('open');}
function closeMenu(){mobileMenu.classList.remove('open');}
burgerBtn.addEventListener('click', openMenu);
mobileOverlay.addEventListener('click', closeMenu);
mobileClose.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-drawer a').forEach(a=>a.addEventListener('click', closeMenu));


const track = document.getElementById('galleryTrack');
const allShots = [...galleryImgs, ...galleryImgs];
allShots.forEach((src,i)=>{
  const img=document.createElement('img');
  img.src=src; img.alt='Gallery image';
  img.onerror=function(){this.src='https://placehold.co/220x150/131c30/ffb454?text=Photo';};
  img.addEventListener('click', ()=>openShots(galleryImgs, 'Gallery', i%galleryImgs.length));
  track.appendChild(img);
});


const viewModal=document.getElementById('viewModal'), modalImg=document.getElementById('modalImg');
const modalCaption=document.getElementById('modalCaption');
let currentSet=[], currentIndex=0, currentLabel='', currentCertLabels=[];
let currentCertView=false;
function openShots(set, label, startIndex=0){
  currentSet=set; currentLabel=label; currentIndex=startIndex;
  currentCertLabels=[];
  currentCertView=false;
  viewModal.classList.remove('cert-view');
  renderModal();
  viewModal.classList.add('open');
}
function renderModal(){
  modalImg.src=currentSet[currentIndex];
  modalImg.onerror=function(){this.src='https://placehold.co/700x500/131c30/ffb454?text=Image';};
  const caption = currentCertView ? currentCertLabels[currentIndex] : currentLabel;
  modalCaption.textContent = caption + ' — ' + (currentIndex+1) + ' / ' + currentSet.length;
}
function closeModal(){
  viewModal.classList.remove('open', 'cert-view');
  currentCertView=false;
}
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalPrev').addEventListener('click', ()=>{currentIndex=(currentIndex-1+currentSet.length)%currentSet.length; renderModal();});
document.getElementById('modalNext').addEventListener('click', ()=>{currentIndex=(currentIndex+1)%currentSet.length; renderModal();});
viewModal.addEventListener('click', (e)=>{ if(e.target===viewModal) closeModal(); });

function openCertModal(src, label){
  const certCards = Array.from(document.querySelectorAll('#certGrid .cert-card'));
  const certs = certCards.map(card=>{
    const image = card.querySelector('img');
    const handler = card.getAttribute('onclick');
    const match = handler?.match(/openCertModal\('([^']+)','([^']+)'\)/);
    return {src:match?.[1] || image?.getAttribute('src') || '', label:match?.[2] || image?.alt || ''};
  });
  currentSet = certs.map(cert=>cert.src);
  currentCertLabels = certs.map(cert=>cert.label);
  currentIndex = Math.max(0, currentSet.findIndex(certSrc=>certSrc === src));
  currentLabel = label;
  currentCertView = true;
  viewModal.classList.add('cert-view');
  renderModal();
  viewModal.classList.add('open');
}

const certGrid = document.getElementById('certGrid');
let certSwipeStartX = 0;
viewModal.addEventListener('pointerdown', event=>{
  if(!currentCertView || event.pointerType === 'mouse') return;
  certSwipeStartX = event.clientX;
});
viewModal.addEventListener('pointerup', event=>{
  if(!currentCertView || event.pointerType === 'mouse') return;
  const deltaX = event.clientX - certSwipeStartX;
  if(Math.abs(deltaX) < 45) return;
  currentIndex = (currentIndex + (deltaX < 0 ? 1 : -1) + currentSet.length) % currentSet.length;
  currentLabel = currentCertLabels[currentIndex];
  currentCertView = true;
  renderModal();
});

/* ---------- chatbot ---------- */
const chatToggle=document.getElementById('chatToggle'), chatBox=document.getElementById('chatBox'), chatClose=document.getElementById('chatClose');
const chatMessages=document.getElementById('chatMessages'), chatInput=document.getElementById('chatInput'), chatSend=document.getElementById('chatSend');
chatToggle.addEventListener('click', ()=>chatBox.classList.toggle('hidden'));
chatClose.addEventListener('click', ()=>chatBox.classList.add('hidden'));

const kb = [
  { k:['age','how old','old is she','old is anjenel'], a:"Anjenel is 23 yrs old." },
  { k:['birthday','birth date','date of birth','when was she born'], a:"Anjenel's birthday is July 17, 2003." },
  { k:['graduated','graduate'], a:"Yes, Anjenel is graduated. She completed her Bachelor of Science in Computer Science in 2026." },
  { k:['number','phone','contact number','mobile number'], a:"You can contact Anjenel at 09298988721 or email her at delumenanjenel@gmail.com." },
  { k:['skill','skills','tech stack','stack'], a:"Anjenel works with HTML, CSS, JavaScript, Kotlin, and Java, plus React, Node.js, Firebase, and SQLite for mobile and web projects. Also skilled in Figma for UI/UX design." },
  { k:['experience','work','ojt','intern'], a:"Anjenel did an OJT at Urban Travellers Hotel (Feb–May 2026) as an IT Intern, Front-End Developer, and UI/UX Designer." },
  { k:['project','projects'], a:"Notable projects include Royale Fitness Center, IRIS Scanner Mobile, HRIS Timekeeping System, and the I-RIS Bookstore website. Check the Projects section above for links." },
  { k:['education','school','degree','course'], a:"Anjenel holds a Bachelor of Science in Computer Science from Philippine Christian University – Dasmariñas, graduating in 2026, and was a Dean's Lister with a GWA of 1.48." },
  { k:['contact','email','reach','hire'], a:"You can reach Anjenel at delumenanjenel@gmail.com or through the contact form at the bottom of this page." },
  { k:['location','based','where'], a:"Anjenel is based in Imus, Cavite, Philippines, and is open to remote or on-site opportunities." },
  { k:['certif'], a:"Certifications include Cisco Networking CyberSecurity, a Machine Learning exam, Mobile Android App Developer training, DICT AI Prompts 101, and AI Class ASEAN." },
];
function botReply(text){
  const t=text.toLowerCase();
  const hit = kb.find(row=>row.k.some(kw=>t.includes(kw)));
  return hit ? hit.a : "I'm not sure about that one — feel free to ask about Anjenel's skills, experience, projects, education, or how to get in touch.";
}
function pushMsg(text, who){
  const div=document.createElement('div');
  div.className='msg '+who;
  div.textContent=text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}
function sendChat(){
  const val=chatInput.value.trim();
  if(!val) return;
  pushMsg(val,'user');
  chatInput.value='';
  setTimeout(()=>pushMsg(botReply(val),'bot'), 300);
}
chatSend.addEventListener('click', sendChat);
chatInput.addEventListener('keypress', e=>{ if(e.key==='Enter') sendChat(); });

/* ---------- theme toggle (dark / light) ---------- */
const root = document.documentElement;
const aboutAvatar = document.getElementById('aboutAvatar');
const heroAvatar = document.getElementById('heroAvatar');
const themeLogo = document.getElementById('themeLogo');
const introLogo = document.getElementById('introLoaderLogo');
const themeLabel = document.getElementById('themeLabel');
const themeLabelMobile = document.getElementById('themeLabelMobile');
let aboutAvatarHovered = false;
let aboutAvatarTapped = false;
let heroAvatarHovered = false;
let heroAvatarTapped = false;

function updateHeroAvatarSource(){
  if(!heroAvatar) return;
  const theme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const source = heroAvatarHovered || heroAvatarTapped ? heroAvatar.dataset[`${theme}Hover`] : heroAvatar.dataset[theme];
  if(source && heroAvatar.src !== new URL(source, document.baseURI).href) heroAvatar.src = source;
}

heroAvatar?.addEventListener('click', ()=>{
  if(window.matchMedia('(hover: none)').matches) heroAvatarHovered = false;
  heroAvatarTapped = !heroAvatarTapped;
  updateHeroAvatarSource();
});
heroAvatar?.addEventListener('mouseenter', ()=>{ heroAvatarHovered=true; updateHeroAvatarSource(); });
heroAvatar?.addEventListener('mouseleave', ()=>{ heroAvatarHovered=false; updateHeroAvatarSource(); });

function updateAboutAvatarSource(){
  if(!aboutAvatar) return;
  const theme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const source = aboutAvatarHovered || aboutAvatarTapped ? aboutAvatar.dataset[`${theme}Hover`] : aboutAvatar.dataset[theme];
  if(source && aboutAvatar.src !== new URL(source, document.baseURI).href) aboutAvatar.src = source;
}

aboutAvatar?.addEventListener('click', ()=>{
  if(window.matchMedia('(hover: none)').matches) aboutAvatarHovered = false;
  aboutAvatarTapped = !aboutAvatarTapped;
  updateAboutAvatarSource();
});
aboutAvatar?.addEventListener('mouseenter', ()=>{ aboutAvatarHovered=true; updateAboutAvatarSource(); });
aboutAvatar?.addEventListener('mouseleave', ()=>{ aboutAvatarHovered=false; updateAboutAvatarSource(); });
aboutAvatar?.addEventListener('focus', ()=>{ aboutAvatarHovered=true; updateAboutAvatarSource(); });
aboutAvatar?.addEventListener('blur', ()=>{ aboutAvatarHovered=false; updateAboutAvatarSource(); });

function applyTheme(theme){
  root.setAttribute('data-theme', theme);
  if(themeLabel) themeLabel.textContent = theme;
  if(themeLabelMobile) themeLabelMobile.textContent = theme + ' mode';
  if(themeLogo){
    const source = theme === 'light' ? themeLogo.dataset.light : themeLogo.dataset.dark;
    if(source && themeLogo.src !== new URL(source, document.baseURI).href) themeLogo.src = source;
    if(introLogo && source && introLogo.src !== new URL(source, document.baseURI).href) introLogo.src = source;
  }
  updateHeroAvatarSource();
  updateAboutAvatarSource();
  try{ localStorage.setItem('ad-theme', theme); }catch(e){}
}
function getPreferredTheme(){
  try{
    const saved = localStorage.getItem('ad-theme');
    if(saved) return saved;
  }catch(e){}
  return 'dark';
}
applyTheme(getPreferredTheme());

function toggleTheme(){
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
}
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
const themeToggleMobile = document.getElementById('themeToggleMobile');
if(themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

/* ---------- scroll-triggered animations ---------- */
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
    } else {
      entry.target.classList.remove('in-view');
    }
  });
}, { threshold:0.15, rootMargin:'0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el=>{
  revealObserver.observe(el);
});

/* ---------- timeline: scroll reveal (both directions) + progressive line ---------- */
(function(){
  const timeline = document.querySelector('.experience-timeline');
  if(!timeline) return;
  const entries = [...timeline.querySelectorAll('.job-entry')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion || !('IntersectionObserver' in window)){
    entries.forEach(el=>el.classList.add('is-visible'));
    timeline.style.setProperty('--tl-p', 1);
    return;
  }

  const TRIGGER = 0.8;   /* viewport fraction where a marker "arrives"; used by both observer and line */
  const STAGGER = 0.14;  /* seconds between markers revealed in the same pass */
  timeline.classList.add('tl-ready');
  timeline.style.setProperty('--tl-p', 0);

  /* markers: toggle on enter/leave so they replay and reverse smoothly */
  const io = new IntersectionObserver((records)=>{
    const entering = records.filter(r=>r.isIntersecting)
      .sort((a,b)=>a.boundingClientRect.top - b.boundingClientRect.top);
    entering.forEach((r,i)=>{
      r.target.style.setProperty('--tl-delay', (i * STAGGER).toFixed(2) + 's');
      r.target.classList.add('is-visible');
    });
    records.filter(r=>!r.isIntersecting).forEach(r=>{
      r.target.style.setProperty('--tl-delay', '0s');
      r.target.classList.remove('is-visible');
    });
  }, { threshold:0, rootMargin:'0px 0px -' + ((1 - TRIGGER) * 100) + '% 0px' });
  entries.forEach(el=>io.observe(el));

  /* connecting line: eases toward a scroll-driven target, so it fills going down and drains going up */
  let current = 0, target = 0, rafId = 0;
  function computeTarget(){
    const rect = timeline.getBoundingClientRect();
    const lineTop = rect.top + 8;
    const lineH = Math.max(rect.height - 16, 1);
    target = Math.min(Math.max((window.innerHeight * TRIGGER - lineTop) / lineH, 0), 1);
  }
  function tick(){
    rafId = 0;
    computeTarget();
    current += (target - current) * 0.16;
    if(Math.abs(target - current) < 0.0008) current = target;
    timeline.style.setProperty('--tl-p', current.toFixed(4));
    if(current !== target) rafId = requestAnimationFrame(tick);
  }
  function schedule(){ if(!rafId) rafId = requestAnimationFrame(tick); }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  window.addEventListener('load', schedule);
  schedule();
})();

const heroSection = document.querySelector('.hero-banner');
if(heroSection){
  let heroWasOutOfView = false;
  const heroObserver = new IntersectionObserver(([entry])=>{
    if(entry.isIntersecting && heroWasOutOfView){
      heroSection.classList.add('hero-reentering');
    } else if(!entry.isIntersecting){
      heroWasOutOfView = true;
      heroSection.classList.remove('hero-reentering');
    }
  }, { threshold:0.15 });
  heroObserver.observe(heroSection);
}

const aboutObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    entry.target.querySelectorAll('.about-reveal').forEach(element=>{
      element.classList.toggle('about-visible', entry.isIntersecting);
    });
  });
}, { threshold:0.18 });
const aboutSection = document.getElementById('about');
if(aboutSection) aboutObserver.observe(aboutSection);

/* skill bars: replay the fill animation whenever their category enters the viewport */
const barTimers = new WeakMap();
const barObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const bars = entry.target.querySelectorAll('.ruler-fill');
    const timers = barTimers.get(entry.target) || [];
    timers.forEach(timer=>clearTimeout(timer));
    barTimers.set(entry.target, []);

    if(entry.isIntersecting){
      bars.forEach(bar=>{ bar.style.width='0%'; });
      requestAnimationFrame(()=>{
        const nextTimers = [];
        bars.forEach((bar,i)=>{
          nextTimers.push(setTimeout(()=>{ bar.style.width = bar.dataset.w || '0%'; }, i*90));
        });
        barTimers.set(entry.target, nextTimers);
      });
    } else {
      bars.forEach((bar,i)=>{
        bar.style.width='0%';
      });
    }
  });
}, { threshold:0.25 });
document.querySelectorAll('.skill-cat').forEach(cat=>barObserver.observe(cat));

/* tap-to-reveal color for grayscale images on touch devices */
document.querySelectorAll('.cert-card, .gallery-track img, .proj-img').forEach(target=>{
  target.addEventListener('click', ()=>{
    target.classList.toggle('is-color');
  });
});