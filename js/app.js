// 🚀 AI-NewsMod App Controller
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 AI NewsMod Starting...");

  try {
    if (typeof CONFIG === "undefined") throw new Error("Config not loaded.");

    await newsFetcher.fetchNews(CONFIG.NEWS.DEFAULT_CATEGORY);
    newsFetcher.startAutoRefresh(CONFIG.NEWS.DEFAULT_CATEGORY);

    if (typeof applyUniversalTheme === "function") {
      applyUniversalTheme(CONFIG.APP.THEME.DEFAULT);
      console.log(`🌓 Theme Applied: ${CONFIG.APP.THEME.DEFAULT}`);
    }

  } catch (err) {
    console.error("❌ Fatal Error Initializing AI NewsMod:", err.message);
    document.body.innerHTML += `<div style="position:fixed;top:0;left:0;width:100%;
      height:100%;background:#000;color:#fff;display:flex;flex-direction:column;
      align-items:center;justify-content:center;z-index:9999;">
      <h2>⚠️ ${err.message}</h2>
      <button onclick="location.reload()" 
        style="padding:10px 20px;border:none;border-radius:8px;
        background:linear-gradient(135deg,#2563eb,#9333ea);color:white;cursor:pointer;">
        Reload
      </button></div>`;
  }
});
