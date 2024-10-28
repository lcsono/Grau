import { CONSTANTS } from "./constants.js";
import { CookieManager } from "./cookie-manager.js";

document.addEventListener('DOMContentLoaded', function () {
    const apiURL = 'https://go-wash-api.onrender.com/api/auth/address';
    const cookieManager = new CookieManager();

    const token = cookieManager.getCookie(
      CONSTANTS.COOKIE_ACCESS_TOKEN_KEY
    );
    console.log("Token acessado:", token);
    // const session = '0hGqRHf0q38ETNgEcJGce30LcPtuPKo48uKtb7Oj';

    let currentPage = 1;
    const rowsPerPage = 10;
    let allData = [];
    let currentEditId = null; 

    const editModal = document.getElementById('editModal');
    const closeModal = document.getElementById('closeModal');
    const saveButton = document.getElementById('saveButton');
    const btnCadastrar = document.getElementById('btnCadastrar');

    btnCadastrar.addEventListener('click', function () {
      window.location.href = '../view/endereco.html'; 
    });

    async function buscarDados() {
        try {
            const response = await fetch(apiURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    // Cookie: `gowash_session=${CONSTANTS.GOWASH_SESSION}`
                }
            });
            const result = await response.json();
            if (!result.data) {
              alert(result.status)
                
            } else if (result.data.length === 0) {
              alert('Não há nenhum cadastro de endereço para este usuário!\n Por favor cadastre algun(s) endereços.'); 
            } else {
              allData = result.data;
              displayTableData(currentPage); 
              setupPagination();
            }
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        }
    }

    function displayTableData(page) {
        const tabela = document.querySelector('#cadastro-tabela tbody');
        tabela.innerHTML = ''; 

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = allData.slice(start, end);

        paginatedData.forEach(item => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title || '-'}</td>
                <td>${item.cep || '-'}</td>
                <td>${item.address || '-'}</td>
                <td>${item.number || '-'}</td>
                <td>
                    <button onclick="abrirModal(${item.id}, '${item.title}', '${item.cep}', '${item.address}', '${item.number}')">Editar</button>
                    <button onclick="apagarCadastro(${item.id})">Excluir</button>
                </td>
            `;

            tabela.appendChild(tr);
        });
    }

    function setupPagination() {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = '';

        const pageCount = Math.ceil(allData.length / rowsPerPage);

        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" onclick="changePage(${i})">${i}</a>`;
            if (i === currentPage) {
                li.classList.add("active"); // Destaca a página ativa
            }
            pagination.appendChild(li);
        }
    }

    window.changePage = function(page) {
        currentPage = page;
        displayTableData(page);
        setupPagination(); // Atualiza a paginação
    };

    window.abrirModal = function(id, title, cep, address, number) {
        currentEditId = id; // Armazena o ID do cadastro que está sendo editado
        document.getElementById('modalTitle').value = title;
        document.getElementById('modalCep').value = cep;
        document.getElementById('modalAddress').value = address;
        document.getElementById('modalNumber').value = number;
        
        editModal.style.display = 'block'; // Abre o modal
    };

    closeModal.onclick = function() {
        editModal.style.display = 'none'; // Fecha o modal
    };

    window.apagarCadastro = function(id) {
        if (confirm("Tem certeza que deseja apagar este cadastro?")) {
            fetch(`${apiURL}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Cadastro apagado com sucesso!\n');
                    buscarDados(); 
                } else {
                    alert('Erro ao apagar cadastro\n', response.data);
                }
            })
            .catch(error => console.error('Erro ao apagar cadastro:', error));
        }
    };

    saveButton.onclick = function() {
        const novoTitulo = document.getElementById('modalTitle').value;
        const novoCep = document.getElementById('modalCep').value;
        const novoEndereco = document.getElementById('modalAddress').value;
        const novoNumero = document.getElementById('modalNumber').value;

        if (novoTitulo && novoCep && novoEndereco && novoNumero) {
            fetch(`${apiURL}/${currentEditId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    // Cookie: `gowash_session=${session}`
                },
                body: JSON.stringify({
                    title: novoTitulo,
                    cep: novoCep,
                    address: novoEndereco,
                    number: novoNumero
                })
            })
            .then(response => response.json())
            .then(data => {
                alert('Cadastro atualizado com sucesso!\n', data.response);
                buscarDados();  
                editModal.style.display = 'none'; 
            })
            .catch(error => console.error('Erro ao atualizar cadastro:', error));
        }
    };

    buscarDados();
});
