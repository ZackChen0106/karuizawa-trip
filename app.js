/* =====================================================
   Trip Dates（全站唯一來源）
===================================================== */
const TRIP_START = new Date("2026-02-21T00:00:00");
const TRIP_END   = new Date("2026-02-25T23:59:59");

/* =====================================================
   Trip Day Index（全站共用）
===================================================== */
window.getTodayDayIndex = function () {
  const now = new Date();

  if (now < TRIP_START) return -1; // 出發前
  if (now > TRIP_END) return 4;    // 旅程結束（Day 5）

  return Math.floor((now - TRIP_START) / (1000 * 60 * 60 * 24));
};

/* =====================================================
   倒數 / 狀態 Pill（首頁）
===================================================== */
function updateCountdown() {
  const pillDay = document.getElementById("pillDay");
  if (!pillDay) return;

  const now = new Date();

  // 出發前
  if (now < TRIP_START) {
    const diff = Math.ceil((TRIP_START - now) / (1000 * 60 * 60 * 24));
    pillDay.textContent = `距離出發 ${diff} 天`;
    return;
  }

  // 旅程中
  if (now <= TRIP_END) {
    pillDay.textContent = `Day ${window.getTodayDayIndex() + 1}`;
    return;
  }

  // 旅程結束
  pillDay.textContent = "旅程結束";
}

/* =====================================================
   TODAY 卡
===================================================== */
function updateToday() {
  const main  = document.getElementById("todayMain");
  const route = document.getElementById("todayRoute");
  const note  = document.getElementById("todayNote");
  if (!main) return;

  const now = new Date();

  // 出發前
  if (now < TRIP_START) {
    main.textContent  = "旅程準備中";
    route.textContent = "";
    note.textContent  = "確認護照、住宿與行李清單";
    return;
  }

  // 旅程中
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
    main.textContent  = today[0];
    route.textContent = today[1];
    note.textContent  = today[2];
    return;
  }

  // 結束後
  main.textContent  = "旅程結束";
  route.textContent = "回憶整理中";
  note.textContent  = "期待下一次旅行";
}

/* =====================================================
   行程頁捲動到 Today
===================================================== */
function scrollToToday() {
  const d = window.getTodayDayIndex() >= 0 ? window.getTodayDayIndex() : 0;
  const target = document.querySelector(`.dayPanel[data-day="${d}"]`);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* =====================================================
   DOM Ready
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Tab 切換 ---------- */
  const tabs  = document.querySelectorAll(".tabbar a");
  const pages = document.querySelectorAll(".page");

function switchPage(target) {
  tabs.forEach(t => t.classList.remove("active"));
  pages.forEach(p => p.classList.remove("active"));

  document.querySelector(`.tabbar a[data-tab="${target}"]`)?.classList.add("active");
  document.querySelector(`.page[data-page="${target}"]`)?.classList.add("active");

  document.body.dataset.page = target;

  // ✅ 第 1 個 frame：等 page.active 真正生效
  requestAnimationFrame(() => {
    // ✅ 第 2 個 frame：再捲動，iOS 才吃得到
    requestAnimationFrame(() => {
      const scroller = document.querySelector(".pages");
      if (scroller) scroller.scrollTop = 0;
    });
  });

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

  /* ---------- TODAY → 行程 ---------- */
  document.getElementById("todayCard")?.addEventListener("click", () => {
    switchPage("itinerary");
  });

  /* ---------- 初始化 ---------- */
  updateCountdown();
  updateToday();
  setInterval(updateCountdown, 60 * 1000);
});

/* =====================================================
   iOS / PWA 回前景時同步更新
===================================================== */
window.addEventListener("pageshow", () => {
  updateCountdown();
  updateToday();
});
