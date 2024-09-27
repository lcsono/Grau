function renderizarCadastro() {
    const cadastroContainer = document.getElementById('cadastro-container');
    
    const dados = JSON.parse(localStorage.getItem('userData'));
    
    cadastroContainer.innerHTML = '';

    if (!dados || !dados.user) {
        cadastroContainer.innerHTML = '<p>Nenhum dado cadastrado.</p>';
        return;
    }

    const user = dados.user;

    const userInfo = `
        <div class="cadastro-item"><strong>ID:</strong> ${user.id}</div>
        <div class="cadastro-item"><strong>Nome:</strong> ${user.name}</div>
        <div class="cadastro-item"><strong>Email:</strong> ${user.email}</div>
        <div class="cadastro-item"><strong>CPF/CNPJ:</strong> ${user.cpf_cnpj}</div>
        <div class="cadastro-item"><strong>Telefone:</strong> ${user.phone}</div>
        <div class="cadastro-item"><strong>Data de Nascimento:</strong> ${user.birthday}</div>
    `;

    cadastroContainer.innerHTML = userInfo;
}

renderizarCadastro();
