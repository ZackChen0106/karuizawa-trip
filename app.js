/* =========================
   Karuizawa Trip App JS v3
   Tab animation upgraded
   ========================= */

// ---- Optional: register service worker (safe if file exists)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

// ---- Tab order (決定左右方向)
const TAB_ORDER = ["home", "flight", "itinerary", "hotel", "packing", "emergency"];

const tabs = Array.from(document.querySelectorAll(".tabbar a"));
const pages = Array.from(document.querySelectorAll(".page"));

let currentPage = "home";
let isAnimating = false;

function getPageEl(name) {
  return document.querySelector(`.page[data-page="${name}"]`);
}

function setActiveTab(name) {
  tabs.forEach(t => t.classList.remove("active"));
  const active = document.querySelector(`.tabbar a[data-tab="${name}"]`);
  if (active) active.classList.add("active");
}

function getDirection(from, to) {
  const fromIdx = TAB_ORDER.indexOf(from);
  const toIdx = TAB_ORDER.indexOf(to);
  if (fromIdx === -1 || toIdx === -1) return "left";
  return toIdx > fromIdx ? "left" : "right"; // 往右邊 tab -> 內容往左滑進（iOS 常見）
}

function cleanupClasses(el) {
  el.classList.remove(
    "enter-left",
    "enter-right",
    "exit-left",
    "exit-right",
    "anim-in",
    "active"
  );
}

function switchPage(target, { pushState = true } = {}) {
  if (!target) return;
  if (target === currentPage) return;
  if (isAnimating) return;

  const currentEl = getPageEl(currentPage);
  const nextEl = getPageEl(target);
  if (!currentEl || !nextEl) return;

  isAnimating = true;

  const dir = getDirection(currentPage, target);

  // 1) Prepare next page start position
  cleanupClasses(nextEl);
  nextEl.classList.add(dir === "left" ? "enter-right" : "enter-left");
  nextEl.classList.add("active"); // put it in flow so container height is correct

  // 2) Animate out current page (keep it visible during transition)
  cleanupClasses(currentEl);
  currentEl.classList.add("active");
  currentEl.classList.add(dir === "left" ? "exit-left" : "exit-right");

  // 3) Next page animates to center
  requestAnimationFrame(() => {
    nextEl.classList.add("anim-in");
    nextEl.classList.remove("enter-left", "enter-right");
  });

  // 4) Finish on transition end (use nextEl transform)
  const onDone = (e) => {
    if (e.propertyName !== "transform") return;

    nextEl.removeEventListener("transitionend", onDone);

    // Make next the only active
    pages.forEach(p => {
      if (p !== nextEl) cleanupClasses(p);
    });
    nextEl.classList.add("active");
    nextEl.classList.remove("anim-in", "exit-left", "exit-right");

    currentPage = target;
    setActiveTab(target);

    // Update URL hash + history
    if (pushState) {
      history.pushState({ page: target }, "", `#${target}`);
    }

    isAnimating = false;
  };

  nextEl.addEventListener("transitionend", onDone);
}

// ---- Bind tab click (no reload)
tabs.forEach(tab => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    const target = tab.dataset.tab;
    switchPage(target);
  });
});

// ---- Handle back/forward
window.addEventListener("popstate", (e) => {
  const page = e.state?.page;
  if (page && page !== currentPage) {
    switchPage(page, { pushState: false });
  }
});

// ---- Initial route via hash
(function initRoute() {
  const hash = (location.hash || "").replace("#", "").trim();
  const initial = TAB_ORDER.includes(hash) ? hash : "home";

  // set initial without animation
  pages.forEach(p => cleanupClasses(p));
  const initialEl = getPageEl(initial);
  if (initialEl) initialEl.classList.add("active");

  currentPage = initial;
  setActiveTab(initial);

  // normalize history state
  history.replaceState({ page: initial }, "", `#${initial}`);
})();
