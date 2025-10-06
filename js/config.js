// AI NewsMod Configuration
const CONFIG = {
    // API Configuration
    NEWS_API: {
        ENABLED: true,
        ENDPOINTS: {
            TECH: 'https://newsapi.org/v2/top-headlines?category=technology&apiKey=YOUR_API_KEY',
            WORLD: 'https://newsapi.org/v2/top-headlines?category=general&apiKey=YOUR_API_KEY',
            MOVIES: 'https://newsapi.org/v2/everything?q=movie&apiKey=YOUR_API_KEY'
        },
        BACKUP_ENDPOINTS: [
            'https://gnews.io/api/v4/top-headlines?token=YOUR_TOKEN',
            'https://api.currentsapi.services/v1/latest-news?apiKey=YOUR_KEY'
        ]
    },

    // AI Summarization
    AI: {
        ENABLED: true,
        PROVIDER: 'openai', // openai, gemini, claude
        API_KEY: 'your_ai_api_key_here',
        MODEL: 'gpt-3.5-turbo',
        MAX_TOKENS: 150,
        TEMPERATURE: 0.7
    },

    // App Settings
    APP: {
        NAME: 'AI NewsMod',
        VERSION: '1.0.0',
        AUTO_REFRESH: true,
        REFRESH_INTERVAL: 300000, // 5 minutes
        MAX_ARTICLES: 50,
        THEME: 'auto' // light, dark, auto
    },

    // Categories
    CATEGORIES: {
        TECH: {
            name: 'Technology',
            icon: 'fas fa-microchip',
            color: '#3b82f6',
            sources: ['TechCrunch', 'The Verge', 'Wired']
        },
        WORLD: {
            name: 'World News',
            icon: 'fas fa-globe',
            color: '#10b981',
            sources: ['BBC', 'CNN', 'Reuters']
        },
        MOVIES: {
            name: 'Movies & Entertainment',
            icon: 'fas fa-film',
            color: '#8b5cf6',
            sources: ['Variety', 'Hollywood Reporter', 'IMDb']
        }
    },

    // Local Storage Keys
    STORAGE_KEYS: {
        NEWS_DATA: 'ainewsmod_news_data',
        SETTINGS: 'ainewsmod_settings',
        LAST_UPDATED: 'ainewsmod_last_updated'
    }
};

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}