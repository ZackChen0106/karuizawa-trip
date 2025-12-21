/* ======================================================
   唯一控制器（定案版）
   - Tab 切換
   - TODAY 對應每日行程
   - TODAY → 行程
   - 行程自動捲動
   - Today 標示
====================================================== */

const START_DATE = "2026-02-21";

/* ---------- 台北時間 ---------- */
function twMidnight() {
  const now = new Date();
  const tw = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Taipei" })
  );
  return new Date(tw.getFullYear(), tw.getMonth(), tw.getDate());
}

function dayIndex() {
  return Math.floor(
    (twMidnight() - new Date(START_DATE)) / 86400000
  );
}

/* ---------- Tab 切換 ---------- */
function switchPage(target) {
  document.querySelectorAll(".tabbar a").forEach(a =>
    a.classList.toggle("active", a.dataset.tab === target)
  );

  document.querySelectorAll(".page").forEach(p =>
    p.classList.toggle("active", p.dataset.page === target)
  );

  document.body.dataset.page = target;
}

/* ---------- TODAY 顯示 ---------- */
function updateToday() {
  const main = document.getElementById("todayMain");
  const route = document.getElementById("todayRoute");
  const note = document.getElementById("todayNote");

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
    ["Day 3｜前往東京", "輕井澤 → 東京", "移動日"],
    ["Day 4｜東京市區", "澀谷・表參道", "自由行程"],
    ["Day 5｜返程", "東京 → 桃園", "別忘伴手禮"]
  ];

  const today = map[d] || ["旅程結束", "", ""];
  main.textContent = today[0];
  route.textContent = today[1];
  note.textContent = today[2];
}

/* ---------- 行程捲動 + Today 標示 ---------- */
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

/* ---------- TODAY → 行程（全域，給 onclick 用） ---------- */
function goTodayItinerary() {
  switchPage("itinerary");
  setTimeout(scrollToToday, 200);
}

/* ---------- 初始化 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  updateToday();
});
