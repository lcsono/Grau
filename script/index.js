const BASE_URL = 'https://go-wash-api.onrender.com/api';
const GOWASH_SESSION = '0hGqRHf0q38ETNgEcJGce30LcPtuPKo48uKtb7Oj';

function validateData({ name, email, password, cpfCnpj, birthDate, terms }) {
	if (!name || !email || !password || !cpfCnpj || !birthDate) {
		alert('Preencha os dados necessários');

		return false;
	}

	if (!terms) {
		alert('É preciso preencher os termos');

		return false;
	}

	return true;
}

function resetValues(inputList) {
	for (const input of inputList) {
		input.value = '';
		input.checked = 0;
	}
}

async function register() {
	const nameInput = document.querySelector('#input-name');
	const emailInput = document.querySelector('#input-email');
	const passwordInput = document.querySelector('#input-password');
	const cpfCnpjInput = document.querySelector('#input-cpf-cnpj');
	const birthDateInput = document.querySelector('#input-birth-date');
	const termsInput = document.querySelector('#input-terms');

	const body = {
		name: nameInput.value,
		email: emailInput.value,
		password: passwordInput.value,
		cpfCnpj: cpfCnpjInput.value,
		birthDate: birthDateInput.value,
		checkedTerms: termsInput.checked,
	};

	if (!validateData(body)) {
		resetValues([
			nameInput,
			emailInput,
			passwordInput,
			cpfCnpjInput,
			birthDateInput,
			termsInput,
		]);
	}
}

document
	.querySelector('input[type="button"]')
	.addEventListener('click', (ev) => {
		ev.preventDefault();

		register();
	});
