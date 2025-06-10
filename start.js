localStorage.clear(); // 로컬스토리지 초기화
sessionStorage.clear(); // 세션스토리지 초기화

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
    window.location.href = 'select.html';
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

  // [초기화 코드 추가] 볼륨 값이 없을 경우 기본값으로 설정
  if (localStorage.getItem('sfxVolume') === null) {
    localStorage.setItem('sfxVolume', '1.0');
  }
  if (localStorage.getItem('bgmVolume') === null) {
    localStorage.setItem('bgmVolume', '0.3');
  }

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

const introLines = [
  "안녕! 나는 이 세계의 포켓몬을 연구하고 있는 오박사다! e키를 눌러보렴.",
  "e키를 누르면 사물이나 사람과 상호작용할 수 있단다. 잘 기억해두렴.",
  "지금 너는 로켓단의 습격으로 대부분의 포켓몬을 잃어버렸단다.",
  "지금 너에게 남은 포켓몬은 노말 타입의 포켓몬뿐이지.",
  "하지만 모험을 시작하면 잃어버린 포켓몬을 찾을 수 있을 거란다.",
  "잃어버린 포켓몬을 찾고 챔피언이 되보렴!",
  "이 표는 포켓몬의 속성의 상관관계란다. 이것 역시 잘 기억해두렴.",
  "이제 모험을 다시 시작할 준비가 되었니?"
];

let currentLine = 0;
let isTyping = false;

function openIntroDialog() {
  document.getElementById('howtoModal').classList.remove('hidden');
  currentLine = 0;
  typeLine(introLines[currentLine]);
}

function typeLine(text) {
  const target = document.getElementById('textContent');
  const chart = document.getElementById('typeChartBox');
  target.textContent = "";
  isTyping = true;


  // 속성표 표시 조건
  if (currentLine === 6) {
    chart.classList.remove('hidden');
  } else {
    chart.classList.add('hidden');
  }

  let i = 0;
  const interval = setInterval(() => {
    target.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      isTyping = false;
    }
  }, 35);
}

document.addEventListener('keydown', (e) => {
  if (document.getElementById('howtoModal').classList.contains('hidden')) return;
  if (e.key.toLowerCase() === 'e' && !isTyping) {
    currentLine++;
    if (currentLine < introLines.length) {
      typeLine(introLines[currentLine]);
    } else {
      document.getElementById('howtoModal').classList.add('hidden');
    }
  }
});
