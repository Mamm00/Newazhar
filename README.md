# الأزهر تكس — Al Azhar Tex
## Complete Netlify-Ready Website

A luxury wholesale fabric website for **Shady Anwar** · Zagazig, Egypt.

---

## 📁 File Structure

```
al-azhar-tex/
├── index.html          ← Homepage (hero, new arrivals, trending, about excerpt)
├── products.html       ← Full filterable fabric catalogue
├── gallery.html        ← Masonry photo gallery with lightbox
├── about.html          ← Shady Anwar's story, timeline, values
├── contact.html        ← Netlify form + Google Maps + WhatsApp
├── netlify.toml        ← Netlify config (headers, redirects, build)
├── _redirects          ← Clean URL redirects
├── README.md           ← This file
└── assets/
    ├── css/
    │   └── style.css   ← Complete stylesheet (2000+ lines, all pages)
    └── js/
        └── main.js     ← All interactions, filters, lightbox, animations
```

---

## 🚀 Deploy to Netlify in 3 Steps

### Option A — Drag & Drop (Fastest)
1. Zip the entire `al-azhar-tex/` folder
2. Go to [app.netlify.com](https://app.netlify.com)
3. Drag the ZIP onto the **"Drag and drop your site folder here"** area
4. ✅ Live in 30 seconds

### Option B — Git + Auto-Deploy (Recommended for updates)
1. Create a new GitHub repo and push this folder to it
2. In Netlify: **New site → Import from Git** → connect your repo
3. Build settings:
   - **Build command:** *(leave blank — it's static)*
   - **Publish directory:** `.`
4. Click **Deploy site**

---

## ✏️ Customisation Checklist

After deploying, update these placeholders:

### 1. Phone Number
Search and replace `20XXXXXXXXXX` with the real number (e.g. `201012345678`).
Appears in every HTML file in `tel:` and `wa.me/` links.

### 2. WhatsApp Number
Same — replace `20XXXXXXXXXX` in all WhatsApp href attributes.

### 3. Email Address
Replace `info@alazhartex.com` with the real email in:
- `contact.html` (mailto link)
- Netlify Dashboard → **Forms → Notifications** (to receive form emails)

### 4. Netlify Form Emails
After deploying:
1. Go to **Netlify Dashboard → Forms**
2. You'll see `fabric-enquiry` form automatically detected
3. Click **Add notification → Email notification**
4. Enter Shady Anwar's email to receive enquiries

### 5. Google Maps — Exact Address
In `contact.html`, replace the Maps embed `src` with an embed for the exact gallery address:
1. Go to [maps.google.com](https://maps.google.com)
2. Search for the exact address in Zagazig
3. Click **Share → Embed a map** → copy the `src` URL
4. Paste it into the `<iframe src="...">` in `contact.html`

### 6. Instagram / Facebook Links
In every footer, replace `href="#"` on the social icons with:
- Instagram: `https://www.instagram.com/YOUR_HANDLE`
- Facebook: `https://www.facebook.com/YOUR_PAGE`

### 7. Product Photos (Optional Upgrade)
Current images use Unsplash fabric photography.
To use real product photos from the Zagazig gallery:
1. Add images to `assets/images/` folder
2. Update `src` attributes in product cards and gallery items

---

## 🎨 Design System

| Token            | Value          | Used For                    |
|------------------|----------------|-----------------------------|
| `--gold`         | `#C9A84C`      | Primary accent, CTAs        |
| `--ink`          | `#0F0D0A`      | Background                  |
| `--ink-mid`      | `#1E1A14`      | Cards, sections             |
| `--ivory`        | `#F5F0E6`      | Primary text                |
| `--sand`         | `#B8A082`      | Secondary text              |
| Font Display     | Playfair Display | Headings                  |
| Font Body        | Tajawal        | Arabic + body text          |
| Font Italic      | Cormorant Garamond | Pull quotes, accents    |

---

## 📱 Features

- ✅ Fully responsive (mobile-first)
- ✅ RTL-aware Arabic typography (Tajawal)
- ✅ Floating WhatsApp button
- ✅ Netlify Forms (contact enquiry)
- ✅ CSS product filter tabs
- ✅ Gallery lightbox
- ✅ Scroll-reveal animations
- ✅ Animated counter stats
- ✅ Parallax hero
- ✅ Marquee announcement strip
- ✅ Gold cursor trail (desktop)
- ✅ SEO meta tags + Open Graph
- ✅ Performance headers via netlify.toml
- ✅ Clean URLs via _redirects

---

## 🌐 Pages

| Page           | File             | Description                              |
|----------------|------------------|------------------------------------------|
| Home           | `index.html`     | Hero, new arrivals, about, trending      |
| Products       | `products.html`  | Full catalogue with filter tabs          |
| Gallery        | `gallery.html`   | Masonry grid with lightbox               |
| About Us       | `about.html`     | Shady's story, timeline, values          |
| Contact        | `contact.html`   | Form, map, contact cards                 |

---

## 💡 Tips for Maximum Impact

- **Add your Instagram Reels** as background video in the hero — replace the CSS `background-image` in `.hero-bg` with a `<video>` tag for stunning effect.
- **WhatsApp catalogue** — share product card images directly from the gallery with clients on WhatsApp.
- **Google Business Profile** — add your Zagazig address to Google Business for local SEO.
- **Facebook Pixel** — add Meta Pixel code before `</head>` to track visitors from Facebook/Instagram ads.

---

*Built with ❤️ for Shady Anwar · الأزهر تكس · الزقازيق*
