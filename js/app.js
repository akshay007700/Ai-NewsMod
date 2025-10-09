// 🚀 AI-NewsMod App Controller (Final Safe Version)
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 AI NewsMod Starting...");

  try {
    if (typeof CONFIG === "undefined") throw new Error("Config not loaded.");

    if (typeof newsFetcher !== "undefined") {
      await newsFetcher.fetchNews(CONFIG.NEWS.DEFAULT_CATEGORY);
      newsFetcher.startAutoRefresh(CONFIG.NEWS.DEFAULT_CATEGORY);
    }

    if (typeof jarvisHUD !== "undefined") {
      jarvisHUD.logJarvis("Jarvis online and ready, Sir.");
    }

    if (typeof applyUniversalTheme === "function") {
      applyUniversalTheme(CONFIG.APP.THEME.DEFAULT);
    }

  } catch (err) {
    console.error("❌ Fatal Error Initializing:", err.message);
    const el = document.createElement("div");
    el.innerHTML = `<div style="
      position:fixed;top:0;left:0;width:100%;height:100%;display:flex;
      align-items:center;justify-content:center;background:black;color:white;
      font-family:Segoe UI;text-align:center;z-index:9999;">
      <div>
        <h2>⚠️ Critical Error</h2>
        <p>${err.message}</p>
        <button onclick="location.reload()" style="
          background:linear-gradient(135deg,#2563eb,#9333ea);
          color:white;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;">
          Reload
        </button>
      </div>
    </div>`;
    document.body.appendChild(el);
  }
});
