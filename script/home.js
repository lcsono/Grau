document.addEventListener('DOMContentLoaded', function() {
    const apiURL = 'https://go-wash-api.onrender.com/api/auth/address';
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLWdvLXdhc2gtZWZjOWM5NTgyNjg3Lmhlcm9rdWFwcC5jb20vYXBpL2xvZ2luIiwiaWF0IjoxNzEwNDE3MjIyLCJuYmYiOjE3MTA0MTcyMjIsImp0aSI6InBsZll0aENEZ0U1NUNzMHEiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.z1pdEBkx8Hq01B7jNKa42NGxtFFHwb-7O_0y8krVWUY';

    let currentPage = 1;
    const rowsPerPage = 10;
    let allData = [];

    async function buscarDados() {
        try {
            const response = await fetch(apiURL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            allData = result.data; // Armazena todos os dados
            displayTableData(currentPage); // Exibe a primeira página
            setupPagination(); // Configura os botões de paginação
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    function displayTableData(page) {
        const tabela = document.querySelector('#cadastro-tabela tbody');
        tabela.innerHTML = ''; 

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = allData.slice(start, end); // Divide os dados pela página

        paginatedData.forEach(item => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title || '-'}</td>
                <td>${item.cep || '-'}</td>
                <td>${item.address || '-'}</td>
                <td>${item.number || '-'}</td>
                <td>
                    <button onclick="editarCadastro(${item.id}, '${item.title}', '${item.cep}', '${item.address}', '${item.number}')">Editar</button>
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
            pagination.appendChild(li);
        }
    }

    function changePage(page) {
        currentPage = page;
        displayTableData(page);

        // Atualiza a classe "active" da paginação
        document.querySelectorAll(".pagination li").forEach((li, index) => {
            if (index + 1 === page) {
                li.classList.add("active");
            } else {
                li.classList.remove("active");
            }
        });
    }

    // Funções para editar e apagar os cadastros
    window.editarCadastro = function(id, title, cep, address, number) {
        const novoTitulo = prompt("Editar título", title);
        const novoCep = prompt("Editar CEP", cep);
        const novoEndereco = prompt("Editar endereço", address);
        const novoNumero = prompt("Editar número", number);

        if (novoTitulo && novoCep && novoEndereco && novoNumero) {
            fetch(`${apiURL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
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
            })
            .catch(error => console.error('Erro ao atualizar cadastro:', error));
        }
    }

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
    }

    buscarDados();
});
