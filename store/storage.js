const PLAYLIST_KEY = 'podcast-player:playlist';
const POSITION_PREFIX = 'podcast-player:position:';

export function getPlaylist() {
  const data = localStorage.getItem(PLAYLIST_KEY);
  return data ? JSON.parse(data) : [];
}

export function savePlaylist(playlist) {
  localStorage.setItem(PLAYLIST_KEY, JSON.stringify(playlist));
}

export function addToPlaylist(episode) {
  const playlist = getPlaylist();
  if (!playlist.some(e => e.id === episode.id)) {
    playlist.push(episode);
    savePlaylist(playlist);
  }
}

export function removeFromPlaylist(episodeId) {
  const playlist = getPlaylist().filter(e => e.id !== episodeId);
  savePlaylist(playlist);
}

export function getPosition(episodeId) {
  const key = POSITION_PREFIX + episodeId;
  const data = localStorage.getItem(key);
  return data ? parseFloat(data) : 0;
}

export function savePosition(episodeId, seconds) {
  const key = POSITION_PREFIX + episodeId;
  localStorage.setItem(key, String(seconds));
}