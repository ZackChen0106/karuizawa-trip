/* ======================================================
   天氣顯示（定位 + Open-Meteo）
====================================================== */

function updateWeatherByLocation() {
  const cityEl = document.getElementById("weatherCity");
  const timeEl = document.getElementById("weatherTime");
  const tempEl = document.getElementById("weatherTemp");
  const descEl = document.getElementById("weatherDesc");
  const rangeEl = document.getElementById("weatherRange");
  const card = document.getElementById("weatherCard");

  if (!cityEl || !tempEl || !card) return;

  cityEl.textContent = "定位中…";
  tempEl.textContent = "—°";

  if (!navigator.geolocation) {
    cityEl.textContent = "無法取得定位";
    return;
  }

  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    // 顯示當地時間（台灣/日本都 OK）
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit"
    });

    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}&longitude=${lon}` +
        `&current_weather=true` +
        `&daily=temperature_2m_max,temperature_2m_min` +
        `&timezone=auto`;

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      const cw = data.current_weather;
      const hi = data.daily.temperature_2m_max[0];
      const lo = data.daily.temperature_2m_min[0];

      tempEl.textContent = `${Math.round(cw.temperature)}°`;
      rangeEl.textContent = `最高 ${Math.round(hi)}° / 最低 ${Math.round(lo)}°`;

      descEl.textContent = weatherCodeToText(cw.weathercode);
      cityEl.textContent = "目前位置";

    } catch (e) {
      cityEl.textContent = "天氣讀取失敗";
    }
  }, () => {
    cityEl.textContent = "未允許定位";
  });

  // 點擊 → Apple 天氣
  card.style.cursor = "pointer";
  card.onclick = () => {
    window.location.href = "weather://";
  };
}

/* WMO code → 中文描述 */
function weatherCodeToText(code) {
  if (code === 0) return "晴朗";
  if ([1,2].includes(code)) return "多雲";
  if (code === 3) return "陰天";
  if ([61,63,65].includes(code)) return "下雨";
  if ([71,73,75].includes(code)) return "下雪";
  if ([95,96,99].includes(code)) return "雷雨";
  return "天氣變化中";
}

/* 初始化時呼叫 */
document.addEventListener("DOMContentLoaded", () => {
  updateWeatherByLocation();
});
