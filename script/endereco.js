import { CONSTANTS } from './constants.js';
import { CookieManager } from './cookie-manager.js';
import { toggleSubmitButtonDisabled } from './toggle-submit-button-disabled.js';
import { ViacepHelper } from './viacep-helper.js';

const viacepHelper = new ViacepHelper();
const cookieManager = new CookieManager();

const accessToken = cookieManager.getCookie(CONSTANTS.COOKIE_ACCESS_TOKEN_KEY);

if (!accessToken) window.location.href = '../index.html';

function validateField(fieldId, errorMessage) {
	const field = document.getElementById(fieldId);
	const errorField = document.getElementById(`${fieldId}-error`);

	if (!field.value.trim()) {
		errorField.textContent = errorMessage;
		return false;
	} else {
		errorField.textContent = '';
		return true;
	}
}

function validateFields() {
	const validations = [
		{ fieldId: 'input-title', message: 'O campo título é obrigatório.' },
		{ fieldId: 'input-zip-code', message: 'O campo CEP é obrigatório.' },
		{ fieldId: 'input-address', message: 'O campo endereço é obrigatório.' },
		{ fieldId: 'input-number', message: 'O campo número é obrigatório.' },
	];

	let allValid = true;

	validations.forEach((validation) => {
		const isValid = validateField(validation.fieldId, validation.message);
		if (!isValid) {
			allValid = false;
		}
	});

	return allValid;
}

document.getElementById('button').addEventListener('click', async function () {
	if (!validateFields()) {
		return;
	}

	const title = document.querySelector('#input-title').value;
	const zipCode = document.querySelector('#input-zip-code').value;
	const address = document.querySelector('#input-address').value;
	const number = document.querySelector('#input-number').value;
	const complement = document.querySelector('#input-complement').value;

	const button = document.querySelector('#button');
	toggleSubmitButtonDisabled(button, 'Cadastrar endereço');

	const data = {
		title,
		cep: zipCode,
		address,
		number,
		complement,
	};

	try {
		const address = await viacepHelper.getAddress(zipCode);

		if (address.erro) {
			alert('Endereço inválido');

			return;
		}

		const response = await fetch(CONSTANTS.GOWASH_BASE_URL + '/auth/address', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `gowash_session=${CONSTANTS.GOWASH_SESSION}`,
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json();

			alert('Erro: ' + errorData.message);
		} else {
			await response.json();

			alert('Endereço cadastrado com sucesso!');

			window.location.href = './home.html';
		}
	} catch (error) {
		alert('Erro ao cadastrar o endereço: ' + error.message);
	} finally {
		toggleSubmitButtonDisabled(button, 'Cadastrar endereço');
	}
});

const zipCodeInput = document.getElementById('input-zip-code');

zipCodeInput.addEventListener('focusout', async (ev) => {
	try {
		const address = await viacepHelper.getAddress(ev.target.value);

		if (address.erro) {
			alert('O CEP informado é inválido');

			return;
		}

		const parsedAddress = [
			address.logradouro,
			address.localidade,
			address.estado,
		].join(', ');

		document.querySelector('#input-address').value = parsedAddress;
		document.querySelector('#input-complement').value = address.complemento;
	} catch (err) {
		if (err instanceof Error) {
			alert(err.message);
		}
	}
});
