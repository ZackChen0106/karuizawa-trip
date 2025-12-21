/* ======================================================
   核心控制器（完整版穩定版）
   - Tab 切換（home / flight / itinerary / hotel / packing）
   - Hero 同步
   - 倒數天數
   - TODAY 對應每日行程
   - TODAY → 跳行程
   - 行程自動捲到今天 + Today 標示
   - 不破壞天氣模組
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ======================================================
     Tab 切換（完整頁面）
  ===================================================== */
  const tabs = document.querySelectorAll(".tabbar a");
  const pages = document.querySelectorAll(".page");

  function switchPage(target) {
    tabs.forEach(t => t.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));

    document
      .querySelector(`.tabbar a[data-tab="${target}"]`)
      ?.classList.add("active");

    document
      .querySelector(`.page[data-page="${target}"]`)
      ?.classList.add("active");

    document.body.dataset.page = target;
    syncHero();

    // 如果是行程頁，嘗試捲到今天
    if (target === "itinerary") {
      setTimeout(scrollToToday, 200);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();
      switchPage(tab.dataset.tab);
    });
  });

  /* ======================================================
     台北時區工具
  ===================================================== */
  function twMidnight() {
    const now = new Date();
    const tw = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Taipei" })
    );
    return new Date(tw.getFullYear(), tw.getMonth(), tw.getDate());
  }

  const START_DATE = "2026-02-21";

  function dayIndex() {
    return Math.floor(
      (twMidnight() - new Date(START_DATE)) / 86400000
    );
  }

  /* ======================================================
     倒數天數（恢復）
  ===================================================== */
  function updateCountdown() {
    const pillDay = document.getElementById("pillDay");
    if (!pillDay) return;

    const diff = Math.round(
      (new Date(START_DATE) - twMidnight()) / 86400000
    );

    pillDay.textContent =
      diff >= 0 ? `距離出發 ${diff} 天` : "旅程進行中";
  }

  /* ======================================================
     TODAY（對應每日行程）
  ===================================================== */
  function updateToday() {
    const main = document.getElementById("todayMain");
    const route = document.getElementById("todayRoute");
    const note = document.getElementById("todayNote");
    if (!main || !route || !note) return;

    const d = dayIndex();

    if (d < 0) {
      main.textContent = "出發前｜準備就緒";
      route.textContent = "確認機票、住宿與行李";
      note.textContent = "放慢腳步，期待旅程";
      return;
    }

    const map = [
      ["Day 1｜前往輕井澤", "成田 → 輕井澤", "早點休息"],
      ["Day 2｜輕井澤慢遊", "舊輕井澤・咖啡・Outlet", "走路多"],
      ["Day 3｜輕井澤 → 東京", "上午輕井澤｜下午東京", "移動日"],
      ["Day 4｜東京市區", "澀谷・表參道・代官山", "自由行程"],
      ["Day 5｜返程", "東京 → 成田 → 桃園", "別忘伴手禮"]
    ];

    const today = map[d] || ["旅程結束", "回憶整理中", "期待下次旅行"];
    main.textContent = today[0];
    route.textContent = today[1];
    note.textContent = today[2];
  }

  /* ======================================================
     Hero（恢復你原本邏輯）
  ===================================================== */
  function syncHero() {
    const hero = document.getElementById("hero");
    const title = document.getElementById("heroTitle");
    const sub = document.getElementById("heroSub");
    const loc = document.getElementById("pillLoc");
    if (!hero || !title || !sub || !loc) return;

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

  /* ======================================================
     TODAY → 行程（你已驗證 OK）
  ===================================================== */
  const todayCard = document.getElementById("todayCard");
  if (todayCard) {
    todayCard.style.cursor = "pointer";
    todayCard.addEventListener("click", () => {
      switchPage("itinerary");
    });
  }

  /* ======================================================
     行程頁：Today 標示 + 自動捲動
     （需行程卡有 data-day="0~4"）
  ===================================================== */
  function scrollToToday() {
    const d = dayIndex();

    document.querySelectorAll(".day-card").forEach(card => {
      card.classList.remove("today");
    });

    const target = document.querySelector(`.day-card[data-day="${d}"]`);
    if (!target) return;

    target.classList.add("today");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ======================================================
     初始化（恢復完整功能）
  ===================================================== */
  updateCountdown();
  updateToday();
  syncHero();
});
