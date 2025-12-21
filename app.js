<script>
  /* ===== 台北時區工具 ===== */
  function twMidnight() {
    const now = new Date();
    const tw = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
    return new Date(tw.getFullYear(), tw.getMonth(), tw.getDate());
  }

  const START_DATE = "2026-02-21";

  /* ===== 倒數天數 ===== */
  const pillDay = document.getElementById("pillDay");
  function updateCountdown() {
    if (!pillDay) return;
    const diff = Math.round(
      (new Date(START_DATE) - twMidnight()) / 86400000
    );
    pillDay.textContent =
      diff >= 0 ? `距離出發 ${diff} 天` : "旅程進行中";
  }

  /* ===== TODAY ===== */
  const todayMain = document.getElementById("todayMain");
  const todayNote = document.getElementById("todayNote");
  function updateToday() {
    if (!todayMain || !todayNote) return;
    const d = Math.round(
      (twMidnight() - new Date(START_DATE)) / 86400000
    );
    if (d < 0) {
      todayMain.textContent = "出發前｜準備就緒";
      todayNote.textContent = "確認證件與行李";
    } else {
      todayMain.textContent = `旅程中｜Day ${d + 1}`;
      todayNote.textContent = "依行程前進";
    }
  }

  /* ===== Hero（只跟 app.js 的 data-page） ===== */
  const hero = document.getElementById("hero");
  const heroTitle = document.getElementById("heroTitle");
  const heroSub = document.getElementById("heroSub");
  const pillLoc = document.getElementById("pillLoc");

  function syncHero() {
    if (!hero) return;
    const page = document.body.dataset.page;
    if (page === "itinerary") {
      hero.style.backgroundImage = "url('./assets/hero-tokyo.jpg')";
      heroTitle.textContent = "2026 初春 · 東京";
      heroSub.textContent = "城市節奏，慢慢探索";
      pillLoc.textContent = "📍 東京";
    } else {
      hero.style.backgroundImage = "url('./assets/hero-karuizawa.jpg')";
      heroTitle.textContent = "2026 初春 · 輕井澤";
      heroSub.textContent = "慢慢走，把時間留給彼此";
      pillLoc.textContent = "📍 輕井澤";
    }
  }

  /* 初始化 */
  updateCountdown();
  updateToday();
  syncHero();

  /* app.js 切頁後會改 data-page，我們只觀察 */
  new MutationObserver(syncHero).observe(document.body, {
    attributes: true,
    attributeFilter: ["data-page"]
  });
</script>
