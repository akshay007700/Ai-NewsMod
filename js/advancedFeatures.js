// 🚀 AI-NewsMod Advanced Features (Fixed & Safe Version)
class AdvancedFeatures {
  constructor() {
    console.log("🚀 Advanced Features Loaded");
    this.sentimentUpdateInterval = CONFIG.ADVANCED_FEATURES.SENTIMENT_ANALYSIS.UPDATE_INTERVAL || 60000;
    this.breakingUpdateInterval = CONFIG.ADVANCED_FEATURES.AI_PREDICTOR.UPDATE_INTERVAL || 300000;

    // Start all systems
    this.init();
  }

  // 🔧 Initialize Advanced Systems
  async init() {
    try {
      await this.initSentimentAnalysis();
      await this.initBreakingTicker();
    } catch (err) {
      console.error("⚠️ AdvancedFeatures init failed:", err.message);
    }
  }

  // 🧠 Sentiment System Initialization
  async initSentimentAnalysis() {
    console.log("🧠 Initializing Sentiment Analysis...");
    await this.updateSentiment();
    setInterval(() => this.updateSentiment(), this.sentimentUpdateInterval);
  }

  async updateSentiment() {
    try {
      await this.calculateSentiment();
    } catch (err) {
      console.warn("⚠️ updateSentiment failed:", err.message);
    }
  }

  // 🧠 Calculate Sentiment with Safe Checks
  async calculateSentiment() {
    try {
      if (!window.newsFetcher) {
        console.warn("⚠️ newsFetcher not ready yet.");
        return;
      }

      const articles = newsFetcher.latestArticles || [];
      if (!Array.isArray(articles) || articles.length === 0) {
        console.warn("⚠️ No articles available for sentiment analysis.");
        return;
      }

      // Dummy neutral sentiment (AI module can replace later)
      articles.forEach((a) => {
        a.sentiment = a.sentiment || "neutral";
      });

      console.log(`🧠 Sentiment recalculated for ${articles.length} articles`);
    } catch (err) {
      console.error("⚠️ Sentiment calculation error:", err.message);
    }
  }

  // 🗞️ Breaking News System Initialization
  async initBreakingTicker() {
    console.log("🗞️ Initializing Breaking News Ticker...");
    await this.updateTicker();
    setInterval(() => this.updateTicker(), this.breakingUpdateInterval);
  }

  async updateTicker() {
    try {
      const breaking = await this.getBreakingNews();
      if (!Array.isArray(breaking) || breaking.length === 0) {
        console.warn("⚠️ No breaking news available for ticker.");
        return;
      }

      const ticker = document.getElementById("breaking-ticker");
      if (!ticker) return;
      ticker.innerHTML = breaking
        .map((a) => `<span class="ticker-item">🔥 ${a.title}</span>`)
        .join("");
      console.log(`🗞️ Updated Breaking Ticker with ${breaking.length} items`);
    } catch (err) {
      console.error("⚠️ updateTicker error:", err.message);
    }
  }

  // 📰 Get Breaking News with Fallback
  async getBreakingNews() {
    try {
      if (!window.newsFetcher) {
        console.warn("⚠️ newsFetcher not found for breaking news.");
        return [];
      }

      const articles = newsFetcher.latestArticles || [];
      if (!Array.isArray(articles)) return [];

      const breaking = articles.filter((a) => a.isBreaking);
      console.log(`🗞️ Found ${breaking.length} breaking articles`);
      return breaking;
    } catch (err) {
      console.error("⚠️ Breaking news fetch failed:", err.message);
      return [];
    }
  }
}

// ✅ Initialize once DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Wait a bit to ensure newsFetcher ready
  setTimeout(() => {
    try {
      if (typeof CONFIG !== "undefined" && CONFIG.ADVANCED_FEATURES.ENABLED) {
        new AdvancedFeatures();
      } else {
        console.log("ℹ️ Advanced features disabled in config.");
      }
    } catch (err) {
      console.error("⚠️ Failed to initialize AdvancedFeatures:", err.message);
    }
  }, 1500);
});
