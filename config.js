const BASE = "http://51.75.118.170:20041/api/v1";

// 1. List movies
const list = await (await fetch(`${BASE}/movies?page=1`)).json();
if (list.success) {
  list.data.forEach(m => console.log(m.title, m.slug));
  console.log(`page ${list.meta.page} / ${list.meta.last_page}`);
}

// 2. Get one movie's details
const movie = await (await fetch(`${BASE}/movies/inception`)).json();
if (!movie.success) throw new Error(movie.error.message);

// 3. Get streaming servers for that movie
const servers = await (await fetch(`${BASE}/episodes/${movie.data.first_episode_id}/servers`)).json();
console.log(servers.data); // [{ server_name, server_link, ... }]

// Full flow for a SERIES episode instead:
const series = await (await fetch(`${BASE}/series/reacher-saison-4-vf`)).json();
const ep = series.data.episodes[0];
const epServers = await (await fetch(`${BASE}/episodes/${ep.episode_id}/servers`)).json();

// Full flow for an ANIME episode (uses ?episode=, not /episodes/{id}):
const anime = await (await fetch(`${BASE}/anime/the-ogres-bride`)).json();
const animeEp = anime.data.episodes[0];
const animeServers = await (
  await fetch(`${BASE}/anime/the-ogres-bride/servers?episode=${animeEp.episode_id}`)
).json();
