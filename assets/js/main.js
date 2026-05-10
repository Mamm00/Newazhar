'use strict';
// Scroll reveal
const revealObs = new IntersectionObserver(e => e.forEach(x => { if(x.isIntersecting){x.target.classList.add('visible');revealObs.unobserve(x.target);}}),{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Navbar scroll
const nb = document.getElementById('navbar');
window.addEventListener('scroll',()=>nb?.classList.toggle('scrolled',scrollY>50),{passive:true});

// Mobile nav
const burger=document.getElementById('burger'),mNav=document.getElementById('mobile-nav'),mClose=document.getElementById('mobile-close');
burger?.addEventListener('click',()=>{mNav.classList.add('open');document.body.style.overflow='hidden';});
mClose?.addEventListener('click',()=>{mNav.classList.remove('open');document.body.style.overflow='';});
document.querySelectorAll('.nav-mobile a').forEach(a=>a.addEventListener('click',()=>{mNav?.classList.remove('open');document.body.style.overflow='';}));

// Active nav link
const pg = location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav-links a,.nav-mobile a').forEach(a=>{if(a.getAttribute('href')===pg)a.classList.add('active');});

// Product filter
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(c=>{
      c.style.display=(f==='all'||c.dataset.category===f)?'':'none';
    });
  });
});

// Lightbox
const lb=document.getElementById('lightbox'),lbImg=document.getElementById('lightbox-img');
document.querySelectorAll('.gallery-item').forEach(item=>{
  item.addEventListener('click',()=>{
    const img=item.querySelector('img');
    if(!lb||!img)return;
    lbImg.src=img.src;lbImg.alt=img.alt;
    lb.classList.add('open');document.body.style.overflow='hidden';
  });
});
document.getElementById('lightbox-close')?.addEventListener('click',closeLb);
lb?.addEventListener('click',e=>{if(e.target===lb)closeLb();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLb();});
function closeLb(){lb?.classList.remove('open');document.body.style.overflow='';}

// Duplicate strip for seamless marquee
const st=document.querySelector('.strip-track');
if(st)st.parentElement.appendChild(st.cloneNode(true));

// Counter animation
const cntObs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){animCount(x.target);cntObs.unobserve(x.target);}}),{threshold:.5});
document.querySelectorAll('.stat-number[data-count]').forEach(el=>cntObs.observe(el));
function animCount(el){
  const target=+el.dataset.count,sfx=el.dataset.suffix||'',dur=1600,step=target/(dur/16);
  let cur=0;const t=setInterval(()=>{cur+=step;if(cur>=target){el.textContent=target+sfx;clearInterval(t);}else el.textContent=Math.floor(cur)+sfx;},16);
}

// Form success
if(new URLSearchParams(location.search).get('success')==='1'){
  const s=document.getElementById('form-success');if(s)s.style.display='flex';
}
