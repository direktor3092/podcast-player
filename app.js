import { initLanding } from './pages/landing.js';
import { renderDetails } from './pages/details.js';
import { initPlaylist, renderPlaylist } from './pages/playlist.js';
import { initPlayer, playEpisode } from './player/audio-player.js';
import { getPlaylist } from './store/storage.js';

const navBtns = document.querySelectorAll('.nav-btn');
const pages = {
  landing: document.getElementById('page-landing'),
  details: document.getElementById('page-details'),
  playlist: document.getElementById('page-playlist'),
};

function navigateTo(page) {
  Object.values(pages).forEach(p => p.classList.remove('active'));
  if (pages[page]) pages[page].classList.add('active');

  navBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });

  if (page === 'playlist') {
    renderPlaylist();
  }
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navigateTo(btn.dataset.page);
  });
});

window.showDetails = (podcastId) => {
  navigateTo('details');
  renderDetails(podcastId);
};

initLanding();
initPlayer();
initPlaylist();
navigateTo('landing');