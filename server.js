const express = require('express');
const path = require('path');

const app = express();

// ===================================================================
// START: REDIRECT MIDDLEWARE (This is the new code)
// This must be the very first piece of middleware in your app.
// It enforces HTTPS and removes 'www' from the domain.
// ===================================================================
app.use((req, res, next) => {
    // Render uses the 'x-forwarded-proto' header to tell us if the request is HTTP or HTTPS.
    if (req.headers['x-forwarded-proto'] !== 'https') {
        // If the request is not secure, redirect to the HTTPS version.
        const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
        return res.redirect(301, httpsUrl);
    }

    // Now, check if the hostname includes 'www'.
    if (req.hostname.startsWith('www.')) {
        // If it has 'www', strip it and redirect.
        const nonWwwHostname = req.hostname.replace(/^www\./, '');
        const nonWwwUrl = `https://${nonWwwHostname}${req.originalUrl}`;
        return res.redirect(301, nonWwwUrl);
    }

    // If no redirect is needed, proceed to the rest of the application.
    next();
});
// ===================================================================
// END: REDIRECT MIDDLEWARE
// ===================================================================


// Your existing code starts here (unchanged)
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
  
  return res.status(503).json({ error: 'The downloader is temporarily under maintenance for an upgrade. Please check back soon.' });
});

// Add an explicit route for the homepage to fix "Cannot GET /"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use server startup configuration compatible with Render/hosting services
const PORT_TO_USE = process.env.PORT || 3000;
app.listen(PORT_TO_USE, '0.0.0.0', () => {
  console.log(`Server is running and listening on port ${PORT_TO_USE}`);
});