#!/usr/bin/env node
/**
 * Al Azhar Tex — CMS Build Script
 * Generates static HTML files from CMS JSON data for Netlify deployment
 * Usage: node build.js [cms-data.json]
 */

const fs = require('fs');
const path = require('path');

const cmsDataPath = process.argv[2] || './cms-data.json';
let data;

try {
  const raw = fs.readFileSync(cmsDataPath, 'utf8');
  data = JSON.parse(raw);
} catch (e) {
  console.error('❌ Error loading CMS data:', e.message);
  process.exit(1);
}

console.log('🏗️  Al Azhar Tex CMS Builder');
console.log('📦 Products:', data.products.length);
console.log('📂 Categories:', data.categories.length);

const OUTPUT_DIR = './dist';
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Copy assets
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
  }
}

if (fs.existsSync('./assets')) {
  copyDir('./assets', path.join(OUTPUT_DIR, 'assets'));
  console.log('✅ Assets copied');
}

// Copy CMS admin panel
if (fs.existsSync('./admin.html')) {
  fs.copyFileSync('./admin.html', path.join(OUTPUT_DIR, 'admin.html'));
  console.log('✅ CMS admin copied');
}

// HTML helpers
function escapeHtml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateHead(title, desc, metaImage) {
  const b = data.branding;
  const analytics = data.settings.enableAnalytics && data.settings.gaId ? `
  <script async src="https://www.googletagmanager.com/gtag/js?id=${data.settings.gaId}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${data.settings.gaId}');</script>` : '';
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc || b.metaDesc)}" />
  <meta name="keywords" content="${escapeHtml(b.metaKeywords)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(desc || b.metaDesc)}" />
  <meta property="og:image" content="${metaImage || b.logo}" />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/style.css" />
  <link rel="icon" href="${b.favicon}" />${analytics}
</head>`;
}

function generateTopBar() {
  const c = data.contact;
  return `<div class="topbar"><div class="container topbar-inner"><div class="topbar-links"><a href="tel:${c.phone.replace(/\s/g, '')}">📞 ${c.phone}</a><a href="https://wa.me/${c.whatsapp.replace(/\+|\s/g, '')}" target="_blank" rel="noopener">💬 WhatsApp Orders</a></div><div>🕐 ${c.days}: <strong>${c.hours}</strong> &nbsp;|&nbsp; <span style="opacity:.6;">${c.closed}</span></div></div></div>`;
}

function generateNavbar(activePage) {
  const pages = [
    { id: 'index', label: 'Home', href: 'index.html' },
    { id: 'products', label: 'Products', href: 'products.html' },
    { id: 'gallery', label: 'Gallery', href: 'gallery.html' },
    { id: 'about', label: 'About Us', href: 'about.html' },
    { id: 'contact', label: 'Contact', href: 'contact.html' }
  ];
  const links = pages.map(p => `<li><a href="${p.href}"${p.id === activePage ? ' class="active"' : ''}>${p.label}</a></li>`).join('');
  const c = data.contact;
  const waNum = c.whatsapp.replace(/\+|\s/g, '');
  return `<nav id="navbar"><div class="container nav-inner"><a href="index.html" class="nav-logo"><img src="${data.branding.logo}" alt="${data.branding.title}" /></a><ul class="nav-links">${links}</ul><div class="nav-right"><a href="https://wa.me/${waNum}?text=مرحبا%20الأزهر%20تكس" class="nav-wa" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>WhatsApp</a><button class="nav-burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button></div></div></nav><nav class="nav-mobile" id="mobile-nav"><button class="nav-mobile-close" id="mobile-close">&times;</button>${pages.map(p => `<a href="${p.href}">${p.label}</a>`).join('')}<a href="https://wa.me/${waNum}" class="btn btn-red" style="margin-top:1rem;" target="_blank" rel="noopener">WhatsApp Order</a></nav>`;
}

