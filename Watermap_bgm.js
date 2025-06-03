let bgmPlayer;
let bgmInterval;
let hasStartedBGM = false;

function onYouTubeIframeAPIReady() {
  bgmPlayer = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: 'RKDHuO4YBKo',
    playerVars: {
      autoplay: 0,
      controls: 0,
      start: 0,
      modestbranding: 1
    },
    events: {
      onReady: (event) => event.target.setVolume(30),
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING && !bgmInterval) {
          bgmInterval = setInterval(() => {
            const currentTime = bgmPlayer.getCurrentTime();
            if (currentTime >= 58) {
              bgmPlayer.seekTo(0);
            }
          }, 1000);
        }
      }
    }
  });
}

document.addEventListener('keydown', () => {
  if (!hasStartedBGM && bgmPlayer && bgmPlayer.playVideo) {
    bgmPlayer.unMute();
    bgmPlayer.playVideo();
    hasStartedBGM = true;
  }
});

function playSound() {
  const clickSound = document.getElementById('clickSound');
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}