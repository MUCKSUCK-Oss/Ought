(function () {
  let lastSaved = 0;
  let attached = false;

  function getVideoId() {
    const url = new URL(window.location.href);
    return url.searchParams.get('v');
  }

  function getTitle() {
    const titleEl =
      document.querySelector('h1.ytd-watch-metadata yt-formatted-string') ||
      document.querySelector('h1.title') ||
      document.querySelector('#title h1');
    if (titleEl && titleEl.textContent.trim()) return titleEl.textContent.trim();
    return document.title.replace(/ - YouTube$/, '');
  }

  function saveProgress(video) {
    if (!video || !video.currentTime) return;

    const now = Date.now();
    if (now - lastSaved < 5000) return; // throttle writes to every 5s
    lastSaved = now;

    const videoId = getVideoId();
    if (!videoId) return;

    const timestamp = Math.floor(video.currentTime);
    const resumeUrl = `https://www.youtube.com/watch?v=${videoId}&t=${timestamp}s`;

    chrome.storage.local.set({
      lastVideo: {
        videoId,
        title: getTitle(),
        timestamp,
        url: resumeUrl,
        savedAt: now
      }
    });
  }

  const poll = setInterval(() => {
    const video = document.querySelector('video');
    if (video && !attached) {
      attached = true;
      video.addEventListener('timeupdate', () => saveProgress(video));
      clearInterval(poll);
    }
  }, 1000);
})();
