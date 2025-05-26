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
    window.location.href = 'WP_10.html';
  }, 300);
}
