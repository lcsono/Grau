document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('backgroundMusic');
  const logo = document.getElementById('audioControl');

  // Verifica se os elementos de áudio e logo foram encontrados corretamente
  if (!audio || !logo) {
    console.error('Elemento de áudio ou logo não encontrado.');
    return;
  }

  // Verifica se a música está em reprodução
  let isPlaying = !audio.paused; // Atualiza o estado baseado na reprodução inicial

  // Atualiza a imagem da logo com base no estado da música
  logo.src = isPlaying ? './img/music.png' : './img/bigode.png';

  // Adiciona um evento de clique ao logo para controlar a reprodução da música
  logo.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      logo.src = './img/bigode.png'; // Imagem quando a música está pausada
    } else {
      audio.play();
      logo.src = './img/music.png'; // Imagem quando a música está tocando
    }

    // Se a música estava tocando, agora estará pausada e vice-versa
    isPlaying = !isPlaying;
  });
});
