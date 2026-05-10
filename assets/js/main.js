
'use strict';

/* ============================================================
   Al Azhar Tex — main.js  (Enhanced with Admin Panel)
   ============================================================ */

// ── Scroll reveal ───────────────────────────────────────────
const revealObs = new IntersectionObserver(e => e.forEach(x => {
  if(x.isIntersecting){x.target.classList.add('visible');revealObs.unobserve(x.target);}
}),{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Navbar scroll ──────────────────────────────────────────
const nb = document.getElementById('navbar');
window.addEventListener('scroll',()=>nb?.classList.toggle('scrolled',scrollY>50),{passive:true});

// ── Mobile nav ────────────────────────────────────────────
const burger=document.getElementById('burger'),mNav=document.getElementById('mobile-nav'),mClose=document.getElementById('mobile-close');
burger?.addEventListener('click',()=>{mNav.classList.add('open');document.body.style.overflow='hidden';});
mClose?.addEventListener('click',()=>{mNav.classList.remove('open');document.body.style.overflow='';});
document.querySelectorAll('.nav-mobile a').forEach(a=>a.addEventListener('click',()=>{mNav?.classList.remove('open');document.body.style.overflow='';}));

// ── Active nav link ────────────────────────────────────────
const pg = location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav-links a,.nav-mobile a').forEach(a=>{if(a.getAttribute('href')===pg)a.classList.add('active');});

// ── Product filter ────────────────────────────────────────
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

// ── Lightbox ────────────────────────────────────────────────
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

// ── Duplicate strip for seamless marquee ──────────────────
const st=document.querySelector('.strip-track');
if(st)st.parentElement.appendChild(st.cloneNode(true));

// ── Counter animation ─────────────────────────────────────
const cntObs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){animCount(x.target);cntObs.unobserve(x.target);}}),{threshold:.5});
document.querySelectorAll('.stat-number[data-count]').forEach(el=>cntObs.observe(el));
function animCount(el){
  const target=+el.dataset.count,sfx=el.dataset.suffix||'',dur=1600,step=target/(dur/16);
  let cur=0;const t=setInterval(()=>{cur+=step;if(cur>=target){el.textContent=target+sfx;clearInterval(t);}else el.textContent=Math.floor(cur)+sfx;},16);
}

// ── Form success ───────────────────────────────────────────
if(new URLSearchParams(location.search).get('success')==='1'){
  const s=document.getElementById('form-success');if(s)s.style.display='flex';
}


/* ============================================================
   ADMIN PANEL SYSTEM
   ============================================================ */

