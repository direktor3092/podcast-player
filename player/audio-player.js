import { formatTime } from '../utils/format-time.js';
import { getPosition, savePosition, getPlaylist, addToPlaylist } from '../store/storage.js';

const playBtn = document.getElementById('play-btn');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');
const progressFill = document.getElementById('progress-fill');
const progressTrack = document.getElementById('progress-track');
const addBtn = document.getElementById('add-to-playlist-btn');
const episodeTitleEl = document.getElementById('current-episode-title');
const podcastTitleEl = document.getElementById('current-podcast-title');

const audio = new Audio();
let currentEpisode = null;
let isPlaying = false;

export function initPlayer() {
  playBtn.addEventListener('click', togglePlay);

  progressTrack.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressTrack.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${percent}%`;
      timeCurrent.textContent = formatTime(audio.currentTime);
      timeTotal.textContent = formatTime(audio.duration);
    }
    if (currentEpisode && audio.currentTime > 0) {
      savePosition(currentEpisode.id, audio.currentTime);
    }
  });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    playBtn.textContent = '▶';
  });
function showToast(text) {
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.textContent = text;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
  addBtn.addEventListener('click', () => {
    if (currentEpisode) {
      addToPlaylist(currentEpisode);
      showToast('✅ Добавлено в плейлист');
    }
  });

  document.addEventListener('episode-selected', (e) => {
    playEpisode(e.detail);
  });
}

export function playEpisode(episode) {
  if (!episode || !episode.audio) {
    console.warn('Нет аудио-ссылки для эпизода');
    return;
  }

  currentEpisode = episode;

  episodeTitleEl.textContent = episode.title || 'Без названия';
  podcastTitleEl.textContent = episode.podcastTitle || '';

  audio.src = episode.audio;
  audio.load();

  const saved = getPosition(episode.id);
  if (saved > 0) {
    audio.currentTime = Math.max(0, saved - 10);
  } else {
    audio.currentTime = 0;
  }

  audio.play()
    .then(() => {
      isPlaying = true;
      playBtn.textContent = '⏸';
    })
    .catch((err) => {
      console.warn('Автовоспроизведение заблокировано:', err);
      isPlaying = false;
      playBtn.textContent = '▶';
    });
}

function togglePlay() {
  if (!currentEpisode) return;

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = '▶';
  } else {
    audio.play()
      .then(() => {
        isPlaying = true;
        playBtn.textContent = '⏸';
      })
      .catch(err => console.warn('Play error:', err));
  }
}

export function getCurrentEpisode() {
  return currentEpisode;
}