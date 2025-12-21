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

/* ======================================================
   TODAY 對應每日行程 ＋ 點擊跳轉行程頁
====================================================== */

(function () {
  const START_DATE = "2026-02-21";

  function twMidnight() {
    const now = new Date();
    const tw = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
    return new Date(tw.getFullYear(), tw.getMonth(), tw.getDate());
  }

  function dayIndex() {
    const start = new Date(START_DATE);
    const diff = Math.round((twMidnight() - start) / 86400000);
    return diff; // 出發前為負數
  }

  const todayMain = document.getElementById("todayMain");
  const todayRoute = document.getElementById("todayRoute");
  const todayNote = document.getElementById("todayNote");

  function updateTodayByItinerary() {
    if (!todayMain || !todayRoute || !todayNote) return;

    const d = dayIndex();

    // 出發前
    if (d < 0) {
      todayMain.textContent = "出發前｜準備就緒";
      todayRoute.textContent = "確認機票、住宿與行李";
      todayNote.textContent = "放慢腳步，期待旅程";
      return;
    }

    // Day 對應表
    const map = {
      0: {
        main: "Day 1｜前往輕井澤",
        route: "成田 → 輕井澤",
        note: "抵達後簡單散步、早點休息"
      },
      1: {
        main: "Day 2｜輕井澤慢遊",
        route: "舊輕井澤・咖啡・Outlet",
        note: "走路多，記得穿好鞋"
      },
      2: {
        main: "Day 3｜輕井澤 → 東京",
        route: "上午輕井澤｜下午東京",
        note: "移動日，行李注意"
      },
      3: {
        main: "Day 4｜東京市區",
        route: "澀谷・表參道・代官山",
        note: "留點時間給臨時驚喜"
      },
      4: {
        main: "Day 5｜返程",
        route: "東京 → 成田 → 桃園",
        note: "別忘了伴手禮"
      }
    };

    const today = map[d] || {
      main: "旅程結束",
      route: "回憶整理中",
      note: "期待下一次旅行"
    };

    todayMain.textContent = today.main;
    todayRoute.textContent = today.route;
    todayNote.textContent = today.note;
  }

  /* 點 TODAY 卡片 → 切到行程頁 */
  function bindTodayClick() {
    const card = document.getElementById("todayCard");
    if (!card) return;

    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      const tab = document.querySelector('.tabbar a[data-tab="itinerary"]');
      tab?.click(); // 直接走你原本的 tab 切換流程
    });
  }

  /* 初始化 */
  updateTodayByItinerary();
  bindTodayClick();
})();

