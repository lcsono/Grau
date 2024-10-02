// Função para validar um campo e exibir a mensagem de erro, se necessário
function validateField(fieldId, errorMessage) {
  const field = document.getElementById(fieldId);
  const errorField = document.getElementById(`${fieldId}-error`);
  
  if (!field.value.trim()) {
    errorField.textContent = errorMessage;
    return false;
  } else {
    errorField.textContent = ''; 
    return true;
  }
}

function validateFields() {
  const validations = [
    { fieldId: 'title', message: 'O campo título é obrigatório.' },
    { fieldId: 'cep', message: 'O campo CEP é obrigatório.' },
    { fieldId: 'address', message: 'O campo endereço é obrigatório.' },
    { fieldId: 'number', message: 'O campo número é obrigatório.' }
  ];

  let allValid = true;

  validations.forEach(validation => {
    const isValid = validateField(validation.fieldId, validation.message);
    if (!isValid) {
      allValid = false;
    }
  });

  return allValid;
}

document.getElementById("button").addEventListener("click", async function () {
  if (!validateFields()) {
    return; 
  }

  const title = document.getElementById("title").value;
  const cep = document.getElementById("cep").value;
  const address = document.getElementById("address").value;
  const number = document.getElementById("number").value;
  const complement = document.getElementById("complement").value;

  const button = document.getElementById("button");
  button.value = "Cadastrando...";
  button.disabled = true;

  const url = "https://go-wash-api.onrender.com/api/";
  const session = '0hGqRHf0q38ETNgEcJGce30LcPtuPKo48uKtb7Oj';
  const data = {
    title: title,
    cep: cep,
    address: address,
    number: number,
    complement: complement,
  };

  try {
    const response = await fetch(url + 'auth/address', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `gowash_session=${session}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert("Erro: " + errorData.message);
    } else {
      const respData = await response.json();
      alert("Endereço cadastrado com sucesso!");

      document.getElementById("title").value = "";
      document.getElementById("cep").value = "";
      document.getElementById("address").value = "";
      document.getElementById("number").value = "";
      document.getElementById("complement").value = "";
    }
  } catch (error) {
    alert("Erro ao cadastrar o endereço: " + error.message);
  } finally {
    button.value = "Cadastrar";
    button.disabled = false;
  }
});
