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


/* ---------- 倒數 / 旅程狀態 ---------- */
function updateCountdown() {
  const pillDay = document.getElementById("pillDay");
  if (!pillDay) return;
  if (!window.getTodayDayIndex) return;

  const now = new Date();
  const TRIP_START = new Date("2026-02-21T00:00:00");
  const TRIP_END   = new Date("2026-02-25T23:59:59");

  // 出發前 → 顯示倒數
  if (now < TRIP_START) {
    const diff = Math.ceil(
      (TRIP_START - now) / (1000 * 60 * 60 * 24)
    );
    pillDay.textContent = `距離出發 ${diff} 天`;
    return;
  }

  // 旅程中 → 顯示 Day X
  if (now <= TRIP_END) {
    const dayIndex = window.getTodayDayIndex();
    pillDay.textContent = `Day ${dayIndex + 1}`;
    return;
  }

  // 旅程結束
  pillDay.textContent = "旅程結束";
}

/* ---------- TODAY ---------- */
function updateToday() {
  const main = document.getElementById("todayMain");
  const route = document.getElementById("todayRoute");
  const note = document.getElementById("todayNote");
  if (!main || !window.getTodayDayIndex) return;

  const now = new Date();
  const TRIP_START = new Date("2026-02-21T00:00:00");
  const TRIP_END   = new Date("2026-02-25T23:59:59");

  /* ===== 出發前 ===== */
  if (now < TRIP_START) {
    const diff = Math.ceil(
      (TRIP_START - now) / (1000 * 60 * 60 * 24)
    );

    main.textContent = "旅程準備中";
    note.textContent = "確認護照、住宿與行李清單";
    return;
  }

  /* ===== 旅程中 ===== */
  if (now <= TRIP_END) {
    const d = window.getTodayDayIndex();

    const map = [
      ["Day 1｜前往輕井澤", "成田 → 輕井澤", "早點休息"],
      ["Day 2｜輕井澤慢遊", "舊輕井澤・Outlet", "走路多"],
      ["Day 3｜前往東京", "上午輕井澤｜下午東京", "移動日"],
      ["Day 4｜東京市區", "澀谷・表參道", "自由行程"],
      ["Day 5｜返程", "東京 → 桃園", "別忘伴手禮"]
    ];

    const today = map[d] || ["旅程中", "", ""];
    main.textContent = today[0];
    route.textContent = today[1];
    note.textContent = today[2];
    return;
  }

  /* ===== 旅程結束 ===== */
  main.textContent = "旅程結束";
  route.textContent = "回憶整理中";
  note.textContent = "期待下一次旅行";
}


  /* ---------- TODAY → 行程 ---------- */
  document.getElementById("todayCard")?.addEventListener("click", () => {
    switchPage("itinerary");
  });

  /* ---------- 行程捲動 ---------- */
  function scrollToToday() {
const d = window.getTodayDayIndex
  ? window.getTodayDayIndex()
  : 0;

document.querySelectorAll(".dayPanel").forEach(c => c.classList.remove("today"));
const target = document.querySelector(`.dayPanel[data-day="${d}"]`);


    if (!target) return;

    target.classList.add("today");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- 天氣（依 Day 預設） ---------- */
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

const baseDay = window.getTodayDayIndex
  ? window.getTodayDayIndex()
  : 0;

const d = Math.max(0, Math.min(baseDay, WEATHER_BY_DAY.length - 1));
    const w = WEATHER_BY_DAY[d];

    cityEl.textContent = w.city;
    descEl.textContent = `${w.emoji} ${w.desc}`;
    tempEl.textContent = `${w.temp}°`;
    rangeEl.textContent = `最高 ${w.hi}° / 最低 ${w.lo}°`;
  }

  /* ======================================================
     🔹 行李清單：完成度 + 記住狀態（新增）
     （完全獨立，不影響其他功能）
  ===================================================== */

  const PACKING_KEY = "packing-checklist-v1";
  const packingCheckboxes = document.querySelectorAll(
    '[data-page="packing"] .checkItem input'
  );
  const progressEl = document.getElementById("packingProgress");

  // 讀取已儲存狀態
  const savedPacking = JSON.parse(
    localStorage.getItem(PACKING_KEY) || "{}"
  );

  packingCheckboxes.forEach((cb, index) => {
    const key = `item-${index}`;
    cb.dataset.key = key;

    if (savedPacking[key]) {
      cb.checked = true;
    }

    cb.addEventListener("change", () => {
      savedPacking[key] = cb.checked;
      localStorage.setItem(PACKING_KEY, JSON.stringify(savedPacking));
      updatePackingProgress();
    });
  });

  function updatePackingProgress() {
    if (!progressEl) return;

    const total = packingCheckboxes.length;
    const checked = [...packingCheckboxes].filter(cb => cb.checked).length;
    progressEl.textContent = `已完成 ${checked} / ${total}`;
  }

  updatePackingProgress();

  /* ---------- 初始化 ---------- */
  updateCountdown();
  updateToday();
  updateWeatherByDay();
});
