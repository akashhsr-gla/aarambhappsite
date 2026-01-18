# Quick Fix for APK Download

## Step 1: Upload APK to GitHub Releases

1. Open: https://github.com/akashhsr-gla/aarambhappsite/releases/new
2. Tag version: `v1.0.0`
3. Release title: `Aarambh App APK`
4. Click "Attach binaries" and upload `public/app.apk`
5. Click "Publish release"
6. After publishing, click on the APK file to open it
7. Copy the URL from the browser (it will be something like):
   ```
   https://github.com/akashhsr-gla/aarambhappsite/releases/download/v1.0.0/app.apk
   ```

## Step 2: Update Environment Variable

Add this to your Vercel project environment variables (or `.env.local` for local):
- Variable name: `NEXT_PUBLIC_APK_URL`
- Value: `https://github.com/akashhsr-gla/aarambhappsite/releases/download/v1.0.0/app.apk`

## Step 3: Update Code to Use Environment Variable

The code will be updated to check for this environment variable first, then fall back to `/app.apk`.

## Alternative: Direct Vercel Upload

If you're using Vercel:
1. Go to Vercel dashboard
2. Your project → Settings → Environment Variables
3. Add `NEXT_PUBLIC_APK_URL` with the GitHub Releases URL
4. Redeploy

The website will automatically use the GitHub Releases URL for downloads!
