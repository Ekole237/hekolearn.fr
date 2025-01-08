namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    NEXT_PUBLIC_SITE_URL: string
    
    // Google OAuth
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    
    // Email Configuration
    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_USER: string
    SMTP_PASSWORD: string
    SMTP_FROM: string
    
    // Application Settings
    APP_NAME: string
    APP_DESCRIPTION: string
    APP_LOCALE: string
    APP_TIMEZONE: string
    
    // Storage Configuration
    NEXT_PUBLIC_STORAGE_BUCKET: string
    MAX_FILE_SIZE: string
    ALLOWED_FILE_TYPES: string
    
    // Security
    SESSION_EXPIRY: string
    PASSWORD_MIN_LENGTH: string
    MAX_LOGIN_ATTEMPTS: string
    LOCKOUT_DURATION: string
  }
}
