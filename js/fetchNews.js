class NewsFetcher {
  constructor() {
    // 🌩️ Cloudflare Proxy endpoint
    this.baseUrl = "https://ai-newsmod-proxy.ak0077003.workers.dev/";
  }

  async fetchNews(category = "technology") {
    try {
      this.showLoading(true);
      const url = `${this.baseUrl}?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== "ok") throw new Error("Invalid response");

      const processed = data.articles.map((a, i) => ({
        id: `news-${i}`,
        title: a.title,
        summary: a.description || "",
        content: a.content || "",
        category,
        source: a.source?.name || "Unknown",
        author: a.author || "AI Reporter",
        image: a.urlToImage || "https://via.placeholder.com/400x250?text=No+Image",
        url: a.url,
        publishedAt: a.publishedAt,
        readTime: "2 min",
      }));

      this.updateLastUpdated();
      return processed;
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      return this.getFallbackNews();
    } finally {
      this.showLoading(false);
    }
  }

  showLoading(show) {
    const spinner = document.getElementById("loading-spinner");
    const container = document.getElementById("news-container");
    if (spinner && container) {
      spinner.classList.toggle("hidden", !show);
      container.classList.toggle("hidden", show);
    }
  }

  updateLastUpdated() {
    const el = document.getElementById("last-updated");
    if (el) el.textContent = new Date().toLocaleTimeString();
  }

  getFallbackNews() {
    return [
      { title: "⚠️ No live news available", summary: "Please try again later." },
    ];
  }
}

const newsFetcher = new NewsFetcher();
