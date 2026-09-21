const teams = [
  { name: "HUASCARAN", color: "#e34b36", short: "H", players: ["Jhon", "Carlos", "Florentino", "Juan", "Teo", "Italo", "Giancarlo", "Roberto", "Asis", "Nelson"] },
  { name: "LA RESISTENCIA", color: "#ef9c26", short: "LR", players: ["Luis", "Juan", "Romel", "Oscar", "Cesar", "Ruben", "Pecho", "Jorge", "Ernesto", "David"] },
  { name: "KINEROS FC", color: "#147e88", short: "K", players: ["Vlady", "Christian Patez", "Christian Uti", "Frank Segura", "Freddy", "James", "Miguelon", "Noe UTI", "Kinero Wilson"] },
  { name: "REAL STATISTIC NEWBOYS", color: "#6254a4", short: "RSN", players: ["Moshe Markarian", "Helfer", "Renato", "Abraham", "Miguel Maquina", "Raul", "Vocina", "Leo Rojas"] }
];

const grid = document.querySelector("#team-grid");
const search = document.querySelector("#team-search");
const emptyState = document.querySelector("#empty-state");
const resultsStatus = document.querySelector("#results-status");

function renderTeams(query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredTeams = teams.filter((team) =>
    team.name.toLocaleLowerCase().includes(normalizedQuery) ||
    team.players.some((player) => player.toLocaleLowerCase().includes(normalizedQuery))
  );

  grid.innerHTML = filteredTeams.map((team, teamIndex) => `
    <div class="col-md-6 col-xl-3">
      <article class="team-card" style="--team: ${team.color}">
        <div class="team-card-head" data-short="${team.short}">
          <span class="team-number">0${teamIndex + 1} / 04</span>
          <h3>${team.name}</h3>
        </div>
        <div class="team-card-body">
          <div class="player-count"><span>Plantilla</span><strong>${team.players.length}</strong></div>
          <ol class="roster">
            ${team.players.map((player, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${player}</li>`).join("")}
          </ol>
        </div>
      </article>
    </div>
  `).join("");

  const hasResults = filteredTeams.length > 0;
  emptyState.classList.toggle("d-none", hasResults);
  resultsStatus.textContent = normalizedQuery
    ? `${filteredTeams.length} ${filteredTeams.length === 1 ? "equipo encontrado" : "equipos encontrados"} para “${query.trim()}”.`
    : `${teams.length} equipos · ${teams.reduce((total, team) => total + team.players.length, 0)} jugadores registrados`;
}

search.addEventListener("input", (event) => renderTeams(event.target.value));
renderTeams();
