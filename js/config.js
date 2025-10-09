// 🧠 AI-NewsMod Configuration (Fixed Syntax, No design change)
const CONFIG = {
  APP: {
    NAME: "AI NewsMod",
    VERSION: "2.1",
    DEVELOPER: "Akshay",
    THEME: { DEFAULT: "dark", ALLOW_SWITCH: true },
    AUTO_REFRESH_INTERVAL: 900000, // 15 minutes
    LANGUAGE: "en"
  },

  NEWS: {
    SOURCES: {
      NEWSAPI: {
        ENABLED: true,
        BASE_URL: "https://ai-newsmod-proxy.ak0077003.workers.dev/news" // 👈Cloudflare URL
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
        API_KEY: "", // keys worker
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
