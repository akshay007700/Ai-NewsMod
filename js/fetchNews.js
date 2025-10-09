// 🌩️ AI NewsMod - Cloudflare Integrated News Fetcher with Offline Fallback
class NewsFetcher {
  constructor() {
    this.baseUrl = CONFIG.NEWS.SOURCES.NEWSAPI.BASE_URL;
    this.defaultCategory = CONFIG.NEWS.DEFAULT_CATEGORY;
    this.refreshInterval = CONFIG.APP.AUTO_REFRESH_INTERVAL || 900000; // 15 min
  }

  // 🧠 Fetch news and render
  async fetchNews(category = this.defaultCategory, silent = false) {
    try {
      if (!silent) this.showLoading(true);

      const url = `${this.baseUrl}?category=${category}`;
      console.log("🔍 Fetching from:", url);

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
        publishedAt: a.publishedAt,
        readTime: this.estimateReadTime(a.content),
        sentiment: aiSummarizer?.analyzeSentiment
          ? aiSummarizer.analyzeSentiment(a.content || a.description || "")
          : "neutral",
        tags: aiSummarizer?.generateTags
          ? aiSummarizer.generateTags(a.title || "", a.description || "")
          : [],
        isBreaking: Math.random() < 0.1,
        isTrending: Math.random() < 0.2
      }));

      console.log(`✅ Loaded ${processed.length} live articles.`);
      await renderNews(processed);

      // 🗃️ Cache news locally for offline use
      localStorage.setItem("cachedNews", JSON.stringify({
        category,
        timestamp: Date.now(),
        articles: processed
      }));

      this.updateStats(processed.length);

    } catch (err) {
      console.warn("⚠️ Fetch error:", err.message);

      // 🗃️ Load cached news if available
      const cached = localStorage.getItem("cachedNews");
      if (cached) {
        const parsed = JSON.parse(cached);
        console.log("📦 Loaded cached news from localStorage.");
        await renderNews(parsed.articles);
        this.updateStats(parsed.articles.length);

        // Voice feedback if offline
        if (CONFIG.VOICE_ASSISTANT.ENABLED) {
          const msg = new SpeechSynthesisUtterance(
            "Sir, we are currently offline. Showing your last saved headlines."
          );
          msg.lang = CONFIG.VOICE_ASSISTANT.DEFAULT_VOICE || "en-US";
          window.speechSynthesis.speak(msg);
        }
      } else {
        const c = document.getElementById("news-container");
        if (c)
          c.innerHTML = `<p style="text-align:center;color:#888;">⚠️ You're offline and no cached news found.</p>`;
      }
    } finally {
      if (!silent) this.showLoading(false);
    }
  }

  // 🧮 Estimate read time
  estimateReadTime(text) {
    const words = (text || "").split(/\s+/).length;
    return `${Math.max(1, Math.round(words / 200))} min read`;
  }

  // 🌀 Show loading spinner
  showLoading(show) {
    const s = document.getElementById("loading-spinner");
    const c = document.getElementById("news-container");
    if (s && c) {
      s.classList.toggle("hidden", !show);
      c.classList.toggle("hidden", show);
    }
  }

  // 📊 Update stats bar
  updateStats(count) {
    const countEl = document.getElementById("news-count");
    const lastUpdatedEl = document.getElementById("last-updated");
    if (countEl) countEl.textContent = count;
    if (lastUpdatedEl)
      lastUpdatedEl.textContent = new Date().toLocaleTimeString();
  }

  // 🔄 Auto-refresh
  startAutoRefresh(category = this.defaultCategory) {
    console.log("🔄 Auto-refresh enabled every 15 minutes");
    setInterval(() => {
      console.log("🕑 Auto-refresh triggered");
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
  }
}

// 🚀 Initialize
const newsFetcher = new NewsFetcher();
document.addEventListener("DOMContentLoaded", () => {
  console.log("📰 Initializing News Fetcher with Offline Support...");
  newsFetcher.fetchNews(CONFIG.NEWS.DEFAULT_CATEGORY);
  newsFetcher.startAutoRefresh(CONFIG.NEWS.DEFAULT_CATEGORY);
});
