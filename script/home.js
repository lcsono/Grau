document.addEventListener('DOMContentLoaded', function () {
    const apiURL = 'https://go-wash-api.onrender.com/api/auth/address';
    
    // Função para pegar o valor do cookie pelo nome
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; 
    }

    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLWdvLXdhc2gtZWZjOWM5NTgyNjg3Lmhlcm9rdWFwcC5jb20vYXBpL2xvZ2luIiwiaWF0IjoxNzEwNDE3MjIyLCJuYmYiOjE3MTA0MTcyMjIsImp0aSI6InBsZll0aENEZ0U1NUNzMHEiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.z1pdEBkx8Hq01B7jNKa42NGxtFFHwb-7O_0y8krVWUY';
    const session = '0hGqRHf0q38ETNgEcJGce30LcPtuPKo48uKtb7Oj';

    let currentPage = 1;
    const rowsPerPage = 10;
    let allData = [];
    let currentEditId = null; // Variável para armazenar o ID do cadastro que está sendo editado

    const editModal = document.getElementById('editModal');
    const closeModal = document.getElementById('closeModal');
    const saveButton = document.getElementById('saveButton');

    async function buscarDados() {
        try {
            const response = await fetch(apiURL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Cookie: `gowash_session=${session}`
                }
            });
            const result = await response.json();
            allData = result.data;
            displayTableData(currentPage); 
            setupPagination(); 
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
                    <button onclick="apagarCadastro(${item.id})">Apagar</button>
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
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Cadastro apagado com sucesso!');
                    buscarDados(); 
                } else {
                    alert('Erro ao apagar cadastro');
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
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Cookie: `gowash_session=${session}`
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
                alert('Cadastro atualizado com sucesso!');
                buscarDados();  
                editModal.style.display = 'none'; 
            })
            .catch(error => console.error('Erro ao atualizar cadastro:', error));
        }
    };

    buscarDados();
});
