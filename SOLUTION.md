# Solution: Fix APK Download (404 Error)

## Problem
The APK file (134MB) is too large for GitHub, so it's not being deployed to your website.

## Quick Solution (Choose One)

### Option 1: Upload APK to GitHub Releases (Recommended - Free)

1. Go to: https://github.com/akashhsr-gla/aarambhappsite/releases
2. Click "Create a new release"
3. Tag: `v1.0.0` (or any version)
4. Title: `Aarambh App APK v1.0.0`
5. Upload `public/app.apk` as a release asset
6. After upload, right-click the APK file and copy the direct download link
   - It will look like: `https://github.com/akashhsr-gla/aarambhappsite/releases/download/v1.0.0/app.apk`
7. Add this to your `.env.local` file:
   ```
   NEXT_PUBLIC_APK_URL=https://github.com/akashhsr-gla/aarambhappsite/releases/download/v1.0.0/app.apk
   ```
8. Redeploy your website

### Option 2: Upload via Vercel Dashboard

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link` (in the aarambhappsite directory)
4. Upload file: `vercel --prod` (this will deploy everything including public folder)
5. OR manually upload via Vercel dashboard → Your Project → Settings → Upload files

### Option 3: Use External File Hosting

Upload `public/app.apk` to any file hosting service:
- Google Drive (make public, get direct link)
- Dropbox (get public link)
- AWS S3
- Cloudflare R2
- Any CDN

Then add to `.env.local`:
```
NEXT_PUBLIC_APK_URL=https://your-hosting-url.com/app.apk
```

### Option 4: Use Git LFS (For Future)

If you want to keep the APK in the repository:

1. Install Git LFS: `brew install git-lfs` (Mac) or download from https://git-lfs.github.com
2. Run: `git lfs install`
3. Run: `git lfs track "*.apk"`
4. Remove `public/app.apk` from `.gitignore`
5. Add and commit: `git add .gitattributes public/app.apk && git commit -m "Add APK with Git LFS"`
6. Push: `git push origin main`

## After Setting Up

Once you have the APK URL, update your environment variable and redeploy. The website will automatically use the new URL for all download links.
