const API_URL = "http://localhost:8080/cliente";  // URL da API do cliente

// Obtém o ID do cliente da URL
const urlParams = new URLSearchParams(window.location.search);
const clienteId = urlParams.get("id");

// Carrega os dados do cliente ao abrir a página
fetch(`${API_URL}/${clienteId}`)
    .then(response => response.json())
    .then(cliente => {
        // Preenche os campos do formulário com os dados do cliente
        document.querySelector("#nomeCliente").value = cliente.nome;
        document.querySelector("#cpfCliente").value = cliente.cpf;
        document.querySelector("#telefoneCliente").value = cliente.telefone;
        document.querySelector("#enderecoCliente").value = cliente.endereco;
    })
    .catch(error => {
        console.error("Erro ao carregar cliente:", error);
        alert("Erro ao carregar as informações do cliente.");
    });

// Função que trata a submissão do formulário
document.querySelector("#form-editar-cliente").addEventListener("submit", function (e) {
    e.preventDefault();  // Evita o envio padrão do formulário

    // Coleta os dados atualizados
    const nome = document.querySelector("#nomeCliente").value;
    const cpf = document.querySelector("#cpfCliente").value;
    const telefone = document.querySelector("#telefoneCliente").value;
    const endereco = document.querySelector("#enderecoCliente").value;

    // Valida os campos obrigatórios
    if (!nome || !cpf || !telefone) {
        alert("Nome, CPF e telefone são obrigatórios.");
        return;
    }

    // Verifica a quantidade de dígitos do CPF
    if (cpf.length !== 11) {
        alert("O CPF deve ter 11 dígitos.");
        return;
    }

    // Cria o objeto cliente com as informações do formulário
    const clienteAtualizado = { id: clienteId, nome, cpf, telefone, endereco };

    // Envia os dados para a API para editar o cliente
    fetch(`${API_URL}/editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteAtualizado)
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao editar cliente.");
            alert("Cliente atualizado com sucesso!");
            window.location.href = "clientes.html";  // Redireciona para a lista de clientes
        })
        .catch(error => alert(`Erro ao atualizar cliente: ${error.message}`));
});