function generateFooter() {
  const c = data.contact, s = data.social, st = data.settings;
  const socialLinks = [];
  if (s.facebook) socialLinks.push(`<a href="${s.facebook}" class="social-icon" aria-label="Facebook"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>`);
  if (s.instagram) socialLinks.push(`<a href="${s.instagram}" class="social-icon" aria-label="Instagram"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>`);
  socialLinks.push(`<a href="https://wa.me/${c.whatsapp.replace(/\+|\s/g, '')}" class="social-icon" aria-label="WhatsApp"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>`);

  return `<footer><div class="container"><div class="footer-grid"><div><img src="${data.branding.logo}" alt="${data.branding.title}" class="footer-logo" /><div class="footer-tagline ar">${st.taglineAr}</div><p class="footer-desc">${st.footerDesc}</p><div class="social-icons">${socialLinks.join('')}</div></div><div class="footer-col"><h4>Quick Links</h4><ul><li><a href="index.html">Home</a></li><li><a href="products.html">Products</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="about.html">About Us</a></li><li><a href="contact.html">Contact</a></li></ul></div><div class="footer-col"><h4>Fabrics · أقمشة</h4><ul>${data.categories.slice(0, 6).map(cat => `<li><a href="products.html#${cat.slug}">${cat.name} · ${cat.nameAr}</a></li>`).join('')}</ul></div><div class="footer-col"><h4>Contact · تواصل</h4><ul><li><a href="tel:${c.phone.replace(/\s/g, '')}">${c.phone}</a></li><li><a href="https://wa.me/${c.whatsapp.replace(/\+|\s/g, '')}">WhatsApp Order</a></li><li><a href="contact.html">${c.address}</a></li><li><a href="mailto:${c.email}">${c.email}</a></li></ul><div style="margin-top:1rem;padding:.9rem;background:rgba(255,255,255,.06);border-radius:var(--radius);border:1px solid rgba(255,255,255,.1);"><div style="font-size:.62rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-accent);margin-bottom:.4rem;">Hours · ساعات العمل</div><div style="font-size:.78rem;color:rgba(255,255,255,.55);">${c.days}: ${c.hours}</div><div style="font-size:.75rem;color:rgba(255,255,255,.35);margin-top:.2rem;">${c.closed}</div></div></div></div><div class="footer-bottom"><p class="footer-copy">© ${st.year} ${st.company} · ${c.address}</p><p class="footer-copy">Fine Fabrics Wholesale · للأقمشة والمنسوجات بالجملة</p></div></div></footer>${st.showWhatsApp ? `<a href="https://wa.me/${c.whatsapp.replace(/\+|\s/g, '')}?text=مرحبا%20الأزهر%20تكس%2C%20أريد%20الاستفسار%20عن%20الأقمشة" class="whatsapp-float" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg><span class="wa-label">Order via WhatsApp</span></a>` : ''}<script src="assets/js/main.js"></script>`;
}

