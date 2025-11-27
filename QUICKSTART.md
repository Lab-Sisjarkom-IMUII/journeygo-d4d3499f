# 🚀 Quick Start - Deploy JourneyGo PWA

## Pilih 1 dari 3 opsi di bawah:

---

## ⭐ **Opsi 1: Vercel (PALING MUDAH)**

```bash
1. Buka: https://vercel.com
2. Click: "Add New" → "Project"
3. Select: "journeygoe" repository
4. Click: "Deploy"
5. SELESAI! ✅

Domain: https://journeygoe.vercel.app
```

**Keuntungan:**
- ✅ Auto HTTPS
- ✅ Instant deployment
- ✅ Free tier generous
- ✅ PWA friendly

---

## 🔵 **Opsi 2: Netlify**

```bash
1. Buka: https://netlify.com
2. Click: "Add new site" → "Import existing project"
3. Select: "journeygoe" repository
4. Settings auto-detected
5. Click: "Deploy site"
6. SELESAI! ✅

Domain: https://journeygoe.netlify.app
```

**Keuntungan:**
- ✅ Auto HTTPS
- ✅ Simple setup
- ✅ Good analytics

---

## 🐳 **Opsi 3: Docker + Server Sendiri**

### Requirements:
- Server dengan Docker installed
- Domain name
- SSL certificate (Let's Encrypt)

### Steps:

```bash
# 1. Clone & navigate
cd journeygoe

# 2. Build Docker image
docker build -t journeygoe:latest .

# 3. Run container
docker run -d \
  -p 80:80 \
  -p 443:443 \
  --name journeygoe \
  journeygoe:latest

# 4. Access
http://localhost
```

**Setup SSL dengan Let's Encrypt:**
```bash
docker run --rm -it \
  -v /etc/letsencrypt:/etc/letsencrypt \
  certbot/certbot certonly \
  --standalone \
  -d yourdomain.com
```

---

## ✅ Test After Deploy

1. **Open app in browser**
2. **Check address bar** → "Install app" button
3. **Click Install** → App added to home screen
4. **DevTools → Application**:
   - ✅ Manifest loading
   - ✅ Service Worker active
   - ✅ Cache storage working

---

## 📱 Install PWA

### Desktop (Chrome/Edge):
1. Click **"Install app"** button in address bar
2. Done!

### Mobile (Android):
1. Open in Chrome
2. Menu → **"Install app"**
3. Done!

### iOS (Safari):
1. Click **Share**
2. **"Add to Home Screen"**
3. Done!

---

## 🧪 Test Offline Mode

1. Open DevTools (F12)
2. Go to **Application → Network**
3. Check **"Offline"** checkbox
4. Refresh page
5. Should still work! ✅

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| No "Install" button | Make sure using HTTPS |
| Icons not showing | Check DevTools → console |
| Offline not working | Check Service Worker in DevTools |
| Slow loading | Check Network tab for large assets |

---

## 📊 Commands Reference

```bash
# Development
npm run dev          # Local dev server
npm run preview      # Test production build locally

# Build & Deploy
npm run build        # Create production build
npm run generate:icons    # Regenerate icons

# Docker
docker build -t journeygoe .     # Build image
docker run -p 80:80 journeygoe   # Run container
```

---

## 🎉 You're Done!

JourneyGo is ready to be a Progressive Web App!

**Next:** Deploy to production using Opsi 1 (Vercel) atau Opsi 2 (Netlify).

Happy deployment! 🚀
