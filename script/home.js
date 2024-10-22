import { CONSTANTS } from "./constants.js";
import { CookieManager } from "./cookie-manager.js";

async function renderizarCadastro() {
  console.log("bateu na funcao");
  const cookieManager = new CookieManager();
  const BASE_URL = "https://go-wash-api.onrender.com/api";

  const cadastroContainer = document.getElementById("cadastro-container");

  const userToken = cookieManager.getCookie(CONSTANTS.COOKIE_ACCESS_TOKEN_KEY);

  const response = await fetch(BASE_URL + "/auth/address", {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  const { data } = await response.json();

  if (!response.ok) {
    alert(data.errors);

    cadastroContainer.innerHTML = `<p>${data.errors.join(", ")}</p>`;

    return;
  }

  cadastroContainer.innerHTML = "";

  if (!data || !data.length) {
    cadastroContainer.innerHTML = "<p>Nenhum dado cadastrado.</p>";

    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
    <tr>
        <th>ID</th>
        <th>Título</th>
        <th>CEP</th>
        <th>Endereço</th>
        <th>Número</th>
        <th>Complemento</th>
        <th>Latitude</th>
        <th>Longitude</th>
        <th>Endereço Formatado</th>
    </tr>
    </thead>
    <tbody></tbody>
`;

  const tbody = table.querySelector("tbody");

  data.forEach((address) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${address.id}</td>
      <td>${address.title || "-"}</td>
      <td>${address.cep || "-"}</td>
      <td>${address.address || "-"}</td>
      <td>${address.number || "-"}</td>
      <td>${address.complement || "-"}</td>
      <td>${address.lat || "-"}</td>
      <td>${address.lng || "-"}</td>
      <td>${address.formatted_address || "-"}</td>
    `;

    tbody.appendChild(row);
  });

  cadastroContainer.appendChild(table);
}

console.log("teste");
window.addEventListener("load", () => renderizarCadastro);
renderizarCadastro();
