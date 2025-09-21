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

        try {
            const response = await fetch(`/api/download?url=${encodeURIComponent(videoUrl)}`);
            const data = await response.json();

            loader.style.display = 'none';

            if (response.ok) {
                displayResult(data);
            } else {
                showError(data.error || 'An unknown error occurred.');
            }
        } catch (error) {
            loader.style.display = 'none';
            showError('Failed to connect to the server. Please check your connection and try again.');
            console.error('Fetch error:', error);
        }
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