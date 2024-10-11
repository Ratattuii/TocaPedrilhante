const apiUrl = 'http://localhost:3000/api';

function usuarioLogado() {
    return localStorage.getItem('usuario_id');
}

function getIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}



function atualizarTotalCarrinho() {
    document.getElementById('total-produtos-carrinho').textContent = totalCarrinho;
}

// ----------------------------------------------------------------------------

async function cadastrarUsuario(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const adm = document.getElementById('adm').checked ? '1' : '0';

    try {
        const response = await fetch(`${apiUrl}/usuarios/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha, adm })
        });

        const result = await response.json();
        if (result.sucesso) {
            alert(result.message);
            window.location.href = '../';
        } else {
            alert(result.message + ":" + result.erro);
        }
    } catch (error) {
        alert('Ocorreu um erro ao tentar realizar o cadastro.');
    }
};


// ----------------------------------------------------------------------------

async function realizarLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`${apiUrl}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const result = await response.json();
        if (result.sucesso) {

            localStorage.setItem('usuario_id', result.user.id);
            localStorage.setItem('usuario_nome', result.user.nome);
            localStorage.setItem('usuario_email', result.user.email);
            localStorage.setItem('usuario_adm', result.user.adm);

            alert(result.message);

            window.location.href = `./menu/index.html?id=${result.user.id}`;
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Ocorreu um erro ao tentar realizar o login.' + error);
    }
}

// ----------------------------------------------------------------------------

async function logout() {
    localStorage.clear();
    alert('Você foi deslogado com sucesso.');
    window.location.href = '../';
}

// ----------------------------------------------------------------------------

async function cadastrarProduto(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('nome', document.getElementById('nome').value);
    formData.append('preco', document.getElementById('preco').value);
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('imagem', document.getElementById('imagem').files[0]);

    try {
        const response = await fetch(`${apiUrl}/produto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, preco, descricao })
        });

        const result = await response.json();
        if (result.sucesso) {
            alert(result.message);
            location.reload();
        } else {
            alert(result.message + ":" + result.erro);
        }
    } catch (error) {
        alert('Ocorreu um erro ao tentar realizar o cadastro.');
    }
};

// ----------------------------------------------------------------------------

async function buscarProdutos() {
    try {
        const response = await fetch(`${apiUrl}/produtos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.sucesso) {
            const produtos = result.data;
            const tabela = document.getElementById('produtos-tabela');
            tabela.innerHTML = '';

            produtos.forEach(produto => {
                const row = document.createElement('tr');


                row.innerHTML = `
                    <td>${produto.nome}</td>
                    <td>R$ ${produto.preco}</td>
                    <td>${produto.descricao}</td>
                    <td>
                        <a href="./editar.html?id=${produto.id}" class="btn btn-warning btn-sm">Editar</a>
                        <a class="btn btn-danger btn-sm" onclick="removerProduto(${produto.id})">Remover</a>
                    </td>
                `;

                tabela.appendChild(row);
            });
        } else {
            alert(result.message + ":" + result.erro);
        }
    } catch (error) {
        alert('Ocorreu um erro ao tentar listar produtos.');
    }
}

// ----------------------------------------------------------------------------

async function carregarDadosProduto() {
    const produtoId = getIdFromURL(); // Obtém o ID do produto da URL

    try {
        const response = await fetch(`${apiUrl}/produto/${produtoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.sucesso && result.data) {
            // Preenche os campos do formulário com os dados do produto
            document.getElementById('nomeNovo').value = result.data.nome;
            document.getElementById('precoNovo').value = result.data.preco;
            document.getElementById('descricaoNova').value = result.data.descricao;
        } else {
            alert('Erro ao carregar dados do produto: ' + result.message);
        }
    } catch (error) {
        alert('Erro ao carregar produto.');
    }
}

// ----------------------------------------------------------------------------

async function editarProduto() {
    const produtoId = getIdFromURL(); // Obtém o ID do produto da URL
    const nome = document.getElementById('nomeNovo').value;
    const preco = document.getElementById('precoNovo').value;
    const descricao = document.getElementById('descricaoNova').value;

    try {
        const response = await fetch(`${apiUrl}/produto/${produtoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, preco, descricao })
        });

        const result = await response.json();
        if (result.sucesso) {
            alert('Produto atualizado com sucesso!');
            window.location.href = './index.html';
        } else {
            alert('Erro ao editar produto: ' + result.message);
        }
    } catch (error) {
        alert('Erro ao editar produto.');
    }
}


// ----------------------------------------------------------------------------

