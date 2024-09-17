document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('backgroundMusic');
  const logo = document.getElementById('audioControl');

  if (!audio || !logo) {
    console.error('Elemento de áudio ou logo não encontrado.');
    return;
  }

  let isPlaying = !audio.paused; 

  logo.src = isPlaying ? './img/music.png' : './img/bigode.png';

  logo.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      logo.src = './img/bigode.png';
    } else {
      audio.play();
      logo.src = './img/music.png'; 
    }

    isPlaying = !isPlaying;
  });
});
