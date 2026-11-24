const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");
const resultCount = document.getElementById("resultCount");
const categoryButtons = [...document.querySelectorAll(".category")];

let activeCategory = "todas";

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Pré-calcula o texto pesquisável de cada card (uma única vez)
const cards = [...document.querySelectorAll(".searchable")].map(el => ({
  el,
  categories: el.dataset.category.split(" "),
  content: normalize(el.dataset.search + " " + el.textContent)
}));

function matchesCategory(card, category) {
  return category === "todas" || card.categories.includes(category);
}

function applyFilters() {
  const term = normalize(searchInput.value.trim());
  let visible = 0;

  cards.forEach(card => {
    const show = matchesCategory(card, activeCategory) &&
                 (!term || card.content.includes(term));
    card.el.hidden = !show;
    if (show) visible++;
  });

  noResults.hidden = visible !== 0;
  resultCount.textContent =
    visible === 0 ? "" : `${visible} ${visible === 1 ? "vídeo" : "vídeos"}`;
}

function setCategory(category) {
  activeCategory = category;
  categoryButtons.forEach(btn => {
    const isActive = btn.dataset.category === category;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive);
  });
  applyFilters();
}

// Mostra a quantidade de vídeos em cada categoria
categoryButtons.forEach(btn => {
  const category = btn.dataset.category;
  const count = cards.filter(c => matchesCategory(c, category)).length;
  const badge = document.createElement("span");
  badge.className = "count";
  badge.textContent = count;
  badge.style.marginLeft = "auto";
  badge.style.opacity = ".7";
  btn.appendChild(badge);

  btn.setAttribute("aria-pressed", btn.classList.contains("active"));
  btn.addEventListener("click", () => setCategory(category));
});

// Busca: ao digitar, volta para "Todas" para não confundir o usuário
searchInput.addEventListener("input", () => {
  if (activeCategory !== "todas") setCategory("todas");
  else applyFilters();
});

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  applyFilters();
});

applyFilters();

/* ---------- Modal ---------- */
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
let lastFocused = null;

function openModal(title) {
  lastFocused = document.activeElement;
  modalTitle.textContent = title;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.getElementById("closeModalButton").focus();
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".watch-button").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.pdf) {
      window.open(button.dataset.pdf, "_blank", "noopener");
      return;
    }
    openModal(button.dataset.title);
  });
});

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("closeModalButton").addEventListener("click", closeModal);

modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("active")) closeModal();
});

/* ---------- Documentos e contato (provisório) ---------- */
document.querySelectorAll(".document").forEach(link => {
  link.addEventListener("click", event => {
    if (link.getAttribute("href") !== "#") return;
    event.preventDefault();
    alert(`O arquivo "${link.dataset.document}" ainda será conectado ao documento real do DTIC.`);
  });
});

function openTicket() {
  alert("Aqui será colocado o link real para abertura de chamado.");
}

document.getElementById("openTicket").addEventListener("click", openTicket);
document.getElementById("openTicketTop").addEventListener("click", openTicket);

document.getElementById("contactDtic").addEventListener("click", () => {
  alert("Entre em contato com o DTIC no número 11 9999-9999.");
});
