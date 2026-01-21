# FitTrack Pro - GitHub Pages Yayınlama Kılavuzu

Bu uygulama GitHub Pages üzerinde (serverless) çalışacak şekilde yapılandırılmıştır. Yayınlamak için şu adımları izleyin:

## 1. Firebase Kurulumu (Kritik)
Firebase üzerinden bir proje oluşturun ve `src/firebase.js` dosyasına kendi anahtarlarınızı yapıştırın.
* Firestore Database'i aktif edin ve "Rules" sekmesinden okuma/yazma izinlerini ayarlayın (Geliştirme aşamasında `allow read, write: if request.auth != null;` önerilir).
* Authentication sekmesinden **Google Sign-in** yöntemini aktif edin.

## 2. GitHub Üzerinden Yayınlama (Otomatik Yöntem)
En temiz yöntem `gh-pages` paketini kullanmaktır.

1.  **Paketi Yükleyin:**
    ```bash
    npm install gh-pages --save-dev
    ```

2.  **package.json Düzenleme:**
    Dosyanıza şu satırları ekleyin:
    ```json
    "homepage": "https://mehmetxkrkmz.github.io/fittrack-pro",
    "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist",
       ...
    }
    ```
    *(Not: Kullanıcı adınız `mehmetxkrkmz` olarak ayarlandı)*

3.  **Yayınlayın:**
    ```bash
    npm run deploy
    ```

## 3. GitHub Pages Ayarları
1. GitHub deponuzun **Settings > Pages** sekmesine gidin.
2. Build and deployment kısmında Source olarak **"Deploy from a branch"** ve Branch olarak **`gh-pages`** seçildiğinden emin olun.

## 4. Önemli Notlar
* **Auth Redirect:** Firebase Console > Authentication > Settings > Authorized Domains kısmına GitHub Pages alan adınızı (`mehmetxkrkmz.github.io`) eklemeyi unutmayın.
* **SPA Yönlendirme:** GitHub Pages üzerinde router işlemlerinin (sayfa yenileyince 404 hatası) düzgün çalışması için `index.html` kopyasını `404.html` olarak kaydedebilirsiniz veya `HashRouter` kullanabilirsiniz.

---
🚀 Artık FitTrack Pro dünyayla paylaşılmaya hazır!
