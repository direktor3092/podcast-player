import { BASE_URL } from '../config.js';

async function apiFetch(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}


export async function fetchBestPodcasts(page = 1) {
  const data = await apiFetch(`/best_podcasts?sort=recent_published_first&page=${page}`);
  return data;
}

export async function searchPodcasts(query, offset = 0) {
  const encoded = encodeURIComponent(query);
  const data = await apiFetch(`/search?q=${encoded}&type=podcast&offset=${offset}`);
  return data;
}


export async function fetchPodcastDetails(podcastId) {
  const data = await apiFetch(`/podcasts/${podcastId}`);
  return data;
}