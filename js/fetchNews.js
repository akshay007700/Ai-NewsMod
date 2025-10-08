// 🧠 Real News Fetcher (AI NewsMod Live)
class NewsFetcher {
  constructor() {
    this.apiKey = "1f82f995327d49449bcf1f7709944d87"; // 🔑 Replace with your real key
    this.baseUrl = "https://newsapi.org/v2/top-headlines";
  }

  async fetchNews(category = 'technology') {
    try {
      this.showLoading(true);
      const url = `${this.baseUrl}?category=${category}&language=en&pageSize=10&apiKey=${this.apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== "ok") throw new Error("API Error");

      const processed = data.articles.map((a, i) => ({
        id: `news-${i}`,
        title: a.title,
        summary: a.description || "",
        content: a.content || "",
        category: category,
        source: a.source.name,
        author: a.author || "Unknown",
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
      console.error("❌ Error fetching real news:", error);
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

  getFallbackNews(category) {
    return [
      { title: "Fallback News Item", summary: "NewsAPI limit reached.", content: "Please try later." }
    ];
  }
}

const newsFetcher = new NewsFetcher();
