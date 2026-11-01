(() => {
  const LANG = document.documentElement.lang === "ja" ? "ja" : "ko";
  const C = LANG === "ja" ? { ...window.INVITE, ...window.INVITE.ja } : window.INVITE;
  const T = {
    ko: {
      dow: ["일", "월", "화", "수", "목", "금", "토"],
      ampm: (h) => h < 12 ? "오전" : h === 12 ? "낮" : "오후",
      time: (ap, h, mi) => `${ap} ${h}시${mi ? " " + mi + "분" : ""}`,
      when: (y, mo, d, dow, t) => `${y}년 ${mo}월 ${d}일 ${dow}요일 ${t}`,
      cal: (y, mo) => `${y}년 ${mo}월`,
      calAria: (y, mo) => `${y}년 ${mo}월 달력`,
      family: (p) => `${p.father} · ${p.mother} <span class="rel">의 ${p.relation}</span>`,
      ddayLeft: (n) => `결혼식까지 <strong>${n}일</strong> 남았습니다`,
      ddayToday: "<strong>오늘</strong> 결혼합니다", ddayPast: "함께해 주셔서 감사합니다",
      copiedAddr: "주소를 복사했어요", copiedAcc: "계좌번호를 복사했어요", copiedLink: "청첩장 링크를 복사했어요",
      copyFail: "복사하지 못했어요. 길게 눌러 직접 복사해 주세요.",
      side: { groom: "신랑측", bride: "신부측" },
      bgmOn: "배경음악 켜기", bgmOff: "배경음악 끄기", bgmFail: "음악을 재생하지 못했어요"
    },
    ja: {
      dow: ["日", "月", "火", "水", "木", "金", "土"],
      ampm: (h) => h < 12 ? "午前" : h === 12 ? "正午" : "午後",
      time: (ap, h, mi) => `${ap}${h}時${mi ? mi + "分" : ""}`,
      when: (y, mo, d, dow, t) => `${y}年${mo}月${d}日（${dow}） ${t}`,
      cal: (y, mo) => `${y}年${mo}月`,
      calAria: (y, mo) => `${y}年${mo}月のカレンダー`,
      family: (p) => `${p.father}・${p.mother} <span class="rel">の${p.relation}</span>`,
      ddayLeft: (n) => `結婚式まであと <strong>${n}日</strong>`,
      ddayToday: "<strong>本日</strong>結婚します", ddayPast: "ご列席いただきありがとうございました",
      copiedAddr: "住所をコピーしました", copiedLink: "招待状のリンクをコピーしました",
      copyFail: "コピーできませんでした。長押しでコピーしてください。",
      bgmOn: "BGMをオン", bgmOff: "BGMをオフ", bgmFail: "音楽を再生できませんでした"
    }
  }[LANG];
  const $ = (id) => document.getElementById(id);
  const DOW = T.dow;
  // 방문자 시간대와 무관하게 예식지 기준 날짜·시각을 그대로 표시한다
  const [, Y, MO, D, H, MI] = C.date.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/).map(Number);
  const when = new Date(Y, MO - 1, D, H, MI);

  // 대표 화면
  $("gName").textContent = C.groom.name;
  $("bName").textContent = C.bride.name;
  $("heroMonth").textContent = MO;
  $("heroDay").textContent = D;
  const timeText = T.time(T.ampm(H), H > 12 ? H - 12 : H, MI);
  $("heroWhen").textContent = T.when(Y, MO, D, DOW[when.getDay()], timeText);
  $("heroWhere").textContent = `${C.venue.name} ${C.venue.hall}`;

  $("greetingText").textContent = C.greeting.join("\n");
  $("family").innerHTML = [C.groom, C.bride].map(p =>
    `<li><span class="parents">${T.family(p)}</span><strong>${p.name}</strong></li>`).join("");

  // 달력
  $("calTitle").textContent = T.cal(Y, MO);
  $("calGrid").setAttribute("aria-label", T.calAria(Y, MO));
  const first = new Date(Y, MO - 1, 1).getDay();
  const last = new Date(Y, MO, 0).getDate();
  let cells = DOW.map((d, i) => `<span class="dow${i === 0 ? " sun" : ""}">${d}</span>`).join("");
  cells += "<span></span>".repeat(first);
  for (let d = 1; d <= last; d++) {
    const cls = [(first + d - 1) % 7 === 0 ? "sun" : "", d === D ? "the-day" : ""].join(" ").trim();
    cells += d === D
      ? `<span class="${cls}" aria-current="date"><b>${d}</b><small>${timeText}</small></span>`
      : `<span class="${cls}">${d}</span>`;
  }
  $("calGrid").innerHTML = cells;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((new Date(Y, MO - 1, D) - today) / 86400000);
  $("dday").innerHTML = diff > 0 ? T.ddayLeft(diff) : diff === 0 ? T.ddayToday : T.ddayPast;

  // 오시는 길
  $("venueName").textContent = `${C.venue.name} ${C.venue.hall}`;
  $("venueAddr").textContent = C.venue.address;
  const q = encodeURIComponent(window.INVITE.venue.name);
  $("naverLink").href = "https://map.naver.com/p/search/" + q;
  $("kakaoLink").href = "https://map.kakao.com/link/search/" + q;
  if ($("googleLink")) $("googleLink").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(window.INVITE.venue.address);
  $("transit").innerHTML = C.venue.transit.map(t => `<dt>${t.label}</dt><dd>${t.text}</dd>`).join("");

  // 복사와 안내
  const toast = (msg) => { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 1800); };
  const copy = async (text, msg) => {
    try { await navigator.clipboard.writeText(text); toast(msg); }
    catch { toast(T.copyFail); }
  };
  $("copyAddr").onclick = () => copy(C.venue.address, T.copiedAddr);

  // 계좌: 일본어판에는 섹션 자체가 없다
  if ($("accounts")) {
    const accRow = (a) => `<li><div><span class="who">${a.who}</span> ${a.holder}<small>${a.bank} ${a.number}</small></div>
      <button type="button" data-acc="${a.bank} ${a.number} ${a.holder}">복사</button></li>`;
    const accHtml = Object.entries(C.accounts || {}).filter(([, list]) => list && list.length).map(([side, list]) =>
      `<details class="${side}"><summary>${T.side[side] || side}</summary><ul>${list.map(accRow).join("")}</ul></details>`).join("");
    $("accounts").innerHTML = accHtml;
    document.querySelector(".gift").hidden = !accHtml;
    $("accounts").addEventListener("click", (e) => {
      const b = e.target.closest("[data-acc]"); if (b) copy(b.dataset.acc, T.copiedAcc);
    });
  }

  // 배경음악
  const bgm = $("bgm"), bgmBtn = $("bgmBtn");
  if (C.bgm) {
    bgm.src = C.bgm; bgm.volume = 0.5; bgmBtn.hidden = false;
    const sync = () => {
      const on = !bgm.paused;
      bgmBtn.classList.toggle("on", on);
      bgmBtn.setAttribute("aria-pressed", on);
      bgmBtn.setAttribute("aria-label", on ? T.bgmOff : T.bgmOn);
    };
    bgm.onplay = bgm.onpause = sync;
    bgm.onerror = () => { bgmBtn.hidden = true; };
    bgmBtn.onclick = () => { if (bgm.paused) bgm.play().catch(() => toast(T.bgmFail)); else bgm.pause(); };
    // 모바일은 자동재생이 막히므로 첫 터치 때 시작. 버튼 자체를 누른 경우는 click 핸들러에 맡김
    bgm.play().catch(() => document.addEventListener("pointerdown", (e) => {
      if (!e.target.closest("#bgmBtn")) bgm.play().catch(() => {});
    }, { once: true }));
    // 뒤로가기·앱 전환으로 화면을 벗어나면 멈추고, 돌아오면 이어서 튼다.
    // 폰 브라우저는 페이지를 닫지 않고 뒤에 살려 두는 경우가 많아 음악만 계속 흐르기 때문
    let wasOn = false;
    const leave = () => { if (!bgm.paused) { wasOn = true; bgm.pause(); } };
    const back = () => { if (wasOn) { wasOn = false; bgm.play().catch(() => {}); } };
    window.addEventListener("pagehide", leave);
    window.addEventListener("pageshow", back);
    document.addEventListener("visibilitychange", () => document.hidden ? leave() : back());
  }

  // 공유
  $("share").onclick = async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch {} }
    else copy(location.href, T.copiedLink);
  };
})();
