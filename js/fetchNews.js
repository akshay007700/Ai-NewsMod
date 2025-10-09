// 🌩️ AI-NewsMod News Fetcher (Final Stable Version)
// Compatible with AdvancedFeatures + Offline Cache + Cloudflare Proxy

class NewsFetcher {
  constructor() {
    this.baseUrl = CONFIG.NEWS.SOURCES.NEWSAPI.BASE_URL;
    this.defaultCategory = CONFIG.NEWS.DEFAULT_CATEGORY;
    this.refreshInterval = CONFIG.APP.AUTO_REFRESH_INTERVAL || 900000; // 15 minutes
    this.latestArticles = []; // store latest articles for advancedFeatures
  }

  // 📰 Fetch and render latest news
  async fetchNews(category = this.defaultCategory, silent = false) {
    try {
      if (!silent) this.showLoading(true);
      console.log(`📰 Fetching category: ${category}`);

      const url = `${this.baseUrl}?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.articles || data.status !== "ok") {
        throw new Error("Invalid API response");
      }

      const processed = data.articles.map((a, i) => ({
        id: `news-${i}`,
        title: a.title || "Untitled",
        summary: a.description || "",
        content: a.content || "",
        category,
        source: a.source?.name || "Unknown",
        author: a.author || "AI Reporter",
        image: a.urlToImage || "https://via.placeholder.com/400x250?text=No+Image",
        url: a.url,
        publishedAt: a.publishedAt || new Date().toISOString(),
        readTime: this.calcReadTime(a.content),
        isBreaking: Math.random() < 0.1,
        isTrending: Math.random() < 0.2
      }));

      // 🗃️ Save latest data globally
      this.latestArticles = processed;

      // 🗃️ Cache news locally for offline use
      localStorage.setItem("cachedNews", JSON.stringify({
        timestamp: Date.now(),
        category,
        articles: processed
      }));

      // ✅ Render on screen
      await renderNews(processed);
      this.updateStats(processed.length);

      console.log(`✅ Loaded and rendered ${processed.length} articles.`);

    } catch (err) {
      console.warn("⚠️ Fetch error:", err.message);
      await this.loadCachedNews();
    } finally {
      if (!silent) this.showLoading(false);
    }
  }

  // 🗃️ Load cached news if offline
  async loadCachedNews() {
    const cache = localStorage.getItem("cachedNews");
    if (cache) {
      const data = JSON.parse(cache);
      console.log("📦 Loaded cached news from localStorage.");
      this.latestArticles = data.articles || [];
      await renderNews(this.latestArticles);
      this.updateStats(this.latestArticles.length);
    } else {
      const container = document.getElementById("news-container");
      if (container)
        container.innerHTML = `<p style="text-align:center;color:#888;">⚠️ You're offline and no cached news found.</p>`;
    }
  }

  // 📊 Update article count + last updated time
  updateStats(count) {
    const countEl = document.getElementById("news-count");
    const lastUpdatedEl = document.getElementById("last-updated");
    if (countEl) countEl.textContent = count;
    if (lastUpdatedEl)
      lastUpdatedEl.textContent = new Date().toLocaleTimeString();
  }

  // ⏳ Calculate estimated read time
  calcReadTime(text) {
    const words = (text || "").split(/\s+/).length;
    return `${Math.max(1, Math.round(words / 200))} min read`;
  }

  // 🌀 Show loading spinner
  showLoading(show) {
    const spinner = document.getElementById("loading-spinner");
    const container = document.getElementById("news-container");
    if (spinner && container) {
      spinner.classList.toggle("hidden", !show);
      container.classList.toggle("hidden", show);
    }
  }

  // 🔄 Auto refresh every X minutes
  startAutoRefresh(category = this.defaultCategory) {
    console.log(`🔁 Auto-refresh enabled every ${this.refreshInterval / 60000} minutes`);
    setInterval(() => {
      console.log("🔁 Refresh triggered...");
      this.fetchNews(category, true);
      this.showRefreshIndicator();
    }, this.refreshInterval);
  }

  // 🕒 Visual refresh indicator
  showRefreshIndicator() {
    let indicator = document.getElementById("auto-refresh-indicator");
    if (!indicator) {
      indicator = document.createElement("div");
      indicator.id = "auto-refresh-indicator";
      indicator.textContent = "🕒 Headlines refreshed just now";
      indicator.classList.add("fade-in");
      document.body.appendChild(indicator);
      indicator.style.cssText =
        "position:fixed;bottom:25px;right:25px;background:linear-gradient(135deg,#2563eb,#9333ea);color:white;padding:8px 16px;border-radius:8px;font-size:14px;font-weight:500;box-shadow:0 0 12px rgba(37,99,235,0.3);opacity:0;transition:opacity .5s ease;z-index:9999;";
    }

    indicator.style.opacity = "1";
    setTimeout(() => {
      indicator.style.opacity = "0";
    }, 3000);

    // Optional Voice Feedback
    if (CONFIG.VOICE_ASSISTANT && CONFIG.VOICE_ASSISTANT.ENABLED && window.speechSynthesis) {
      const msg = new SpeechSynthesisUtterance("Sir, the latest headlines have been refreshed.");
      msg.lang = CONFIG.VOICE_ASSISTANT.DEFAULT_VOICE || "en-US";
      msg.rate = CONFIG.VOICE_ASSISTANT.SPEED || 1;
      window.speechSynthesis.speak(msg);
    }
  }
}

// ✅ Initialize newsFetcher globally
const newsFetcher = new NewsFetcher();

document.addEventListener("DOMContentLoaded", () => {
  console.log("📰 Initializing NewsFetcher...");
  newsFetcher.fetchNews(CONFIG.NEWS.DEFAULT_CATEGORY);
  newsFetcher.startAutoRefresh(CONFIG.NEWS.DEFAULT_CATEGORY);
});
