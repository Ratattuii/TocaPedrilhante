const apiUrl = 'https://app-1e4f1efa-b329-4ef9-8728-065573d77c09.cleverapps.io/api';

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

function showAdmin(isAdmin) {
    const adminLink = document.getElementById("admin-link");

    if (isAdmin === 1) {
        adminLink.style.display = "block";
    } else {
        adminLink.style.display = "none";
    }
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
            window.location.href = '../';
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

            window.location.href = `./menu/index.html?id=${result.user.id}`;
        }
    } catch (error) {
        alert('Ocorreu um erro ao tentar realizar o login.' + error);
    }
}

// ----------------------------------------------------------------------------

async function logout() {
    localStorage.clear();
    window.location.href = '../';
}

// ----------------------------------------------------------------------------

async function cadastrarProduto(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('nome', document.getElementById('nome').value);
    formData.append('preco', document.getElementById('preco').value);
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('imagem', document.getElementById('formFileSm').files[0]);

    try {
        const response = await fetch(`${apiUrl}/produto`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.sucesso) {
            location.reload();
        }
    } catch (error) {
        alert('Ocorreu um erro ao tentar realizar o cadastro.');
        console.error('Erro:', error);
    }
}

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
                    <td>${produto.imagem}</td>
                    <td>
                        <a href="./editar.html?id=${produto.id}" class="btn btn-warning btn-sm">Editar</a>
                        <a class="btn btn-danger btn-sm" onclick="removerProduto(${produto.id})">Remover</a>
                    </td>
                `;

                tabela.appendChild(row);
            });
        }
    } catch (error) {
        alert('Ocorreu um erro ao tentar listar produtos.');
    }
}

// ----------------------------------------------------------------------------

async function carregarDadosProduto() {
    const produtoId = getIdFromURL(); 

    try {
        const response = await fetch(`${apiUrl}/produto/${produtoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.sucesso && result.data) {
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
                location.reload();
            }
        } catch (error) {
            alert('Ocorreu um erro ao tentar realizar o cadastro.');
        }
    }
};

// ----------------------------------------------------------------------------

async function carregarProdutosCatalogo() {
    usuario_id = usuarioLogado()
    alert(usuario_id);

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
                <div class="card mb-4 shadow-sm">
                    <img src="/assets/images/${produto.imagem}" class="card-img-top" alt="${produto.nome}" style="object-fit: cover;">
                    <div class="card-body bg-roxo-claro" style="border-radius: 8px;">
                        <h5 class="card-title">${produto.nome}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">R$ ${produto.preco}</h6>
                        <p class="card-text">${produto.descricao}</p>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-primary bg-roxo-escuro me-2" style= "border: none;" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                            ${isFavorito ? 
                                `<button class="btn btn-danger" style="max-width: 120px; max-height: 50px;" onclick="desfavoritar(${usuario_id}, ${produto.id})">Desfavoritar</button>` : 
                                `<button class="btn btn-secondary" style="max-width: 120px; max-height: 50px;" onclick="favoritar(${usuario_id}, ${produto.id})">Favoritar</button>`}
                        </div>
                    </div>
                </div>
            `;            
                tabela.appendChild(card);
            });
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
                    <div class="card mb-4">
                        <div class="card-body bg-roxo-medio" style="border-radius: 8px;">
                            <h5 class="card-title">${produto.nome}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">R$ ${produto.preco}</h6>
                            <p class="card-text">Quantidade: ${produto.quantidade}</p>
                            <p class="card-text">Total: R$ ${produto.total}</p>
                            <button class="btn bg-verde-medio" style="max-width: 120px;" onclick="removerDoCarrinho(${produto.produto_id})">Remover</button>
                        </div>
                    </div>
                `;

                // Soma o preço total de cada produto no carrinho
                totalCarrinho += produto.preco * produto.quantidade;
                tabela.appendChild(card);
            });

            // Atualiza o total exibido
            atualizarTotalCarrinho();
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
            atualizarTotalCarrinho();
            carregarProdutosCarrinho(usuario_id);
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
            carregarProdutosCarrinho(usuario_id);
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
            carregarProdutosCatalogo(usuario_id);
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
            carregarProdutosCatalogo(usuario_id);
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
            carregarProdutosCarrinho(usuario_id);
            window.location.href= '/public/compra-finalizada/index.html';
        } else {
            alert('Erro ao finalizar a compra: ' + result.message);
        }
    } catch (error) {
        alert('Ocorreu um erro ao finalizar a compra: ' + error);
    }
}