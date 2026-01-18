# How to Upload APK File to Your Website

The APK file (134MB) is too large for GitHub, so it needs to be uploaded separately.

## Option 1: Upload via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your `aarambhappsite` project
3. Go to Settings → General
4. Upload the file `public/app.apk` directly through the Vercel dashboard
5. The file will be available at `https://www.aarambhapp.com/app.apk`

## Option 2: Use GitHub Releases

1. Go to https://github.com/akashhsr-gla/aarambhappsite/releases
2. Click "Create a new release"
3. Upload `public/app.apk` as a release asset
4. Copy the direct download URL
5. Update all download links in the code to use that URL

## Option 3: Use a CDN/File Hosting Service

Upload `public/app.apk` to:
- Google Drive (make it public and get direct link)
- Dropbox (get public link)
- AWS S3
- Cloudflare R2
- Any other file hosting service

Then update the links in the code to point to that URL.

## Quick Fix: Create API Route (Temporary Solution)

If you need it working immediately, we can create a redirect API route.
