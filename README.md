# 🎙 Podcast Player

A lightweight Single Page Application (SPA) for browsing and playing podcasts. Built with vanilla JavaScript.

## ✨ Features

- **Landing page** – shows a list of recent podcasts (via Listen Notes test API)  
- **Search** – filters podcasts by title/author (debounced input)  
- **Podcast details** – view episodes with title, publication date, and duration  
- **Audio player** – play/pause, progress bar with seek, current/total time  
- **Playlist** – add/remove episodes, persist across page reloads  
- **Playback memory** – saves current position and resumes ~10 seconds before last stop  

## 🧱 Tech Stack

- HTML5 / CSS3 (custom, no frameworks)
- JavaScript (ES Modules)
- [Listen Notes Test API](https://listen-api-test.listennotes.com/api/v2) – no API key required
- LocalStorage (playlist & playback position)
- Deployed on [Netlify](https://www.netlify.com/) / GitHub Pages

## 🚀 Live Demo

🔗 [**View the app**](https://glistening-starburst-40cd9e.netlify.app)  

## 🛠️ Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/direktor3092/podcast-player.git
   cd podcast-player