'use strict';

/* ============================================================
   Al Azhar Tex — main.js  (Admin Panel Enabled)
   ============================================================ */

// Wait for DOM to be fully loaded before running anything
document.addEventListener('DOMContentLoaded', function() {

  // ── Scroll reveal ───────────────────────────────────────────
  const revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.1, rootMargin: '0px 0px -50px 0px'});

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObs.observe(el);
  });

  // ── Navbar scroll ──────────────────────────────────────────
  const nb = document.getElementById('navbar');
  if(nb) {
    window.addEventListener('scroll', function() {
      nb.classList.toggle('scrolled', window.scrollY > 50);
    }, {passive: true});
  }

  // ── Mobile nav ────────────────────────────────────────────
  const burger = document.getElementById('burger');
  const mNav = document.getElementById('mobile-nav');
  const mClose = document.getElementById('mobile-close');

  if(burger && mNav) {
    burger.addEventListener('click', function() {
      mNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if(mClose && mNav) {
    mClose.addEventListener('click', function() {
      mNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  document.querySelectorAll('.nav-mobile a').forEach(function(a) {
    a.addEventListener('click', function() {
      if(mNav) {
        mNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // ── Active nav link ────────────────────────────────────────
  var pg = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function(a) {
    if(a.getAttribute('href') === pg) a.classList.add('active');
  });

  // ── Product filter ────────────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.dataset.filter;
      document.querySelectorAll('.product-card').forEach(function(c) {
        c.style.display = (f === 'all' || c.dataset.category === f) ? '' : 'none';
      });
    });
  });

  // ── Lightbox ────────────────────────────────────────────────
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');

  document.querySelectorAll('.gallery-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var img = item.querySelector('img');
      if(!lb || !img) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  var lbClose = document.getElementById('lightbox-close');
  if(lbClose) {
    lbClose.addEventListener('click', closeLb);
  }
  if(lb) {
    lb.addEventListener('click', function(e) {
      if(e.target === lb) closeLb();
    });
  }
  document.addEventListener('keydown', function(e) {
    if(e.key === 'Escape') closeLb();
  });

  function closeLb() {
    if(lb) {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ── Duplicate strip for seamless marquee ──────────────────
  var st = document.querySelector('.strip-track');
  if(st && st.parentElement) {
    st.parentElement.appendChild(st.cloneNode(true));
  }

  // ── Counter animation ─────────────────────────────────────
  var cntObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if(entry.isIntersecting) {
        animCount(entry.target);
        cntObs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.5});

  document.querySelectorAll('.stat-number[data-count]').forEach(function(el) {
    cntObs.observe(el);
  });

  function animCount(el) {
    var target = parseInt(el.dataset.count, 10);
    var sfx = el.dataset.suffix || '';
    var dur = 1600;
    var step = target / (dur / 16);
    var cur = 0;
    var t = setInterval(function() {
      cur += step;
      if(cur >= target) {
        el.textContent = target + sfx;
        clearInterval(t);
      } else {
        el.textContent = Math.floor(cur) + sfx;
      }
    }, 16);
  }

  // ── Form success ───────────────────────────────────────────
  if(new URLSearchParams(location.search).get('success') === '1') {
    var s = document.getElementById('form-success');
    if(s) s.style.display = 'flex';
  }

  // ── Initialize Admin System ─────────────────────────────────
  initAdminSystem();

}); // END DOMContentLoaded


/* ============================================================
   ADMIN PANEL SYSTEM
   ============================================================ */

function initAdminSystem() {
  'use strict';

  // Only run if we're on the admin page
  var loginScreen = document.getElementById('login-screen');
  if(!loginScreen) return; // Not on admin page

  // Default credentials
  var DEFAULT_USERS = [
    { username: 'admin', password: 'admin123', role: 'admin', lastLogin: null, status: 'active' },
    { username: 'shady', password: 'azhartex2025', role: 'admin', lastLogin: null, status: 'active' }
  ];

  var STORAGE_KEYS = {
    USERS: 'alazhar_admin_users',
    SESSION: 'alazhar_admin_session',
    ENQUIRIES: 'alazhar_enquiries',
    PRODUCTS: 'alazhar_products',
    GALLERY: 'alazhar_gallery',
    SETTINGS: 'alazhar_settings',
    CONTENT: 'alazhar_content',
    ACTIVITY: 'alazhar_activity'
  };

  // Initialize storage
  function initStorage() {
    if(!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if(!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify([]));
    }
    if(!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(getDefaultProducts()));
    }
    if(!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(getDefaultGallery()));
    }
    if(!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(getDefaultSettings()));
    }
    if(!localStorage.getItem(STORAGE_KEYS.CONTENT)) {
      localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(getDefaultContent()));
    }
    if(!localStorage.getItem(STORAGE_KEYS.ACTIVITY)) {
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
      description: "Al Azhar Tex — Egypt's trusted wholesale fabric supplier.",
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
      story: 'Founded by Shady Anwar in the heart of Zagazig, Al Azhar Tex has grown from a modest fabric gallery into one of Egypt\'s most trusted wholesale fabric suppliers.',
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
    try {
      var item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch(e) {
      return [];
    }
  }

  function set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function addActivity(action, details) {
    var acts = get(STORAGE_KEYS.ACTIVITY);
    acts.unshift({
      time: new Date().toLocaleString('en-GB'),
      action: action,
      details: details,
      status: 'Active'
    });
    if(acts.length > 50) acts.pop();
    set(STORAGE_KEYS.ACTIVITY, acts);
  }

  // Auth functions (synchronous, no async/await)
  function login(username, password) {
    var users = get(STORAGE_KEYS.USERS);
    var user = null;
    for(var i = 0; i < users.length; i++) {
      if(users[i].username === username && users[i].password === password) {
        user = users[i];
        break;
      }
    }

    if(user) {
      user.lastLogin = new Date().toISOString();
      set(STORAGE_KEYS.USERS, users);
      var session = {
        username: user.username,
        role: user.role,
        token: btoa(user.username + Date.now()),
        expires: Date.now() + 86400000
      };
      set(STORAGE_KEYS.SESSION, session);
      addActivity('Login', 'User: ' + username);
      return { success: true, user: { username: user.username, role: user.role } };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  function logout() {
    var session = get(STORAGE_KEYS.SESSION);
    if(session && session.username) {
      addActivity('Logout', 'User: ' + session.username);
    }
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  function checkAuth() {
    var session = get(STORAGE_KEYS.SESSION);
    if(!session || !session.token || Date.now() > session.expires) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      return null;
    }
    return session;
  }

  // Enquiry management
  function addEnquiry(data) {
    var enquiries = get(STORAGE_KEYS.ENQUIRIES);
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
    addActivity('New Enquiry', 'From: ' + (data.name || 'Unknown'));
  }

  function updateEnquiryStatus(id, status) {
    var enquiries = get(STORAGE_KEYS.ENQUIRIES);
    for(var i = 0; i < enquiries.length; i++) {
      if(enquiries[i].id === id) {
        enquiries[i].status = status;
        set(STORAGE_KEYS.ENQUIRIES, enquiries);
        return;
      }
    }
  }

  function deleteEnquiry(id) {
    var enquiries = get(STORAGE_KEYS.ENQUIRIES);
    var filtered = [];
    for(var i = 0; i < enquiries.length; i++) {
      if(enquiries[i].id !== id) filtered.push(enquiries[i]);
    }
    set(STORAGE_KEYS.ENQUIRIES, filtered);
  }

  function clearAllEnquiries() {
    set(STORAGE_KEYS.ENQUIRIES, []);
    addActivity('Clear Enquiries', 'All enquiries deleted');
  }

  function exportEnquiriesCSV() {
    var enquiries = get(STORAGE_KEYS.ENQUIRIES);
    if(!enquiries.length) return null;
    var headers = ['Date', 'Name', 'Phone', 'Email', 'Fabric', 'Quantity', 'City', 'Message', 'Status'];
    var rows = [];
    for(var i = 0; i < enquiries.length; i++) {
      var e = enquiries[i];
      var row = [
        '"' + (e.date || '').replace(/"/g, '""') + '"',
        '"' + (e.name || '').replace(/"/g, '""') + '"',
        '"' + (e.phone || '').replace(/"/g, '""') + '"',
        '"' + (e.email || '').replace(/"/g, '""') + '"',
        '"' + (e.fabric || '').replace(/"/g, '""') + '"',
        '"' + (e.quantity || '').replace(/"/g, '""') + '"',
        '"' + (e.city || '').replace(/"/g, '""') + '"',
        '"' + (e.message || '').replace(/"/g, '""') + '"',
        '"' + (e.status || '').replace(/"/g, '""') + '"'
      ];
      rows.push(row.join(','));
    }
    return headers.join(',') + '\n' + rows.join('\n');
  }

  // Product management
  function addProduct(product) {
    var products = get(STORAGE_KEYS.PRODUCTS);
    product.id = Date.now();
    products.push(product);
    set(STORAGE_KEYS.PRODUCTS, products);
    addActivity('Add Product', product.name);
    return product;
  }

  function updateProduct(id, updates) {
    var products = get(STORAGE_KEYS.PRODUCTS);
    for(var i = 0; i < products.length; i++) {
      if(products[i].id === id) {
        for(var key in updates) {
          products[i][key] = updates[key];
        }
        set(STORAGE_KEYS.PRODUCTS, products);
        return;
      }
    }
  }

  function deleteProduct(id) {
    var products = get(STORAGE_KEYS.PRODUCTS);
    var prod = null;
    var filtered = [];
    for(var i = 0; i < products.length; i++) {
      if(products[i].id === id) {
        prod = products[i];
      } else {
        filtered.push(products[i]);
      }
    }
    set(STORAGE_KEYS.PRODUCTS, filtered);
    if(prod) addActivity('Delete Product', prod.name);
  }

  // Gallery management
  function addGalleryItem(item) {
    var gallery = get(STORAGE_KEYS.GALLERY);
    item.id = Date.now();
    gallery.push(item);
    set(STORAGE_KEYS.GALLERY, gallery);
    addActivity('Add Gallery', item.capEn);
    return item;
  }

  function updateGalleryItem(id, updates) {
    var gallery = get(STORAGE_KEYS.GALLERY);
    for(var i = 0; i < gallery.length; i++) {
      if(gallery[i].id === id) {
        for(var key in updates) {
          gallery[i][key] = updates[key];
        }
        set(STORAGE_KEYS.GALLERY, gallery);
        return;
      }
    }
  }

  function deleteGalleryItem(id) {
    var gallery = get(STORAGE_KEYS.GALLERY);
    var filtered = [];
    for(var i = 0; i < gallery.length; i++) {
      if(gallery[i].id !== id) filtered.push(gallery[i]);
    }
    set(STORAGE_KEYS.GALLERY, filtered);
    addActivity('Delete Gallery', 'ID: ' + id);
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
    var users = get(STORAGE_KEYS.USERS);
    for(var i = 0; i < users.length; i++) {
      if(users[i].username === user.username) {
        return { success: false, error: 'Username already exists' };
      }
    }
    users.push({
      username: user.username,
      password: user.password,
      role: user.role,
      lastLogin: null,
      status: 'active'
    });
    set(STORAGE_KEYS.USERS, users);
    addActivity('Add User', user.username);
    return { success: true };
  }

  function deleteUser(username) {
    var users = get(STORAGE_KEYS.USERS);
    var filtered = [];
    for(var i = 0; i < users.length; i++) {
      if(users[i].username !== username) filtered.push(users[i]);
    }
    set(STORAGE_KEYS.USERS, filtered);
    addActivity('Delete User', username);
  }

  // Expose AdminSystem globally
  window.AdminSystem = {
    initStorage: initStorage,
    login: login,
    logout: logout,
    checkAuth: checkAuth,
    addEnquiry: addEnquiry,
    updateEnquiryStatus: updateEnquiryStatus,
    deleteEnquiry: deleteEnquiry,
    clearAllEnquiries: clearAllEnquiries,
    exportEnquiriesCSV: exportEnquiriesCSV,
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    addGalleryItem: addGalleryItem,
    updateGalleryItem: updateGalleryItem,
    deleteGalleryItem: deleteGalleryItem,
    saveSettings: saveSettings,
    getSettings: getSettings,
    saveContent: saveContent,
    getContent: getContent,
    addUser: addUser,
    deleteUser: deleteUser,
    getStorageKeys: function() { return STORAGE_KEYS; },
    getData: function(key) { return get(key); },
    setData: function(key, val) { set(key, val); },
    addActivity: addActivity
  };

  // Initialize storage
  initStorage();

  // ============================================================
  // ADMIN PANEL UI CONTROLLER
  // ============================================================

  var currentSection = 'overview';
  var editingProductId = null;

  var dashboard = document.getElementById('dashboard');
  var loginBtn = document.getElementById('login-btn');
  var logoutBtn = document.getElementById('logout-btn');
  var loginError = document.getElementById('login-error');
  var toastEl = document.getElementById('toast');

  // Check existing session on load
  function checkSession() {
    var session = AdminSystem.checkAuth();
    if(session) {
      showDashboard(session);
    }
  }

  // Login handler
  function handleLogin() {
    var usernameInput = document.getElementById('admin-user');
    var passwordInput = document.getElementById('admin-pass');
    var username = usernameInput ? usernameInput.value.trim() : '';
    var password = passwordInput ? passwordInput.value : '';

    if(!username || !password) {
      showLoginError('Please enter both username and password');
      return;
    }

    var result = AdminSystem.login(username, password);
    if(result.success) {
      showDashboard(result.user);
    } else {
      showLoginError('Invalid username or password');
    }
  }

  function showLoginError(msg) {
    if(loginError) {
      loginError.textContent = msg;
      loginError.classList.add('show');
      setTimeout(function() {
        loginError.classList.remove('show');
      }, 4000);
    }
  }

  function showDashboard(user) {
    var loginScreenEl = document.getElementById('login-screen');
    if(loginScreenEl) loginScreenEl.style.display = 'none';
    if(dashboard) dashboard.classList.add('active');

    var usernameDisplay = document.getElementById('admin-username-display');
    if(usernameDisplay) usernameDisplay.textContent = user.username;

    loadSection('overview');
    showToast('Welcome back, ' + user.username + '!', 'success');
  }

  function handleLogout() {
    AdminSystem.logout();
    if(dashboard) dashboard.classList.remove('active');
    var loginScreenEl = document.getElementById('login-screen');
    if(loginScreenEl) loginScreenEl.style.display = 'flex';

    var userInput = document.getElementById('admin-user');
    var passInput = document.getElementById('admin-pass');
    if(userInput) userInput.value = '';
    if(passInput) passInput.value = '';
    if(loginError) loginError.classList.remove('show');
  }

  // Section navigation
  function loadSection(section) {
    currentSection = section;

    document.querySelectorAll('.admin-section').forEach(function(s) {
      s.classList.remove('active');
    });
    document.querySelectorAll('.sidebar-menu a').forEach(function(a) {
      a.classList.remove('active');
    });

    var target = document.getElementById('section-' + section);
    if(target) target.classList.add('active');

    var sidebarLink = document.querySelector('.sidebar-menu a[data-section="' + section + '"]');
    if(sidebarLink) sidebarLink.classList.add('active');

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
    var enquiries = AdminSystem.getData(AdminSystem.getStorageKeys().ENQUIRIES);
    var statEnquiries = document.getElementById('stat-enquiries');
    if(statEnquiries) statEnquiries.textContent = enquiries.length;

    var activity = AdminSystem.getData(AdminSystem.getStorageKeys().ACTIVITY);
    var tbody = document.getElementById('activity-body');
    if(tbody) {
      if(activity && activity.length) {
        tbody.innerHTML = activity.slice(0, 10).map(function(a) {
          return '<tr><td>' + a.time + '</td><td>' + a.action + '</td><td>' + a.details + '</td><td><span class="status-badge status-replied">' + a.status + '</span></td></tr>';
        }).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-light);">No activity yet</td></tr>';
      }
    }
  }

  // Enquiries
  function renderEnquiries() {
    var enquiries = AdminSystem.getData(AdminSystem.getStorageKeys().ENQUIRIES);
    var enquiryCount = document.getElementById('enquiry-count');
    var statEnquiries = document.getElementById('stat-enquiries');
    if(enquiryCount) enquiryCount.textContent = enquiries.length;
    if(statEnquiries) statEnquiries.textContent = enquiries.length;

    var tbody = document.getElementById('enquiries-body');
    var noEnq = document.getElementById('no-enquiries');

    if(!enquiries.length) {
      if(tbody) tbody.innerHTML = '';
      if(noEnq) noEnq.style.display = 'block';
      return;
    }
    if(noEnq) noEnq.style.display = 'none';

    if(tbody) {
      tbody.innerHTML = enquiries.map(function(e) {
        var statusClass = e.status === 'new' ? 'status-new' : e.status === 'replied' ? 'status-replied' : 'status-read';
        return '<tr>' +
          '<td>' + escapeHtml(e.date) + '</td>' +
          '<td><strong>' + escapeHtml(e.name) + '</strong></td>' +
          '<td>' + escapeHtml(e.phone) + '</td>' +
          '<td>' + escapeHtml(e.fabric) + '</td>' +
          '<td>' + escapeHtml(e.quantity) + '</td>' +
          '<td>' + escapeHtml(e.city) + '</td>' +
          '<td><span class="status-badge ' + statusClass + '">' + e.status + '</span></td>' +
          '<td>' +
            '<div class="table-actions">' +
              '<button class="table-btn table-btn-view" onclick="adminApp.viewEnquiry(' + e.id + ')">View</button>' +
              '<button class="table-btn table-btn-edit" onclick="adminApp.markReplied(' + e.id + ')">Reply</button>' +
              '<button class="table-btn table-btn-del" onclick="adminApp.deleteEnquiry(' + e.id + ')">Delete</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      }).join('');
    }
  }

  function viewEnquiry(id) {
    var enquiries = AdminSystem.getData(AdminSystem.getStorageKeys().ENQUIRIES);
    var e = null;
    for(var i = 0; i < enquiries.length; i++) {
      if(enquiries[i].id === id) { e = enquiries[i]; break; }
    }
    if(!e) return;
    alert('Enquiry from ' + e.name + '\nPhone: ' + e.phone + '\nEmail: ' + (e.email || 'N/A') + '\nFabric: ' + e.fabric + '\nQuantity: ' + e.quantity + '\nCity: ' + e.city + '\n\nMessage:\n' + (e.message || 'No message'));
  }

  function markReplied(id) {
    AdminSystem.updateEnquiryStatus(id, 'replied');
    renderEnquiries();
    showToast('Marked as replied', 'success');
  }

  function deleteEnquiry(id) {
    if(!confirm('Delete this enquiry?')) return;
    AdminSystem.deleteEnquiry(id);
    renderEnquiries();
    showToast('Enquiry deleted', 'success');
  }

  function exportEnquiries() {
    var csv = AdminSystem.exportEnquiriesCSV();
    if(!csv) { showToast('No enquiries to export', 'error'); return; }
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'alazhar-enquiries-' + new Date().toISOString().slice(0,10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully', 'success');
  }

  function clearAllEnquiries() {
    if(!confirm('Delete ALL enquiries? This cannot be undone.')) return;
    AdminSystem.clearAllEnquiries();
    renderEnquiries();
    showToast('All enquiries cleared', 'success');
  }

  // Products
  function renderProducts() {
    var products = AdminSystem.getData(AdminSystem.getStorageKeys().PRODUCTS);
    var statProducts = document.getElementById('stat-products');
    if(statProducts) statProducts.textContent = products.length;

    var tbody = document.getElementById('products-body');
    if(tbody) {
      tbody.innerHTML = products.map(function(p) {
        var badgeHtml = p.badge ? '<span class="status-badge status-replied">' + p.badge + '</span>' : '—';
        return '<tr>' +
          '<td><img src="' + p.img + '" alt="' + p.name + '" style="width:50px;height:50px;object-fit:cover;border-radius:var(--radius);" /></td>' +
          '<td><strong>' + p.name + '</strong></td>' +
          '<td class="ar">' + p.ar + '</td>' +
          '<td><span class="status-badge status-new">' + p.category + '</span></td>' +
          '<td>' + p.type + '</td>' +
          '<td>' + badgeHtml + '</td>' +
          '<td>' +
            '<div class="table-actions">' +
              '<button class="table-btn table-btn-edit" onclick="adminApp.editProduct(' + p.id + ')">Edit</button>' +
              '<button class="table-btn table-btn-del" onclick="adminApp.deleteProduct(' + p.id + ')">Delete</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      }).join('');
    }
  }

  function openProductModal(id) {
    editingProductId = id || null;
    var modal = document.getElementById('product-modal');
    var title = document.getElementById('product-modal-title');

    if(id) {
      var products = AdminSystem.getData(AdminSystem.getStorageKeys().PRODUCTS);
      var p = null;
      for(var i = 0; i < products.length; i++) {
        if(products[i].id === id) { p = products[i]; break; }
      }
      if(p) {
        if(title) title.textContent = 'Edit Product';
        setVal('prod-name', p.name);
        setVal('prod-ar', p.ar);
        setVal('prod-cat', p.category);
        setVal('prod-type', p.type);
        setVal('prod-img', p.img);
        setVal('prod-badge', p.badge || '');
      }
    } else {
      if(title) title.textContent = 'Add Product';
      setVal('prod-name', '');
      setVal('prod-ar', '');
      setVal('prod-cat', 'special');
      setVal('prod-type', '');
      setVal('prod-img', 'assets/images/fabric-dark-2.jpg');
      setVal('prod-badge', '');
    }
    if(modal) modal.classList.add('open');
  }

  function setVal(id, val) {
    var el = document.getElementById(id);
    if(el) el.value = val || '';
  }

  function saveProduct() {
    var product = {
      name: getVal('prod-name'),
      ar: getVal('prod-ar'),
      category: getVal('prod-cat'),
      type: getVal('prod-type'),
      img: getVal('prod-img'),
      badge: getVal('prod-badge')
    };
    if(!product.name) { showToast('Product name is required', 'error'); return; }

    if(editingProductId) {
      AdminSystem.updateProduct(editingProductId, product);
      showToast('Product updated', 'success');
    } else {
      AdminSystem.addProduct(product);
      showToast('Product added', 'success');
    }
    closeModal('product-modal');
    renderProducts();
  }

  function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function editProduct(id) {
    openProductModal(id);
  }

  function deleteProduct(id) {
    if(!confirm('Delete this product?')) return;
    AdminSystem.deleteProduct(id);
    renderProducts();
    showToast('Product deleted', 'success');
  }

  function saveProducts() {
    showToast('Products saved to local storage', 'success');
  }

  // Gallery
  function renderGallery() {
    var gallery = AdminSystem.getData(AdminSystem.getStorageKeys().GALLERY);
    var tbody = document.getElementById('gallery-body');
    if(tbody) {
      tbody.innerHTML = gallery.map(function(g) {
        return '<tr>' +
          '<td><img src="' + g.img + '" style="width:60px;height:60px;object-fit:cover;border-radius:var(--radius);" /></td>' +
          '<td>' + g.img.split('/').pop() + '</td>' +
          '<td>' + g.capEn + '</td>' +
          '<td class="ar">' + g.capAr + '</td>' +
          '<td>' + (g.span || 'Normal') + '</td>' +
          '<td>' +
            '<div class="table-actions">' +
              '<button class="table-btn table-btn-edit" onclick="adminApp.editGalleryItem(' + g.id + ')">Edit</button>' +
              '<button class="table-btn table-btn-del" onclick="adminApp.deleteGalleryItem(' + g.id + ')">Delete</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      }).join('');
    }
  }

  function openGalleryModal() {
    setVal('gal-img', '');
    setVal('gal-cap-en', '');
    setVal('gal-cap-ar', '');
    setVal('gal-span', '');
    var modal = document.getElementById('gallery-modal');
    if(modal) modal.classList.add('open');
  }

  function saveGalleryItem() {
    var item = {
      img: getVal('gal-img'),
      capEn: getVal('gal-cap-en'),
      capAr: getVal('gal-cap-ar'),
      span: getVal('gal-span')
    };
    if(!item.img) { showToast('Image path is required', 'error'); return; }
    AdminSystem.addGalleryItem(item);
    closeModal('gallery-modal');
    renderGallery();
    showToast('Image added to gallery', 'success');
  }

  function editGalleryItem(id) {
    var gallery = AdminSystem.getData(AdminSystem.getStorageKeys().GALLERY);
    var g = null;
    for(var i = 0; i < gallery.length; i++) {
      if(gallery[i].id === id) { g = gallery[i]; break; }
    }
    if(!g) return;
    var newCapEn = prompt('New English caption:', g.capEn);
    if(newCapEn === null) return;
    AdminSystem.updateGalleryItem(id, { capEn: newCapEn });
    renderGallery();
    showToast('Gallery item updated', 'success');
  }

  function deleteGalleryItem(id) {
    if(!confirm('Delete this gallery image?')) return;
    AdminSystem.deleteGalleryItem(id);
    renderGallery();
    showToast('Image deleted', 'success');
  }

  function saveGallery() {
    showToast('Gallery saved', 'success');
  }

  // Content Editor
  function renderContent() {
    var content = AdminSystem.getContent();
    setVal('edit-hero-title', content.heroTitle);
    setVal('edit-hero-ar', content.heroAr);
    setVal('edit-hero-sub', content.heroSub);
    setVal('edit-about-excerpt', content.aboutExcerpt);
    setVal('edit-products-title', content.productsTitle);
    setVal('edit-products-desc', content.productsDesc);
    setVal('edit-founder', content.founder);
    setVal('edit-story', content.story);
    setVal('edit-quote', content.quote);
    setVal('edit-phone', content.phone);
    setVal('edit-whatsapp', content.whatsapp);
    setVal('edit-email', content.email);
    setVal('edit-address', content.address);
    setVal('edit-hours', content.hours);
    setVal('edit-gallery-title', content.galleryTitle);
    setVal('edit-gallery-desc', content.galleryDesc);
  }

  function saveContent() {
    var content = {
      heroTitle: getVal('edit-hero-title'),
      heroAr: getVal('edit-hero-ar'),
      heroSub: getVal('edit-hero-sub'),
      aboutExcerpt: getVal('edit-about-excerpt'),
      productsTitle: getVal('edit-products-title'),
      productsDesc: getVal('edit-products-desc'),
      founder: getVal('edit-founder'),
      story: getVal('edit-story'),
      quote: getVal('edit-quote'),
      phone: getVal('edit-phone'),
      whatsapp: getVal('edit-whatsapp'),
      email: getVal('edit-email'),
      address: getVal('edit-address'),
      hours: getVal('edit-hours'),
      galleryTitle: getVal('edit-gallery-title'),
      galleryDesc: getVal('edit-gallery-desc')
    };
    AdminSystem.saveContent(content);
    showToast('Content saved! Refresh website to see changes.', 'success');
  }

  function previewContent() {
    window.open('index.html', '_blank');
  }

  function resetContent() {
    if(!confirm('Reset all content to defaults?')) return;
    localStorage.removeItem(AdminSystem.getStorageKeys().CONTENT);
    AdminSystem.initStorage();
    renderContent();
    showToast('Content reset to defaults', 'success');
  }

  // Settings
  function renderSettings() {
    var settings = AdminSystem.getSettings();
    setVal('setting-title', settings.title);
    setVal('setting-desc', settings.description);
    setVal('setting-fb', settings.facebook);
    setVal('setting-ig', settings.instagram);
    setVal('setting-maps', settings.mapsUrl);

    var toggleWa = document.getElementById('toggle-wa');
    var toggleStrip = document.getElementById('toggle-strip');
    var toggleForms = document.getElementById('toggle-forms');
    var toggleMaint = document.getElementById('toggle-maint');

    if(toggleWa) toggleWa.classList.toggle('on', settings.whatsappFloat);
    if(toggleStrip) toggleStrip.classList.toggle('on', settings.promoStrip);
    if(toggleForms) toggleForms.classList.toggle('on', settings.netlifyForms);
    if(toggleMaint) toggleMaint.classList.toggle('on', settings.maintenanceMode);
  }

  function saveSettings() {
    var settings = {
      title: getVal('setting-title'),
      description: getVal('setting-desc'),
      facebook: getVal('setting-fb'),
      instagram: getVal('setting-ig'),
      mapsUrl: getVal('setting-maps'),
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
    if(el) el.classList.toggle('on');
  }

  // Users
  function renderUsers() {
    var users = AdminSystem.getData(AdminSystem.getStorageKeys().USERS);
    var tbody = document.getElementById('users-body');
    if(tbody) {
      tbody.innerHTML = users.map(function(u) {
        var roleClass = u.role === 'admin' ? 'status-new' : u.role === 'editor' ? 'status-pending' : 'status-read';
        var statusClass = u.status === 'active' ? 'status-replied' : 'status-read';
        var lastLogin = u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-GB') : 'Never';
        var disabledAttr = u.username === 'admin' ? 'disabled style="opacity:.4"' : '';
        return '<tr>' +
          '<td><strong>' + u.username + '</strong></td>' +
          '<td><span class="status-badge ' + roleClass + '">' + u.role + '</span></td>' +
          '<td>' + lastLogin + '</td>' +
          '<td><span class="status-badge ' + statusClass + '">' + u.status + '</span></td>' +
          '<td>' +
            '<div class="table-actions">' +
              '<button class="table-btn table-btn-del" ' + disabledAttr + ' onclick="adminApp.deleteUser(\'' + u.username + '\')">Delete</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      }).join('');
    }
  }

  function openUserModal() {
    setVal('new-username', '');
    setVal('new-password', '');
    setVal('new-role', 'admin');
    var modal = document.getElementById('user-modal');
    if(modal) modal.classList.add('open');
  }

  function addUser() {
    var username = getVal('new-username');
    var password = getVal('new-password');
    var role = getVal('new-role');
    if(!username || !password) { showToast('Username and password required', 'error'); return; }

    var result = AdminSystem.addUser({ username: username, password: password, role: role });
    if(result.success) {
      closeModal('user-modal');
      renderUsers();
      showToast('User added successfully', 'success');
    } else {
      showToast(result.error, 'error');
    }
  }

  function deleteUser(username) {
    if(!confirm('Delete user "' + username + '"?')) return;
    AdminSystem.deleteUser(username);
    renderUsers();
    showToast('User deleted', 'success');
  }

  // Modal helpers
  function closeModal(id) {
    var modal = document.getElementById(id);
    if(modal) modal.classList.remove('open');
    editingProductId = null;
  }

  // Toast
  function showToast(message, type) {
    if(!toastEl) return;
    toastEl.textContent = message;
    toastEl.className = 'toast ' + (type || '');
    toastEl.classList.add('show');
    setTimeout(function() {
      toastEl.classList.remove('show');
    }, 3500);
  }

  // Escape HTML
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  // Event listeners - attach directly
  if(loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogin();
    });
  }

  var passInput = document.getElementById('admin-pass');
  if(passInput) {
    passInput.addEventListener('keypress', function(e) {
      if(e.key === 'Enter') {
        e.preventDefault();
        handleLogin();
      }
    });
  }

  var userInput = document.getElementById('admin-user');
  if(userInput) {
    userInput.addEventListener('keypress', function(e) {
      if(e.key === 'Enter') {
        e.preventDefault();
        if(passInput) passInput.focus();
      }
    });
  }

  if(logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogout();
    });
  }

  // Sidebar navigation
  document.querySelectorAll('.sidebar-menu a[data-section]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var section = link.dataset.section;
      if(section) loadSection(section);
    });
  });

  // Editor tabs
  document.querySelectorAll('.editor-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.editor-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelectorAll('.editor-pane').forEach(function(p) { p.classList.remove('active'); });
      var pane = document.querySelector('.editor-pane[data-page="' + tab.dataset.page + '"]');
      if(pane) pane.classList.add('active');
    });
  });

  // Initialize
  checkSession();

  // Expose adminApp globally for inline onclick handlers
  window.adminApp = {
    openSection: openSection,
    viewEnquiry: viewEnquiry,
    markReplied: markReplied,
    deleteEnquiry: deleteEnquiry,
    exportEnquiries: exportEnquiries,
    clearAllEnquiries: clearAllEnquiries,
    openProductModal: openProductModal,
    saveProduct: saveProduct,
    editProduct: editProduct,
    deleteProduct: deleteProduct,
    saveProducts: saveProducts,
    openGalleryModal: openGalleryModal,
    saveGalleryItem: saveGalleryItem,
    editGalleryItem: editGalleryItem,
    deleteGalleryItem: deleteGalleryItem,
    saveGallery: saveGallery,
    saveContent: saveContent,
    previewContent: previewContent,
    resetContent: resetContent,
    saveSettings: saveSettings,
    loadSettings: loadSettings,
    toggle: toggle,
    openUserModal: openUserModal,
    addUser: addUser,
    deleteUser: deleteUser,
    closeModal: closeModal
  };

} // end initAdminSystem


/* ============================================================
   FORM CAPTURE — Intercept contact form submissions
   ============================================================ */

(function() {
  var contactForm = document.getElementById('contact-form');
  if(!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    var formData = new FormData(contactForm);
    var data = {};
    formData.forEach(function(val, key) {
      if(key !== 'form-name' && key !== 'bot-field') data[key] = val;
    });
    if(window.AdminSystem) {
      window.AdminSystem.addEnquiry(data);
    }
  });
})();

