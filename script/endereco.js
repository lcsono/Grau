document.getElementById('loginButton').addEventListener('click', async function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
  
    let valid = true;
  
    if (!email) {
      document.getElementById('email-error').textContent = 'O campo e-mail é obrigatório.';
      valid = false;
    } else if (!password) {
      document.getElementById('password-error').textContent = 'O campo senha é obrigatório.';
      valid = false; 
    }
  
    if (!valid) return;
  
    const loginButton = document.getElementById('loginButton');
    loginButton.textContent = 'Aguarde a resposta...';
    loginButton.disabled = true;
  
    const url = 'https://go-wash-api.onrender.com/api/';
    const session = '0hGqRHf0q38ETNgEcJGce30LcPtuPKo48uKtb7Oj';
    const data = {
      email: email,
      password: password,
      user_type_id: 1,
    };
  
    try {
      const response = await fetch(url + 'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `gowash_session=${session}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert('Erro: ' + errorData.data.errors);
      }
  
      const respData = await response.json();
      sessionStorage.setItem('userData', JSON.stringify(respData));
  
      window.location.href = "../view/home.html";
  
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.style.color = 'red';
    } finally {
      loginButton.textContent = 'Entrar';
      loginButton.disabled = false;
    }
  });