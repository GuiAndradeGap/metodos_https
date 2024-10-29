const API_URL = 'http://localhost:81/API/Controller/clientes.php';

        // Função para carregar os clientes
        async function loadClientes() {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Erro ao carregar clientes: ${response.status} ${response.statusText}`);
                }
                const clientes = await response.json();

                const clientesBody = document.getElementById('clientes-body');
                clientesBody.innerHTML = ''; // Limpa o conteúdo anterior

                clientes.forEach(cliente => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cliente.ID}</td>
                        <td>${cliente.Nome}</td>
                        <td>${cliente.Endereco}</td>
                        <td>${cliente.CPF}</td>
                        <td>${cliente.Telefone}</td>
                        <td>${cliente.Email}</td>
                        <td>${cliente.DataNascimento}</td>
                        <td>
                            <button onclick="editCliente(${cliente.ID})">Editar</button>
                            <button onclick="deleteCliente(${cliente.ID})">Excluir</button>
                        </td>
                    `;
                    clientesBody.appendChild(row);
                });
            } catch (error) {
                console.error('Erro ao carregar clientes:', error);
                alert('Ocorreu um erro ao carregar a lista de clientes.');
            }
        }

        // Função para adicionar um cliente
        document.getElementById('add-client-form').addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio do formulário padrão

            const clienteData = {
                nome: document.getElementById('nome').value,
                endereco: document.getElementById('endereco').value,
                cpf: document.getElementById('cpf').value,
                telefone: document.getElementById('telefone').value,
                email: document.getElementById('email').value,
                dataNascimento: document.getElementById('data-nascimento').value,
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(clienteData),
                });

                if (!response.ok) {
                    throw new Error(`Erro: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                alert(result.resposta); // Exibe a mensagem de resposta

                loadClientes(); // Recarrega a lista de clientes
                document.getElementById('add-client-form').reset(); // Reseta o formulário após o envio
            } catch (error) {
                console.error('Erro ao adicionar cliente:', error);
                alert('Ocorreu um erro ao adicionar o cliente. Tente novamente.');
            }
        });

        async function editCliente(id) {
            const rows = Array.from(document.querySelectorAll('#clientes-body tr')); 
            const row = rows.find(row => row.cells[0].innerText == id);

            if (!row) {
                alert('Cliente não encontrado.');
                return;
            }

            const clienteData = {
                id: id,
                nome: row.cells[1].innerText,
                endereco: row.cells[2].innerText,
                cpf: row.cells[3].innerText,
                telefone: row.cells[4].innerText,
                email: row.cells[5].innerText,
                dataNascimento: row.cells[6].innerText,
            };

            document.getElementById('nome').value = clienteData.nome;
            document.getElementById('endereco').value = clienteData.endereco;
            document.getElementById('cpf').value = clienteData.cpf;
            document.getElementById('telefone').value = clienteData.telefone;
            document.getElementById('email').value = clienteData.email;
            document.getElementById('data-nascimento').value = clienteData.dataNascimento;

            document.getElementById('submit-button').style.display = 'none';
            document.getElementById('edit-button').style.display = 'block';
            document.getElementById('edit-button').onclick = () => updateCliente(clienteData.id);
        }

        async function updateCliente(id) {
            const clienteData = {
                id: id,
                nome: document.getElementById('nome').value,
                endereco: document.getElementById('endereco').value,
                cpf: document.getElementById('cpf').value,
                telefone: document.getElementById('telefone').value,
                email: document.getElementById('email').value,
                dataNascimento: document.getElementById('data-nascimento').value,
            };

            try {
                const response = await fetch(`${API_URL}?id=${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(clienteData),
                });

                if (!response.ok) {
                    throw new Error(`Erro: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                alert(result.mensagem); // Exibe a mensagem de resposta

                loadClientes(); // Recarrega a lista de clientes
                document.getElementById('add-client-form').reset(); // Reseta o formulário após o envio
                document.getElementById('submit-button').style.display = 'block';
                document.getElementById('edit-button').style.display = 'none';
            } catch (error) {
                console.error('Erro ao atualizar cliente:', error);
                alert('Ocorreu um erro ao atualizar o cliente. Tente novamente.');
            }
        }

        async function deleteCliente(id) {
                const confirmDelete = confirm('Você tem certeza que deseja excluir este cliente?');
                if (!confirmDelete) return;

                try {
                    const response = await fetch(`${API_URL}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id }) // Envia o ID no corpo da requisição como JSON
                });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        alert(result.resposta); // Exibe a mensagem de resposta

        loadClientes(); // Recarrega a lista de clientes
        } catch (error) {
                console.error('Erro ao excluir cliente:', error);
                alert('Ocorreu um erro ao excluir o cliente. Tente novamente.');
            }
        }

        // Carrega os clientes ao iniciar a página
        loadClientes();