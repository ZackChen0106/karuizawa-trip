/* =========================
   App Config (請你只改這裡)
   ========================= */

// 你的旅行起始日（請改成你的出發日）
const TRIP_START_DATE = "2026-02-21"; // 例：2026/03/08
// 你從輕井澤切換到東京的日期（包含這天算東京 or 輕井澤？你決定）
const TOKYO_START_DATE = "2026-02-23"; // 例：3/12 起住東京

// 地點座標（不要改格式）
const LOCATIONS = {
  karuizawa: {
    name: "輕井澤",
    lat: 36.3489,
    lon: 138.5960,
    hero: "assets/hero-karuizawa.jpg" // 你放的真實照片
  },
  tokyo: {
    name: "東京市區",
    lat: 35.6812,
    lon: 139.7671,
    hero: "assets/hero-tokyo.jpg" // 你放的真實照片
  }
};

// 你要顯示在 Today 卡上的「今日重點」(之後你再填)
const TODAY_HIGHLIGHT = {
  title: "Day X｜目的地",
  route: "例：星野 → 舊輕井澤",
  note: "例：走路多，記得穿好鞋"
};

/* =========================
   Helpers
   ========================= */
function toDateOnlyStr(d) {
  // local date -> YYYY-MM-DD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(startStr, todayStr) {
  const s = new Date(`${startStr}T00:00:00`);
  const t = new Date(`${todayStr}T00:00:00`);
  const diff = Math.round((t - s) / (1000 * 60 * 60 * 24));
  return diff; // today - start
}

function pickLocation(todayStr) {
  // 若 today >= TOKYO_START_DATE 就切東京，否則輕井澤
  if (todayStr >= TOKYO_START_DATE) return LOCATIONS.tokyo;
  return LOCATIONS.karuizawa;
}

function wmoToIcon(code) {
  // Open-Meteo WMO weather codes -> emoji
  // 詳細可後續再調整（先夠用）
  if ([0].includes(code)) return "☀️";
  if ([1,2].includes(code)) return "🌤️";
  if ([3].includes(code)) return "☁️";
  if ([45,48].includes(code)) return "🌫️";
  if ([51,53,55,56,57].includes(code)) return "🌦️";
  if ([61,63,65,66,67].includes(code)) return "🌧️";
  if ([71,73,75,77].includes(code)) return "🌨️";
  if ([80,81,82].includes(code)) return "🌧️";
  if ([95,96,99].includes(code)) return "⛈️";
  return "🌡️";
}

async function fetchWeather(lat, lon) {
  // Daily: weathercode, temp max/min
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
    `&timezone=Asia%2FTokyo`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("weather fetch failed");
  return await res.json();
}

/* =========================
   UI Binding
   ========================= */
function setActiveTab() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".tabbar a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
    else a.classList.remove("active");
  });
}

function setHeroImage(src) {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  hero.style.setProperty("--hero-image", `url('${src}')`);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

/* =========================
   Home Page Logic
   ========================= */
async function initHome() {
  const todayStr = toDateOnlyStr(new Date());
  const loc = pickLocation(todayStr);

  // Hero / Title
  setHeroImage(loc.hero);
  setText("heroTitle", "2026 初春 · 輕井澤");
  setText("heroSub", "慢慢走，把時間留給彼此");

  // Day / Countdown
  const diff = daysBetween(TRIP_START_DATE, todayStr);
  if (diff < 0) {
    setText("pillDay", `距離出發 ${Math.abs(diff)} 天`);
  } else {
    setText("pillDay", `Day ${diff + 1}｜${loc.name}`);
  }
  setText("pillLoc", `📍 ${loc.name}`);

  // Today card (你之後填)
  setText("todayTitle", diff < 0 ? "出發前｜準備就緒" : `TODAY`);
  setText("todayMain", diff < 0 ? "出發前倒數" : `Day ${diff + 1}｜${loc.name}`);
  setText("todayRoute", TODAY_HIGHLIGHT.route);
  setText("todayNote", TODAY_HIGHLIGHT.note);

  // Weather card
  setText("weatherLoc", loc.name);

  const cacheKey = `weather_cache_${loc.lat}_${loc.lon}`;
  const cached = localStorage.getItem(cacheKey);

  try {
    const data = await fetchWeather(loc.lat, loc.lon);

    const d = data.daily;
    // 今天 index 0，明天 index 1
    const todayCode = d.weathercode?.[0];
    const tomorrowCode = d.weathercode?.[1];
    const tHi = Math.round(d.temperature_2m_max?.[0]);
    const tLo = Math.round(d.temperature_2m_min?.[0]);
    const tmHi = Math.round(d.temperature_2m_max?.[1]);
    const tmLo = Math.round(d.temperature_2m_min?.[1]);

    setHTML("wTodayIcon", wmoToIcon(todayCode));
    setText("wTodayHi", `${tHi}°`);
    setText("wTodayLo", `低 ${tLo}°`);

    setHTML("wTomIcon", wmoToIcon(tomorrowCode));
    setText("wTomHi", `${tmHi}°`);
    setText("wTomLo", `低 ${tmLo}°`);

    // cache
    localStorage.setItem(cacheKey, JSON.stringify({
      ts: Date.now(),
      today: { code: todayCode, hi: tHi, lo: tLo },
      tom: { code: tomorrowCode, hi: tmHi, lo: tmLo }
    }));
    setText("weatherHint", "已更新");
  } catch (e) {
    // fallback to cache
    if (cached) {
      const c = JSON.parse(cached);
      setHTML("wTodayIcon", wmoToIcon(c.today.code));
      setText("wTodayHi", `${c.today.hi}°`);
      setText("wTodayLo", `低 ${c.today.lo}°`);

      setHTML("wTomIcon", wmoToIcon(c.tom.code));
      setText("wTomHi", `${c.tom.hi}°`);
      setText("wTomLo", `低 ${c.tom.lo}°`);

      setText("weatherHint", "離線顯示（上次資料）");
    } else {
      setText("weatherHint", "目前無法取得天氣");
    }
  }
}

/* =========================
   Boot
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  setActiveTab();

  // 只有首頁才跑天氣/hero邏輯
  if (document.body.dataset.page === "home") {
    initHome();
  }
});
