# 🚀 Deploy Guide - JourneyGo PWA

## Opsi 1: Deploy ke Vercel (Recommended - Paling Mudah)

### Step 1: Push ke GitHub
```bash
git add .
git commit -m "Add PWA support with icons and service worker"
git push origin main
```

### Step 2: Deploy ke Vercel
1. Buka https://vercel.com
2. Login dengan GitHub
3. Click "Add New" → "Project"
4. Select repository `journeygoe`
5. Settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

**✅ Aplikasi akan live di:** `https://journeygoe.vercel.app`

---

## Opsi 2: Deploy ke Netlify

### Step 1: Connect Repository
1. Buka https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select GitHub → Choose `journeygoe` repository
4. Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

**✅ Aplikasi akan live di:** `https://journeygoe.netlify.app`

---

## Opsi 3: Deploy ke Server Sendiri (Advanced)

### Menggunakan Docker + Nginx

#### 1. Buat `Dockerfile`
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Buat `nginx.conf`
```nginx
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html index.htm;

    # Cache assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker - no cache
    location /service-worker.js {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Manifest
    location /manifest.json {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Fallback untuk SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 3. Build & Run
```bash
# Build Docker image
docker build -t journeygoe .

# Run container
docker run -d -p 80:80 --name journeygoe journeygoe

# Access di http://localhost
```

---

## ✅ Checklist Sebelum Deploy

- [ ] Run `npm run build` - harus berhasil tanpa error
- [ ] Icons sudah generate di `publik/icons/`
- [ ] `manifest.json` sudah ada dengan icon list yang lengkap
- [ ] Service Worker sudah di-register di `main.tsx`
- [ ] PWA meta tags sudah ada di `index.html`
- [ ] Domain menggunakan HTTPS (Vercel/Netlify auto-setup)

---

## 🧪 Test PWA Setelah Deploy

1. **Install PWA:**
   - Chrome: Address bar → "Install app" button
   - Safari/iOS: Share → "Add to Home Screen"
   - Android: Menu → "Install app"

2. **Test Offline Mode:**
   - Open DevTools → Network → Offline
   - Refresh halaman - harus masih bisa buka (cached)

3. **Check PWA Status:**
   - DevTools → Application → Manifest
   - DevTools → Application → Service Workers
   - Harus ada dan active ✅

---

## 📊 PWA Lighthouse Score

Setelah deploy, test di:
- Chrome DevTools → Lighthouse
- https://pagespeed.web.dev

Target score:
- ✅ Performance: > 80
- ✅ Accessibility: > 90
- ✅ Best Practices: > 90
- ✅ PWA: > 90 (paling penting!)

---

## 🔒 HTTPS (Penting!)

PWA HARUS menggunakan HTTPS. Untungnya:
- ✅ Vercel - Auto HTTPS
- ✅ Netlify - Auto HTTPS
- ❌ HTTP - PWA tidak akan bekerja

---

## 🆘 Troubleshooting

### Service Worker tidak register?
```bash
# Check console di DevTools
# Pastikan service-worker.js di publik folder
# Pastikan HTTPS (jika production)
```

### Manifest tidak loading?
- Cek di DevTools → Application → Manifest
- Pastikan path di `index.html` benar: `<link rel="manifest" href="/manifest.json">`

### Icons tidak muncul?
- Cek di `publik/icons/` - harus ada file `.png`
- Verify path di manifest.json

---

**Happy deploying! 🎉**
