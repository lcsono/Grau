async function register() {
    const nameInput = document.querySelector('#input-name');
    const emailInput = document.querySelector('#input-email');
    const passwordInput = document.querySelector('#input-password');
    const cpfCnpjInput = document.querySelector('#input-cpf-cnpj');
    const birthDateInput = document.querySelector('#input-birth-date');
    const termsInput = document.querySelector('#input-terms');

    const body = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        cpfCnpj: cpfCnpjInput.value,
        birthDate: birthDateInput.value,
        checkedTerms: termsInput.checked,
    };

    console.log(body)
}

document.querySelector('input[type="button"]').addEventListener('click', register)
switch cons.body