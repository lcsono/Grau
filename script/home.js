function renderizarCadastro() {
    const cadastroContainer = document.getElementById('cadastro-container');
    const cadastroContainerNome = document.getElementById('nome_cadastro');

    const dados = JSON.parse(localStorage.getItem('userData'));
    
    cadastroContainer.innerHTML = '';

    if (!dados || !dados.user) {
        cadastroContainer.innerHTML = '<p>Nenhum dado cadastrado.</p>';
        return;
    }

    const user = dados.user;
    const nome = `
      <div class="cadastro-item"><strong>${user.name}</strong></div>
    `;
    const userInfo = `
        <div class="cadastro-item"><strong>ID:</strong> ${user.id}</div>
        <div class="cadastro-item"><strong>Email:</strong> ${user.email}</div>
        <div class="cadastro-item"><strong>CPF/CNPJ:</strong> ${user.cpf_cnpj}</div>
        <div class="cadastro-item"><strong>Telefone:</strong> ${user.phone}</div>
        <div class="cadastro-item"><strong>Data de Nascimento:</strong> ${user.birthday}</div>
    `;
  
    cadastroContainerNome.innerHTML = nome
    cadastroContainer.innerHTML = userInfo;
}

renderizarCadastro();
