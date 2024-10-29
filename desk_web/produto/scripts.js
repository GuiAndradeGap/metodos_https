const API_URL = 'http://localhost:81/API/Controller/produtos.php';
        let currentEditId = null; // Para armazenar o ID do produto sendo editado

        async function loadProdutos() {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error(`Erro ao carregar produtos: ${response.status} ${response.statusText}`);
                const produtos = await response.json();

                const produtosBody = document.getElementById('produtos-body');
                produtosBody.innerHTML = '';

                produtos.forEach(produto => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${produto.id_produto}</td>
                        <td>${produto.nome}</td>
                        <td>${produto.descricao}</td>
                        <td>${produto.preco}</td>
                        <td>${produto.qtd}</td>
                        <td>${produto.validade}</td>
                        <td>
                            <button onclick="editProduto(${produto.id_produto})">Editar</button>
                            <button onclick="deleteProduto(${produto.id_produto})">Excluir</button>
                        </td>
                    `;
                    produtosBody.appendChild(row);
                });
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
                alert('Ocorreu um erro ao carregar a lista de produtos.');
            }
        }

        document.getElementById('add-product-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const produtoData = {
                nome: document.getElementById('nome-produto').value,
                descricao: document.getElementById('descricao').value,
                preco: parseFloat(document.getElementById('preco').value),
                qtd: parseInt(document.getElementById('quantidade').value, 10),
                validade: document.getElementById('validade').value,
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(produtoData),
                });

                if (!response.ok) throw new Error(`Erro: ${response.status} ${response.statusText}`);

                const result = await response.json();
                alert(result.mensagem);
                loadProdutos();
                document.getElementById('add-product-form').reset();
            } catch (error) {
                console.error('Erro ao adicionar produto:', error);
                alert('Ocorreu um erro ao adicionar o produto. Tente novamente.');
            }
        });

        async function editProduto(id_produto) {
            const rows = Array.from(document.querySelectorAll('#produtos-body tr'));
            const row = rows.find(row => row.cells[0].innerText == id_produto);

            if (!row) {
                alert('Produto não encontrado.');
                return;
            }

            currentEditId = id_produto; // Armazena o ID do produto que está sendo editado
            document.getElementById('nome-produto').value = row.cells[1].innerText;
            document.getElementById('descricao').value = row.cells[2].innerText;
            document.getElementById('preco').value = parseFloat(row.cells[3].innerText).toFixed(2);
            document.getElementById('quantidade').value = parseInt(row.cells[4].innerText, 10);
            document.getElementById('validade').value = row.cells[5].innerText;
            document.getElementById('submit-button').style.display = 'none';
            document.getElementById('edit-button').style.display = 'inline-block';
        }

        document.getElementById('edit-button').addEventListener('click', async () => {
            const produtoData = {
                id_produto: currentEditId,
                nome: document.getElementById('nome-produto').value,
                descricao: document.getElementById('descricao').value,
                preco: parseFloat(document.getElementById('preco').value),
                qtd: parseInt(document.getElementById('quantidade').value, 10),
                validade: document.getElementById('validade').value,
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(produtoData),
                });

                if (!response.ok) throw new Error(`Erro: ${response.status} ${response.statusText}`);

                const result = await response.json();
                alert(result.mensagem);
                loadProdutos();
                document.getElementById('add-product-form').reset();
                document.getElementById('submit-button').style.display = 'inline-block';
                document.getElementById('edit-button').style.display = 'none';
                currentEditId = null; // Reseta o ID do produto após a edição
            } catch (error) {
                console.error('Erro ao editar produto:', error);
                alert('Ocorreu um erro ao editar o produto. Tente novamente.');
            }
        });

        async function deleteProduto(id_produto) {
            const confirmDelete = confirm('Tem certeza que deseja excluir este produto?');
            if (!confirmDelete) return;

            try {
                const response = await fetch(API_URL, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_produto }),
                });

                if (!response.ok) throw new Error(`Erro: ${response.status} ${response.statusText}`);

                const result = await response.json();
                alert(result.mensagem);
                loadProdutos();
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
                alert('Ocorreu um erro ao excluir o produto. Tente novamente.');
            }
        }

        // Carrega os produtos ao carregar a página
        window.onload = loadProdutos;