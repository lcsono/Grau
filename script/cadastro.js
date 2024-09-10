class RegisterHandler {
	#BASE_URL;
	#GOWASH_SESSION;

	constructor() {
		this.#BASE_URL = 'https://go-wash-api.onrender.com/api';
		this.#GOWASH_SESSION = '0hGqRHf0q38ETNgEcJGce30LcPtuPKo48uKtb7Oj';
	}

	#validateData({ name, email, password, cpf_cnpj, birthday }) {
		if (!name || !email || !password || !cpf_cnpj || !birthday) {
			alert('Preencha os dados necessários');

			return false;
		}

		const parsedBirthDate = new Date(birthday);
		parsedBirthDate.setHours(parsedBirthDate.getHours() + 3); // GMT0300

		const now = new Date();

		if (parsedBirthDate > now) {
			alert('A data precisa estar no passado');

			return false;
		}

		if (now.getFullYear() - parsedBirthDate.getFullYear() < 18) {
			alert('O usuário precisa ter no mínimo 18 anos');

			return false;
		}

		return true;
	}

	#resetValues(inputList) {
		for (const input of inputList) {
			input.value = '';
			input.checked = 0;
		}
	}

	#fetchFormData() {
		const usernameInput = document.querySelector('#input-username');
		const userDocumentInput = document.querySelector('#input-cpf-cnpj');
		const birthDateInput = document.querySelector('#input-birth-date');
		const emailInput = document.querySelector('#input-email');
		const passwordInput = document.querySelector('#input-password');
		const termsInput = document.querySelector('#input-terms');

		const data = {
			name: usernameInput.value,
			email: emailInput.value,
			password: passwordInput.value,
			cpf_cnpj: userDocumentInput.value,
			birthday: birthDateInput.value,
			terms: termsInput.checked,
			user_type_id: 1,
		};

		if (!this.#validateData(data)) {
			this.#resetValues([
				usernameInput,
				emailInput,
				passwordInput,
				userDocumentInput,
				birthDateInput,
				termsInput,
			]);

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

	async execute() {
		const termsInput = document.querySelector('#input-terms');

		if (!termsInput.checked) {
			alert('Aceite os termos para continuar');

			return;
		}

		const body = this.#fetchFormData();

		if (!body) {
			return;
		}

		console.log({ body });

		const fetchOptions = this.#getExternalAPIFetchOptions(body);

		const response = await fetch(this.#BASE_URL + '/user', fetchOptions);

		console.log(response);
	}
}

const button = document.querySelector('#icon-input-password');

button.addEventListener('click', (ev) => {
	const input = document.querySelector('#input-password');

	if (input.type === 'password') {
		input.type = 'text';
		button.src = '../img/eye-solid.svg';
	} else {
		input.type = 'password';
		button.src = '../img/eye-slash-solid.svg';
	}
});

document
	.querySelector('input[type="button"]')
	.addEventListener('click', async (ev) => {
		ev.preventDefault();

		const registerHandler = new RegisterHandler();

		await registerHandler.execute();
	});