async function removerProduto(id) {
    if (confirm('Tem certeza que deseja remover este produto?')) {
        try {
            const response = await fetch(`${apiUrl}/produto/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (result.sucesso) {
                alert(result.message);
                location.reload();
            } else {
                alert(result.message + ":" + result.erro);
            }
        } catch (error) {
            alert('Ocorreu um erro ao tentar realizar o cadastro.');
        }
    }
};

// ----------------------------------------------------------------------------

async function carregarProdutosCatalogo() {
    usuario_id = usuarioLogado()

    try {
        const response = await fetch(`${apiUrl}/produtos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();

        if (result.sucesso) {
            const produtos = result.data;
            const tabela = document.getElementById('produtos-catalogo');
            tabela.innerHTML = '';

            const favoritosResponse = await fetch(`${apiUrl}/favoritos/${usuario_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const favoritosResult = await favoritosResponse.json();
            const favoritos = favoritosResult.data;

            produtos.forEach(produto => {
                const isFavorito = favoritos.includes(produto.id);
                const card = document.createElement('div');
                card.className = 'col-md-6 mb-3';

                card.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${produto.nome}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">R$ ${produto.preco}</h6>
                            <p class="card-text">${produto.descricao}</p>
                            <button class="btn btn-primary" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                            ${isFavorito ? 
                                `<button class="btn btn-danger" onclick="desfavoritar(${usuario_id}, ${produto.id})">Desfavoritar</button>` : 
                                `<button class="btn btn-secondary" onclick="favoritar(${usuario_id}, ${produto.id})">Favoritar</button>`}
                        </div>
                    </div>
                `;
                tabela.appendChild(card);
            });
        } else {
            alert(result.message + ":" + result.erro);
        }
    } catch (error) {
        alert('Ocorreu um erro ao tentar listar produtos.');
    }
}

// ----------------------------------------------------------------------------

async function carregarProdutosCarrinho() {
    usuario_id = usuarioLogado()

    try {
        const response = await fetch(`${apiUrl}/carrinho/${usuario_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();

        if (result.sucesso) {
            const carrinho = result.data;
            const tabela = document.getElementById('produtos-carrinho');
            tabela.innerHTML = '';

            // Reinicia o total do carrinho ao carregar os itens
            totalCarrinho = 0;

            carrinho.forEach(produto => {
                const card = document.createElement('div');
                card.className = 'col-md-6 mb-3';

                card.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${produto.nome}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">R$ ${produto.preco}</h6>
                            <p class="card-text">${produto.total}</p>
                            <button class="btn btn-danger" onclick="removerDoCarrinho(${produto.produto_id})">Remover</button>
                        </div>
                    </div>
                `;

                // Soma o preço total de cada produto no carrinho
                totalCarrinho += produto.preco * produto.quantidade;
                tabela.appendChild(card);
            });

            // Atualiza o total exibido
            atualizarTotalCarrinho();
        } else {
            alert(result.message + ":" + result.erro);
        }
    } catch (error) {
        alert('Ocorreu um erro ao tentar listar produtos.');
    }
}

// ----------------------------------------------------------------------------

async function adicionarAoCarrinho(produto_id) {
    const usuario_id = usuarioLogado();

    try {
        const response = await fetch(`${apiUrl}/carrinho`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario_id, produto_id, quantidade: 1 })
        });

        const result = await response.json();
        if (result.sucesso) {
            alert(result.message);
            atualizarTotalCarrinho();
            carregarProdutosCarrinho(usuario_id);
        } else {
            alert('Erro ao adicionar ao carrinho: ' + result.message);
        }
    } catch (erro) {
        alert('Ocorreu um erro ao tentar adicionar o produto ao carrinho.' + erro);
    }
}


// ----------------------------------------------------------------------------

async function removerDoCarrinho(produto_id) {
    const usuario_id = usuarioLogado();

    try {
        const response = await fetch(`${apiUrl}/carrinho/${usuario_id}/${produto_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.sucesso) {
            alert(result.message);
            carregarProdutosCarrinho(usuario_id);
        } else {
            alert('Erro ao remover produto do carrinho: ' + result.message);
        }
    } catch (erro) {
        alert('Ocorreu um erro ao tentar remover o produto do carrinho.' + erro);
    }
}

// ----------------------------------------------------------------------------

async function favoritar(usuario_id, produto_id) {
    try {
        const response = await fetch(`${apiUrl}/favoritos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario_id, produto_id })
        });

        const result = await response.json();
        if (result.message) {
            alert(result.message);
            carregarProdutosCatalogo(usuario_id);
        } else {
            alert(result.erro);
        }
    } catch (error) {
        alert('Erro ao favoritar o produto.');
    }
}

// ----------------------------------------------------------------------------

async function desfavoritar(usuario_id, produto_id) {
    try {
        const response = await fetch(`${apiUrl}/favoritos/${usuario_id}/${produto_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.message) {
            alert(result.message);
            carregarProdutosCatalogo(usuario_id); // Recarregar os produtos
        } else {
            alert(result.erro);
        }
    } catch (error) {
        alert('Erro ao desfavoritar o produto.');
    }
}

// ----------------------------------------------------------------------------

async function finalizarCompra() {
    const usuario_id = localStorage.getItem('usuario_id');

    try {
        const response = await fetch(`${apiUrl}/finalizar-compra`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario_id })
        });

        const result = await response.json();

        if (result.sucesso) {
            alert(result.message);
            carregarProdutosCarrinho(usuario_id);
            window.location.href= '/public/compra-finalizada/index.html';
        } else {
            alert('Erro ao finalizar a compra: ' + result.message);
        }
    } catch (error) {
        alert('Ocorreu um erro ao finalizar a compra: ' + error);
    }
}