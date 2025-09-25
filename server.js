const express = require('express');
const path = require('path');

const app = express();

// ===================================================================
// REDIRECT MIDDLEWARE: enforce HTTPS and remove 'www'
// ===================================================================
app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
        return res.redirect(301, httpsUrl);
    }

    if (req.hostname.startsWith('www.')) {
        const nonWwwHostname = req.hostname.replace(/^www\./, '');
        const nonWwwUrl = `https://${nonWwwHostname}${req.originalUrl}`;
        return res.redirect(301, nonWwwUrl);
    }

    next();
});

// ===================================================================
// Serve static files
// ===================================================================
app.use(express.static(path.join(__dirname, 'public')));

// ===================================================================
// Serve robots.txt
// ===================================================================
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /

Sitemap: https://toltik.com/sitemap.xml`);
});

// ===================================================================
// API endpoint for downloading videos
// ===================================================================
app.get('/api/download', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!videoUrl.includes('tiktok.com')) {
      return res.status(400).json({ error: 'Invalid URL. Please enter a valid TikTok video URL.' });
  }
  
  return res.status(503).json({ error: 'The downloader is temporarily under maintenance for an upgrade. Please check back soon.' });
});

// ===================================================================
// Homepage route
// ===================================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===================================================================
// Start server
// ===================================================================
const PORT_TO_USE = process.env.PORT || 3000;
app.listen(PORT_TO_USE, '0.0.0.0', () => {
  console.log(`Server is running and listening on port ${PORT_TO_USE}`);
});
