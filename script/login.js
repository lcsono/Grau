document.getElementById('loginButton').addEventListener('click', async function () {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  document.getElementById('email-error').textContent = '';
  document.getElementById('password-error').textContent = '';
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = '';

  let valid = true;

  if (!email) {
    document.getElementById('email-error').textContent = 'O campo e-mail é obrigatório.';
    valid = false;
  } else if (!password) {
    document.getElementById('password-error').textContent = 'O campo senha é obrigatório.';
    valid = false; 
  }

  if (!valid) return;

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
      console.log('Erro:', errorData);
      throw new Error(errorData.errors || 'Erro desconhecido');
    }

    const respData = await response.json();
    console.log('Login realizado com sucesso!' + 'resposta:', respData);
    alert("Login realizado com sucesso!");
    // window.location.href = "../view/home.html";

  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.style.color = 'red';
  }
});
