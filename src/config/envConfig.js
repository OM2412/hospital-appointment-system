// src/config/envConfig.js

/**
 * Environment Configuration
 * Reads environment variables and provides them to the application
 */

// Determine environment
const ENV = import.meta.env.MODE || 'development'
const isProduction = ENV === 'production'

// API Configuration
const API_CONFIG = {
  // For Render production: use VITE_API_BASE_HOST
  // For local dev: use VITE_API_URL
  baseURL: (() => {
    const apiUrl = import.meta.env.VITE_API_URL
    const apiHost = import.meta.env.VITE_API_BASE_HOST
    
    if (apiUrl) {
      return apiUrl // Local dev
    } else if (apiHost) {
      return `https://${apiHost}/api` // Render production
    }
    return 'http://localhost:8080/api' // Fallback
  })(),
  
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// JWT Configuration
const JWT_CONFIG = {
  secret: import.meta.env.VITE_JWT_SECRET || 'dev-secret-key',
  tokenKey: 'authToken',
  refreshTokenKey: 'refreshToken',
}

// App Configuration
const APP_CONFIG = {
  name: 'Hospital Appointment System',
  version: '1.0.0',
  environment: ENV,
  isProduction: isProduction,
  isDevelopment: !isProduction,
}

// Feature Flags
const FEATURES = {
  enableAnalytics: isProduction,
  enableDebugLogging: !isProduction,
  enableErrorTracking: isProduction,
}

// API Endpoints
const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  appointments: {
    list: '/appointments',
    create: '/appointments',
    update: '/appointments/:id',
    delete: '/appointments/:id',
    history: '/appointments/history',
    reschedule: '/appointments/:id/reschedule',
  },
  doctors: {
    list: '/doctors',
    search: '/doctors/search',
    specialty: '/doctors/specialty',
  },
  patients: {
    profile: '/patients/profile',
    update: '/patients/profile',
  },
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    analytics: '/admin/analytics',
  },
}

// Logging Configuration
const LOGGING = {
  enableConsole: !isProduction,
  enableFile: isProduction,
  level: ENV === 'production' ? 'error' : 'debug',
}

export default {
  API_CONFIG,
  JWT_CONFIG,
  APP_CONFIG,
  FEATURES,
  API_ENDPOINTS,
  LOGGING,
}

export {
  API_CONFIG,
  JWT_CONFIG,
  APP_CONFIG,
  FEATURES,
  API_ENDPOINTS,
  LOGGING,
}
