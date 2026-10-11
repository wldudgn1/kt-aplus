// 매장 정보: 이 배열만 수정하면 '매장안내' 섹션에 반영됩니다.
// name: 매장명, addr: 주소·지역(없으면 비워 둠), hq: 사무실 여부
// photo: 매장 사진 경로 (예: "assets/stores/jeungpyeong.jpg"). 비워 두면 사진 없이 표시됩니다.
const STORES = [
  { name: "본사 (사무실점)", addr: "충북 증평군 증평읍 중앙로 207-2, KT증평지사 2층", hq: true, photo: "" },
  { name: "증평점", addr: "충북 증평군", photo: "assets/stores/jeungpyeong.jpg" },
  { name: "중앙로점", addr: "충북 증평군 증평읍 중앙로 207-2, KT증평지사 1층", photo: "assets/stores/jungangro.jpg" },
  { name: "진천점", addr: "충북 진천군", photo: "assets/stores/jincheon.jpg" },
  { name: "괴산점", addr: "충북 괴산군", photo: "assets/stores/goesan.jpg" },
  { name: "음성점", addr: "충북 음성군", photo: "assets/stores/eumseong.jpg" },
  { name: "금왕점", addr: "충북 음성군", photo: "assets/stores/geumwang.jpg" },
  { name: "대소점", addr: "충북 음성군", photo: "assets/stores/daeso.jpg" },
  { name: "용산점", addr: "충북 충주시", photo: "" },
  { name: "율량점", addr: "충북 청주시", photo: "assets/stores/yullyang.jpg" },
  { name: "당진점", addr: "충남 당진시", photo: "" },
  { name: "내포점", addr: "충남 내포신도시", photo: "" },
];

document.documentElement.classList.add("js");

const header = document.getElementById("header");
const hero = document.getElementById("hero");

// ----- 매장 목록 렌더링 -----
const storeGrid = document.getElementById("storeGrid");
STORES.forEach((s, i) => {
  const el = document.createElement("article");
  el.className = "store reveal" + (s.hq ? " is-hq" : "");
  const no = document.createElement("span");
  no.className = "store-no";
  // 본사가 00번, 매장은 01번부터
  no.textContent = String(i).padStart(2, "0") + (s.hq ? " · OFFICE" : "");
  if (s.photo) {
    const img = document.createElement("img");
    img.className = "store-photo";
    img.src = s.photo;
    img.alt = "KT 에이플러스 " + s.name;
    img.loading = "lazy";
    el.appendChild(img);
  }
  const h = document.createElement("h3");
  const brand = document.createElement("small");
  brand.textContent = "KT 에이플러스";
  h.append(brand, s.name);
  const p = document.createElement("p");
  p.textContent = s.addr;
  el.append(no, h, p);
  storeGrid.appendChild(el);
});

// ----- 히어로 슬라이드 -----
const slides = [...document.querySelectorAll(".hero-slide")];
const tabs = [...document.querySelectorAll(".hero-tab")];
const SLIDE_MS = 6000;
let current = 0;
let timer;

function syncHeader() {
  const pastHero = window.scrollY > hero.offsetHeight - header.offsetHeight;
  header.classList.toggle("is-solid", pastHero);
  header.classList.toggle("on-light", !pastHero && slides[current].dataset.theme === "light");
}

function show(i) {
  current = (i + slides.length) % slides.length;
  slides.forEach((s, n) => s.classList.toggle("is-active", n === current));
  tabs.forEach((t, n) => {
    t.classList.toggle("is-active", n === current);
    t.setAttribute("aria-selected", n === current);
  });
  hero.classList.toggle("on-light", slides[current].dataset.theme === "light");
  syncHeader();
}

function play() {
  clearInterval(timer);
  timer = setInterval(() => show(current + 1), SLIDE_MS);
}

tabs.forEach((t, n) => t.addEventListener("click", () => { show(n); play(); }));
window.addEventListener("scroll", syncHeader, { passive: true });
show(0);
play();

// ----- 모바일 메뉴 -----
const menuBtn = document.getElementById("menuBtn");
function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  document.body.style.overflow = open ? "hidden" : "";
  menuBtn.setAttribute("aria-expanded", open);
}
menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
document.querySelectorAll("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// ----- 스크롤 등장 + 숫자 카운트업 -----
function countUp(el) {
  const target = Number(el.dataset.count);
  const plain = "plain" in el.dataset; // 연도처럼 천 단위 구분이 필요 없는 숫자
  const start = performance.now();
  const dur = 1400;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const v = Math.round(target * (1 - Math.pow(1 - p, 4)));
    el.textContent = plain ? v : v.toLocaleString("ko-KR");
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    // 등장 지연이 이후 hover 전환에까지 남지 않도록 제거
    setTimeout(() => { e.target.style.transitionDelay = ""; }, 1200);
    e.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el, i) => {
  // 같은 줄에 놓인 카드들이 순서대로 올라오도록 약간의 지연을 준다
  const siblings = el.parentElement.querySelectorAll(":scope > .reveal");
  if (siblings.length > 1) el.style.transitionDelay = ([...siblings].indexOf(el) % 4) * 80 + "ms";
  io.observe(el);
});

document.getElementById("year").textContent = new Date().getFullYear();
