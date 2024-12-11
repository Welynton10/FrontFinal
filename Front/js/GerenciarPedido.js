const API_PEDIDOS = "http://localhost:8080/pedidos";
const API_CLIENTES = "http://localhost:8080/clientes";

let pedidos = [];
let clientes = [];

window.onload = async () => {
    await carregarPedidos();
    configurarBusca();
};

async function carregarPedidos() {
    try {
        const response = await fetch(`${API_PEDIDOS}/listar`);
        if (!response.ok) throw new Error("Falha ao carregar os pedidos.");

        pedidos = await response.json();
        const tabela = document.querySelector("#pedidos-table tbody");
        tabela.innerHTML = ""; // Limpar a tabela antes de adicionar novos dados

        for (const pedido of pedidos) {
            const cliente = await obterCliente(pedido.clienteId);
            const linha = criarLinhaTabela(pedido, cliente);
            tabela.innerHTML += linha;
        }
    } catch (erro) {
        console.error("Erro ao carregar pedidos:", erro.message);
        alert("Não foi possível carregar os pedidos. Tente novamente mais tarde.");
    }
}

async function obterCliente(idCliente) {
    const clienteExistente = clientes.find(cliente => cliente.id === idCliente);
    if (clienteExistente) return clienteExistente;

    try {
        const response = await fetch(`${API_CLIENTES}/${idCliente}`);
        if (!response.ok) throw new Error("Erro ao buscar cliente.");

        const cliente = await response.json();
        clientes.push(cliente); // Armazena o cliente para uso futuro
        return cliente;
    } catch (erro) {
        console.error("Erro ao buscar cliente:", erro.message);
        return { nome: "Desconhecido", cpf: "N/A" }; // Retorna cliente desconhecido
    }
}

function criarLinhaTabela(pedido, cliente) {
    return `
        <tr>
            <td>${pedido.descricao}</td>
            <td>${pedido.valor}</td>
            <td>${pedido.status}</td>
            <td>${cliente.nome}</td>
            <td>
                <button class="btn btn-primary btn-sm editar-btn" data-id="${pedido.id}">Editar</button>
                <button class="btn btn-danger btn-sm excluir-btn" data-id="${pedido.id}">Excluir</button>
            </td>
        </tr>
    `;
}

function configurarBusca() {
    const searchInput = document.getElementById('search-bar');
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const pedidosFiltrados = pedidos.filter(pedido => {
            const cliente = clientes.find(c => c.id === pedido.clienteId);
            return cliente && (cliente.nome.toLowerCase().includes(query) || cliente.cpf.includes(query));
        });
        atualizarTabela(pedidosFiltrados);
    });
}

function atualizarTabela(pedidosFiltrados) {
    const tabela = document.querySelector("#pedidos-table tbody");
    tabela.innerHTML = ""; // Limpar a tabela antes de adicionar novos dados

    pedidosFiltrados.forEach(pedido => {
        const cliente = clientes.find(c => c.id === pedido.clienteId);
        const linha = criarLinhaTabela(pedido, cliente);
        tabela.innerHTML += linha;
    });
}

document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('excluir-btn')) {
        const pedidoId = event.target.getAttribute('data-id');
        const confirmacao = confirm("Tem certeza que deseja excluir este pedido?");
        if (confirmacao) {
            await excluirPedido(pedidoId);
            carregarPedidos(); // Recarrega a lista após a exclusão
        }
    }
});

async function excluirPedido(id) {
    try {
        const response = await fetch(`${API_PEDIDOS}/remover/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Erro ao excluir o pedido.");
        alert("Pedido excluído com sucesso!");
    } catch (erro) {
        console.error("Erro ao excluir pedido:", erro.message);
        alert("Falha ao excluir o pedido.");
    }
}
