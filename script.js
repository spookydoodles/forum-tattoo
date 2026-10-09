const placeholder = (n, red) => "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#f4f4f4"/>` +
  `<g stroke="#000" stroke-width="2" opacity=".12">${Array.from({length:14},(_,i)=>`<line x1="${-100+i*50}" y1="500" x2="${100+i*50}" y2="0"/>`).join("")}</g>` +
  `<rect x="${170-n*2}" y="120" width="${60+n*4}" height="260" rx="${30+n*2}" fill="none" stroke="${red?'#e0141e':'#000'}" stroke-width="8"/>` +
  `<text x="200" y="450" fill="#000" font-family="Arial" font-size="20" letter-spacing="6" text-anchor="middle" opacity=".5">PHOTO ${n}</text></svg>`);

const works = [
  {title: "tetoválás",     style:"Fekete-szürke",   src: "images/tattoo1.jpg"},
  {title: "tetoválás",  style:"Fine line",   src: "images/tattoo2.jpg" },
  {title: "tetoválás",     style:"Portré", src: "images/tattoo3.jpg"},
  {title: "tetoválás", style:"Realisztikus",   src: "images/tattoo4.jpg"},
  {title: "tetoválás",  style:"Fekete-szürke",   src: "images/tattoo5.jpg"},
  {title: "tetoválás",          style:"Fine line",   src: "images/tattoo6.jpg"},
  {title: "tetoválás",      style:"Realisztikus", src: "images/tattoo7.jpg"},
  {title: "tetoválás",       style:"Portré",   src: "images/tattoo8.jpg"},
  {title: "tetoválás",    style:"Fekete-szürke",   src: "images/Sasa1.jpeg"},
  {title: "tetoválás",    style:"Fekete-szürke",   src: placeholder(0,0)},
  {title: "tetoválás",    style:"Fekete-szürke",   src: placeholder(0,0)},
  {title: "tetoválás",    style:"Fekete-szürke",   src: placeholder(0,0)},
  {title: "tetoválás",    style:"Fekete-szürke",   src: placeholder(0,0)},
  {title: "tetoválás",    style:"Fekete-szürke",   src: placeholder(0,0)},
  {title: "tetoválás",    style:"Fekete-szürke",   src: placeholder(0,0)},
  {title: "tetoválás",    style:"Fekete-szürke",   src: placeholder(0,0)}
];
  const shorts = ["9oRSoLTvfQA", "FAfx7c-jOLg", "b0RqjI2Zioc", "hIlx_Mv1gE4", "kH3XgiCdKlI"];

  const caps = document.getElementById("capsules");
  shorts.forEach(id => {
    const d = document.createElement("div");
    d.innerHTML = `<iframe
    src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0"
    title="" allow="autoplay; encrypted-media" loading="lazy" tabindex="-1"></iframe>`;
    caps.appendChild(d);
  });

// Mobile menu
const burger = document.querySelector(".burger"), menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });

// Portfolio grid + filters
  // Portfolio grid + filters + paging
  const phone = window.matchMedia("(max-width:600px)");
  const perPage = () => phone.matches ? 1 : 8;
  const grid = document.getElementById("grid"), filters = document.querySelector(".filters");
  const dots = document.getElementById("dots");
  const prevBtn = document.querySelector(".pg-prev"), nextBtn = document.querySelector(".pg-next");
  let page = 0, activeStyle = "Összes";

  const styles = ["Összes", ...new Set(works.map(w => w.style))];
  styles.forEach((s, i) => {
    const b = document.createElement("button");
    b.textContent = s; b.type = "button"; b.setAttribute("aria-pressed", i === 0);
    b.addEventListener("click", () => {
      filters.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      activeStyle = s; page = 0; render();
    });
    filters.appendChild(b);
  });

  works.forEach((w, i) => {
    const t = document.createElement("button");
    t.className = "tile"; t.type = "button"; t.dataset.style = w.style; t.dataset.i = i;
    t.innerHTML = `<img src="${w.src}" alt="${w.title}" loading="lazy"><figcaption><small>${w.style}</small>${w.title}</figcaption>`;
    t.addEventListener("click", () => openLb(i));
    grid.appendChild(t);
  });

  // tiles that match the current filter (all pages)
  const matching = () => [...grid.querySelectorAll(".tile")].filter(t => activeStyle === "Összes" || t.dataset.style === activeStyle);

  function render() {
    const list = matching(), pages = Math.max(1, Math.ceil(list.length / perPage()));
    page = Math.min(page, pages - 1);
    grid.querySelectorAll(".tile").forEach(t => t.hidden = true);
    list.slice(page * perPage(), (page + 1) * perPage()).forEach(t => t.hidden = false);

    prevBtn.disabled = page === 0;
    nextBtn.disabled = page === pages - 1;
    prevBtn.style.display = nextBtn.style.display = pages > 1 ? "" : "none";

    dots.innerHTML = "";
    if (pages > 1) for (let p = 0; p < pages; p++) {
      const d = document.createElement("button");
      d.type = "button"; d.setAttribute("aria-label", "Page " + (p + 1));
      d.setAttribute("aria-current", p === page);
      d.addEventListener("click", () => { page = p; render(); });
      dots.appendChild(d);
    }
  }
  prevBtn.addEventListener("click", () => { page--; render(); });
  nextBtn.addEventListener("click", () => { page++; render(); });
  render();

  phone.addEventListener("change", () => { page = 0; render(); });

// Lightbox (steps through the tiles currently visible)
const lb = document.getElementById("lightbox"), lbImg = document.getElementById("lb-img"), lbCap = document.getElementById("lb-cap");
let current = 0, lastFocus = null;
const visible = () => matching().map(t => +t.dataset.i);
function show(i){ current = i; lbImg.src = works[i].src; lbImg.alt = works[i].title; lbCap.textContent = works[i].title + " (" + works[i].style + ")"; }
function openLb(i){ lastFocus = document.activeElement; show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; lb.querySelector(".lb-close").focus(); }
function closeLb(){ lb.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
function step(d){ const v = visible(), p = v.indexOf(current); show(v[(p + d + v.length) % v.length]); }
lb.querySelector(".lb-close").addEventListener("click", closeLb);
lb.querySelector(".lb-prev").addEventListener("click", () => step(-1));
lb.querySelector(".lb-next").addEventListener("click", () => step(1));
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

// Booking form
const form = document.getElementById("form"), statusBox = document.getElementById("status");
const rules = {
  name:  v => v.trim().length >= 2 || "Kérlek, add meg a neved.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Kérlek adj meg egy létező e-mail címet.",
  idea:  v => v.trim().length >= 10 || "Egy kicsivel több infóra lenne szükségünk (legalább 10 karakter)."
};
form.addEventListener("submit", e => {
  e.preventDefault();
  let ok = true;
  Object.keys(rules).forEach(id => {
    const el = form.elements[id], res = rules[id](el.value);
    form.querySelector(`[data-for="${id}"]`).textContent = res === true ? "" : res;
    el.setAttribute("aria-invalid", res !== true);
    if (res !== true) ok = false;
  });
  if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
  /* To really send the form, post it to a service such as Formspree:
     fetch("https://formspree.io/f/mkjorlvb", {method:"POST", body:new FormData(form)}) */
  statusBox.textContent = "Köszönjük, " + form.elements.name.value.trim() + ". A kérést elküldtük. 24 órán belül válaszolunk.";
  statusBox.classList.add("show");
  form.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();

document.documentElement.classList.add("js");

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      io.unobserve(entry.target);          // animate only once
    }
  });
}, { threshold: 0.15 });                   // 15% of the element must be visible

document.querySelectorAll(".reveal").forEach(el => io.observe(el));
