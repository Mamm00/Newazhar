# Al Azhar Tex — CMS Control Panel
## Complete Website Management System

### 📁 Files Included

| File | Purpose |
|------|---------|
| `admin.html` | CMS Control Panel (open in browser to edit) |
| `build.js` | Node.js build script to generate static files |
| `netlify.toml` | Netlify configuration (headers, caching) |
| `_redirects` | Clean URL redirects |

### 🚀 Quick Start

#### Option 1: Direct Browser Editing (No Build Required)
1. Open `admin.html` in any modern browser
2. Login with password: `alazhartex2025`
3. Edit all content directly in the browser
4. Changes save automatically to browser storage
5. Export JSON when ready to deploy

#### Option 2: Build & Deploy to Netlify (Production)
1. Edit content in `admin.html` CMS
2. Click **"Export to JSON"** → save the `.json` file
3. Run: `node build.js exported-data.json`
4. This creates a `dist/` folder with all static HTML files
5. Drag & drop `dist/` folder to [Netlify](https://app.netlify.com)

### 📋 CMS Features

- ✅ **Products** — Add, edit, delete products with Arabic names
- ✅ **Categories** — Manage fabric categories
- ✅ **Homepage** — Edit hero, featured products, promo banners
- ✅ **About Us** — Update story, timeline, values
- ✅ **Contact** — Phone, WhatsApp, email, hours, map
- ✅ **Social Media** — Facebook, Instagram, TikTok, etc.
- ✅ **Branding** — Logo, colors, meta tags, favicon
- ✅ **Settings** — Analytics, WhatsApp float button, promo strip
- ✅ **Data Export/Import** — JSON backup and restore

### 🔐 Security

- Password protected: `alazhartex2025` (change in admin.html line 1 of script)
- Session-based login (resets on browser close)
- No server required — all client-side

### 📝 After Deployment Checklist

- [ ] Update phone number in Contact section
- [ ] Update WhatsApp number
- [ ] Add real email address
- [ ] Update Google Maps embed with exact address
- [ ] Add Facebook page URL
- [ ] Add Instagram URL
- [ ] Upload real product photos to `assets/images/`
- [ ] Update logo in `assets/images/logo-badge.jpg`
- [ ] Set Google Analytics ID (optional)
- [ ] Set Facebook Pixel ID (optional)

---
*Built for Al Azhar Tex · الأزهر تكس · Zagazig, Egypt*
