import { CONSTANTS } from './constants.js';
import { CookieManager } from './cookie-manager.js';
import { getUser } from './getUser.js';

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

const link = document.querySelector('#login-or-user-name');
const registerButton = document.querySelector('#register-button');
const title = document.querySelector('h1');
const listAddressButton = document.querySelector('#list-addresses-button');
const user = getUser();

if (user) {
	link.textContent = user.name;
	link.href = '';

	title.innerHTML = '';

	listAddressButton.textContent = 'Sair';
	listAddressButton.href = '';

	listAddressButton.addEventListener('click', (ev) => {
		ev.preventDefault();

		const cookieManager = new CookieManager();

		cookieManager.deleteCookie(CONSTANTS.COOKIE_ACCESS_TOKEN_KEY);

		window.location.reload();
	});

	registerButton.textContent = 'Listar Endereços';
	registerButton.href = './view/home.html';
} else {
	link.textContent = 'Entrar';
	link.href = './view/login.html';

	registerButton.textContent = 'Não possui conta?';
	registerButton.href = './view/cadastro.html';

	title.innerHTML = 'Barbearia <spane class="highlight">Garage do Rodão</span>';

	listAddressButton.textContent = '';
	listAddressButton.href = '#';

	listAddressButton.removeEventListener('click', () => {});
}
