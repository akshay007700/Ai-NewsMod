// 🌩️ AI-NewsMod News Fetcher
class NewsFetcher {
  constructor() {
    if (typeof CONFIG === 'undefined') {
      throw new Error('CONFIG not loaded');
    }
    this.baseUrl = CONFIG.NEWS.SOURCES.NEWSAPI.BASE_URL;
    this.defaultCategory = CONFIG.NEWS.DEFAULT_CATEGORY;
    this.refreshInterval = CONFIG.APP.AUTO_REFRESH_INTERVAL || 900000;
    this.currentNews = [];
  }

  async fetchNews(category = this.defaultCategory, silent = false) {
    try {
      if (!silent) this.showLoading(true);

      const url = `${this.baseUrl}?category=${category}`;
      console.log('🌐 Fetching from:', url);
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();

      // Handle different response formats
      let articles = [];
      if (data.articles && Array.isArray(data.articles)) {
        articles = data.articles;
      } else if (Array.isArray(data)) {
        articles = data;
      } else {
        throw new Error("Invalid API response format");
      }

      const processed = articles.map((a, i) => ({
        id: `news-${Date.now()}-${i}`,
        title: a.title || "Untitled",
        summary: a.description || a.summary || "",
        source: a.source?.name || a.source || "Unknown",
        image: a.urlToImage || a.image || "https://via.placeholder.com/400x250/374151/FFFFFF?text=No+Image",
        url: a.url || "#",
        readTime: this.calcReadTime(a.content || a.description),
        content: a.content || a.description || "",
        isBreaking: Math.random() > 0.8
      }));

      this.currentNews = processed;
      await this.renderNews(processed);
      this.updateStats(processed.length);

      return processed;

    } catch (err) {
      console.warn("⚠️ Fetch error:", err.message);
      // Fallback to sample data
      const sampleNews = this.getSampleNews();
      this.currentNews = sampleNews;
      await this.renderNews(sampleNews);
      this.updateStats(sampleNews.length);
      return sampleNews;
    } finally {
      if (!silent) this.showLoading(false);
    }
  }

  async renderNews(newsArray) {
    const container = document.getElementById("news-container");
    if (!container) {
      console.error("❌ news-container not found");
      return;
    }

    container.innerHTML = "";

    if (!newsArray.length) {
      container.innerHTML = `<p class="no-news">⚠️ No news available. Please try again later.</p>`;
      return;
    }

    newsArray.forEach((item) => {
      const card = document.createElement("div");
      card.className = `news-card ${item.isBreaking ? 'breaking' : ''}`;
      card.innerHTML = `
        ${item.isBreaking ? '<div class="breaking-badge">BREAKING</div>' : ''}
        <div class="news-header">
          <img src="${item.image}" alt="news" class="news-image" onerror="this.src='https://via.placeholder.com/400x250/374151/FFFFFF?text=No+Image'">
          <div class="news-content">
            <h3 class="news-title">${item.title}</h3>
            <p class="news-summary">${item.summary || "No summary available."}</p>
            <div class="news-meta">
              <span class="source">${item.source}</span>
              <span class="read-time">${item.readTime}</span>
            </div>
          </div>
        </div>
        <a href="${item.url}" target="_blank" class="read-more">Read More →</a>
      `;
      container.appendChild(card);
    });

    console.log(`📰 Rendered ${newsArray.length} articles.`);
  }

  getSampleNews() {
    return [
      {
        id: `sample-${Date.now()}-1`,
        title: "AI Technology Advances Rapidly in 2024",
        summary: "New breakthroughs in artificial intelligence are transforming industries worldwide with unprecedented speed.",
        source: "Tech News",
        image: "https://via.placeholder.com/400x250/2563eb/FFFFFF?text=AI+News",
        url: "#",
        readTime: "3 min read",
        content: "Detailed content about AI advancements...",
        isBreaking: true
      },
      {
        id: `sample-${Date.now()}-2`,
        title: "Global Markets Show Positive Trends",
        summary: "Economic indicators suggest strong growth in technology and renewable energy sectors.",
        source: "Business Daily",
        image: "https://via.placeholder.com/400x250/10b981/FFFFFF?text=Business",
        url: "#",
        readTime: "2 min read",
        content: "Market analysis and trends...",
        isBreaking: false
      }
    ];
  }

  showLoading(show) {
    const spinner = document.getElementById("loading-spinner");
    const container = document.getElementById("news-container");
    if (spinner) spinner.style.display = show ? "block" : "none";
    if (container) container.style.display = show ? "none" : "block";
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

  // Helper methods for other features
  getCurrentNews() {
    return this.currentNews;
  }

  getBreakingNews() {
    return this.currentNews.filter(item => item.isBreaking);
  }

  searchNews(query) {
    const lowerQuery = query.toLowerCase();
    return this.currentNews.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.summary.toLowerCase().includes(lowerQuery)
    );
  }
}

// Initialize only after DOM is ready
let newsFetcher;
document.addEventListener("DOMContentLoaded", () => {
  newsFetcher = new NewsFetcher();
  window.newsFetcher = newsFetcher;
  
  // Initial load
  if (typeof CONFIG !== 'undefined') {
    newsFetcher.fetchNews(CONFIG.NEWS.DEFAULT_CATEGORY);
    newsFetcher.startAutoRefresh(CONFIG.NEWS.DEFAULT_CATEGORY);
  }
});