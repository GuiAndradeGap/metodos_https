const API_URL = 'http://localhost:81/API/Controller/pedidos.php';

// Função para carregar os pedidos
async function loadPedidos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro ao carregar pedidos: ${response.status} ${response.statusText}`);
        }
        const pedidos = await response.json();

        const pedidosBody = document.getElementById('pedidos-body');
        pedidosBody.innerHTML = ''; // Limpa o conteúdo anterior

        pedidos.forEach(pedido => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pedido.id_pedido}</td>
                <td>${pedido.id_cliente}</td>
                <td>${pedido.data}</td>
                <td>
                    <button onclick="editPedido(${pedido.id_pedido})">Editar</button>
                    <button onclick="deletePedido(${pedido.id_pedido})">Excluir</button>
                </td>
            `;
            pedidosBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        alert('Ocorreu um erro ao carregar a lista de pedidos.');
    }
}

// Função para adicionar um pedido
document.getElementById('add-pedido-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio do formulário padrão

    const pedidoData = {
        id_cliente: parseInt(document.getElementById('id_cliente').value, 10),
        data: document.getElementById('data').value,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedidoData),
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        alert(result.mensagem); // Exibe a mensagem de resposta

        loadPedidos(); // Recarrega a lista de pedidos
        document.getElementById('add-pedido-form').reset(); // Reseta o formulário após o envio
    } catch (error) {
        console.error('Erro ao adicionar pedido:', error);
        alert('Ocorreu um erro ao adicionar o pedido. Tente novamente.');
    }
});

async function editPedido(id) {
    const rows = Array.from(document.querySelectorAll('#pedidos-body tr')); 
    const row = rows.find(row => row.cells[0].innerText == id);

    if (!row) {
        alert('Pedido não encontrado.');
        return;
    }

    const pedidoData = {
        id_pedido: id,
        id_cliente: parseInt(row.cells[1].innerText, 10),
        data: row.cells[2].innerText,
    };

    document.getElementById('id_cliente').value = pedidoData.id_cliente;
    document.getElementById('data').value = pedidoData.data;
    document.getElementById('submit-button').style.display = 'none';
    document.getElementById('edit-button').style.display = 'inline';
    document.getElementById('edit-button').onclick = async () => {
        await updatePedido(pedidoData.id_pedido);
    };
}

async function updatePedido(id) {
    const pedidoData = {
        id_pedido: id,
        id_cliente: parseInt(document.getElementById('id_cliente').value, 10),
        data: document.getElementById('data').value,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedidoData),
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        alert(result.mensagem); // Exibe a mensagem de resposta

        loadPedidos(); // Recarrega a lista de pedidos
        document.getElementById('add-pedido-form').reset(); // Reseta o formulário após o envio
        document.getElementById('submit-button').style.display = 'inline';
        document.getElementById('edit-button').style.display = 'none';
    } catch (error) {
        console.error('Erro ao editar pedido:', error);
        alert('Ocorreu um erro ao editar o pedido. Tente novamente.');
    }
}

async function deletePedido(id) {
    if (!confirm('Você tem certeza que deseja excluir este pedido?')) {
        return;
    }

try {
    const response = await fetch(`${API_URL}`, {
        method: 'DELETE',
        headers: {
                'Content-Type': 'application/json'
            },
body: JSON.stringify({ id_pedido: id }) // Envia o ID do pedido no corpo da requisição como JSON
});

if (!response.ok) {
    throw new Error(`Erro: ${response.status} ${response.statusText}`);
}

const result = await response.json();
alert(result.mensagem); // Exibe a mensagem de resposta
loadPedidos(); // Recarrega a lista de pedidos

} catch (error) {
    console.error('Erro ao excluir pedido:', error);
    alert('Ocorreu um erro ao excluir o pedido. Tente novamente.');
}
}


// Carregar os pedidos ao iniciar a página
loadPedidos();