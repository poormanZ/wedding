(() => {
  const LANG = document.documentElement.lang === "ja" ? "ja" : "ko";
  const C = LANG === "ja" ? { ...window.INVITE, ...window.INVITE.ja } : window.INVITE;
  const T = {
    ko: {
      dow: ["일", "월", "화", "수", "목", "금", "토"],
      ampm: (h) => h < 12 ? "오전" : h === 12 ? "낮" : "오후",
      time: (ap, h, mi) => `${ap} ${h}시${mi ? " " + mi + "분" : ""}`,
      when: (y, mo, d, dow, t) => `${y}년 ${mo}월 ${d}일 ${dow}요일 ${t}`,
      rel: (r) => `의 ${r}`,
      cal: (y, mo) => `${y}년 ${mo}월`, calAria: (y, mo) => `${y}년 ${mo}월 달력`,
      ddayLeft: (n) => `결혼식까지 <strong>${n}일</strong> 남았습니다`,
      ddayToday: "<strong>오늘</strong> 결혼합니다", ddayPast: "함께해 주셔서 감사합니다",
      photo: (i) => `사진 ${i} 크게 보기`,
      copiedAddr: "주소를 복사했어요", copiedAcc: "계좌번호를 복사했어요", copiedLink: "청첩장 링크를 복사했어요",
      copyFail: "복사하지 못했어요. 길게 눌러 직접 복사해 주세요.",
      side: { groom: "신랑 측 계좌", bride: "신부 측 계좌" },
      bgmOn: "배경음악 켜기", bgmOff: "배경음악 끄기", bgmFail: "음악을 재생하지 못했어요"
    },
    ja: {
      dow: ["日", "月", "火", "水", "木", "金", "土"],
      ampm: (h) => h < 12 ? "午前" : h === 12 ? "正午" : "午後",
      time: (ap, h, mi) => `${ap}${h}時${mi ? mi + "分" : ""}`,
      when: (y, mo, d, dow, t) => `${y}年${mo}月${d}日（${dow}） ${t}`,
      rel: (r) => `の${r}`,
      cal: (y, mo) => `${y}年${mo}月`, calAria: (y, mo) => `${y}年${mo}月のカレンダー`,
      ddayLeft: (n) => `結婚式まであと <strong>${n}日</strong>`,
      ddayToday: "<strong>本日</strong>結婚します", ddayPast: "ご列席いただきありがとうございました",
      photo: (i) => `写真${i}を拡大`,
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
  $("heroImg").onerror = function () { this.remove(); };
  $("heroImg").src = "images/" + C.photos[0];
  $("heroMonth").textContent = MO;
  $("heroDay").textContent = D;
  $("gName").textContent = C.groom.name;
  $("bName").textContent = C.bride.name;
  const timeText = T.time(T.ampm(H), H > 12 ? H - 12 : H, MI);
  $("heroWhen").textContent = T.when(Y, MO, D, DOW[when.getDay()], timeText);
  $("heroWhere").textContent = `${C.venue.name} ${C.venue.hall}`;

  // 인사말과 혼주
  $("greetingText").textContent = C.greeting.join("\n");
  $("family").innerHTML = [C.groom, C.bride].map(p =>
    `<dt><span class="parents"><span>${p.father}</span><span>${p.mother}</span></span><span class="rel">${T.rel(p.relation)}</span></dt><dd>${p.name}</dd>`).join("");

  // 달력
  $("calTitle").textContent = T.cal(Y, MO);
  $("calGrid").setAttribute("aria-label", T.calAria(Y, MO));
  const first = new Date(Y, MO - 1, 1).getDay();
  const last = new Date(Y, MO, 0).getDate();
  let cells = DOW.map((d, i) => `<span class="dow${i === 0 ? " sun" : ""}">${d}</span>`).join("");
  cells += "<span></span>".repeat(first);
  for (let d = 1; d <= last; d++) {
    const cls = [(first + d - 1) % 7 === 0 ? "sun" : "", d === D ? "the-day" : ""].join(" ").trim();
    cells += `<span class="${cls}"${d === D ? ' aria-current="date"' : ""}>${d}</span>`;
  }
  $("calGrid").innerHTML = cells;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((new Date(Y, MO - 1, D) - today) / 86400000);
  $("dday").innerHTML = diff > 0 ? T.ddayLeft(diff) : diff === 0 ? T.ddayToday : T.ddayPast;

  // 사진: 작은 썸네일을 먼저 쓰고, 썸네일이 없으면 원본으로 대체한다
  const gal = $("galGrid");
  gal.addEventListener("error", (e) => {
    const img = e.target; if (img.tagName !== "IMG") return;
    const full = img.parentNode.dataset.src;
    if (img.getAttribute("src") !== full) img.src = full; else img.remove();
  }, true);
  gal.innerHTML = C.photos.map((f, i) =>
    `<button type="button" data-src="images/${f}" aria-label="${T.photo(i + 1)}"><img src="images/thumb/${f}" alt="" loading="lazy" decoding="async"></button>`).join("");
  const viewer = $("viewer"), vImg = $("viewerImg");
  let cur = 0;
  const show = (i) => {
    cur = (i + C.photos.length) % C.photos.length;
    vImg.src = "images/" + C.photos[cur];
    $("viewerCount").textContent = `${cur + 1} / ${C.photos.length}`;
    // 다음·이전 사진을 미리 받아 두면 넘길 때 끊기지 않는다
    [cur + 1, cur - 1].forEach(j => { new Image().src = "images/" + C.photos[(j + C.photos.length) % C.photos.length]; });
  };
  gal.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    show([...gal.children].indexOf(b)); viewer.showModal();
  });
  $("viewerPrev").onclick = () => show(cur - 1);
  $("viewerNext").onclick = () => show(cur + 1);
  $("viewerClose").onclick = () => viewer.close();
  // 사진 왼쪽 절반을 누르면 이전, 오른쪽 절반은 다음
  vImg.addEventListener("click", (e) => {
    const r = vImg.getBoundingClientRect();
    show(e.clientX - r.left < r.width / 2 ? cur - 1 : cur + 1);
  });
  let sx = 0, sy = 0;
  viewer.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  viewer.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(dx < 0 ? cur + 1 : cur - 1);
  });
  viewer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "ArrowLeft") show(cur - 1);
  });
  viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });

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
    const accRow = (a) => `<li><div>${a.who} ${a.holder}<small>${a.bank} ${a.number}</small></div>
      <button type="button" data-acc="${a.bank} ${a.number} ${a.holder}">복사</button></li>`;
    const accHtml = Object.entries(C.accounts || {}).filter(([, list]) => list && list.length).map(([side, list]) =>
      `<details><summary>${T.side[side] || side}</summary><ul>${list.map(accRow).join("")}</ul></details>`).join("");
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
  }

  // 공유
  $("share").onclick = async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch {} }
    else copy(location.href, T.copiedLink);
  };
})();
