// select.js

let selectedChar = null;
const chars = document.querySelectorAll('.char');
const nameBox = document.getElementById('nameBox');
const nameInput = document.getElementById('playerNameInput');
const hoverSound = document.getElementById('hoverSound');
const clickSound = document.getElementById('clickSound');
const bgmAudio = document.getElementById('bgmAudio');
const sfxVolumeSlider = document.getElementById('sfxVolume');
const bgmVolumeSlider = document.getElementById('bgmVolume');
const settingsBtn = document.querySelector('.settings');
const closeButton = document.querySelector('.modal-close');

let bgmStarted = false;

function playSound() {
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
}

function closeSettings() {
  document.getElementById('settingsModal').classList.add('hidden');
}

function confirmSelection() {
  const name = nameInput.value.trim();
  if (!selectedChar) return alert('캐릭터를 선택해주세요!');
  if (!name) return alert('이름을 입력해주세요!');
  localStorage.setItem('playerSprite', selectedChar);
  localStorage.setItem('playerName', name);
  window.location.href = 'difficult_select.html';
}

document.addEventListener('DOMContentLoaded', () => {
  // 캐릭터 선택
  chars.forEach(char => {
    char.addEventListener('click', () => {
      chars.forEach(c => c.classList.remove('selected'));
      char.classList.add('selected');
      selectedChar = char.id;
      nameBox.style.display = 'flex';

      // 캐릭터에 따라 디폴트 이름 설정
      if (selectedChar === 'boy') {
        nameInput.value = '공명';
      } else if (selectedChar === 'girl') {
        nameInput.value = '봄이';
      }
    });
    char.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play();
    });
  });

  // 효과음 볼륨
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

  // 배경음악 볼륨
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

  document.body.addEventListener('click', () => {
    if (!bgmStarted) {
      bgmStarted = true;
      bgmAudio.play().catch(() => {});
    }
  });

  // 설정 버튼
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      document.getElementById('settingsModal').classList.remove('hidden');
    });
    settingsBtn.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play();
    });
  }

  // 설정 닫기
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

  // 시작 버튼 효과음
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

