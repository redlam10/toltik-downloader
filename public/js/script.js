document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('download-form');
    const urlInput = document.getElementById('tiktok-url');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const resultSection = document.getElementById('result-section');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const videoUrl = urlInput.value.trim();

        if (!videoUrl) {
            showError('Please paste a TikTok URL.');
            return;
        }

        // Reset UI
        hideError();
        resultSection.style.display = 'none';
        loader.style.display = 'block';

        // --- START: MODIFIED CODE BLOCK ---
        try {
            const response = await fetch(`/api/download?url=${encodeURIComponent(videoUrl)}`);
            
            // Hide the loader as soon as we get a response
            loader.style.display = 'none';

            // If the response is OK (status 200-299), it's a success, so parse it as JSON
            if (response.ok) {
                const data = await response.json();
                displayResult(data);
            } else {
                // If the response is an error (like our 503 maintenance error)
                // Read the response as plain text to get the error message
                const errorText = await response.text();
                showError(errorText || 'An unknown server error occurred.');
            }

        } catch (error) {
            // This will catch network errors (e.g., user is offline or server is down)
            loader.style.display = 'none';
            showError('Failed to connect to the server. Please check your connection and try again.');
            console.error('Fetch error:', error);
        }
        // --- END: MODIFIED CODE BLOCK ---
    });

    function displayResult(data) {
        const videoThumbnail = document.getElementById('video-thumbnail');
        const videoTitle = document.getElementById('video-title');
        const downloadVideo = document.getElementById('download-video');
        const downloadAudio = document.getElementById('download-audio');

        videoThumbnail.src = data.thumbnail;
        videoThumbnail.alt = data.title || 'TikTok Video Thumbnail';
        videoTitle.textContent = data.title;
        downloadVideo.href = data.videoUrl;
        downloadAudio.href = data.audioUrl;

        resultSection.style.display = 'block';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }
});