document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('loginButton').addEventListener('click', function() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = '';

    if (email === '' || password === '') {
      errorMessage.textContent = 'Por favor, preencha todos os campos.';
      return;
    }

    const formattedEmail = email.replace(/\D/g, '');

    const loginData = {
      email: formattedEmail,
      password: password
    };

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          errorMessage.textContent = data.message || 'Erro ao fazer login.';
        } else {
          window.location.href = '/dashboard'; 
        }
      })
      .catch(error => {
        errorMessage.textContent = 'Erro de conexão com o servidor.';
      });
  });
});
