let bgmAudio = null;
let hasStartedBGM = false;

const mapType = document.body.dataset.map || "grass";

const bgmConfig = {
  grass: "res/sound/grassmap_bgm.mp3",
  fire:  "res/sound/firemap_bgm.mp3",
  water: "res/sound/watermap_bgm.mp3"
};

function setupBGM() {
  const src = bgmConfig[mapType];
  if (!src) {
    console.warn(`[${mapType}] BGM not configured.`);
    return;
  }

  bgmAudio = new Audio(src);
  bgmAudio.loop = true;

  const bgmSlider = document.getElementById('bgmVolume');
  const savedVolume = localStorage.getItem('bgmVolume');
  const volume = savedVolume !== null ? parseFloat(savedVolume) : 0.3;

  bgmAudio.volume = volume;
  if (bgmSlider) bgmSlider.value = volume;

  bgmSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    if (bgmAudio) bgmAudio.volume = vol;
    localStorage.setItem('bgmVolume', vol);
  });

  console.log(`[${mapType}] BGM loaded: ${src}`);
}

document.addEventListener("keydown", () => {
  if (!hasStartedBGM && bgmAudio) {
    bgmAudio.play().then(() => {
      console.log(`[${mapType}] BGM started`);
    }).catch((err) => {
      console.error("BGM play error:", err);
    });
    hasStartedBGM = true;
  }
});

setupBGM();





