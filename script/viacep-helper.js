import { CONSTANTS } from './constants.js';

export class ViacepHelper {
	async getAddress(zipCode) {
		let parsedZipCode = zipCode.trim();

		if (parsedZipCode.length === 9 && parsedZipCode.includes('-')) {
			parsedZipCode = parsedZipCode.split('-').join('');
		}

		if (parsedZipCode.length !== 8) {
			throw new TypeError('O CEP deve ter 8 dígitos');
		}

		const url = CONSTANTS.VIACEP_URL.replace('{{ZIP_CODE}}', parsedZipCode);

		const response = await fetch(url, { method: 'GET' });
		return response.json();
	}
}
