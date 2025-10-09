// 🧠 AI-NewsMod Configuration (fixed syntax)
const CONFIG = {
  APP: {
    NAME: "AI NewsMod",
    VERSION: "2.1",
    DEVELOPER: "Akshay Kumar",
    THEME: { DEFAULT: "dark", ALLOW_SWITCH: true },
    AUTO_REFRESH_INTERVAL: 900000, // 15 min
    LANGUAGE: "en"
  },

  NEWS: {
    SOURCES: {
      NEWSAPI: {
        ENABLED: true,
        BASE_URL: "https://ai-newsmod-proxy.ak0077003.workers.dev/news" // 👈 replace with your Cloudflare worker URL
      }
    },
    DEFAULT_CATEGORY: "technology",
    MAX_RESULTS: 20,
    AUTO_UPDATE: true
  },

  REAL_AI: {
    ENABLED: true,
    PROVIDERS: {
      OPENAI: {
        API_KEY: "", // empty, handled via Cloudflare worker
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
  }
};
