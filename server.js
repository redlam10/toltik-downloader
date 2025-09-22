const express = require('express');
// We no longer need 'node-fetch' so we can remove it.
const path = require('path');

const app = express();

// Use the correct relative path that works everywhere.
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

  // --- THIS IS THE FIX ---
  // The harmful API call has been removed.
  // We now return a temporary maintenance message to the user.
  return res.status(503).json({ error: 'The downloader is temporarily under maintenance for an upgrade. Please check back soon.' });
}); // <-- The missing closing bracket is now here.

// Add an explicit route for the homepage to fix "Cannot GET /"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use server startup configuration compatible with Render/hosting services
const PORT_TO_USE = process.env.PORT || 3000;
app.listen(PORT_TO_USE, '0.0.0.0', () => {
  console.log(`Server is running and listening on port ${PORT_TO_USE}`);
});