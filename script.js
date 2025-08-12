// frontend/script.js
const api = "http://localhost:3000/clientes";
const form = document.getElementById("formCliente");
const tabela = document.getElementById("tabelaClientes");

async function carregarClientes() {
    const res = await fetch(api);
    const dados = await res.json();
    tabela.innerHTML = "";
    dados.forEach(cliente => {
        tabela.innerHTML += `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.telefone || ""}</td>
                <td>${cliente.endereco || ""}</td>
                <td>${cliente.cargo || ""}</td>
                <td>
                    <button onclick="editar(${cliente.id}, '${cliente.nome}', '${cliente.email}', '${cliente.telefone}', '${cliente.endereco}', '${cliente.cargo}')">✏️</button>
                    <button onclick="deletar(${cliente.id})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("id").value;
    const cliente = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        endereco: document.getElementById("endereco").value,
        cargo: document.getElementById("cargo").value
    };

    if (id) {
        await fetch(`${api}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cliente) });
    } else {
        await fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cliente) });
    }
    form.reset();
    carregarClientes();
});

async function deletar(id) {
    if (confirm("Deseja excluir este cliente?")) {
        await fetch(`${api}/${id}`, { method: "DELETE" });
        carregarClientes();
    }
}

function editar(id, nome, email, telefone, endereco, cargo) {
    document.getElementById("id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("email").value = email;
    document.getElementById("telefone").value = telefone;
    document.getElementById("endereco").value = endereco;
    document.getElementById("cargo").value = cargo;
}

carregarClientes();
