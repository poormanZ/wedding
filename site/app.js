(() => {
  const C = window.INVITE;
  const $ = (id) => document.getElementById(id);
  const when = new Date(C.date);
  const DOW = ["일", "월", "화", "수", "목", "금", "토"];

  // 대표 화면
  $("heroImg").onerror = function () { this.remove(); };
  $("heroImg").src = "images/" + C.photos[0];
  $("gName").textContent = C.groom.name;
  $("bName").textContent = C.bride.name;
  const h = when.getHours();
  const timeText = `${h < 12 ? "오전" : h === 12 ? "낮" : "오후"} ${h > 12 ? h - 12 : h}시${when.getMinutes() ? " " + when.getMinutes() + "분" : ""}`;
  $("heroWhen").textContent = `${when.getFullYear()}년 ${when.getMonth() + 1}월 ${when.getDate()}일 ${DOW[when.getDay()]}요일 ${timeText}`;
  $("heroWhere").textContent = `${C.venue.name} ${C.venue.hall}`;

  // 인사말과 혼주
  $("greetingText").textContent = C.greeting.join("\n");
  $("family").innerHTML = [C.groom, C.bride].map(p =>
    `<dt>${p.father} · ${p.mother}의 ${p.relation}</dt><dd>${p.name}</dd>`).join("");

  // 달력
  const y = when.getFullYear(), m = when.getMonth();
  $("calTitle").textContent = `${y}년 ${m + 1}월`;
  const first = new Date(y, m, 1).getDay();
  const last = new Date(y, m + 1, 0).getDate();
  let cells = DOW.map((d, i) => `<span class="dow${i === 0 ? " sun" : ""}">${d}</span>`).join("");
  cells += "<span></span>".repeat(first);
  for (let d = 1; d <= last; d++) {
    const cls = [(first + d - 1) % 7 === 0 ? "sun" : "", d === when.getDate() ? "the-day" : ""].join(" ").trim();
    cells += `<span class="${cls}"${d === when.getDate() ? ' aria-current="date"' : ""}>${d}</span>`;
  }
  $("calGrid").innerHTML = cells;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(y, m, when.getDate());
  const diff = Math.round((target - today) / 86400000);
  $("dday").innerHTML = diff > 0 ? `결혼식까지 <strong>${diff}일</strong> 남았습니다`
    : diff === 0 ? "<strong>오늘</strong> 결혼합니다" : "함께해 주셔서 감사합니다";

  // 사진
  $("galGrid").innerHTML = C.photos.map((f, i) =>
    `<button type="button" data-src="images/${f}" aria-label="사진 ${i + 1} 크게 보기"><img src="images/${f}" alt="" loading="lazy" onerror="this.remove()"></button>`).join("");
  const viewer = $("viewer");
  $("galGrid").addEventListener("click", (e) => {
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

  const accRow = (a) => `<li><div>${a.who} ${a.holder}<small>${a.bank} ${a.number}</small></div>
    <button type="button" data-acc="${a.bank} ${a.number} ${a.holder}">복사</button></li>`;
  $("accGroom").innerHTML = C.accounts.groom.map(accRow).join("");
  $("accBride").innerHTML = C.accounts.bride.map(accRow).join("");
  document.querySelector(".gift").addEventListener("click", (e) => {
    const b = e.target.closest("[data-acc]"); if (b) copy(b.dataset.acc, "계좌번호를 복사했어요");
  });

  // 공유
  $("share").onclick = async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch {} }
    else copy(location.href, "청첩장 링크를 복사했어요");
  };
})();