// Generate pages
function generateIndex() {
  const h = data.homepage.hero, p = data.homepage.promo;
  const featured = data.products.filter(pr => data.homepage.featured.includes(pr.id));
  const catTiles = data.categories.slice(0, 6).map((cat, i) => {
    const img = data.products.find(p => p.category === cat.slug)?.image || 'assets/images/fabric-dark-1.jpg';
    return `<div class="cat-tile ${i === 0 || i === 5 ? 'wide' : ''} reveal${i > 0 ? ` reveal-delay-${Math.min(i, 3)}` : ''}"><img src="${img}" alt="${cat.name}" loading="lazy" /><div class="cat-tile-overlay"></div><div class="cat-tile-body"><div class="cat-label">${cat.nameAr}</div><div class="cat-name">${cat.name}</div><div class="cat-ar ar">${cat.nameAr}</div><a href="products.html#${cat.slug}" class="cat-cta">Shop Now →</a></div></div>`;
  }).join('');

  const featCards = featured.map((pr, i) => `<div class="product-card reveal${i > 0 ? ` reveal-delay-${Math.min(i, 3)}` : ''}" data-category="${pr.category}"><div class="product-card-img"><img src="${pr.image}" alt="${pr.name}" loading="lazy" />${pr.badge ? `<span class="product-badge${['Premium','New'].includes(pr.badge) ? ' navy-badge' : ''}">${pr.badge}</span>` : ''}</div><div class="product-card-body"><div class="product-card-name">${pr.name}</div><div class="product-card-ar ar">${pr.nameAr}</div><div class="product-card-type">${pr.type}</div><div class="product-card-footer"><a href="contact.html">Enquire Now →</a></div></div></div>`).join('');

  const html = `${generateHead(data.branding.title, data.branding.metaDesc, h.bgImage)}
<body>
${data.settings.showPromoStrip ? `<div class="promo-strip"><div style="display:flex;overflow:hidden;"><div class="strip-track" aria-hidden="true"><span>New Arrivals: ${data.products.filter(p => ['New','New Season'].includes(p.badge)).slice(0,3).map(p => p.name).join(' · ')}</span><span>✦</span><span class="ar">${data.products.filter(p => ['chiffon','rotana'].includes(p.category)).slice(0,2).map(p => p.nameAr).join(' · ')} — متوفر الآن</span><span>✦</span><span>Wholesale Only · Min Order Applies</span><span>✦</span><span class="ar">الأزهر تكس — للأقمشة والمنسوجات بالجملة</span><span>✦</span><span>Open Daily ${data.contact.hours} · Closed ${data.contact.closed.split('·')[0].trim()}</span><span>✦</span></div></div></div>` : ''}
${generateTopBar()}
${generateNavbar('index')}
<header class="hero"><div class="hero-bg"><img src="${h.bgImage}" alt="Al Azhar Tex" /></div><div class="container"><div class="hero-content"><div class="hero-badge">${h.badge}</div><h1>${h.title1}<br><em>${h.title2}</em><br>${h.title3}</h1><p class="hero-ar ar">${h.arabic}</p><p class="hero-sub">${h.description}</p><div class="hero-actions"><a href="products.html" class="btn btn-red">${h.btn1}</a><a href="contact.html" class="btn btn-outline-white">${h.btn2}</a></div></div></div><div class="hero-scroll">Scroll</div></header>
<section class="categories"><div class="container"><div class="section-header"><div><span class="eyebrow reveal">Shop by Category</span><h2 class="section-title reveal reveal-delay-1">Browse Our <br>Fabric Lines</h2></div><a href="products.html" class="btn btn-outline reveal">View All Products →</a></div><div class="cat-grid">${catTiles}</div></div></section>
<section class="products-section"><div class="container"><div class="section-header"><div><span class="eyebrow reveal">New Season</span><h2 class="section-title reveal reveal-delay-1">Featured Fabrics</h2><div class="divider reveal reveal-delay-2"></div></div><a href="products.html" class="btn btn-outline reveal">Full Catalogue →</a></div><div class="products-grid">${featCards}</div></div></section>
<section class="promo-banner"><div class="container promo-banner-inner"><div class="promo-banner-text reveal"><span class="eyebrow">${p.eyebrow}</span><h2>${p.title.replace(/\n/g, '<br>')}</h2><p class="ar-sub ar">${p.arabic}</p></div><div class="reveal reveal-delay-2" style="display:flex;gap:1rem;flex-wrap:wrap;"><a href="products.html" class="btn btn-white">${p.btn1}</a><a href="https://wa.me/${data.contact.whatsapp.replace(/\+|\s/g, '')}" class="btn btn-outline-white" target="_blank" rel="noopener">${p.btn2}</a></div></div></section>
<section class="catalogue-strip"><div class="container"><div class="section-header"><div><span class="eyebrow reveal">Full Range · المجموعة الكاملة</span><h2 class="section-title reveal reveal-delay-1">Our Fabric Catalogue</h2></div><a href="products.html" class="btn btn-outline reveal">All Products →</a></div><div class="cat-scroll">${data.homepage.catalogue.map(img => `<div class="cat-poster"><img src="${img}" alt="Catalogue" loading="lazy" /></div>`).join('')}</div></div></section>
<section class="gallery-section"><div class="container"><div class="section-header"><div><span class="eyebrow reveal">Gallery · المعرض</span><h2 class="section-title reveal reveal-delay-1">From the Showroom</h2></div><a href="gallery.html" class="btn btn-outline reveal">Full Gallery →</a></div><div class="gallery-grid">${data.products.slice(0,4).map((pr,i) => `<div class="gallery-item ${['tall','','','wide'][i]} reveal${i > 0 ? ` reveal-delay-${Math.min(i,2)}` : ''}"><img src="${pr.image}" alt="${pr.name}" loading="lazy" /><div class="gallery-item-overlay"><span class="gallery-zoom">⊕</span></div><div class="gallery-caption"><div class="gallery-caption-name">${pr.name}</div></div></div>`).join('')}</div></div></section>
<div class="lightbox" id="lightbox"><button class="lightbox-close" id="lightbox-close">&times;</button><img src="" alt="" class="lightbox-img" id="lightbox-img" /></div>
<section style="padding:var(--section-gap) 0;"><div class="container"><div class="about-split" style="padding:0;"><img src="assets/images/store-display-2.jpg" alt="Showroom" class="reveal" /><div class="reveal reveal-delay-2"><span class="eyebrow">Our Story · قصتنا</span><h2 class="section-title">A Family Legacy<br>of Fine Fabrics</h2><div class="divider"></div><p style="color:var(--text-mid);font-size:.9rem;line-height:1.8;margin-bottom:1rem;">Founded by <strong>${data.about.founder}</strong> in the heart of ${data.about.location}, Al Azhar Tex has become one of Egypt's most trusted wholesale fabric suppliers. Our gallery stocks ${data.about.stats.fabrics}+ premium fabric lines.</p><p style="font-family:var(--font-arabic);direction:rtl;color:var(--text-light);font-size:.88rem;line-height:1.9;padding:1rem;background:var(--off-white);border-right:3px solid var(--red);border-radius:var(--radius);">"${data.about.arabicQuote}"</p><div class="stat-row"><div class="stat-item"><div class="stat-number" data-count="${data.about.stats.years}" data-suffix="+">${data.about.stats.years}+</div><div class="stat-label">Years of Trust</div></div><div class="stat-item"><div class="stat-number" data-count="${data.about.stats.fabrics}" data-suffix="+">${data.about.stats.fabrics}+</div><div class="stat-label">Fabric Lines</div></div><div class="stat-item"><div class="stat-number" data-count="${data.about.stats.clients}" data-suffix="+">${data.about.stats.clients}+</div><div class="stat-label">Happy Clients</div></div></div><a href="about.html" class="btn btn-navy" style="margin-top:2rem;">Read Our Story →</a></div></div></div></section>
${generateFooter()}
</body></html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
  console.log('✅ Generated: index.html');
}

function generateProducts() {
  const prodCards = data.products.map((pr, i) => `<div class="product-card reveal${i % 4 > 0 ? ` reveal-delay-${i % 4}` : ''}" data-category="${pr.category}" id="${i === 0 ? pr.category : ''}"><div class="product-card-img"><img src="${pr.image}" alt="${pr.name}" loading="lazy" />${pr.badge ? `<span class="product-badge${['Premium','New'].includes(pr.badge) ? ' navy-badge' : ''}">${pr.badge}</span>` : ''}</div><div class="product-card-body"><div class="product-card-name">${pr.name}</div><div class="product-card-ar ar">${pr.nameAr}</div><div class="product-card-type">${pr.type}</div><div class="product-card-footer"><a href="contact.html">Enquire Now →</a></div></div></div>`).join('');
  const filters = data.categories.map(cat => `<button class="filter-btn" data-filter="${cat.slug}">${cat.name} · ${cat.nameAr}</button>`).join('');

  const html = `${generateHead('Products — Al Azhar Tex', 'Full wholesale fabric catalogue — ' + data.products.slice(0,5).map(p => p.name).join(', ') + ' and more.', 'assets/images/logo-satin.jpg')}
<body>
${generateTopBar()}
${generateNavbar('products')}
<section class="page-hero"><div class="container" style="position:relative;z-index:1;"><div class="breadcrumb"><a href="index.html">Home</a><span class="sep">/</span><span style="color:rgba(255,255,255,.8);">Products</span></div><span class="eyebrow">Wholesale Catalogue · كتالوج الجملة</span><h1>Our Fabric Lines</h1><p style="color:rgba(255,255,255,.65);font-size:.88rem;margin-top:.7rem;max-width:500px;">${data.about.stats.fabrics}+ premium fabric lines available wholesale. All rolls in-stock at our ${data.about.location} gallery.</p></div></section>
<div class="promo-strip"><div style="display:flex;overflow:hidden;"><div class="strip-track">${data.products.slice(0,8).map(p => `<span>${p.name} · ${p.nameAr}</span><span>✦</span>`).join('')}</div></div></div>
<section class="products-section"><div class="container"><div style="margin-bottom:3rem;"><div class="cat-scroll">${data.homepage.catalogue.map(img => `<div class="cat-poster"><img src="${img}" alt="Catalogue" loading="lazy" /></div>`).join('')}</div></div><div class="filter-bar reveal" id="all"><button class="filter-btn active" data-filter="all">All · الكل</button>${filters}</div><div class="products-grid" id="product-grid">${prodCards}</div><div class="promo-banner" style="margin-top:4rem;border-radius:var(--radius);"><div class="container promo-banner-inner" style="padding:2.5rem clamp(1rem,4vw,2.5rem);"><div class="promo-banner-text"><span class="eyebrow">Can't Find It? · لا تجد ما تبحث عنه؟</span><h2>Ask Us Directly</h2><p class="ar-sub ar">تواصل معنا عبر واتساب لأي استفسار أو طلب خاص</p></div><div style="display:flex;gap:.9rem;flex-wrap:wrap;"><a href="https://wa.me/${data.contact.whatsapp.replace(/\+|\s/g, '')}?text=مرحبا%20الأزهر%20تكس%2C%20أريد%20الاستفسار%20عن%20قماش" class="btn btn-white" target="_blank" rel="noopener">WhatsApp Now →</a><a href="contact.html" class="btn btn-outline-white">Send Enquiry</a></div></div></div></div></section>
${generateFooter()}
</body></html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'products.html'), html);
  console.log('✅ Generated: products.html');
}

