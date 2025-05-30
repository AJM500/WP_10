let player;
let bgmInterval;
let hasStartedBGM = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: 'h1n1uP2U-jc',
    playerVars: {
      autoplay: 0,
      controls: 0,
      start: 8,
      modestbranding: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.setVolume(30);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING && !bgmInterval) {
    bgmInterval = setInterval(() => {
      const currentTime = player.getCurrentTime();
      if (currentTime >= 20) {
        player.seekTo(8);
      }
    }, 1000);
  }
}

document.addEventListener('click', () => {
  if (!hasStartedBGM && player && player.playVideo) {
    player.unMute(); // 혹시 모르게 mute 상태일 수 있으니
    player.playVideo();
    hasStartedBGM = true;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn');
  const hoverSound = document.getElementById('hoverSound');
  const clickSound = document.getElementById('clickSound');

  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (hoverSound) {
        hoverSound.currentTime = 0;
        hoverSound.play();
      }
    });

    btn.addEventListener('click', () => {
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play();
      }
    });
  });
});

function playSound() {
  const clickSound = document.getElementById('clickSound');
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}

function startGame() {
  playSound();
  setTimeout(() => {
    window.location.href = 'map.html';
  }, 300);
}
