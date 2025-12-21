document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Tab 切換 ---------- */
  const tabs = document.querySelectorAll(".tabbar a");
  const pages = document.querySelectorAll(".page");

  function switchPage(target) {
    tabs.forEach(t => t.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));

    document.querySelector(`.tabbar a[data-tab="${target}"]`)?.classList.add("active");
    document.querySelector(`.page[data-page="${target}"]`)?.classList.add("active");

    document.body.dataset.page = target;
    syncHero();
    updateWeatherByDay();

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

  /* ---------- 台北時間 ---------- */
  function twMidnight() {
    const now = new Date();
    const tw = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
    return new Date(tw.getFullYear(), tw.getMonth(), tw.getDate());
  }

  const START_DATE = "2026-02-21";

  function dayIndex() {
    return Math.floor((twMidnight() - new Date(START_DATE)) / 86400000);
  }

  /* ---------- 倒數 ---------- */
  function updateCountdown() {
    const pillDay = document.getElementById("pillDay");
    if (!pillDay) return;

    const diff = Math.round((new Date(START_DATE) - twMidnight()) / 86400000);
    pillDay.textContent = diff >= 0 ? `距離出發 ${diff} 天` : "旅程進行中";
  }

  /* ---------- TODAY ---------- */
  function updateToday() {
    const main = document.getElementById("todayMain");
    const route = document.getElementById("todayRoute");
    const note = document.getElementById("todayNote");
    if (!main) return;

    const d = dayIndex();
    if (d < 0) {
      main.textContent = "出發前｜準備就緒";
      route.textContent = "確認機票、住宿與行李";
      note.textContent = "放慢腳步，期待旅程";
      return;
    }

    const map = [
      ["Day 1｜前往輕井澤", "成田 → 輕井澤", "早點休息"],
      ["Day 2｜輕井澤慢遊", "舊輕井澤・Outlet", "走路多"],
      ["Day 3｜前往東京", "上午輕井澤｜下午東京", "移動日"],
      ["Day 4｜東京市區", "澀谷・表參道", "自由行程"],
      ["Day 5｜返程", "東京 → 桃園", "別忘伴手禮"]
    ];

    const today = map[d] || ["旅程結束", "回憶整理中", "期待下次旅行"];
    main.textContent = today[0];
    route.textContent = today[1];
    note.textContent = today[2];
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

  /* ---------- TODAY → 行程 ---------- */
  document.getElementById("todayCard")?.addEventListener("click", () => {
    switchPage("itinerary");
  });

  /* ---------- 行程捲動 ---------- */
  function scrollToToday() {
    const d = dayIndex();
    document.querySelectorAll(".day-card").forEach(c => c.classList.remove("today"));

    const target = document.querySelector(`.day-card[data-day="${d}"]`);
    if (!target) return;

    target.classList.add("today");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- 天氣：依 Day 預設 + Emoji ---------- */
  const WEATHER_BY_DAY = [
    { city: "輕井澤", emoji: "☁️", desc: "多雲", temp: 6, hi: 9, lo: 1 },
    { city: "輕井澤", emoji: "🌤", desc: "晴時多雲", temp: 8, hi: 11, lo: 2 },
    { city: "東京",   emoji: "☁️", desc: "陰天", temp: 12, hi: 15, lo: 8 },
    { city: "東京",   emoji: "☀️", desc: "晴朗", temp: 14, hi: 17, lo: 9 },
    { city: "東京",   emoji: "☁️", desc: "多雲", temp: 13, hi: 16, lo: 8 }
  ];

  function updateWeatherByDay() {
    const cityEl = document.getElementById("weatherCity");
    const descEl = document.getElementById("weatherDesc");
    const tempEl = document.getElementById("weatherTemp");
    const rangeEl = document.getElementById("weatherRange");
    if (!cityEl) return;

    const d = Math.max(0, Math.min(dayIndex(), WEATHER_BY_DAY.length - 1));
    const w = WEATHER_BY_DAY[d];

    cityEl.textContent = w.city;
    descEl.textContent = `${w.emoji} ${w.desc}`;
    tempEl.textContent = `${w.temp}°`;
    rangeEl.textContent = `最高 ${w.hi}° / 最低 ${w.lo}°`;
  }

  /* ---------- 初始化 ---------- */
  updateCountdown();
  updateToday();
  syncHero();
  updateWeatherByDay();
});