function generateGallery() {
  const html = `${generateHead('Gallery — Al Azhar Tex', 'Gallery of fabric samples from the Al Azhar Tex showroom in ' + data.about.location, 'assets/images/store-display-1.png')}
<body>
${generateTopBar()}
${generateNavbar('gallery')}
<section class="page-hero"><div class="container" style="position:relative;z-index:1;"><div class="breadcrumb"><a href="index.html">Home</a><span class="sep">/</span><span style="color:rgba(255,255,255,.8);">Gallery</span></div><span class="eyebrow">Gallery · معرض الصور</span><h1>Fabric Showroom</h1><p style="color:rgba(255,255,255,.6);font-size:.88rem;margin-top:.6rem;">Real fabric samples from our ${data.about.location} gallery. Click any image to view full size.<span class="ar" style="display:block;font-size:.82rem;margin-top:.3rem;color:rgba(255,255,255,.45);">اضغط على أي صورة للتكبير</span></p></div></section>
<section style="padding:var(--section-gap) 0;"><div class="container"><div class="section-header" style="margin-bottom:2rem;"><div><span class="eyebrow reveal">Store Displays · عروض المتجر</span><h2 class="section-title reveal reveal-delay-1">The ${data.about.location} Gallery</h2></div></div><div class="gallery-full" style="border-radius:var(--radius);overflow:hidden;">${data.products.slice(0,9).map((pr,i) => `<div class="gallery-item ${['tall','','','span2','tall','','','','span2'][i] || ''} reveal${i % 3 > 0 ? ` reveal-delay-${i % 3}` : ''}"><img src="${pr.image}" alt="${pr.name}" loading="lazy" /><div class="gallery-item-overlay"><span class="gallery-zoom">⊕</span></div><div class="gallery-caption"><div class="gallery-caption-name">${pr.name}</div><div class="gallery-caption-ar ar">${pr.nameAr}</div></div></div>`).join('')}</div></div></section>
<section style="padding:0 0 var(--section-gap); background:var(--off-white);"><div class="container" style="padding-top:var(--section-gap);"><div class="section-header" style="margin-bottom:2rem;"><div><span class="eyebrow reveal">Catalogue Visuals · صور الكتالوج</span><h2 class="section-title reveal reveal-delay-1">Product Line Posters</h2></div><a href="products.html" class="btn btn-outline reveal">Browse Products →</a></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;">${data.homepage.catalogue.map((img,i) => `<div class="gallery-item reveal${i % 4 > 0 ? ` reveal-delay-${i % 4}` : ''}" style="aspect-ratio:2/3;border-radius:var(--radius);overflow:hidden;"><img src="${img}" alt="Catalogue" loading="lazy" /><div class="gallery-item-overlay"><span class="gallery-zoom">⊕</span></div></div>`).join('')}</div></div></section>
<div class="lightbox" id="lightbox"><button class="lightbox-close" id="lightbox-close">&times;</button><img src="" alt="" class="lightbox-img" id="lightbox-img" /></div>
${generateFooter()}
</body></html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'gallery.html'), html);
  console.log('✅ Generated: gallery.html');
}

function generateAbout() {
  const a = data.about;
  const tl = a.timeline.map((t, i) => `<div class="timeline-item reveal reveal-delay-${Math.min(i+1,3)}"><div class="timeline-year">${t.year}</div><div class="timeline-event">${t.event}</div><div class="timeline-desc">${t.desc}</div></div>`).join('');
  const vals = a.values.map((v, i) => `<div class="value-card reveal${i > 0 ? ` reveal-delay-${Math.min(i,3)}` : ''}"><div class="value-icon">${v.icon}</div><div class="value-title">${v.title}</div><div class="value-desc">${v.desc}</div></div>`).join('');

  const html = `${generateHead('About Us — Al Azhar Tex', 'The story of ' + a.founder + ' and Al Azhar Tex — a family legacy of premium wholesale fabrics in ' + a.location + ', Egypt.', 'assets/images/store-display-2.jpg')}
<body>
${generateTopBar()}
${generateNavbar('about')}
<section class="page-hero" style="min-height:55vh;display:flex;align-items:flex-end;padding-bottom:4rem;position:relative;"><div style="position:absolute;inset:0;overflow:hidden;"><img src="assets/images/logo-satin.jpg" alt="" style="width:100%;height:100%;object-fit:cover;opacity:.35;" /><div style="position:absolute;inset:0;background:var(--navy-dark);opacity:.75;"></div></div><div class="container" style="position:relative;z-index:1;"><div class="breadcrumb"><a href="index.html">Home</a><span class="sep">/</span><span style="color:rgba(255,255,255,.8);">About Us</span></div><span class="eyebrow">Our Story · قصتنا</span><h1>Built on Fabric<br>& Trust</h1></div></section>
<section style="padding:var(--section-gap) 0;"><div class="container"><div class="about-split" style="padding:0;"><div class="reveal" style="display:flex;flex-direction:column;gap:1rem;"><img src="assets/images/store-display-1.png" alt="Showroom" style="border:3px solid var(--grey-light);border-radius:var(--radius);" /><div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;"><img src="${data.branding.logo}" alt="Logo" style="width:100%;aspect-ratio:1;object-fit:contain;border:2px solid var(--grey-light);border-radius:var(--radius);background:var(--off-white);padding:.5rem;" /><img src="assets/images/store-display-2.jpg" alt="Samples" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:var(--radius);" /></div></div><div class="reveal reveal-delay-2"><span class="eyebrow">About the Founder</span><h2 class="section-title">${a.founder} &<br>Al Azhar Tex</h2><div class="divider"></div><p style="color:var(--text-mid);font-size:.9rem;line-height:1.85;margin-bottom:1.2rem;">${a.story1}</p><p style="color:var(--text-mid);font-size:.9rem;line-height:1.85;margin-bottom:1.2rem;">${a.story2}</p><blockquote style="border-left:4px solid var(--red);padding:1rem 1.5rem;background:var(--off-white);border-radius:0 var(--radius) var(--radius) 0;margin:1.5rem 0;"><p style="font-size:1rem;font-style:italic;color:var(--navy);font-weight:600;line-height:1.6;">"${a.quote}"</p><cite style="font-size:.72rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text-light);font-style:normal;margin-top:.5rem;display:block;">— ${a.quoteAuthor}</cite></blockquote><p class="ar" style="color:var(--text-light);font-size:.88rem;line-height:1.9;direction:rtl;padding:1rem;background:var(--off-white);border-right:3px solid var(--navy);border-radius:var(--radius);">"${a.arabicQuote}"</p><div class="stat-row"><div class="stat-item"><div class="stat-number" data-count="${a.stats.years}" data-suffix="+">${a.stats.years}+</div><div class="stat-label">Years Active</div></div><div class="stat-item"><div class="stat-number" data-count="${a.stats.fabrics}" data-suffix="+">${a.stats.fabrics}+</div><div class="stat-label">Fabric Lines</div></div><div class="stat-item"><div class="stat-number" data-count="${a.stats.clients}" data-suffix="+">${a.stats.clients}+</div><div class="stat-label">Wholesale Clients</div></div></div></div></div></div></section>
<section style="padding:0 0 var(--section-gap);background:var(--off-white);"><div class="container" style="padding-top:var(--section-gap);"><div style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,5vw,5rem);align-items:start;"><div><span class="eyebrow reveal">Our Journey · مسيرتنا</span><h2 class="section-title reveal reveal-delay-1">Milestones</h2><div class="divider reveal reveal-delay-2"></div><div class="timeline">${tl}</div></div><div><img src="assets/images/fabric-dark-2.jpg" alt="Gallery" class="reveal" style="width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:var(--radius);border:3px solid var(--grey-light);" /></div></div></div></section>
<section style="padding:var(--section-gap) 0;"><div class="container"><div style="text-align:center;margin-bottom:2.5rem;"><span class="eyebrow reveal" style="justify-content:center;display:block;">What We Stand For · قيمنا</span><h2 class="section-title reveal reveal-delay-1" style="text-align:center;">Our Principles</h2></div><div class="values-grid">${vals}</div></div></section>
<section style="padding:0 0 var(--section-gap);"><div class="container"><div class="promo-banner" style="border-radius:var(--radius);"><div class="promo-banner-inner" style="padding:3rem clamp(1.5rem,4vw,3rem);"><div class="promo-banner-text reveal"><span class="eyebrow">Ready to Order? · جاهز للطلب؟</span><h2>Place a Wholesale<br>Order Today</h2><p class="ar-sub ar">اطلب بالجملة مباشرة عبر واتساب أو تعال زور معرضنا</p></div><div style="display:flex;gap:.9rem;flex-wrap:wrap;" class="reveal reveal-delay-2"><a href="https://wa.me/${data.contact.whatsapp.replace(/\+|\s/g, '')}?text=مرحبا%20الأزهر%20تكس%2C%20أريد%20طلب%20بالجملة" class="btn btn-white" target="_blank" rel="noopener">WhatsApp Order →</a><a href="contact.html" class="btn btn-outline-white">Send Enquiry</a></div></div></div></div></section>
${generateFooter()}
</body></html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'about.html'), html);
  console.log('✅ Generated: about.html');
}

