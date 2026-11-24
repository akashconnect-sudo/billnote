export type AppLanguage = {
  code: string
  label: string
  native: string
}

export const APP_LANGUAGES: AppLanguage[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
]

export const LANG_KEY = 'bn_lang'

export function getStoredLanguage(): string {
  if (typeof window === 'undefined') return 'en'
  return window.localStorage.getItem(LANG_KEY) ?? 'en'
}

export function setStoredLanguage(code: string) {
  window.localStorage.setItem(LANG_KEY, code)
  document.documentElement.lang = code
}
