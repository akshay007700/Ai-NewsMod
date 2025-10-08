class NewsFetcher {
  constructor() {
    this.apiKey = "1f82f995327d49449bcf1f7709944d87"; // 🔑 replace with your real key
    this.baseUrl = "https://newsapi.org/v2/top-headlines";
  }

  async fetchNews(category = "technology") {
    try {
      this.showLoading(true);

      // ✅ Proper encoding for GitHub + Proxy
      const targetURL = `${this.baseUrl}?category=${category}&language=en&pageSize=10&apiKey=${this.apiKey}`;
      const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(targetURL)}`;

      const res = await fetch(proxy);
      const wrapped = await res.json();
      const data = JSON.parse(wrapped.contents);

      if (data.status !== "ok") throw new Error(data.message);

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
        tags: aiSummarizer.generateTags(a.title, a.content),
        sentiment: aiSummarizer.analyzeSentiment(a.content)
      }));

      this.updateLastUpdated();
      return processed;
    } catch (error) {
      console.error("❌ Error fetching news:", error);
      return this.getFallbackNews(category);
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
      { title: "⚠️ No live news available", summary: "CORS or API limit reached.", content: "Please try again later." }
    ];
  }
}

const newsFetcher = new NewsFetcher();
