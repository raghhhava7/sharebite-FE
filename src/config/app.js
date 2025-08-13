// Application Configuration
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },

  // Application Settings
  app: {
    name: 'ShareBite',
    version: '1.0.0',
    description: 'Reducing food waste by connecting donors, receivers, and volunteers',
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@sharebite.com',
    contactPhone: import.meta.env.VITE_CONTACT_PHONE || '+1-555-SHARE-BITE',
  },

  // Feature Flags
  features: {
    performanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
    debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
    mockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  },

  // Social Media
  social: {
    twitter: import.meta.env.VITE_TWITTER_HANDLE || '@sharebite',
    facebook: import.meta.env.VITE_FACEBOOK_PAGE || 'sharebite',
    linkedin: import.meta.env.VITE_LINKEDIN_COMPANY || 'sharebite',
  },

  // Analytics
  analytics: {
    gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID,
    gtmId: import.meta.env.VITE_GTM_ID,
  },

  // Environment
  env: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  },

  // UI Configuration
  ui: {
    theme: {
      primaryColor: '#87A96B',
      secondaryColor: '#F4D03F',
      accentColor: '#E67E22',
    },
    animation: {
      duration: {
        fast: 150,
        normal: 250,
        slow: 350,
      },
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },

  // Validation Rules
  validation: {
    password: {
      minLength: 6,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
    },
    username: {
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      pattern: /^[+]?[0-9]{10,15}$/,
    },
  },

  // Map Configuration (for future use)
  map: {
    defaultCenter: { lat: 40.7128, lng: -74.0060 }, // New York City
    defaultZoom: 12,
    maxRadius: 50, // km
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  // Cache Configuration
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

export default config;