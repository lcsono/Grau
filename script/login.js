import { CONSTANTS } from './constants.js';
import { CookieManager } from './cookie-manager.js';
import { toggleSubmitButtonDisabled } from './toggle-submit-button-disabled.js';

class LoginHandler {
	#BASE_URL;
	#GOWASH_SESSION;
	#cookieManager;

	constructor() {
		this.#BASE_URL = CONSTANTS.GOWASH_BASE_URL;
		this.#GOWASH_SESSION = CONSTANTS.GOWASH_SESSION;
		this.#cookieManager = new CookieManager();
	}

	#validateData({ email, password }) {
		const emailErrorMessage = document.querySelector('#email-error-message');
		const passwordErrorMessage = document.querySelector(
			'#password-error-message'
		);
		let isValid = true;

		if (!email) {
			emailErrorMessage.textContent = 'Insira um e-mail';
			isValid = false;
		} else if (!email.includes('@')) {
			emailErrorMessage.textContent =
				'O e-mail deve ter um domínio (@example.com) para ser válido';
			isValid = false;
		} else if (email.includes(' ')) {
			emailErrorMessage.textContent = 'O e-mail não deve haver espaços';
			isValid = false;
		}

		if (!password) {
			passwordErrorMessage.textContent = 'Informe a senha';
			isValid = false;
		} else if (password.length < 8) {
			passwordErrorMessage.textContent =
				'A senha deve ter no mínimo 8 caracteres';
			isValid = false;
		}

		return isValid;
	}

	#fetchFormData() {
		const emailInput = document.querySelector('#input-email');
		const passwordInput = document.querySelector('#input-password');

		const data = {
			email: emailInput.value.trim(),
			password: passwordInput.value.trim(),
			user_type_id: 1,
		};

		if (!this.#validateData(data)) {
			return;
		}

		return data;
	}

	#getExternalAPIFetchOptions(body) {
		return {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				Cookie: `gowash_session=${this.#GOWASH_SESSION}`,
			},
		};
	}

	#dealWithResponseError(message) {
		document.querySelector('#response-error-message').textContent = message;
	}

	async execute() {
		const body = this.#fetchFormData();

		if (!body) {
			return;
		}

		const fetchOptions = this.#getExternalAPIFetchOptions(body);

		const response = await fetch(this.#BASE_URL + '/login', fetchOptions);

		if (response.status === 401) {
			this.#dealWithResponseError('Usuário não está ativo');
		} else if (response.status === 404) {
			this.#dealWithResponseError('Usuário não encontrado');
		} else if (response.status === 200) {
			const data = await response.json();

			this.#cookieManager.setCookie(
				CONSTANTS.COOKIE_ACCESS_TOKEN_KEY,
				data.access_token
			);
			sessionStorage.setItem(
				CONSTANTS.SESSION_STORAGE_USER_DATA_KEY,
				JSON.stringify(data.user)
			);

			window.location.href = '../index.html';
		}
	}
}

const buttonSubmitLogin = document.querySelector('#submit-login-button');

buttonSubmitLogin.addEventListener('click', async (ev) => {
	ev.preventDefault();

	try {
		toggleSubmitButtonDisabled(buttonSubmitLogin, 'Entrar');

		const loginHandler = new LoginHandler();

		await loginHandler.execute();
	} catch (err) {
		document.querySelector('#response-error-message').textContent =
			'Erro inesperado';
	} finally {
		toggleSubmitButtonDisabled(buttonSubmitLogin, 'Entrar');
	}
});

const passwordInput = document.querySelector('#input-password');
const emailInput = document.querySelector('#input-email');

passwordInput.addEventListener('keydown', (ev) => {
	document.querySelector('#password-error-message').textContent = '';

	if (ev.key === 'Enter') {
		buttonSubmitLogin.click();
	}
});

emailInput.addEventListener('keydown', (ev) => {
	document.querySelector('#email-error-message').textContent = '';

	if (emailInput.value && ev.key === 'Enter') {
		passwordInput.focus();
	}
});

const button = document.querySelector('#icon-input-password');

button.addEventListener('click', (ev) => {
	const input = document.querySelector('#input-password');

	if (input.type === 'password') {
		input.type = 'text';
		button.src = '../img/eye-solid-black.svg';
	} else {
		input.type = 'password';
		button.src = '../img/eye-slash-solid-black.svg';
	}
});

const queryParams = window.location.href.split('?')?.[1];

const emailQueryParam = queryParams
	?.split('&')
	.find((param) => param.split('=')[0] === 'email');

if (emailQueryParam) {
	const emailInput = document.querySelector('#input-email');

	emailInput.value = emailQueryParam.split('=')[1];
}
