// 📰 AI-NewsMod Render Engine (Final Clean Version)
async function renderNews(newsArray = []) {
  const container = document.getElementById("news-container");
  const countEl = document.getElementById("news-count");
  const lastUpdatedEl = document.getElementById("last-updated");

  if (!container) return console.error("❌ news-container not found.");

  container.innerHTML = "";

  if (!newsArray.length) {
    container.innerHTML = `<p class="no-news">⚠️ No news available. Please try again later.</p>`;
    if (countEl) countEl.textContent = "0";
    return;
  }

  newsArray.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = `news-card ${item.isBreaking ? "breaking" : item.isTrending ? "trending" : ""}`;
    card.innerHTML = `
      <div class="news-header">
        <img src="${item.image}" alt="news" class="news-image">
        <div>
          <h3 class="news-title">${item.title}</h3>
          <p class="news-summary">${item.summary || ""}</p>
          <div class="news-meta">
            <span>${item.source || "Unknown"}</span>
            <span>${item.readTime || "2 min read"}</span>
          </div>
        </div>
      </div>
      <div class="news-tags">
        ${(item.tags || []).map(t => `<span class="news-tag">${t}</span>`).join("")}
      </div>
      <a href="${item.url}" target="_blank" class="read-more">Read More</a>
    `;
    container.appendChild(card);
  });

  if (countEl) countEl.textContent = newsArray.length;
  if (lastUpdatedEl) lastUpdatedEl.textContent = new Date().toLocaleTimeString();

  console.log(`📰 Rendered ${newsArray.length} articles.`);
}
