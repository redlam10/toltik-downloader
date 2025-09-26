const express = require('express');
const path = require('path');

const app = express();

// ===================================================================
// START: REDIRECT MIDDLEWARE (HTTPS + remove www.)
// ===================================================================
app.use((req, res, next) => {
    // Enforce HTTPS
    if (req.headers['x-forwarded-proto'] !== 'https') {
        const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
        return res.redirect(301, httpsUrl);
    }

    // Remove "www."
    if (req.hostname.startsWith('www.')) {
        const nonWwwHostname = req.hostname.replace(/^www\./, '');
        const nonWwwUrl = `https://${nonWwwHostname}${req.originalUrl}`;
        return res.redirect(301, nonWwwUrl);
    }

    next();
});
// ===================================================================
// END: REDIRECT MIDDLEWARE
// ===================================================================


// ===================================================================
// START: CUSTOM PAGE REDIRECTS (your new rules)
// ===================================================================
app.get('/contact', (req, res) => {
    res.redirect(301, '/contact.html');
});

app.get('/privacy-policy', (req, res) => {
    res.redirect(301, '/privacy.html');
});

app.get('/faq', (req, res) => {
    res.redirect(301, '/faq.html');
});
// ===================================================================
// END: CUSTOM PAGE REDIRECTS
// ===================================================================


// Serve static files (your public folder with .html files)
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

    return res.status(503).json({
        error: 'The downloader is temporarily under maintenance for an upgrade. Please check back soon.'
    });
});

// Homepage route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all for other 404s (optional, nice for SEO)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Server startup
const PORT_TO_USE = process.env.PORT || 3000;
app.listen(PORT_TO_USE, '0.0.0.0', () => {
    console.log(`Server is running and listening on port ${PORT_TO_USE}`);
});
