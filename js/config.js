// AI NewsMod Configuration
const CONFIG = {
    // API Configuration
    NEWS_API: {
        ENABLED: true,
        ENDPOINTS: {
            TECH: 'https://newsapi.org/v2/top-headlines?category=technology&apiKey=YOUR_API_KEY',
            WORLD: 'https://newsapi.org/v2/top-headlines?category=general&apiKey=YOUR_API_KEY',
            MOVIES: 'https://newsapi.org/v2/everything?q=movie&apiKey=YOUR_API_KEY'
        }
    },

    // AI Summarization
    AI: {
        ENABLED: true,
        PROVIDER: 'openai',
        API_KEY: 'your_ai_api_key_here',
        MODEL: 'gpt-3.5-turbo',
        MAX_TOKENS: 150
    },

    // App Settings
    APP: {
        NAME: 'AI NewsMod',
        VERSION: '1.0.0',
        AUTO_REFRESH: true,
        REFRESH_INTERVAL: 300000,
        THEME: 'auto'
    },

    // Advance Features
    ADVANCED_FEATURES: {
        ENABLED: true,
        AI_PREDICTOR: {
            UPDATE_INTERVAL: 300000,
            CONFIDENCE_THRESHOLD: 75
        },
        SENTIMENT_ANALYSIS: {
            REAL_TIME: true,
            UPDATE_INTERVAL: 60000
        },
    VOICE_READER: {
        ENABLED: true,
        DEFAULT_SPEED: 1,
        LANGUAGES: ['en-US', 'en-IN', 'hi-IN']
    },
    ANALYTICS: {
        REAL_TIME: true,
        DASHBOARD: true
    }
}
        }
        // Add to existing CONFIG object
     NEWSLETTER: {
    ENABLED: true,
    SCHEDULE: {
        DAILY: '08:00', // 8 AM
        WEEKLY: '09:00', // 9 AM Monday
        BREAKING: 'instant' // Immediate
    },
    SETTINGS: {
        MAX_SUBSCRIBERS: 10000,
        RETENTION_DAYS: 365,
        AUTO_CLEANUP: true
    }
}
    }
};