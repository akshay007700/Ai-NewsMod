class NewsFetcher {
  constructor() {
    this.apiKey = "db3675082b0baa43b845beb0565e6762";   // ←key 
    this.baseUrl = "https://gnews.io/api/v4/top-headlines";
  }

  async fetchNews(topic = "technology") {
    try {
      this.showLoading(true);
      const url = `${this.baseUrl}?topic=${topic}&lang=en&max=10&token=${this.apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      return data.articles.map((a, i) => ({
        id: `news-${i}`,
        title: a.title,
        summary: a.description || "",
        content: a.content || "",
        category: topic,
        source: a.source.name,
        author: a.author || "Reporter",
        image: a.image || "https://via.placeholder.com/400x250?text=No+Image",
        url: a.url,
        publishedAt: a.publishedAt,
        readTime: "2 min"
      }));
    } catch (err) {
      console.error("❌ GNews error:", err);
      return this.getFallbackNews();
    } finally {
      this.showLoading(false);
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

  getFallbackNews() {
    return [
      { title: "⚠️ No live news available", summary: "Please try again later." }
    ];
  }
}
const newsFetcher = new NewsFetcher();
