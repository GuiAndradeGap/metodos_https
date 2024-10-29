const API_URL = 'http://localhost:81/API/Controller/pedido_produto.php';
        const API_PEDIDOS_URL = 'http://localhost:81/API/Controller/pedidos.php';
        const API_PRODUTOS_URL = 'http://localhost:81/API/Controller/produtos.php';

        // Função para carregar pedidos
        async function loadPedidos() {
            try {
                const response = await fetch(API_PEDIDOS_URL);
                const pedidos = await response.json();

                const idPedidoSelect = document.getElementById('id_pedido');
                pedidos.forEach(pedido => {
                    const option = document.createElement('option');
                    option.value = pedido.id_pedido;
                    option.textContent = pedido.id_pedido;
                    idPedidoSelect.appendChild(option);
                });
            } catch (error) {
                console.error('Erro ao carregar pedidos:', error);
            }
        }

        // Função para carregar produtos
        async function loadProdutos() {
            try {
                const response = await fetch(API_PRODUTOS_URL);
                const produtos = await response.json();

                const idProdutoSelect = document.getElementById('id_produto');
                produtos.forEach(produto => {
                    const option = document.createElement('option');
                    option.value = produto.id_produto;
                    option.textContent = produto.id_produto;
                    idProdutoSelect.appendChild(option);
                });
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            }
        }

        // Função para carregar pedidos produtos
        async function loadPedidosProdutos() {
            try {
                const response = await fetch(API_URL);
                const pedidosProdutos = await response.json();

                const pedidosProdutosBody = document.getElementById('pedidos-produtos-body');
                pedidosProdutosBody.innerHTML = ''; // Limpa o conteúdo anterior

                pedidosProdutos.forEach(pedidoProduto => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${pedidoProduto.id_pedido}</td>
                        <td>${pedidoProduto.id_produto}</td>
                        <td>${pedidoProduto.qtd}</td>
                        <td>
                            <button onclick="editPedidoProduto('${pedidoProduto.id_pedido}', '${pedidoProduto.id_produto}', ${pedidoProduto.qtd})">Editar</button>
                            <button onclick="deletePedidoProduto('${pedidoProduto.id_pedido}', '${pedidoProduto.id_produto}')">Excluir</button>
                        </td>
                    `;
                    pedidosProdutosBody.appendChild(row);
                });
            } catch (error) {
                console.error('Erro ao carregar pedidos produtos:', error);
            }
        }

        // Função para adicionar um pedido produto
        document.getElementById('add-pedido-produto-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const id_pedido = document.getElementById('id_pedido').value;
            const id_produto = document.getElementById('id_produto').value;
            const qtd = document.getElementById('qtd').value;

            const data = { id_pedido, id_produto, qtd };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                alert(result.mensagem); // Mostra a mensagem de resposta
                loadPedidosProdutos(); // Atualiza a tabela
                document.getElementById('add-pedido-produto-form').reset(); // Limpa o formulário
            } catch (error) {
                console.error('Erro ao adicionar pedido produto:', error);
            }
        });

        // Função para editar um pedido produto
        function editPedidoProduto(id_pedido, id_produto, qtd) {
            document.getElementById('id_pedido').value = id_pedido;
            document.getElementById('id_produto').value = id_produto;
            document.getElementById('qtd').value = qtd;

            document.getElementById('submit-button').style.display = 'none';
            const editButton = document.getElementById('edit-button');
            editButton.style.display = 'block';

            editButton.onclick = async () => {
                const updatedData = { id_pedido, id_produto, qtd: document.getElementById('qtd').value };

                try {
                    const response = await fetch(API_URL, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedData),
                    });

                    const result = await response.json();
                    alert(result.mensagem); // Mostra a mensagem de resposta
                    loadPedidosProdutos(); // Atualiza a tabela
                    document.getElementById('add-pedido-produto-form').reset(); // Limpa o formulário
                    editButton.style.display = 'none';
                    document.getElementById('submit-button').style.display = 'block';
                } catch (error) {
                    console.error('Erro ao editar pedido produto:', error);
                }
            };
        }

        // Função para excluir um pedido produto
        async function deletePedidoProduto(id_pedido, id_produto) {
            const confirmDelete = confirm('Tem certeza que deseja excluir este pedido produto?');
            if (!confirmDelete) return;

            try {
                const response = await fetch(`${API_URL}`, {
                    method: 'DELETE',
                    headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_pedido, id_produto }) // Envia dados no corpo da requisição
            });

            const result = await response.json();
            alert(result.mensagem); // Mostra a mensagem de resposta
            loadPedidosProdutos(); // Atualiza a tabela
            } catch (error) {
            console.error('Erro ao excluir pedido produto:', error);
            }
        }


        // Carregar dados na inicialização
        loadPedidos();
        loadProdutos();
        loadPedidosProdutos();