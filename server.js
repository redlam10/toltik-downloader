const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// FIX 1: Utiliser le chemin relatif correct qui fonctionne partout.
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for downloading videos
app.get('/api/download', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!videoUrl.includes('tiktok.com')) {
      return res.status(400).json({ error: 'Invalid URL. Please enter a valid TikTok video URL.' });
  }

  try {
    const tikwmApiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(tikwmApiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await response.json();

    if (data.code === 0) {
      const normalizedResponse = {
        title: data.data.title || 'TikTok Video',
        thumbnail: data.data.cover,
        videoUrl: data.data.play,
        audioUrl: data.data.music
      };
      return res.json(normalizedResponse);
    } else {
      return res.status(500).json({ error: data.msg || 'Failed to fetch TikTok video info.' });
    }
  } catch (error) {
    console.error(error);
    if (error.name === 'AbortError') {
        return res.status(504).json({ error: 'The request timed out. Please try again.' });
    }
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// FIX 2: Ajouter une route explicite pour la page d'accueil pour corriger "Cannot GET /"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// FIX 3: Utiliser la configuration de démarrage du serveur compatible avec Render
const PORT_TO_USE = process.env.PORT || 3000;
app.listen(PORT_TO_USE, '0.0.0.0', () => {
  console.log(`Server is running and listening on port ${PORT_TO_USE}`);
});