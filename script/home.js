import { CONSTANTS } from './constants.js';
import { CookieManager } from './cookie-manager.js';

document.addEventListener('DOMContentLoaded', () => {
	// Função para buscar os endereços e preencher a tabela
	async function fetchAddresses() {
		try {
			const cookieManager = new CookieManager();
			const accessToken = cookieManager.getCookie(CONSTANTS.COOKIE_ACCESS_TOKEN_KEY);

			const response = await fetch(CONSTANTS.GOWASH_BASE_URL + '/auth/addresses', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${accessToken}`, // Utilizando o token para autenticação
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert('Erro ao buscar os endereços: ' + errorData.message);
				return;
			}

			const addresses = await response.json();
			populateAddressTable(addresses);

		} catch (error) {
			alert('Erro ao buscar os endereços: ' + error.message);
		}
	}

	// Função para preencher a tabela com os dados dos endereços
	function populateAddressTable(addresses) {
		const tableBody = document.querySelector('#address-table tbody');
		tableBody.innerHTML = ''; 

		addresses.forEach((address) => {
			const row = document.createElement('tr');

			row.innerHTML = `
				<td>${address.title}</td>
				<td>${address.zipCode}</td>
				<td>${address.address}</td>
				<td>${address.number}</td>
				<td>${address.complement || 'N/A'}</td>
				<td>
					<button class="edit-btn" data-id="${address.id}">Editar</button>
					<button class="delete-btn" data-id="${address.id}">Excluir</button>
				</td>
			`;

			tableBody.appendChild(row);
		});
	}

	async function deleteAddress(id) {
		try {
			const cookieManager = new CookieManager();
			const accessToken = cookieManager.getCookie(CONSTANTS.COOKIE_ACCESS_TOKEN_KEY);

			const response = await fetch(`${CONSTANTS.GOWASH_BASE_URL}/auth/address/${id}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${accessToken}`, // Utilizando o token para autenticação
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert('Erro ao deletar o endereço: ' + errorData.message);
				return;
			}

			alert('Endereço excluído com sucesso!');
			fetchAddresses(); // Atualiza a tabela após a exclusão

		} catch (error) {
			alert('Erro ao deletar o endereço: ' + error.message);
		}
	}

	document.querySelector('#address-table').addEventListener('click', (event) => {
		const target = event.target;

		if (target.classList.contains('delete-btn')) {
			const id = target.getAttribute('data-id');
			if (confirm('Tem certeza que deseja excluir este endereço?')) {
				deleteAddress(id);
			}
		} else if (target.classList.contains('edit-btn')) {
			const id = target.getAttribute('data-id');
			// window.location.href = `edit-address.html?id=${id}`; 
		}
	});

	fetchAddresses();
});
