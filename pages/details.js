import { fetchPodcastDetails } from '../api/podcast-api.js';
import { formatTime } from '../utils/format-time.js';

const detailsContent = document.getElementById('details-content');
const backBtn = document.getElementById('back-to-landing');

let currentPodcastId = null;

export async function renderDetails(podcastId) {
  if (!podcastId) return;
  currentPodcastId = podcastId;
  detailsContent.innerHTML = '<p>Загрузка...</p>';
  try {
    const data = await fetchPodcastDetails(podcastId);
    const podcast = data;
    const episodes = data.episodes || [];

    let html = `
      <div style="display:flex; gap:20px; margin-bottom:20px; background:#1e1e1e; padding:20px; border-radius:12px;">
        <img src="${podcast.image || 'https://via.placeholder.com/200'}" alt="${podcast.title}" style="width:120px; height:120px; border-radius:8px; object-fit:cover;" />
        <div>
          <h2 style="margin-bottom:8px;">${podcast.title}</h2>
          <p style="color:#aaa;">${podcast.author || 'Unknown'}</p>
          <p style="color:#aaa; font-size:0.9rem;">${podcast.description || ''}</p>
        </div>
      </div>
      <h3 style="margin-bottom:16px;">Эпизоды (${episodes.length})</h3>
      <div id="episodes-list">
    `;

    if (episodes.length === 0) {
      html += `<p style="color:#aaa;">Эпизоды не найдены</p>`;
    } else {
      episodes.forEach(ep => {
        const duration = ep.audio_length_sec || ep.duration || 0;
        const pubDate = ep.pub_date_ms ? new Date(ep.pub_date_ms).toLocaleDateString() : ep.pub_date || '';

        html += `
          <div class="episode-item" data-episode='${JSON.stringify({
            id: ep.id,
            title: ep.title,
            audio: ep.audio || ep.enclosure_url || '',
            duration: duration,
            pubDate: pubDate,
            podcastTitle: podcast.title,
            podcastImage: podcast.image
          })}'>
            <div class="episode-title">${ep.title || 'Без названия'}</div>
            <div class="episode-meta">
              ${pubDate ? `${pubDate} • ` : ''}${duration ? formatTime(duration) : '—'}
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    detailsContent.innerHTML = html;

    detailsContent.querySelectorAll('.episode-item').forEach(item => {
      item.addEventListener('click', () => {
        const episodeData = JSON.parse(item.dataset.episode);
        const event = new CustomEvent('episode-selected', { detail: episodeData });
        document.dispatchEvent(event);
      });
    });

  } catch (error) {
    console.error('Ошибка загрузки деталей:', error);
    detailsContent.innerHTML = '<p style="color:#ff6b6b;">Ошибка загрузки подкаста</p>';
  }
}

backBtn.addEventListener('click', () => {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-landing').classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.nav-btn[data-page="landing"]').classList.add('active');
});