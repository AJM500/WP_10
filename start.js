function playSound() {
  const clickSound = document.getElementById('clickSound');
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}

function closeSettings() {
  document.getElementById('settingsModal').classList.add('hidden');
}

function startGame() {
  playSound();
  const nameInput = document.getElementById('playerNameInput');
  const name = nameInput ? nameInput.value : '';
  if (name.trim()) localStorage.setItem('playerName', name.trim());

  setTimeout(() => {
    window.location.href = 'map.html';
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  const hoverSound = document.getElementById('hoverSound');
  const clickSound = document.getElementById('clickSound');
  const bgmAudio = document.getElementById('bgmAudio');

  const sfxVolumeSlider = document.getElementById('sfxVolume'); //설정창 전역 변수
  const bgmVolumeSlider = document.getElementById('bgmVolume'); //설정창 전역 변수
  const settingsBtn = document.querySelector('.settings');
  const closeButton = document.querySelector('.modal-close');

  let bgmStarted = false;

  //  효과음 볼륨
  sfxVolumeSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    hoverSound.volume = vol;
    clickSound.volume = vol;
    localStorage.setItem('sfxVolume', vol);
  });

  const savedSFX = localStorage.getItem('sfxVolume');
  if (savedSFX !== null) {
    sfxVolumeSlider.value = savedSFX;
    hoverSound.volume = parseFloat(savedSFX);
    clickSound.volume = parseFloat(savedSFX);
  }

  //  배경음악 볼륨
  bgmVolumeSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    bgmAudio.volume = vol;
    localStorage.setItem('bgmVolume', vol);
  });

  const savedBGM = localStorage.getItem('bgmVolume');
  if (savedBGM !== null) {
    bgmVolumeSlider.value = savedBGM;
    bgmAudio.volume = parseFloat(savedBGM);
  }

  //  전체 화면 클릭 시 BGM 재생
  document.body.addEventListener('click', () => {
    if (!bgmStarted) {
      bgmStarted = true;
      bgmAudio.play().catch(() => {});
    }
  });

  // 설정창 열기
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      document.getElementById('settingsModal').classList.remove('hidden');
    });

    settingsBtn.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play();
    });
  }

  //  닫기 버튼 동작 + 효과음
  if (closeButton) {
    closeButton.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play();
    });
    closeButton.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
      closeSettings();
    });
  }

  // 버튼들 사운드
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play();
    });
    btn.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    });
  });
});

