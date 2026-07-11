import { fetchBestPodcasts, searchPodcasts } from '../api/podcast-api.js';
import { debounce } from '../utils/debounce.js';

const grid = document.getElementById('podcast-grid');
const searchInput = document.getElementById('search-input');
const loadMoreBtn = document.getElementById('load-more');
const loadingIndicator = document.getElementById('loading-indicator');

let currentPage = 1;
let currentQuery = '';
let nextPage = null;
let isLoading = false;

function setLoading(visible) {
  loadingIndicator.classList.toggle('visible', visible);
}

function renderPodcasts(podcasts) {
  if (!podcasts || podcasts.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#aaa;">Ничего не найдено</p>';
    return;
  }

  const html = podcasts.map(p => `
    <div class="podcast-card" data-id="${p.id}">
      <img src="${p.image || 'https://via.placeholder.com/200'}" alt="${p.title}" loading="lazy" />
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-author">${p.author || 'Unknown'}</div>
      </div>
    </div>
  `).join('');

  grid.innerHTML = html;

  grid.querySelectorAll('.podcast-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      window.showDetails(id);
    });
  });
}

async function loadData(reset = true) {
  if (isLoading) return;
  isLoading = true;
  setLoading(true);

  try {
    let data;
    if (currentQuery.trim() === '') {
      data = await fetchBestPodcasts(reset ? 1 : currentPage + 1);
      if (reset) {
        renderPodcasts(data.podcasts);
        currentPage = 1;
      } else {
        if (data.podcasts && data.podcasts.length > 0) {
          const newCardsHtml = data.podcasts.map(p => `
            <div class="podcast-card" data-id="${p.id}">
              <img src="${p.image || 'https://via.placeholder.com/200'}" alt="${p.title}" loading="lazy" />
              <div class="card-body">
                <div class="card-title">${p.title}</div>
                <div class="card-author">${p.author || 'Unknown'}</div>
              </div>
            </div>
          `).join('');
          grid.insertAdjacentHTML('beforeend', newCardsHtml);
          grid.querySelectorAll('.podcast-card:not([data-listener])').forEach(card => {
            card.dataset.listener = 'true';
            card.addEventListener('click', () => {
              window.showDetails(card.dataset.id);
            });
          });
        }
        currentPage++;
      }
      nextPage = data.next_page_number || null;
    } else {
      const offset = reset ? 0 : (data?.next_offset || 0);
      data = await searchPodcasts(currentQuery, reset ? 0 : (data?.next_offset || 0));
      if (reset) {
        renderPodcasts(data.results || []);
      } else {
        renderPodcasts(data.results || []);
      }
      nextPage = data.next_offset || null;
    }

    loadMoreBtn.style.display = (nextPage && data.podcasts?.length > 0) ? 'block' : 'none';
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#ff6b6b;">Ошибка загрузки данных</p>';
  } finally {
    isLoading = false;
    setLoading(false);
  }
}

const handleSearch = debounce((query) => {
  currentQuery = query;
  loadData(true);
}, 400);

export function initLanding() {
  searchInput.addEventListener('input', (e) => {
    handleSearch(e.target.value);
  });

  loadMoreBtn.addEventListener('click', () => {
    if (nextPage) {
      loadData(false);
    }
  });

  loadData(true);
}