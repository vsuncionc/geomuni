const teams = [
  { name: "HUASCARAN", color: "#e34b36", short: "H", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Huascaran.JPG/960px-Huascaran.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", imageAlt: "Imagen ilustrativa del nevado Huascarán en la Cordillera Blanca del Perú; no corresponde a sus jugadores", players: ["Jhon", "Carlos", "Florentino", "Juan", "Teo", "Italo", "Giancarlo", "Roberto", "Asis", "Nelson"] },
  { name: "LA RESISTENCIA", color: "#ef9c26", short: "LR", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=78", imageAlt: "Imagen futbolística ilustrativa de LA RESISTENCIA; no corresponde a sus jugadores", players: ["Luis", "Juan", "Romel", "Oscar", "Cesar", "Ruben", "Pecho", "Jorge", "Ernesto", "David"] },
  { name: "KINEROS FC", color: "#147e88", short: "K", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/20180610_FIFA_Friendly_Match_Austria_vs._Brazil_Neymar_850_1705.jpg/960px-20180610_FIFA_Friendly_Match_Austria_vs._Brazil_Neymar_850_1705.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", imageAlt: "Imagen futbolística ilustrativa de Neymar como único jugador visible con Brasil; no corresponde a los jugadores de KINEROS FC", country: "BRASIL", logo: "./assets/kineros-fc-escudo.jpg", players: ["Vlady", "Christian Patez", "Christian Uti", "Frank Segura", "Freddy", "James", "Miguelon", "Noe UTI", "Kinero Wilson"] },
  { name: "REAL STATISTIC NEWBOYS", color: "#6254a4", short: "RSN", image: "https://upload.wikimedia.org/wikipedia/commons/4/46/Maracana_Stadium.jpg", imageAlt: "Imagen futbolística ilustrativa del estadio Maracaná en Brasil; no corresponde a sus jugadores", players: ["Moshe Markarian", "Helfer", "Renato", "Abraham", "Miguel Maquina", "Raul", "Vocina", "Leo Rojas"] }
];

const grid = document.querySelector("#team-grid");
const search = document.querySelector("#team-search");
const emptyState = document.querySelector("#empty-state");
const resultsStatus = document.querySelector("#results-status");
const countdown = document.querySelector("#countdown");

function renderTeams(query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredTeams = teams.filter((team) =>
    team.name.toLocaleLowerCase().includes(normalizedQuery) ||
    team.players.some((player) => player.toLocaleLowerCase().includes(normalizedQuery))
  );

  grid.innerHTML = filteredTeams.map((team, teamIndex) => `
    <div class="col-md-6 col-xl-3">
      <article class="team-card" style="--team: ${team.color}">
        <div class="team-card-media${team.country ? " brazil-feature" : ""}">
          <img src="${team.image}" alt="${team.imageAlt}" loading="lazy" decoding="async">
          ${team.logo ? `<img class="team-logo" src="${team.logo}" alt="Escudo de ${team.name}" loading="lazy" decoding="async">` : ""}
          ${team.country ? `<span class="team-country-badge" aria-label="Referencia visual a Brasil"><span aria-hidden="true">◆</span>${team.country}</span>` : ""}
          <div class="team-card-head" data-short="${team.short}">
          <span class="team-number">0${teamIndex + 1} / 04</span>
          <h3>${team.name}</h3>
          </div>
        </div>
        <div class="team-card-body">
          <div class="player-count"><span>Plantilla</span><strong>${team.players.length}</strong></div>
          <ol class="roster">
            ${team.players.map((player, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><span class="player-name" tabindex="0">${player}</span></li>`).join("")}
          </ol>
        </div>
      </article>
    </div>
  `).join("");
  grid.querySelectorAll(".team-card-media img").forEach((image) => {
    image.addEventListener("error", () => {
      if (image.classList.contains("team-logo")) {
        image.remove();
        return;
      }
      image.closest(".team-card-media").classList.add("image-fallback");
      image.remove();
    }, { once: true });
  });

  const hasResults = filteredTeams.length > 0;
  emptyState.classList.toggle("d-none", hasResults);
  resultsStatus.textContent = normalizedQuery
    ? `${filteredTeams.length} ${filteredTeams.length === 1 ? "equipo encontrado" : "equipos encontrados"} para “${query.trim()}”.`
    : `${teams.length} equipos · ${teams.reduce((total, team) => total + team.players.length, 0)} jugadores registrados`;
}

search.addEventListener("input", (event) => renderTeams(event.target.value));
renderTeams();

function updateCountdown() {
  if (!countdown) return;

  const startDateParts = countdown.dataset.startDate.split(/[-T:]/).map(Number);
  const startDate = new Date(
    startDateParts[0],
    startDateParts[1] - 1,
    startDateParts[2],
    startDateParts[3],
    startDateParts[4],
    startDateParts[5]
  );
  const remaining = startDate.getTime() - Date.now();

  if (remaining <= 0) {
    countdown.classList.add("is-started");
    countdown.querySelector(".countdown-label").textContent = "El campeonato ya comenzó. ¡Que ruede el balón!";
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const values = { days, hours, minutes, seconds };

  Object.entries(values).forEach(([unit, value]) => {
    const element = countdown.querySelector(`[data-unit="${unit}"]`);
    if (element) element.textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);
