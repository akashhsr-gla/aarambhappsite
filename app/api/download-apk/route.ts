import { NextResponse } from 'next/server'

// APK file URL - can be:
// 1. Relative path '/app.apk' if file is in public folder
// 2. External URL if hosted elsewhere (GitHub Releases, CDN, etc.)
const APK_URL = process.env.NEXT_PUBLIC_APK_URL || '/app.apk'

export async function GET() {
  // If it's an external URL, redirect to it
  if (APK_URL.startsWith('http')) {
    return NextResponse.redirect(APK_URL)
  }
  
  // For relative paths, serve from public folder
  // Next.js will automatically serve files from public folder
  return NextResponse.redirect(APK_URL)
}
