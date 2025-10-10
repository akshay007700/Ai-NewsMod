// 🤖 AI-NewsMod AI Expander System (Multi-Source + Long Summary Generator)

class AIExpander {
  constructor() {
    this.apiBase = "https://your-worker-name.workers.dev/openai"; // via Cloudflare Worker
    this.cache = JSON.parse(localStorage.getItem("ai_summaries") || "{}");
    console.log("🧠 AI Expander Ready.");
  }

  // 🔹 Generate Long Summary for a single article
  async expandArticle(article) {
    try {
      if (!article || !article.title) return null;

      // Check cache first
      if (this.cache[article.title]) {
        console.log("📦 Loaded AI summary from cache:", article.title);
        return this.cache[article.title];
      }

      const prompt = `
        Write a detailed, human-style article (~400 to 500 words) based on the headline and description below.
        Headline: "${article.title}"
        Description: "${article.summary || article.description || ''}"
        Focus on facts, background, impact, and expert analysis.
      `;

      const response = await fetch(`${this.apiBase}?e=/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 800
        })
      });

      const data = await response.json();
      const summary = data?.choices?.[0]?.message?.content?.trim() || "";

      // Cache it
      this.cache[article.title] = summary;
      localStorage.setItem("ai_summaries", JSON.stringify(this.cache));

      console.log(`✅ AI expanded: ${article.title}`);
      return summary;
    } catch (err) {
      console.error("⚠️ AI expansion failed:", err.message);
      return "";
    }
  }

  // 🔹 Expand all visible articles in background
  async expandAll(newsArray) {
    if (!Array.isArray(newsArray)) return;

    console.log("🧩 Expanding news articles via AI...");
    for (const article of newsArray) {
      if (!article.aiSummary) {
        const summary = await this.expandArticle(article);
        article.aiSummary = summary;
      }
    }

    console.log("✅ All visible news expanded.");
    renderNews(newsArray);
  }
}

// ✅ Global Access
const aiExpander = new AIExpander();
