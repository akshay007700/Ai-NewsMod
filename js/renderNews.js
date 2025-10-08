// 🌩️ AI NewsMod - Cloudflare Live News Fetcher
class NewsFetcher {
  constructor() {
    // 🔗 Cloudflare Worker endpoint (replace if different)
    this.baseUrl = "https://ai-newsmod-proxy.ak0077003.workers.dev/";
  }

  async fetchAndRender(category = "technology") {
    try {
      this.showLoading(true);

      // Fetch live news via Cloudflare proxy
      const url = `${this.baseUrl}?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.articles || data.status !== "ok") {
        throw new Error("Invalid API Response");
      }

      // Convert to internal format expected by renderNews.js
      const processedNews = data.articles.map((a, i) => ({
        id: `news-${i}`,
        title: a.title || "Untitled",
        summary: a.description || "",
        content: a.content || "",
        category: category.toLowerCase(),
        source: a.source?.name || "Unknown",
        author: a.author || "AI Reporter",
        image: a.urlToImage || "https://via.placeholder.com/400x250?text=No+Image",
        url: a.url,
        publishedAt: a.publishedAt,
        readTime: this.estimateReadTime(a.content),
        sentiment: aiSummarizer.analyzeSentiment(a.content || a.description || ""),
        tags: aiSummarizer.generateTags(a.title || "", a.description || ""),
        isBreaking: Math.random() < 0.1, // randomize highlights
        isTrending: Math.random() < 0.2
      }));

      console.log(`✅ Loaded ${processedNews.length} live news articles.`);
      await newsRenderer.renderNews(processedNews); // 👈 integrated call

    } catch (err) {
      console.error("❌ Fetch error:", err);
      const container = document.getElementById("news-container");
      if (container) {
        container.innerHTML = `<p style="text-align:center;color:#888;">Failed to load live news.</p>`;
      }
    } finally {
      this.showLoading(false);
    }
  }

  estimateReadTime(text) {
    const words = (text || "").split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  }

  showLoading(show) {
    const spinner = document.getElementById("loading-spinner");
    const container = document.getElementById("news-container");
    if (spinner && container) {
      spinner.classList.toggle("hidden", !show);
      container.classList.toggle("hidden", show);
    }
  }
}

// Initialize fetcher
const newsFetcher = new NewsFetcher();

// Auto-load tech news on page ready
document.addEventListener("DOMContentLoaded", () => {
  newsFetcher.fetchAndRender("technology");
});
