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
// --- REPLACE WITH THIS CODE ---
// Return a temporary maintenance message.
return res.status(503).json({ error: 'The downloader is temporarily under maintenance for an upgrade. Please check back soon.' });
// FIX 2: Ajouter une route explicite pour la page d'accueil pour corriger "Cannot GET /"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// FIX 3: Utiliser la configuration de démarrage du serveur compatible avec Render
const PORT_TO_USE = process.env.PORT || 3000;
app.listen(PORT_TO_USE, '0.0.0.0', () => {
  console.log(`Server is running and listening on port ${PORT_TO_USE}`);
});