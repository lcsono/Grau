import { CONSTANTS } from "./constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("backgroundMusic");
  const logo = document.getElementById("audioControl");

  if (!audio || !logo) {
    console.error("Elemento de áudio ou logo não encontrado.");
    return;
  }

  let isPlaying = !audio.paused;

  logo.src = isPlaying ? "./img/music.png" : "./img/bigode.png";

  logo.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      logo.src = "./img/bigode.png";
    } else {
      audio.play();
      logo.src = "./img/music.png";
    }

    isPlaying = !isPlaying;
  });
});

const userData = sessionStorage.getItem(
  CONSTANTS.SESSION_STORAGE_USER_DATA_KEY
);

const link = document.querySelector("#login-or-user-name");
const registerButton = document.querySelector("#register-button");
const listAddresses = document.querySelector("#list-addresses");

if (userData) {
  const parsedUserData = JSON.parse(userData);

  link.textContent = parsedUserData.name;
	link.href = ''

  registerButton.textContent = "Cadastrar endereço";
  registerButton.href = "./view/endereco.html";

	listAddresses.textContent = 'Listar endereços'
	listAddresses.href = './view/home.html'
} else {
  link.textContent = "Entrar";
  link.href = "./view/login.html";

  registerButton.textContent = "Não possui conta?";
  registerButton.href = "./view/cadastro.html";

	listAddresses.textContent = ''
	listAddresses.href = ''
}
