const queryInput = document.getElementById("query");
const searchBtn = document.getElementById("searchBtn");
const resultsEl = document.getElementById("results");
const errorEl = document.getElementById("error");

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.style.display = "block";
}

function clearError() {
  errorEl.style.display = "none";
  errorEl.textContent = "";
}

async function searchMovies() {
  const q = queryInput.value.trim();
  clearError();
  resultsEl.innerHTML = "";

  if (!TMDB_API_KEY || TMDB_API_KEY === "COLLE_TA_CLE_ICI") {
    showError("Ajoute ta clé API TMDB dans le fichier config.js avant de chercher.");
    return;
  }
  if (!q) {
    showError("Entre un titre de film.");
    return;
  }

  resultsEl.innerHTML = '<p class="loading">Recherche en cours...</p>';

  try {
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&language=fr-FR`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      }
    );

    if (!searchRes.ok) {
      resultsEl.innerHTML = "";
      showError(`Clé API invalide ou erreur de connexion (code ${searchRes.status}).`);
      return;
    }

    const searchData = await searchRes.json();
    const movies = (searchData.results || []).slice(0, 8);
    resultsEl.innerHTML = "";

    if (movies.length === 0) {
      resultsEl.innerHTML = '<p class="loading">Aucun film trouvé.</p>';
      return;
    }

    movies.forEach((movie, index) => renderMovieCard(movie, index));
  } catch (e) {
    resultsEl.innerHTML = "";
    showError("Erreur réseau. Vérifie ta connexion.");
  }
}

function renderMovieCard(movie, index) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "";
  const year = (movie.release_date || "").slice(0, 4);
  const providerId = `providers-${movie.id}`;
  const topBadge = index < 3 ? `<div class="top10-badge">TOP ${index + 1}</div>` : "";

  card.innerHTML = `
    <div class="poster-wrap">
      ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'" />` : "🎬"}
      ${topBadge}
      <div class="mylist-btn">+</div>
      <div class="play-badge"><div class="circle">▶</div></div>
    </div>
    <div class="info">
      <div class="title">${movie.title}</div>
      <div class="year">${year || ""}</div>
      <div class="providers" id="${providerId}">Chargement...</div>
    </div>
  `;

  resultsEl.appendChild(card);
  loadProviders(movie.id, providerId);
}

async function loadProviders(movieId, elementId) {
  const el = document.getElementById(elementId);
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: "application/json",
        },
      }
    );
    const data = await res.json();
    const fr = data.results && data.results.FR;

    if (!fr || (!fr.flatrate && !fr.rent && !fr.buy)) {
      el.textContent = "Non disponible en France";
      return;
    }

    const names = new Set();
    (fr.flatrate || []).forEach((p) => names.add(p.provider_name));
    (fr.rent || []).forEach((p) => names.add(p.provider_name));
    (fr.buy || []).forEach((p) => names.add(p.provider_name));

    el.textContent = Array.from(names).slice(0, 3).join(", ");
  } catch (e) {
    el.textContent = "Impossible de charger les plateformes.";
  }
}

searchBtn.addEventListener("click", searchMovies);
queryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchMovies();
});

// ===== GENRES =====
function selectGenre(el) {
  document.querySelectorAll(".genre-chip").forEach((chip) => chip.classList.remove("active"));
  el.classList.add("active");
}

// ===== MODALES =====
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

function openAccount() {
  document.getElementById("settingsMenu").classList.remove("open");
  const raw = localStorage.getItem("pkm_user");
  const isPremium = localStorage.getItem("pkm_premium") === "true";

  if (raw) {
    const u = JSON.parse(raw);
    document.getElementById("accPrenom").textContent = u.prenom || "-";
    document.getElementById("accNom").textContent = u.nom || "-";
    document.getElementById("accEmail").textContent = u.email || "-";
    document.getElementById("accTel").textContent = u.tel || "-";
    const initials = ((u.prenom || "?")[0] || "?") + ((u.nom || "")[0] || "");
    document.getElementById("accountAvatar").textContent = initials.toUpperCase();
  } else {
    document.getElementById("accPrenom").textContent = "Non inscrit";
    document.getElementById("accNom").textContent = "-";
    document.getElementById("accEmail").textContent = "-";
    document.getElementById("accTel").textContent = "-";
    document.getElementById("accountAvatar").textContent = "?";
  }

  const badge = document.getElementById("accPlanBadge");
  badge.textContent = isPremium ? "⭐ Plan Premium actif" : "🎬 Plan gratuit";

  document.getElementById("accountModal").classList.add("open");
}

function openPremium() {
  document.getElementById("settingsMenu").classList.remove("open");
  document.getElementById("premiumModal").classList.add("open");
}

function selectPlan(el) {
  document.querySelectorAll(".plan-option").forEach((p) => p.classList.remove("selected"));
  el.classList.add("selected");
}

function unlockCelebRow() {
  const row = document.getElementById("celebRow");
  const msg = document.getElementById("celebLockMsg");
  if (row) {
    row.style.filter = "none";
    row.style.pointerEvents = "auto";
    row.style.opacity = "1";
  }
  if (msg) msg.textContent = "✅ Contenu Célèbres débloqué.";
}

function confirmPremium() {
  localStorage.setItem("pkm_premium", "true");
  closeModal("premiumModal");
  unlockCelebRow();
}

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("pkm_premium") === "true") {
    unlockCelebRow();
  }
});
