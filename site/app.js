(() => {
  const C = window.INVITE;
  const $ = (id) => document.getElementById(id);
  const DOW = ["일", "월", "화", "수", "목", "금", "토"];
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
  const timeText = `${H < 12 ? "오전" : H === 12 ? "낮" : "오후"} ${H > 12 ? H - 12 : H}시${MI ? " " + MI + "분" : ""}`;
  $("heroWhen").textContent = `${Y}년 ${MO}월 ${D}일 ${DOW[when.getDay()]}요일 ${timeText}`;
  $("heroWhere").textContent = `${C.venue.name} ${C.venue.hall}`;

  // 인사말과 혼주
  $("greetingText").textContent = C.greeting.join("\n");
  $("family").innerHTML = [C.groom, C.bride].map(p =>
    `<dt>${p.father} · ${p.mother}의 ${p.relation}</dt><dd>${p.name}</dd>`).join("");

  // 달력
  $("calTitle").textContent = `${Y}년 ${MO}월`;
  $("calGrid").setAttribute("aria-label", `${Y}년 ${MO}월 달력`);
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
  $("dday").innerHTML = diff > 0 ? `결혼식까지 <strong>${diff}일</strong> 남았습니다`
    : diff === 0 ? "<strong>오늘</strong> 결혼합니다" : "함께해 주셔서 감사합니다";

  // 사진: 작은 썸네일을 먼저 쓰고, 썸네일이 없으면 원본으로 대체한다
  const gal = $("galGrid");
  gal.addEventListener("error", (e) => {
    const img = e.target; if (img.tagName !== "IMG") return;
    const full = img.parentNode.dataset.src;
    if (img.getAttribute("src") !== full) img.src = full; else img.remove();
  }, true);
  gal.innerHTML = C.photos.map((f, i) =>
    `<button type="button" data-src="images/${f}" aria-label="사진 ${i + 1} 크게 보기"><img src="images/thumb/${f}" alt="" loading="lazy" decoding="async"></button>`).join("");
  const viewer = $("viewer");
  gal.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $("viewerImg").src = b.dataset.src; viewer.showModal();
  });
  $("viewerClose").onclick = () => viewer.close();
  viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });

  // 오시는 길
  $("venueName").textContent = `${C.venue.name} ${C.venue.hall}`;
  $("venueAddr").textContent = C.venue.address;
  const q = encodeURIComponent(C.venue.name);
  $("naverLink").href = "https://map.naver.com/p/search/" + q;
  $("kakaoLink").href = "https://map.kakao.com/link/search/" + q;
  $("transit").innerHTML = C.venue.transit.map(t => `<dt>${t.label}</dt><dd>${t.text}</dd>`).join("");

  // 복사와 안내
  const toast = (msg) => { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 1800); };
  const copy = async (text, msg) => {
    try { await navigator.clipboard.writeText(text); toast(msg); }
    catch { toast("복사하지 못했어요. 길게 눌러 직접 복사해 주세요."); }
  };
  $("copyAddr").onclick = () => copy(C.venue.address, "주소를 복사했어요");

  const SIDE = { groom: "신랑 측 계좌", bride: "신부 측 계좌" };
  const accRow = (a) => `<li><div>${a.who} ${a.holder}<small>${a.bank} ${a.number}</small></div>
    <button type="button" data-acc="${a.bank} ${a.number} ${a.holder}">복사</button></li>`;
  const accHtml = Object.entries(C.accounts || {}).filter(([, list]) => list && list.length).map(([side, list]) =>
    `<details><summary>${SIDE[side] || side}</summary><ul>${list.map(accRow).join("")}</ul></details>`).join("");
  $("accounts").innerHTML = accHtml;
  document.querySelector(".gift").hidden = !accHtml;
  $("accounts").addEventListener("click", (e) => {
    const b = e.target.closest("[data-acc]"); if (b) copy(b.dataset.acc, "계좌번호를 복사했어요");
  });

  // 공유
  $("share").onclick = async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch {} }
    else copy(location.href, "청첩장 링크를 복사했어요");
  };
})();
