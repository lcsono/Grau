class LoginHandler {
	#BASE_URL;
	#GOWASH_SESSION;

	constructor() {
		this.#BASE_URL = 'https://go-wash-api.onrender.com/api';
		this.#GOWASH_SESSION = '0hGqRHf0q38ETNgEcJGce30LcPtuPKo48uKtb7Oj';
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

			sessionStorage.setItem('userData', JSON.stringify(data));
		}
	}
}

function toggleSubmitButtonDisabled(button) {
	if (!button.disabled) {
		button.style.backgroundColor = 'var(--disabled)';
		button.style.cursor = 'default';
		button.value = 'Aguarde...';
		button.disabled = true;
	} else {
		button.style.backgroundColor = 'var(--primary-color)';
		button.value = 'Criar conta';
		button.disabled = false;
	}
}

const buttonSubmitLogin = document.querySelector('#submit-login-button');

buttonSubmitLogin.addEventListener('click', async (ev) => {
	ev.preventDefault();

	try {
		toggleSubmitButtonDisabled(buttonSubmitLogin);

		const loginHandler = new LoginHandler();

		await loginHandler.execute();
	} catch (err) {
		document.querySelector('#response-error-message').textContent =
			'Erro inesperado';
	} finally {
		toggleSubmitButtonDisabled(buttonSubmitLogin);
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
