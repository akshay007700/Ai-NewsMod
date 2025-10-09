// 🌩️ AI-NewsMod News Fetcher
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
        source: a.source?.name || "Unknown",
        image: a.urlToImage || "https://via.placeholder.com/400x250?text=No+Image",
        url: a.url,
        readTime: this.calcReadTime(a.content)
      }));

      await renderNews(processed);
      this.updateStats(processed.length);

    } catch (err) {
      console.warn("⚠️ Fetch error:", err.message);
      const container = document.getElementById("news-container");
      if (container)
        container.innerHTML = `<p style="text-align:center;color:#aaa;">⚠️ News unavailable.</p>`;
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