const AdminSystem = (function() {
  'use strict';

  // Default credentials (change these after first login!)
  const DEFAULT_USERS = [
    { username: 'admin', password: 'admin123', role: 'admin', lastLogin: null, status: 'active' },
    { username: 'shady', password: 'azhartex2025', role: 'admin', lastLogin: null, status: 'active' }
  ];

  const STORAGE_KEYS = {
    USERS: 'alazhar_admin_users',
    SESSION: 'alazhar_admin_session',
    ENQUIRIES: 'alazhar_enquiries',
    PRODUCTS: 'alazhar_products',
    GALLERY: 'alazhar_gallery',
    SETTINGS: 'alazhar_settings',
    CONTENT: 'alazhar_content',
    ACTIVITY: 'alazhar_activity'
  };

  // Initialize storage with defaults
  function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(getDefaultProducts()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(getDefaultGallery()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(getDefaultSettings()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTENT)) {
      localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(getDefaultContent()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify([]));
    }
  }

  function getDefaultProducts() {
    return [
      { id: 1, name: 'Warsaw', ar: 'ورسو', category: 'special', type: 'Special Weave · Wholesale Roll', img: 'assets/images/fabric-dark-2.jpg', badge: 'New Season' },
      { id: 2, name: 'Pirlanta', ar: 'بيرلانتا', category: 'special', type: 'Diamond Texture · Wholesale', img: 'assets/images/store-display-1.png', badge: 'Featured' },
      { id: 3, name: 'Lexus', ar: 'ليكسس', category: 'special', type: 'Premium Weave · Wholesale', img: 'assets/images/fabric-swatch-sofa.jpg', badge: 'New' },
      { id: 4, name: 'Zebda', ar: 'زبدة', category: 'special', type: 'Soft-Hand Weave · Wholesale', img: 'assets/images/fabric-dark-1.jpg', badge: '' },
      { id: 5, name: 'ITY Lickra 1001', ar: 'آي تي واي ليكرا ١٠٠١', category: 'stretch', type: 'Stretch Knit · Interlock', img: 'assets/images/fabric-dark-3.jpg', badge: 'Bestseller' },
      { id: 6, name: 'ITY Lickra 1002', ar: 'آي تي واي ليكرا ١٠٠٢', category: 'stretch', type: 'Stretch Knit · Premium Grade', img: 'assets/images/store-display-2.jpg', badge: 'Hot' },
      { id: 7, name: 'Armani 150', ar: 'أرماني ١٥٠', category: 'premium', type: '150 cm Width · Luxury Grade', img: 'assets/images/fabric-swatch-card.png', badge: 'Premium' },
      { id: 8, name: 'Concord', ar: 'كونكورد', category: 'premium', type: 'Dense Weave · Wide Roll', img: 'assets/images/fabric-purple.jpg', badge: '' },
      { id: 9, name: 'Chiffon 150', ar: 'شيفون ١٥٠', category: 'chiffon', type: '150 cm Width · Sheer & Floaty', img: 'assets/images/fabric-crinkle.webp', badge: '' },
      { id: 10, name: 'Chiffon 180', ar: 'شيفون ١٨٠', category: 'chiffon', type: '180 cm Width · Premium Grade', img: 'assets/images/fabric-dark-2.jpg', badge: 'Popular' },
      { id: 11, name: 'Silky 180', ar: 'سيلكي ١٨٠', category: 'premium', type: '180 cm Width · Silky Finish', img: 'assets/images/fabric-dark-1.jpg', badge: 'Premium' },
      { id: 12, name: '625', ar: 'قماش ٦٢٥', category: 'special', type: 'Multi-Use · Dense Weave', img: 'assets/images/store-display-1.png', badge: '' },
      { id: 13, name: 'Rotana 150', ar: 'روتانا ١٥٠', category: 'rotana', type: '150 cm Width · Smooth Finish', img: 'assets/images/fabric-dark-3.jpg', badge: '' },
      { id: 14, name: 'Royal 150', ar: 'رويال ١٥٠', category: 'rotana', type: '150 cm Width · Royal Grade', img: 'assets/images/fabric-purple.jpg', badge: 'Popular' },
      { id: 15, name: 'Rotana 180', ar: 'روتانا ١٨٠', category: 'rotana', type: '180 cm Width · Wide Roll', img: 'assets/images/fabric-swatch-sofa.jpg', badge: 'New Colours' },
      { id: 16, name: 'Fursan 180', ar: 'فرسان ١٨٠', category: 'fursan', type: '180 cm Width · Noble Drape', img: 'assets/images/fabric-dark-1.jpg', badge: 'Premium' },
      { id: 17, name: 'Grade BC', ar: 'جريد بي سي', category: 'special', type: 'Grade Quality · Wholesale', img: 'assets/images/fabric-dark-2.jpg', badge: '' },
      { id: 18, name: 'Venecia', ar: 'فينيسيا', category: 'premium', type: 'Italian-Inspired · Wholesale', img: 'assets/images/fabric-swatch-card.png', badge: 'New' },
      { id: 19, name: 'Bubble Satin', ar: 'ستان فقاعات', category: 'satin', type: 'Textured Surface · Glossy', img: 'assets/images/store-display-2.jpg', badge: 'Bestseller' },
      { id: 20, name: 'Creep Satin', ar: 'كريب ستان', category: 'satin', type: 'Crepe-Back Satin · Matte', img: 'assets/images/fabric-crinkle.webp', badge: '' },
      { id: 21, name: 'Satin Crinkle', ar: 'ستان مكسر', category: 'satin', type: 'Crinkled Texture · Lustrous', img: 'assets/images/fabric-dark-3.jpg', badge: '' },
      { id: 22, name: 'Raww', ar: 'رو', category: 'special', type: 'Raw Texture · Natural Hand', img: 'assets/images/fabric-purple.jpg', badge: 'New' }
    ];
  }

  function getDefaultGallery() {
    return [
      { id: 1, img: 'assets/images/store-display-1.png', capEn: 'Store Display — Pink Collection', capAr: 'عرض المتجر — المجموعة الوردية', span: 'tall' },
      { id: 2, img: 'assets/images/store-display-2.jpg', capEn: 'Fabric Sample Board', capAr: 'لوحة عينات الأقمشة', span: '' },
      { id: 3, img: 'assets/images/fabric-dark-1.jpg', capEn: 'ITY Lickra Display', capAr: 'عرض آي تي واي ليكرا', span: '' },
      { id: 4, img: 'assets/images/fabric-dark-2.jpg', capEn: 'Warsaw & Pirlanta Collection', capAr: 'مجموعة ورسو وبيرلانتا', span: 'span2' },
      { id: 5, img: 'assets/images/fabric-dark-3.jpg', capEn: 'Satin Dark Collection', capAr: 'مجموعة ستان داكن', span: 'tall' },
      { id: 6, img: 'assets/images/fabric-purple.jpg', capEn: 'Velvet & Satin Swatches', capAr: 'عينات مخمل وستان', span: '' },
      { id: 7, img: 'assets/images/fabric-crinkle.webp', capEn: 'Chiffon Crinkle Texture', capAr: 'نسيج شيفون مكسر', span: '' },
      { id: 8, img: 'assets/images/fabric-swatch-sofa.jpg', capEn: 'Terracotta Swatch Display', capAr: 'عرض عينات تيراكوتا', span: '' },
      { id: 9, img: 'assets/images/fabric-swatch-card.png', capEn: 'Official Sample Card', capAr: 'بطاقة عينات الأزهر تكس', span: 'span2' }
    ];
  }

  function getDefaultSettings() {
    return {
      title: 'Al Azhar Tex — Fine Fabrics Wholesale',
      description: "Al Azhar Tex — Egypt's trusted wholesale fabric supplier. Chiffon, Satin, Rotana, Warsaw, Lexus and more.",
      facebook: '#',
      instagram: '#',
      mapsUrl: 'https://maps.google.com/maps?q=Zagazig,+Al+Sharqia,+Egypt&t=&z=14&ie=UTF8&iwloc=&output=embed',
      whatsappFloat: true,
      promoStrip: true,
      netlifyForms: true,
      maintenanceMode: false
    };
  }

  function getDefaultContent() {
    return {
      heroTitle: "Egypt's Finest Wholesale Fabrics",
      heroAr: 'الأزهر تكس — للأقمشة والمنسوجات بالجملة',
      heroSub: 'From chiffon to satin, Warsaw to Lexus — Al Azhar Tex brings 20+ premium fabric lines to wholesale buyers across Egypt.',
      aboutExcerpt: "Founded by Shady Anwar in the heart of Zagazig, Al Azhar Tex has become one of Egypt's most trusted wholesale fabric suppliers.",
      productsTitle: 'Our Fabric Lines',
      productsDesc: '20+ premium fabric lines available wholesale. All rolls in-stock at our Zagazig gallery.',
      founder: 'Shady Anwar',
      story: 'Founded by Shady Anwar in the heart of Zagazig, Al Azhar Tex has grown from a modest fabric gallery into one of Egypt's most trusted wholesale fabric suppliers.',
      quote: "I don't just sell fabric. I sell the confidence a woman feels when she wears it.",
      phone: '+20 100 360 0949',
      whatsapp: '201003600949',
      email: 'info@alazhartex.com',
      address: 'Zagazig, Al Sharqia, Egypt',
      hours: 'Sun–Thu & Sat: 11 AM – 7 PM | Friday: Closed',
      galleryTitle: 'Fabric Showroom',
      galleryDesc: 'Real fabric samples and display shots from our Zagazig gallery.'
    };
  }

  // Storage helpers
  function get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }
  function set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function addActivity(action, details) {
    const acts = get(STORAGE_KEYS.ACTIVITY);
    acts.unshift({ time: new Date().toLocaleString('en-GB'), action, details, status: 'Active' });
    if (acts.length > 50) acts.pop();
    set(STORAGE_KEYS.ACTIVITY, acts);
  }

  // Hash password (simple SHA-256 for client-side)
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Auth functions
  async function login(username, password) {
    const users = get(STORAGE_KEYS.USERS);
    const hashed = await hashPassword(password);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      user.lastLogin = new Date().toISOString();
      set(STORAGE_KEYS.USERS, users);
      const session = { username: user.username, role: user.role, token: await hashPassword(username + Date.now()), expires: Date.now() + 86400000 };
      set(STORAGE_KEYS.SESSION, session);
      addActivity('Login', `User: ${username}`);
      return { success: true, user: { username: user.username, role: user.role } };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  function logout() {
    const session = get(STORAGE_KEYS.SESSION);
    if (session.username) addActivity('Logout', `User: ${session.username}`);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  function checkAuth() {
    const session = get(STORAGE_KEYS.SESSION);
    if (!session || !session.token || Date.now() > session.expires) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      return null;
    }
    return session;
  }

  function getCurrentUser() {
    const session = checkAuth();
    if (!session) return null;
    const users = get(STORAGE_KEYS.USERS);
    return users.find(u => u.username === session.username);
  }

  // Enquiry management
  function addEnquiry(data) {
    const enquiries = get(STORAGE_KEYS.ENQUIRIES);
    enquiries.unshift({
      id: Date.now(),
      date: new Date().toLocaleString('en-GB'),
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      fabric: data.fabric || '',
      quantity: data.quantity || '',
      city: data.city || '',
      message: data.message || '',
      status: 'new'
    });
    set(STORAGE_KEYS.ENQUIRIES, enquiries);
    addActivity('New Enquiry', `From: ${data.name || 'Unknown'}`);
  }

  function updateEnquiryStatus(id, status) {
    const enquiries = get(STORAGE_KEYS.ENQUIRIES);
    const enq = enquiries.find(e => e.id === id);
    if (enq) { enq.status = status; set(STORAGE_KEYS.ENQUIRIES, enquiries); }
  }

  function deleteEnquiry(id) {
    let enquiries = get(STORAGE_KEYS.ENQUIRIES);
    enquiries = enquiries.filter(e => e.id !== id);
    set(STORAGE_KEYS.ENQUIRIES, enquiries);
  }

  function clearAllEnquiries() {
    set(STORAGE_KEYS.ENQUIRIES, []);
    addActivity('Clear Enquiries', 'All enquiries deleted');
  }

  function exportEnquiriesCSV() {
    const enquiries = get(STORAGE_KEYS.ENQUIRIES);
    if (!enquiries.length) return null;
    const headers = ['Date', 'Name', 'Phone', 'Email', 'Fabric', 'Quantity', 'City', 'Message', 'Status'];
    const rows = enquiries.map(e => [e.date, e.name, e.phone, e.email, e.fabric, e.quantity, e.city, e.message, e.status].map(v => `"${(v || '').replace(/"/g, '""')}"`).join(','));
    return [headers.join(','), ...rows].join('\n');
  }

  // Product management
  function addProduct(product) {
    const products = get(STORAGE_KEYS.PRODUCTS);
    product.id = Date.now();
    products.push(product);
    set(STORAGE_KEYS.PRODUCTS, products);
    addActivity('Add Product', product.name);
    return product;
  }

  function updateProduct(id, updates) {
    const products = get(STORAGE_KEYS.PRODUCTS);
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) { products[idx] = { ...products[idx], ...updates }; set(STORAGE_KEYS.PRODUCTS, products); }
  }

  function deleteProduct(id) {
    let products = get(STORAGE_KEYS.PRODUCTS);
    const prod = products.find(p => p.id === id);
    products = products.filter(p => p.id !== id);
    set(STORAGE_KEYS.PRODUCTS, products);
    if (prod) addActivity('Delete Product', prod.name);
  }

  // Gallery management
  function addGalleryItem(item) {
    const gallery = get(STORAGE_KEYS.GALLERY);
    item.id = Date.now();
    gallery.push(item);
    set(STORAGE_KEYS.GALLERY, gallery);
    addActivity('Add Gallery', item.capEn);
    return item;
  }

  function updateGalleryItem(id, updates) {
    const gallery = get(STORAGE_KEYS.GALLERY);
    const idx = gallery.findIndex(g => g.id === id);
    if (idx !== -1) { gallery[idx] = { ...gallery[idx], ...updates }; set(STORAGE_KEYS.GALLERY, gallery); }
  }

  function deleteGalleryItem(id) {
    let gallery = get(STORAGE_KEYS.GALLERY);
    gallery = gallery.filter(g => g.id !== id);
    set(STORAGE_KEYS.GALLERY, gallery);
    addActivity('Delete Gallery', `ID: ${id}`);
  }

  // Settings
  function saveSettings(settings) {
    set(STORAGE_KEYS.SETTINGS, settings);
    addActivity('Update Settings', 'Website configuration changed');
  }

  function getSettings() {
    return get(STORAGE_KEYS.SETTINGS);
  }

  // Content
  function saveContent(content) {
    set(STORAGE_KEYS.CONTENT, content);
    addActivity('Update Content', 'Website content edited');
  }

  function getContent() {
    return get(STORAGE_KEYS.CONTENT);
  }

  // User management
  function addUser(user) {
    const users = get(STORAGE_KEYS.USERS);
    if (users.find(u => u.username === user.username)) return { success: false, error: 'Username already exists' };
    users.push({ ...user, lastLogin: null, status: 'active' });
    set(STORAGE_KEYS.USERS, users);
    addActivity('Add User', user.username);
    return { success: true };
  }

  function deleteUser(username) {
    let users = get(STORAGE_KEYS.USERS);
    users = users.filter(u => u.username !== username);
    set(STORAGE_KEYS.USERS, users);
    addActivity('Delete User', username);
  }

  function updateUser(username, updates) {
    const users = get(STORAGE_KEYS.USERS);
    const idx = users.findIndex(u => u.username === username);
    if (idx !== -1) { users[idx] = { ...users[idx], ...updates }; set(STORAGE_KEYS.USERS, users); }
  }

  // Public API
  return {
    initStorage,
    login,
    logout,
    checkAuth,
    getCurrentUser,
    addEnquiry,
    updateEnquiryStatus,
    deleteEnquiry,
    clearAllEnquiries,
    exportEnquiriesCSV,
    addProduct,
    updateProduct,
    deleteProduct,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    saveSettings,
    getSettings,
    saveContent,
    getContent,
    addUser,
    deleteUser,
    updateUser,
    getStorageKeys: () => STORAGE_KEYS,
    getData: (key) => get(key),
    setData: (key, val) => set(key, val),
    addActivity,
    hashPassword
  };
})();

