const API_PEDIDOS = "http://localhost:8080/pedido";
const API_CLIENTES = "http://localhost:8080/cliente";

const urlParams = new URLSearchParams(window.location.search);
const pedidoId = urlParams.get("id");

// Carregar os dados do pedido e cliente
window.onload = carregarPedido;

async function carregarPedido() {
    try {
        const response = await fetch(`${API_PEDIDOS}/${pedidoId}`);
        if (!response.ok) {
            throw new Error("Erro ao carregar os dados do pedido.");
        }

        const pedido = await response.json();
        document.querySelector("#descricao").value = pedido.descricao;
        document.querySelector("#valor").value = pedido.valor;
        document.querySelector("#status").value = pedido.status;

        // Buscar o cliente associado ao pedido
        const cliente = await buscarCliente(pedido.clienteId);
        document.querySelector("#cliente").value = cliente.id; // Seleciona o cliente correto

    } catch (error) {
        console.error("Erro ao carregar pedido:", error);
        alert("Erro ao carregar os dados do pedido.");
    }
}

async function buscarCliente(id) {
    try {
        const response = await fetch(`${API_CLIENTES}/${id}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar cliente.");
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        return { nome: "Desconhecido" }; // Caso erro ao buscar cliente
    }
}

document.querySelector("#form-editar-pedido").onsubmit = function (e) {
    e.preventDefault();

    const descricao = document.querySelector("#descricao").value;
    const valor = document.querySelector("#valor").value;
    const status = document.querySelector("#status").value;
    const clienteId = document.querySelector("#cliente").value;

    if (!descricao || !valor || !status || !clienteId) {
        alert("Todos os campos são obrigatórios.");
        return;
    }

    if (isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
        alert("O valor deve ser um número válido e maior que 0.");
        return;
    }

    const pedido = { id: pedidoId, descricao, valor, status, clienteId };

    fetch(`${API_PEDIDOS}/editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao editar pedido.");
            alert("Pedido editado com sucesso!");
            window.location.href = "pedidos.html"; // Redireciona para a lista de pedidos
        })
        .catch(error => alert(`Erro ao editar pedido: ${error}`));
};
