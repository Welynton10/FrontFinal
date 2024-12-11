const API_URL = "http://localhost:8080/cliente";  // URL da API do cliente

window.onload = loadClients;

function loadClients() {
    fetch(`${API_URL}/listar`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar os dados dos clientes.");
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector("#clientList");
            tableBody.innerHTML = "";  // Limpa a tabela antes de popular

            function displayClients(filteredClients) {
                tableBody.innerHTML = "";  // Limpa a tabela novamente antes de preencher
                filteredClients.forEach(client => {
                    const row = `
                        <tr>
                            <td>${client.nome}</td>
                            <td>${client.cpf}</td>
                            <td>${client.telefone || "Não informado"}</td>
                            <td>${client.endereco || "Não informado"}</td>
                            <td>
                                <a href="editar-cliente.html?id=${client.id}" class="btn btn-warning btn-sm">Editar</a>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${client.id}">Excluir</button>
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });

                // Adiciona eventos de exclusão
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        const clientId = this.dataset.id;
                        removeClient(clientId);
                    });
                });
            }

            // Exibe todos os clientes ao carregar a página
            displayClients(data);

            // Função de busca
            document.querySelector('#searchButton').addEventListener('click', () => {
                const searchTerm = document.querySelector('#searchCPF').value.toLowerCase();
                const filteredClients = data.filter(client =>
                    client.nome.toLowerCase().includes(searchTerm) || client.cpf.includes(searchTerm)
                );
                displayClients(filteredClients);
            });

            // Filtro dinâmico enquanto digita
            document.querySelector('#searchCPF').addEventListener('input', () => {
                const searchTerm = document.querySelector('#searchCPF').value.toLowerCase();
                const filteredClients = data.filter(client =>
                    client.nome.toLowerCase().includes(searchTerm) || client.cpf.includes(searchTerm)
                );
                displayClients(filteredClients);
            });
        })
        .catch(error => {
            alert(`Falha ao carregar os clientes: ${error.message}`);
        });
}

// Função de exclusão de cliente
function removeClient(id) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        fetch(`${API_URL}/remover/${id}`, {
            method: "DELETE",
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errMessage => {
                        throw new Error(errMessage);
                    });
                }
                alert("Cliente excluído com sucesso!");
                loadClients();  // Recarrega a lista de clientes após a exclusão
            })
            .catch(error => {
                alert(`Erro ao excluir cliente: ${error.message}`);
            });
    }

}