function generateContact() {
  const c = data.contact;
  const fabricOpts = data.products.map(p => `<option>${p.name} — ${p.nameAr}</option>`).join('');

  const html = `${generateHead('Contact — Al Azhar Tex', 'Contact Al Azhar Tex for wholesale fabric orders. WhatsApp ' + c.whatsapp + '. Open ' + c.days + ' ' + c.hours + '. ' + c.address + '.', 'assets/images/logo-badge.jpg')}
<body>
${generateTopBar()}
${generateNavbar('contact')}
<section class="page-hero"><div class="container" style="position:relative;z-index:1;"><div class="breadcrumb"><a href="index.html">Home</a><span class="sep">/</span><span style="color:rgba(255,255,255,.8);">Contact</span></div><span class="eyebrow">Contact · تواصل</span><h1>Get in Touch</h1><p style="color:rgba(255,255,255,.6);font-size:.88rem;margin-top:.6rem;max-width:460px;">Wholesale enquiries, gallery visits, product availability — we're here.<span class="ar" style="display:block;font-size:.82rem;margin-top:.3rem;direction:rtl;">للطلبات والاستفسارات — تواصل معنا اليوم</span></p></div></section>
<section class="contact-section"><div class="container"><div class="contact-layout"><div><span class="eyebrow reveal">Find Us · موقعنا</span><h2 class="section-title reveal reveal-delay-1" style="font-size:clamp(1.4rem,2.5vw,1.9rem);">Contact Info</h2><div class="divider reveal reveal-delay-2"></div><a href="https://wa.me/${c.whatsapp.replace(/\+|\s/g, '')}?text=مرحبا%20الأزهر%20تكس%2C%20أريد%20الاستفسار%20عن%20الأقمشة" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:1rem;padding:1.2rem;background:#25D366;border-radius:var(--radius);color:#fff;margin-bottom:1rem;text-decoration:none;transition:background .2s;font-weight:800;" class="reveal" onmouseover="this.style.background='#128C7E'" onmouseout="this.style.background='#25D366'"><div style="width:48px;height:48px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div><div><div style="font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;opacity:.8;margin-bottom:.2rem;">Fastest Way to Order</div><div style="font-size:1.1rem;font-weight:900;">${c.whatsapp}</div><div style="font-size:.75rem;opacity:.8;">Chat with us on WhatsApp</div></div></a><div class="info-card reveal"><div class="info-icon">📍</div><div><div class="info-label">Address · العنوان</div><div class="info-value">${c.address}</div><div class="info-sub">${c.addressAr}</div></div></div><div class="info-card reveal reveal-delay-1"><div class="info-icon">📞</div><div><div class="info-label">Phone · هاتف</div><div class="info-value"><a href="tel:${c.phone.replace(/\s/g, '')}" style="color:var(--navy);">${c.phone}</a></div><div class="info-sub">Call or WhatsApp</div></div></div><div class="info-card reveal reveal-delay-2"><div class="info-icon">🕐</div><div><div class="info-label">Working Hours · ساعات العمل</div><div class="info-value">${c.hours}</div><div class="info-sub" style="display:flex;flex-direction:column;gap:2px;"><span>✅ ${c.days}: Open</span><span style="color:var(--red);">❌ ${c.closed}</span></div></div></div><div class="info-card reveal reveal-delay-3"><div class="info-icon">📧</div><div><div class="info-label">Email · بريد إلكتروني</div><div class="info-value"><a href="mailto:${c.email}" style="color:var(--navy);">${c.email}</a></div><div class="info-sub">We reply within 1 business day</div></div></div><div class="map-container reveal"><iframe src="${c.mapUrl}" title="Al Azhar Tex — ${c.address}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div><div class="reveal reveal-delay-1"><span class="eyebrow">Send Enquiry · أرسل استفسارًا</span><h2 class="section-title" style="font-size:clamp(1.4rem,2.5vw,1.9rem);">What Do You Need?</h2><div class="divider"></div><p style="color:var(--text-light);font-size:.85rem;margin-bottom:2rem;line-height:1.7;">Fill in the form below and we'll get back to you personally.<span class="ar" style="display:block;font-size:.82rem;margin-top:.3rem;direction:rtl;color:var(--text-light);">أخبرنا بما تحتاجه وسنرد في أقرب وقت</span></p><div class="form-success" id="form-success" style="display:none;">✅ &nbsp;شكرًا! تم إرسال رسالتك — سنتواصل معك قريبًا. Thank you, your enquiry was received!</div><form id="contact-form" name="fabric-enquiry" method="POST" action="contact.html?success=1" data-netlify="true" netlify-honeypot="bot-field"><input type="hidden" name="form-name" value="fabric-enquiry" /><p style="display:none;"><input name="bot-field" /></p><div class="form-row"><div class="form-group"><label for="name">Full Name · الاسم</label><input type="text" id="name" name="name" placeholder="Your name" required /></div><div class="form-group"><label for="phone">Phone / WhatsApp · رقم الهاتف</label><input type="tel" id="phone" name="phone" placeholder="+20 XXX XXX XXXX" required /></div></div><div class="form-group"><label for="email">Email (Optional) · البريد الإلكتروني</label><input type="email" id="email" name="email" placeholder="your@email.com" /></div><div class="form-group"><label for="fabric">Fabric of Interest · نوع القماش</label><select id="fabric" name="fabric"><option value="">— Select fabric —</option>${fabricOpts}<option>Other — أخرى</option></select></div><div class="form-row"><div class="form-group"><label for="quantity">Quantity · الكمية</label><select id="quantity" name="quantity"><option value="">— Select —</option><option>1–5 rolls</option><option>5–20 rolls</option><option>20–50 rolls</option><option>50+ rolls</option><option>Not sure yet</option></select></div><div class="form-group"><label for="city">Your City · مدينتك</label><input type="text" id="city" name="city" placeholder="e.g. Cairo, Alexandria..." /></div></div><div class="form-group"><label for="message">Message · رسالتك</label><textarea id="message" name="message" placeholder="Describe your requirements...
اكتب تفاصيل طلبك هنا..."></textarea></div><button type="submit" class="btn btn-navy" style="width:100%;justify-content:center;padding:1rem;font-size:.8rem;"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send Enquiry · إرسال الاستفسار</button><div style="text-align:center;margin-top:1.2rem;padding-top:1.2rem;border-top:1px solid var(--grey-light);"><p style="font-size:.75rem;color:var(--text-light);margin-bottom:.6rem;">Or reach us instantly via WhatsApp:</p><a href="https://wa.me/${c.whatsapp.replace(/\+|\s/g, '')}?text=مرحبا%20الأزهر%20تكس" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:.5rem;background:#25D366;color:#fff;padding:.65rem 1.5rem;border-radius:50px;font-size:.75rem;font-weight:800;text-decoration:none;transition:background .2s;" onmouseover="this.style.background='#128C7E'" onmouseout="this.style.background='#25D366'"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>${c.whatsapp}</a></div></form></div></div></div></section>
${generateFooter()}
</body></html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'contact.html'), html);
  console.log('✅ Generated: contact.html');
}

// Generate _redirects for Netlify
function generateRedirects() {
  const content = `# Al Azhar Tex — Netlify Redirects
/home              /index.html     200
/shop              /products.html  200
/catalogue         /products.html  200
/about-us          /about.html     200
/aboutus           /about.html     200
/get-in-touch      /contact.html   200
/enquiry           /contact.html   200
/admin             /admin.html     200
/cms               /admin.html     200
/*                 /index.html     404
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, '_redirects'), content);
  console.log('✅ Generated: _redirects');
}

// Generate netlify.toml
function generateNetlifyConfig() {
  const config = `[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'netlify.toml'), config);
  console.log('✅ Generated: netlify.toml');
}

// Run all generators
generateIndex();
generateProducts();
generateGallery();
generateAbout();
generateContact();
generateRedirects();
generateNetlifyConfig();

console.log('\n🎉 Build complete! Deploy the ./dist folder to Netlify.');
console.log('📁 Files ready in: ' + path.resolve(OUTPUT_DIR));
