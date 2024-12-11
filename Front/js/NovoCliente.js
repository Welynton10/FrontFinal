const API_URL = "http://localhost:8080/cliente";  // URL da API do cliente

// Adiciona o listener ao formulário de novo cliente
document.querySelector("#form-cadastro-cliente").addEventListener("submit", function (event) {
    event.preventDefault();  // Evita o envio tradicional do formulário

    // Coleta os valores dos campos
    const nome = document.querySelector("#nomeCliente").value;
    const cpf = document.querySelector("#cpfCliente").value;
    const telefone = document.querySelector("#telefoneCliente").value;
    const endereco = document.querySelector("#enderecoCliente").value || "";  // Endereço pode ser vazio

    // Validações básicas
    if (!nome || !cpf || !telefone) {
        alert("Nome, CPF e telefone são campos obrigatórios.");
        return;
    }

    // Valida o formato do CPF
    if (cpf.length !== 11) {
        alert("O CPF deve ter exatamente 11 dígitos.");
        return;
    }

    // Cria o objeto cliente para enviar para a API
    const novoCliente = { nome, cpf, telefone, endereco };

    console.log("Cliente a ser cadastrado:", JSON.stringify(novoCliente));

    // Envia o novo cliente para a API
    fetch(`${API_URL}/salvar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoCliente)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    console.error("Erro ao cadastrar cliente:", errorMessage);
                    throw new Error(errorMessage);
                });
            }

            alert("Cliente cadastrado com sucesso!");
            window.location.href = "clientes.html";  // Redireciona para a página de clientes
        })
        .catch(error => {
            alert(`Erro ao cadastrar cliente: ${error.message}`);
        });
});
