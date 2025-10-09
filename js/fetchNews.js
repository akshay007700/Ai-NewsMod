// 🌩️ AI-NewsMod News Fetcher (Cloudflare + Offline Support)
class NewsFetcher {
  constructor() {
    this.baseUrl = CONFIG.NEWS.SOURCES.NEWSAPI.BASE_URL;
    this.defaultCategory = CONFIG.NEWS.DEFAULT_CATEGORY;
    this.refreshInterval = CONFIG.APP.AUTO_REFRESH_INTERVAL || 900000;
  }

  async fetchNews(category = this.defaultCategory, silent = false) {
    try {
      if (!silent) this.showLoading(true);

      const url = `${this.baseUrl}?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.articles || data.status !== "ok") throw new Error("Invalid API response");

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
        readTime: this.calcReadTime(a.content),
        isBreaking: Math.random() < 0.1,
        isTrending: Math.random() < 0.2
      }));

      localStorage.setItem("cachedNews", JSON.stringify(processed));

      await renderNews(processed);
      this.updateStats(processed.length);

    } catch (err) {
      console.warn("⚠️ Fetch error:", err.message);
      const cached = localStorage.getItem("cachedNews");
      if (cached) {
        const offline = JSON.parse(cached);
        console.log("📦 Loaded cached news");
        await renderNews(offline);
        this.updateStats(offline.length);
      } else {
        const c = document.getElementById("news-container");
        if (c) c.innerHTML = `<p style="text-align:center;">⚠️ Offline. No cached news.</p>`;
      }
    } finally {
      if (!silent) this.showLoading(false);
    }
  }

  showLoading(show) {
    const s = document.getElementById("loading-spinner");
    const c = document.getElementById("news-container");
    if (s && c) {
      s.classList.toggle("hidden", !show);
      c.classList.toggle("hidden", show);
    }
  }

  updateStats(count) {
    const countEl = document.getElementById("news-count");
    const lastUpdatedEl = document.getElementById("last-updated");
    if (countEl) countEl.textContent = count;
    if (lastUpdatedEl) lastUpdatedEl.textContent = new Date().toLocaleTimeString();
  }

  calcReadTime(text) {
    const words = (text || "").split(/\s+/).length;
    return `${Math.max(1, Math.round(words / 200))} min read`;
  }

  startAutoRefresh(category = this.defaultCategory) {
    console.log("🔄 Auto refresh enabled");
    setInterval(() => {
      this.fetchNews(category, true);
    }, this.refreshInterval);
  }
}

const newsFetcher = new NewsFetcher();

document.addEventListener("DOMContentLoaded", () => {
  newsFetcher.fetchNews(CONFIG.NEWS.DEFAULT_CATEGORY);
  newsFetcher.startAutoRefresh(CONFIG.NEWS.DEFAULT_CATEGORY);
});
