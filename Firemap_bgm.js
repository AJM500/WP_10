let bgmFirePlayer;
let fireInterval;
let fireHasStarted = false;

function onYouTubeIframeAPIReady() {
  bgmFirePlayer = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: 'RKDHuO4YBKo',
    playerVars: {
      autoplay: 0,
      controls: 0,
      start: 1678,
      modestbranding: 1
    },
    events: {
      onReady: (event) => event.target.setVolume(30),
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING && !fireInterval) {
          console.log("🔥 Firemap BGM Started");
          fireInterval = setInterval(() => {
            const currentTime = bgmFirePlayer.getCurrentTime();
            console.log("🔥 BGM Time:", currentTime);
            if (currentTime >= 1774) {
              console.log("🔁 Loop Firemap BGM");
              bgmFirePlayer.seekTo(1678);
            }
          }, 1000);
        }
      }
    }
  });
}

document.addEventListener('keydown', () => {
  if (!fireHasStarted && bgmFirePlayer && bgmFirePlayer.playVideo) {
    bgmFirePlayer.unMute();
    bgmFirePlayer.playVideo();
    fireHasStarted = true;
  }
});


function playSound() {
  const clickSound = document.getElementById('clickSound');
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}
