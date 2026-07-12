import { getPlaylist, removeFromPlaylist } from '../store/storage.js';
import { formatTime } from '../utils/format-time.js';
import { playEpisode } from '../player/audio-player.js';
import { showToast } from '../player/audio-player.js';

const playlistContent = document.getElementById('playlist-content');

export function renderPlaylist() {
  const playlist = getPlaylist();

  if (playlist.length === 0) {
    playlistContent.innerHTML = '<p style="color:#aaa; text-align:center;">Плейлист пуст. Добавьте эпизоды из деталей подкаста.</p>';
    return;
  }

  let html = '';
  playlist.forEach((ep, index) => {
    html += `
      <div class="playlist-item" data-index="${index}" data-episode='${JSON.stringify(ep)}'>
        <div class="info">
          <div style="font-weight:500;">${ep.title || 'Без названия'}</div>
          <div style="font-size:0.85rem; color:#aaa;">${ep.podcastTitle || 'Подкаст'} • ${ep.duration ? formatTime(ep.duration) : ''}</div>
        </div>
        <button class="remove-btn" data-id="${ep.id}">✕</button>
      </div>
    `;
  });

  playlistContent.innerHTML = html;

  playlistContent.querySelectorAll('.playlist-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-btn')) return;
      const episode = JSON.parse(item.dataset.episode);
      playEpisode(episode);
    });
  });

  playlistContent.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      removeFromPlaylist(id);
      renderPlaylist();
      showToast('🗑️ Удалено из плейлиста');
    });
  });
}

export function initPlaylist() {
  renderPlaylist();
}