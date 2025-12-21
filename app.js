/* ======================================================
   核心控制器（唯一 JS）
   - Tab 切換
   - Hero / TODAY / 倒數
   - 天氣（示意）
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Tab 切換 ---------- */
  const tabs = document.querySelectorAll(".tabbar a");
  const pages = document.querySelectorAll(".page");

  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove("active"));
      pages.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      document.querySelector(`.page[data-page="${target}"]`)?.classList.add("active");

      document.body.dataset.page = target;
      syncHero();
    });
  });

  /* ---------- 時區工具 ---------- */
  function twMidnight() {
    const now = new Date();
    const tw = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
    return new Date(tw.getFullYear(), tw.getMonth(), tw.getDate());
  }

  const START_DATE = "2026-02-21";

  /* ---------- 倒數 ---------- */
  function updateCountdown() {
    const el = document.getElementById("pillDay");
    if (!el) return;
    const diff = Math.round(
      (new Date(START_DATE) - twMidnight()) / 86400000
    );
    el.textContent = diff >= 0 ? `距離出發 ${diff} 天` : "旅程進行中";
  }

  /* ---------- TODAY ---------- */
  function updateToday() {
    const main = document.getElementById("todayMain");
    const route = document.getElementById("todayRoute");
    const note = document.getElementById("todayNote");
    if (!main) return;

    const d = Math.round(
      (twMidnight() - new Date(START_DATE)) / 86400000
    );

    if (d < 0) {
      main.textContent = "出發前｜準備就緒";
      route.textContent = "例：星野 → 舊輕井澤";
      note.textContent = "備註：走路多，記得穿好鞋";
    } else {
      main.textContent = `旅程中｜Day ${d + 1}`;
      route.textContent = "依行程前進";
      note.textContent = "保持彈性，好好玩";
    }
  }

  /* ---------- Hero ---------- */
  function syncHero() {
    const hero = document.getElementById("hero");
    const title = document.getElementById("heroTitle");
    const sub = document.getElementById("heroSub");
    const loc = document.getElementById("pillLoc");

    if (document.body.dataset.page === "itinerary") {
      hero.style.backgroundImage = "url('./assets/hero-tokyo.jpg')";
      title.textContent = "2026 初春 · 東京";
      sub.textContent = "城市節奏，慢慢探索";
      loc.textContent = "📍 東京";
    } else {
      hero.style.backgroundImage = "url('./assets/hero-karuizawa.jpg')";
      title.textContent = "2026 初春 · 輕井澤";
      sub.textContent = "慢慢走，把時間留給彼此";
      loc.textContent = "📍 輕井澤";
    }
  }

  /* ---------- 天氣（示意，可接 API） ---------- */
  function updateWeather() {
    const hint = document.getElementById("weatherHint");
    const info = document.getElementById("weatherInfo");
    if (!hint || !info) return;

    hint.textContent = "已更新";
    info.textContent = "☀️ 3° / -5°（示意）";
  }

  /* ---------- 初始化 ---------- */
  updateCountdown();
  updateToday();
  syncHero();
  updateWeather();
});