// Initialize storage on load
AdminSystem.initStorage();


/* ============================================================
   ADMIN PANEL UI CONTROLLER
   Only runs on admin.html
   ============================================================ */

const adminApp = (function() {
  'use strict';

  // Only initialize if we're on the admin page
  if (!document.getElementById('login-screen')) return {};

  let currentSection = 'overview';
  let editingProductId = null;

  // DOM refs
  const loginScreen = document.getElementById('login-screen');
  const dashboard = document.getElementById('dashboard');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const loginError = document.getElementById('login-error');
  const toastEl = document.getElementById('toast');

  // Check existing session
  function checkSession() {
    const session = AdminSystem.checkAuth();
    if (session) {
      showDashboard(session);
    }
  }

  // Login handler
  async function handleLogin() {
    const username = document.getElementById('admin-user').value.trim();
    const password = document.getElementById('admin-pass').value;
    if (!username || !password) {
      showLoginError('Please enter both username and password');
      return;
    }
    const result = await AdminSystem.login(username, password);
    if (result.success) {
      showDashboard(result.user);
    } else {
      showLoginError('Invalid username or password');
    }
  }

  function showLoginError(msg) {
    loginError.textContent = msg;
    loginError.classList.add('show');
    setTimeout(() => loginError.classList.remove('show'), 4000);
  }

  function showDashboard(user) {
    loginScreen.style.display = 'none';
    dashboard.classList.add('active');
    document.getElementById('admin-username-display').textContent = user.username;
    loadSection('overview');
    showToast(`Welcome back, ${user.username}!`, 'success');
  }

  function handleLogout() {
    AdminSystem.logout();
    dashboard.classList.remove('active');
    loginScreen.style.display = 'flex';
    document.getElementById('admin-user').value = '';
    document.getElementById('admin-pass').value = '';
    loginError.classList.remove('show');
  }

  // Section navigation
  function loadSection(section) {
    currentSection = section;
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));

    const target = document.getElementById('section-' + section);
    if (target) target.classList.add('active');

    const sidebarLink = document.querySelector(`.sidebar-menu a[data-section="${section}"]`);
    if (sidebarLink) sidebarLink.classList.add('active');

    // Load section data
    switch(section) {
      case 'overview': renderOverview(); break;
      case 'enquiries': renderEnquiries(); break;
      case 'products': renderProducts(); break;
      case 'gallery': renderGallery(); break;
      case 'content': renderContent(); break;
      case 'settings': renderSettings(); break;
      case 'users': renderUsers(); break;
    }
  }

  function openSection(section) {
    loadSection(section);
  }

  // Overview
  function renderOverview() {
    const enquiries = AdminSystem.getData(AdminSystem.getStorageKeys().ENQUIRIES);
    document.getElementById('stat-enquiries').textContent = enquiries.length;

    // Activity log
    const activity = AdminSystem.getData(AdminSystem.getStorageKeys().ACTIVITY);
    const tbody = document.getElementById('activity-body');
    tbody.innerHTML = activity.slice(0, 10).map(a =>
      `<tr><td>${a.time}</td><td>${a.action}</td><td>${a.details}</td><td><span class="status-badge status-replied">${a.status}</span></td></tr>`
    ).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text-light);">No activity yet</td></tr>';
  }

  // Enquiries
  function renderEnquiries() {
    const enquiries = AdminSystem.getData(AdminSystem.getStorageKeys().ENQUIRIES);
    document.getElementById('enquiry-count').textContent = enquiries.length;
    document.getElementById('stat-enquiries').textContent = enquiries.length;

    const tbody = document.getElementById('enquiries-body');
    const noEnq = document.getElementById('no-enquiries');

    if (!enquiries.length) {
      tbody.innerHTML = '';
      noEnq.style.display = 'block';
      return;
    }
    noEnq.style.display = 'none';

    tbody.innerHTML = enquiries.map(e => {
      const statusClass = e.status === 'new' ? 'status-new' : e.status === 'replied' ? 'status-replied' : 'status-read';
      return `<tr>
        <td>${e.date}</td>
        <td><strong>${escapeHtml(e.name)}</strong></td>
        <td>${escapeHtml(e.phone)}</td>
        <td>${escapeHtml(e.fabric)}</td>
        <td>${escapeHtml(e.quantity)}</td>
        <td>${escapeHtml(e.city)}</td>
        <td><span class="status-badge ${statusClass}">${e.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="table-btn table-btn-view" onclick="adminApp.viewEnquiry(${e.id})">View</button>
            <button class="table-btn table-btn-edit" onclick="adminApp.markReplied(${e.id})">Reply</button>
            <button class="table-btn table-btn-del" onclick="adminApp.deleteEnquiry(${e.id})">Delete</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  function viewEnquiry(id) {
    const enquiries = AdminSystem.getData(AdminSystem.getStorageKeys().ENQUIRIES);
    const e = enquiries.find(x => x.id === id);
    if (!e) return;
    alert(`Enquiry from ${e.name}\nPhone: ${e.phone}\nEmail: ${e.email || 'N/A'}\nFabric: ${e.fabric}\nQuantity: ${e.quantity}\nCity: ${e.city}\n\nMessage:\n${e.message || 'No message'}`);
  }

  function markReplied(id) {
    AdminSystem.updateEnquiryStatus(id, 'replied');
    renderEnquiries();
    showToast('Marked as replied', 'success');
  }

  function deleteEnquiry(id) {
    if (!confirm('Delete this enquiry?')) return;
    AdminSystem.deleteEnquiry(id);
    renderEnquiries();
    showToast('Enquiry deleted', 'success');
  }

  function exportEnquiries() {
    const csv = AdminSystem.exportEnquiriesCSV();
    if (!csv) { showToast('No enquiries to export', 'error'); return; }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alazhar-enquiries-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully', 'success');
  }

  function clearAllEnquiries() {
    if (!confirm('Delete ALL enquiries? This cannot be undone.')) return;
    AdminSystem.clearAllEnquiries();
    renderEnquiries();
    showToast('All enquiries cleared', 'success');
  }

  // Products
  function renderProducts() {
    const products = AdminSystem.getData(AdminSystem.getStorageKeys().PRODUCTS);
    document.getElementById('stat-products').textContent = products.length;

    const tbody = document.getElementById('products-body');
    tbody.innerHTML = products.map(p => `<tr>
      <td><img src="${p.img}" alt="${p.name}" style="width:50px;height:50px;object-fit:cover;border-radius:var(--radius);" /></td>
      <td><strong>${p.name}</strong></td>
      <td class="ar">${p.ar}</td>
      <td><span class="status-badge status-new">${p.category}</span></td>
      <td>${p.type}</td>
      <td>${p.badge ? `<span class="status-badge status-replied">${p.badge}</span>` : '—'}</td>
      <td>
        <div class="table-actions">
          <button class="table-btn table-btn-edit" onclick="adminApp.editProduct(${p.id})">Edit</button>
          <button class="table-btn table-btn-del" onclick="adminApp.deleteProduct(${p.id})">Delete</button>
        </div>
      </td>
    </tr>`).join('');
  }

  function openProductModal(id = null) {
    editingProductId = id;
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');

    if (id) {
      const products = AdminSystem.getData(AdminSystem.getStorageKeys().PRODUCTS);
      const p = products.find(x => x.id === id);
      if (p) {
        title.textContent = 'Edit Product';
        document.getElementById('prod-name').value = p.name;
        document.getElementById('prod-ar').value = p.ar;
        document.getElementById('prod-cat').value = p.category;
        document.getElementById('prod-type').value = p.type;
        document.getElementById('prod-img').value = p.img;
        document.getElementById('prod-badge').value = p.badge || '';
      }
    } else {
      title.textContent = 'Add Product';
      document.getElementById('prod-name').value = '';
      document.getElementById('prod-ar').value = '';
      document.getElementById('prod-cat').value = 'special';
      document.getElementById('prod-type').value = '';
      document.getElementById('prod-img').value = 'assets/images/fabric-dark-2.jpg';
      document.getElementById('prod-badge').value = '';
    }
    modal.classList.add('open');
  }

  function saveProduct() {
    const product = {
      name: document.getElementById('prod-name').value.trim(),
      ar: document.getElementById('prod-ar').value.trim(),
      category: document.getElementById('prod-cat').value,
      type: document.getElementById('prod-type').value.trim(),
      img: document.getElementById('prod-img').value.trim(),
      badge: document.getElementById('prod-badge').value
    };
    if (!product.name) { showToast('Product name is required', 'error'); return; }

    if (editingProductId) {
      AdminSystem.updateProduct(editingProductId, product);
      showToast('Product updated', 'success');
    } else {
      AdminSystem.addProduct(product);
      showToast('Product added', 'success');
    }
    closeModal('product-modal');
    renderProducts();
  }

  function editProduct(id) {
    openProductModal(id);
  }

  function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    AdminSystem.deleteProduct(id);
    renderProducts();
    showToast('Product deleted', 'success');
  }

  function saveProducts() {
    showToast('Products saved to local storage', 'success');
  }

  // Gallery
  function renderGallery() {
    const gallery = AdminSystem.getData(AdminSystem.getStorageKeys().GALLERY);
    const tbody = document.getElementById('gallery-body');
    tbody.innerHTML = gallery.map(g => `<tr>
      <td><img src="${g.img}" style="width:60px;height:60px;object-fit:cover;border-radius:var(--radius);" /></td>
      <td>${g.img.split('/').pop()}</td>
      <td>${g.capEn}</td>
      <td class="ar">${g.capAr}</td>
      <td>${g.span || 'Normal'}</td>
      <td>
        <div class="table-actions">
          <button class="table-btn table-btn-edit" onclick="adminApp.editGalleryItem(${g.id})">Edit</button>
          <button class="table-btn table-btn-del" onclick="adminApp.deleteGalleryItem(${g.id})">Delete</button>
        </div>
      </td>
    </tr>`).join('');
  }

  function openGalleryModal() {
    document.getElementById('gal-img').value = '';
    document.getElementById('gal-cap-en').value = '';
    document.getElementById('gal-cap-ar').value = '';
    document.getElementById('gal-span').value = '';
    document.getElementById('gallery-modal').classList.add('open');
  }

  function saveGalleryItem() {
    const item = {
      img: document.getElementById('gal-img').value.trim(),
      capEn: document.getElementById('gal-cap-en').value.trim(),
      capAr: document.getElementById('gal-cap-ar').value.trim(),
      span: document.getElementById('gal-span').value
    };
    if (!item.img) { showToast('Image path is required', 'error'); return; }
    AdminSystem.addGalleryItem(item);
    closeModal('gallery-modal');
    renderGallery();
    showToast('Image added to gallery', 'success');
  }

  function editGalleryItem(id) {
    // For simplicity, just delete and re-add or use prompt
    const gallery = AdminSystem.getData(AdminSystem.getStorageKeys().GALLERY);
    const g = gallery.find(x => x.id === id);
    if (!g) return;
    const newCapEn = prompt('New English caption:', g.capEn);
    if (newCapEn === null) return;
    AdminSystem.updateGalleryItem(id, { capEn: newCapEn });
    renderGallery();
    showToast('Gallery item updated', 'success');
  }

  function deleteGalleryItem(id) {
    if (!confirm('Delete this gallery image?')) return;
    AdminSystem.deleteGalleryItem(id);
    renderGallery();
    showToast('Image deleted', 'success');
  }

  function saveGallery() {
    showToast('Gallery saved', 'success');
  }

  // Content Editor
  function renderContent() {
    const content = AdminSystem.getContent();
    document.getElementById('edit-hero-title').value = content.heroTitle;
    document.getElementById('edit-hero-ar').value = content.heroAr;
    document.getElementById('edit-hero-sub').value = content.heroSub;
    document.getElementById('edit-about-excerpt').value = content.aboutExcerpt;
    document.getElementById('edit-products-title').value = content.productsTitle;
    document.getElementById('edit-products-desc').value = content.productsDesc;
    document.getElementById('edit-founder').value = content.founder;
    document.getElementById('edit-story').value = content.story;
    document.getElementById('edit-quote').value = content.quote;
    document.getElementById('edit-phone').value = content.phone;
    document.getElementById('edit-whatsapp').value = content.whatsapp;
    document.getElementById('edit-email').value = content.email;
    document.getElementById('edit-address').value = content.address;
    document.getElementById('edit-hours').value = content.hours;
    document.getElementById('edit-gallery-title').value = content.galleryTitle;
    document.getElementById('edit-gallery-desc').value = content.galleryDesc;
  }

  function saveContent() {
    const content = {
      heroTitle: document.getElementById('edit-hero-title').value,
      heroAr: document.getElementById('edit-hero-ar').value,
      heroSub: document.getElementById('edit-hero-sub').value,
      aboutExcerpt: document.getElementById('edit-about-excerpt').value,
      productsTitle: document.getElementById('edit-products-title').value,
      productsDesc: document.getElementById('edit-products-desc').value,
      founder: document.getElementById('edit-founder').value,
      story: document.getElementById('edit-story').value,
      quote: document.getElementById('edit-quote').value,
      phone: document.getElementById('edit-phone').value,
      whatsapp: document.getElementById('edit-whatsapp').value,
      email: document.getElementById('edit-email').value,
      address: document.getElementById('edit-address').value,
      hours: document.getElementById('edit-hours').value,
      galleryTitle: document.getElementById('edit-gallery-title').value,
      galleryDesc: document.getElementById('edit-gallery-desc').value
    };
    AdminSystem.saveContent(content);
    showToast('Content saved! Refresh website to see changes.', 'success');
  }

  function previewContent() {
    window.open('index.html', '_blank');
  }

  function resetContent() {
    if (!confirm('Reset all content to defaults?')) return;
    localStorage.removeItem(AdminSystem.getStorageKeys().CONTENT);
    AdminSystem.initStorage();
    renderContent();
    showToast('Content reset to defaults', 'success');
  }

  // Settings
  function renderSettings() {
    const settings = AdminSystem.getSettings();
    document.getElementById('setting-title').value = settings.title;
    document.getElementById('setting-desc').value = settings.description;
    document.getElementById('setting-fb').value = settings.facebook;
    document.getElementById('setting-ig').value = settings.instagram;
    document.getElementById('setting-maps').value = settings.mapsUrl;
    document.getElementById('toggle-wa').classList.toggle('on', settings.whatsappFloat);
    document.getElementById('toggle-strip').classList.toggle('on', settings.promoStrip);
    document.getElementById('toggle-forms').classList.toggle('on', settings.netlifyForms);
    document.getElementById('toggle-maint').classList.toggle('on', settings.maintenanceMode);
  }

  function saveSettings() {
    const settings = {
      title: document.getElementById('setting-title').value,
      description: document.getElementById('setting-desc').value,
      facebook: document.getElementById('setting-fb').value,
      instagram: document.getElementById('setting-ig').value,
      mapsUrl: document.getElementById('setting-maps').value,
      whatsappFloat: document.getElementById('toggle-wa').classList.contains('on'),
      promoStrip: document.getElementById('toggle-strip').classList.contains('on'),
      netlifyForms: document.getElementById('toggle-forms').classList.contains('on'),
      maintenanceMode: document.getElementById('toggle-maint').classList.contains('on')
    };
    AdminSystem.saveSettings(settings);
    showToast('Settings saved successfully', 'success');
  }

  function loadSettings() {
    renderSettings();
    showToast('Settings reloaded', 'success');
  }

  function toggle(el) {
    el.classList.toggle('on');
  }

  // Users
  function renderUsers() {
    const users = AdminSystem.getData(AdminSystem.getStorageKeys().USERS);
    const tbody = document.getElementById('users-body');
    tbody.innerHTML = users.map(u => `<tr>
      <td><strong>${u.username}</strong></td>
      <td><span class="status-badge ${u.role === 'admin' ? 'status-new' : u.role === 'editor' ? 'status-pending' : 'status-read'}">${u.role}</span></td>
      <td>${u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-GB') : 'Never'}</td>
      <td><span class="status-badge ${u.status === 'active' ? 'status-replied' : 'status-read'}">${u.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="table-btn table-btn-del" ${u.username === 'admin' ? 'disabled style="opacity:.4"' : ''} onclick="adminApp.deleteUser('${u.username}')">Delete</button>
        </div>
      </td>
    </tr>`).join('');
  }

  function openUserModal() {
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('new-role').value = 'admin';
    document.getElementById('user-modal').classList.add('open');
  }

  async function addUser() {
    const username = document.getElementById('new-username').value.trim();
    const password = document.getElementById('new-password').value;
    const role = document.getElementById('new-role').value;
    if (!username || !password) { showToast('Username and password required', 'error'); return; }

    const result = AdminSystem.addUser({ username, password, role });
    if (result.success) {
      closeModal('user-modal');
      renderUsers();
      showToast('User added successfully', 'success');
    } else {
      showToast(result.error, 'error');
    }
  }

  function deleteUser(username) {
    if (!confirm(`Delete user "${username}"?`)) return;
    AdminSystem.deleteUser(username);
    renderUsers();
    showToast('User deleted', 'success');
  }

  // Modal helpers
  function closeModal(id) {
    document.getElementById(id)?.classList.remove('open');
    editingProductId = null;
  }

  // Toast
  function showToast(message, type = '') {
    toastEl.textContent = message;
    toastEl.className = 'toast ' + type;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3500);
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Event listeners
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
    document.getElementById('admin-pass')?.addEventListener('keypress', e => {
      if (e.key === 'Enter') handleLogin();
    });
  }

  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  // Sidebar navigation
  document.querySelectorAll('.sidebar-menu a[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = link.dataset.section;
      if (section) loadSection(section);
    });
  });

  // Editor tabs
  document.querySelectorAll('.editor-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.editor-pane').forEach(p => p.classList.remove('active'));
      document.querySelector(`.editor-pane[data-page="${tab.dataset.page}"]`)?.classList.add('active');
    });
  });

  // Initialize
  checkSession();

  // Public API
  return {
    openSection,
    viewEnquiry,
    markReplied,
    deleteEnquiry,
    exportEnquiries,
    clearAllEnquiries,
    openProductModal,
    saveProduct,
    editProduct,
    deleteProduct,
    saveProducts,
    openGalleryModal,
    saveGalleryItem,
    editGalleryItem,
    deleteGalleryItem,
    saveGallery,
    saveContent,
    previewContent,
    resetContent,
    saveSettings,
    loadSettings,
    toggle,
    openUserModal,
    addUser,
    deleteUser,
    closeModal
  };
})();


/* ============================================================
   FORM CAPTURE — Intercept contact form submissions
   and store them in the admin system
   ============================================================ */

(function() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    // Let Netlify handle the form normally, but also store locally
    const formData = new FormData(contactForm);
    const data = {};
    formData.forEach((val, key) => { if (key !== 'form-name' && key !== 'bot-field') data[key] = val; });

    // Store in admin system
    if (typeof AdminSystem !== 'undefined') {
      AdminSystem.addEnquiry(data);
    }
  });
})();
