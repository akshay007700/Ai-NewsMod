// 🚀 AI NewsMod Main App Controller (Error-Safe Version)
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 AI NewsMod Starting...");

  try {
    // 🧠 Step 1: Initialize Config
    if (typeof CONFIG === "undefined") throw new Error("Config not loaded.");
    console.log(`🧩 Config loaded: ${CONFIG.APP.NAME} v${CONFIG.APP.VERSION}`);

    // 📰 Step 2: Start News Fetcher
    if (typeof newsFetcher !== "undefined") {
      await newsFetcher.fetchNews(CONFIG.NEWS.DEFAULT_CATEGORY);
      newsFetcher.startAutoRefresh(CONFIG.NEWS.DEFAULT_CATEGORY);
    } else {
      console.warn("⚠️ NewsFetcher not found, skipping news load...");
    }

    // 🧩 Step 3: Advanced Features (if available)
    try {
      if (typeof AdvancedFeatures !== "undefined") {
        console.log("⚙️ Loading Advanced Features...");
        new AdvancedFeatures();
      } else {
        console.log("ℹ️ AdvancedFeatures module not found (skipped).");
      }
    } catch (advErr) {
      console.warn("⚠️ AdvancedFeatures Error:", advErr.message);
    }

    // 🗣️ Step 4: Jarvis Command Center
    try {
      if (typeof jarvisHUD !== "undefined") {
        jarvisHUD.logJarvis("Jarvis online and fully operational, Sir.");
      } else {
        console.warn("ℹ️ Jarvis HUD not found (might be disabled).");
      }
    } catch (hudErr) {
      console.warn("⚠️ Jarvis HUD Error:", hudErr.message);
    }

    // 🌗 Step 5: Apply theme safely
    try {
      if (typeof applyUniversalTheme === "function") {
        applyUniversalTheme(CONFIG.APP.THEME.DEFAULT);
        console.log(`🌓 Theme Applied: ${CONFIG.APP.THEME.DEFAULT}`);
      } else {
        console.warn("Theme function missing, skipped...");
      }
    } catch (themeErr) {
      console.warn("⚠️ Theme Apply Error:", themeErr.message);
    }

    // 🧩 Step 6: AI Assistant Boot
    try {
      if (typeof aiAssistant !== "undefined" && aiAssistant.init) {
        await aiAssistant.init();
        console.log("🤖 AI Assistant Ready.");
      } else {
        console.log("ℹ️ AI Assistant module not found.");
      }
    } catch (aiErr) {
      console.warn("⚠️ AI Assistant Error:", aiErr.message);
    }

  } catch (mainErr) {
    console.error("❌ Fatal Error Initializing AI NewsMod:", mainErr.message);
    displayCriticalError(mainErr.message);
  }
});

// 🧱 Global Fallback Error Display
function displayCriticalError(msg) {
  const el = document.createElement("div");
  el.innerHTML = `
    <div style="
      position:fixed;top:0;left:0;width:100%;height:100%;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      background:rgba(0,0,0,0.9);color:white;z-index:999999;
      font-family:Segoe UI,system-ui,sans-serif;text-align:center;padding:20px;">
      <h2 style="color:#f87171;">⚠️ Critical Error</h2>
      <p>${msg}</p>
      <p style="color:#9ca3af;">Check console for details or try reloading.</p>
      <button onclick="location.reload()" style="
        background:linear-gradient(135deg,#2563eb,#9333ea);
        color:white;border:none;padding:10px 20px;border-radius:8px;
        cursor:pointer;margin-top:1rem;">Reload</button>
    </div>`;
  document.body.appendChild(el);
}
