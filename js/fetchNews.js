// 🌩️ AI NewsMod – Cloudflare Live Fetcher + Auto Refresh + Visual Indicator
class NewsFetcher {
  constructor() {
    this.baseUrl = "https://ai-newsmod-proxy.ak0077003.workers.dev/"; // ← Your Cloudflare Worker URL
    this.refreshInterval = 15 * 60 * 1000; // 15 minutes
  }

  async fetchAndRender(category = "technology", silent = false) {
    try {
      if (!silent) this.showLoading(true);

      const url = `${this.baseUrl}?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.articles || data.status !== "ok") throw new Error("Invalid API Response");

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
        sentiment: aiSummarizer.analyzeSentiment(a.content || a.description || ""),
        tags: aiSummarizer.generateTags(a.title || "", a.description || ""),
        isBreaking: Math.random() < 0.1,
        isTrending: Math.random() < 0.2
      }));

      console.log(`✅ Loaded ${processed.length} live articles`);
      await newsRenderer.renderNews(processed);

      if (!silent) {
        this.announceUpdate();
        this.showRefreshIndicator(); // 👈 Visual indicator
      }

    } catch (err) {
      console.error("❌ Fetch error:", err);
      const c = document.getElementById("news-container");
      if (c) c.innerHTML = `<p style="text-align:center;color:#888;">Failed to load live news.</p>`;
    } finally {
      if (!silent) this.showLoading(false);
    }
  }

  estimateReadTime(text) {
    const words = (text || "").split(/\s+/).length;
    return `${Math.max(1, Math.round(words / 200))} min read`;
  }

  showLoading(show) {
    const s = document.getElementById("loading-spinner");
    const c = document.getElementById("news-container");
    if (s && c) {
      s.classList.toggle("hidden", !show);
      c.classList.toggle("hidden", show);
    }
  }

  // 🔊 Jarvis-style voice
  announceUpdate() {
    const synth = window.speechSynthesis;
    const msg = new SpeechSynthesisUtterance("Sir, the latest headlines have been refreshed.");
    msg.lang = localStorage.getItem("jarvis_language") || "en-US";
    synth.speak(msg);

    if (typeof jarvisHUD !== "undefined") {
      jarvisHUD.logJarvis("🕒 Headlines auto-refreshed successfully.");
    }
  }

  // ✨ Animated visual indicator
  showRefreshIndicator() {
    let indicator = document.getElementById("auto-refresh-indicator");
    if (!indicator) {
      indicator = document.createElement("div");
      indicator.id = "auto-refresh-indicator";
      indicator.style.cssText = `
        position:fixed;
        bottom:20px;
        right:25px;
        background:linear-gradient(135deg,#2563eb,#9333ea);
        color:white;
        padding:8px 16px;
        border-radius:8px;
        font-size:14px;
        font-weight:500;
        box-shadow:0 0 12px rgba(0,0,0,0.3);
        opacity:0;
        transition:opacity 0.5s ease;
        z-index:99999;
      `;
      document.body.appendChild(indicator);
    }

    indicator.textContent = "🕒 Headlines refreshed just now";
    indicator.style.opacity = "1";

    setTimeout(() => {
      indicator.style.opacity = "0";
    }, 3000);
  }

  // 🔄 Auto refresh loop
  startAutoRefresh(category = "technology") {
    console.log("🔄 Auto-refresh every 15 min enabled");
    setInterval(() => {
      console.log("🕑 Auto-fetch triggered (silent)");
      this.fetchAndRender(category, true);
      this.showRefreshIndicator(); // show small popup even on silent refresh
    }, this.refreshInterval);
  }
}

// 🚀 Initialize on page load
const newsFetcher = new NewsFetcher();
document.addEventListener("DOMContentLoaded", () => {
  newsFetcher.fetchAndRender("technology");
  newsFetcher.startAutoRefresh("technology");
});
