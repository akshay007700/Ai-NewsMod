// 🧠 AI-NewsMod Global Configuration (Verified Safe Syntax)
const CONFIG = {
  APP: {
    NAME: "AI NewsMod",
    VERSION: "2.1",
    DEVELOPER: "Akshay Kumar",
    THEME: {
      DEFAULT: "dark",
      ALLOW_SWITCH: true
    },
    AUTO_REFRESH_INTERVAL: 900000, // 15 min
    LANGUAGE: "en"
  },

  // 📰 News configuration
  NEWS: {
    SOURCES: {
      NEWSAPI: {
        ENABLED: true,
        BASE_URL: "https://ai-newsmod-proxy.ak0077003.workers.dev/news" // 👈 replace this with your actual Cloudflare Worker URL
      }
    },
    DEFAULT_CATEGORY: "technology",
    MAX_RESULTS: 20,
    AUTO_UPDATE: true
  },

  // 🤖 Real AI provider settings
  REAL_AI: {
    ENABLED: true,
    PROVIDERS: {
      OPENAI: {
        API_KEY: "", // keys handled via Cloudflare worker (keep empty)
        MODEL: "gpt-3.5-turbo",
        MAX_TOKENS: 500
      },
      GEMINI: {
        API_KEY: "",
        MODEL: "gemini-pro"
      }
    },
    FEATURES: {
      SUMMARIZATION: true,
      SENTIMENT_ANALYSIS: true,
      TRANSLATION: true,
      IMAGE_GENERATION: true,
      NEWS_GENERATION: true,
      AI_ASSISTANT: true
    }
  },

  // 🎛 Advanced features (optional)
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
      DEFAULT_SPEED: 1
    }
  }
};

// ✅ Debug log to confirm loaded
console.log("🧩 CONFIG loaded successfully:", CONFIG.APP.NAME, "v" + CONFIG.APP.VERSION);
