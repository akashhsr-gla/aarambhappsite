/**
 * Get the APK download URL
 * Checks for environment variable first, then falls back to local file
 */
export function getApkUrl(): string {
  // Check for external URL from environment variable
  // NEXT_PUBLIC_* variables are available on both client and server
  const externalUrl = process.env.NEXT_PUBLIC_APK_URL
  
  if (externalUrl) {
    return externalUrl
  }
  
  // Fallback to local file in public folder
  return '/app.apk'
}
