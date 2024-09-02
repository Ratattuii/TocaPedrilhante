const apiUrl = 'http://localhost:3000';

// document.addEventListener('DOMContentLoaded', () => {
//     if (document.getElementById('produtos')) {
//         carregarProdutos();
//     }
//     if (document.getElementById('carrinho')) {
//         carregarCarrinho();
//     }
//     if (document.getElementById('loginForm')) {
//         document.getElementById('loginForm').addEventListener('submit', realizarLogin);
//     }
//     if (document.getElementById('cadastroForm')) {
//         document.getElementById('cadastroForm').addEventListener('submit', realizarCadastro);
//     }
// });

async function carregarProdutos() {
    const produtosContainer = document.getElementById('produtos');
    const response = await fetch(`${apiUrl}/produtos`);
    const produtos = await response.json();

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.innerHTML = `
            <h2>${produto.nome}</h2>
            <p>Preço: R$ ${produto.preco}</p>
            <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
        `;
        produtosContainer.appendChild(produtoDiv);
    });
}

async function carregarCarrinho() {
    const carrinhoContainer = document.getElementById('carrinho');
    const usuarioId = 1; 
    const response = await fetch(`${apiUrl}carrinho/${usuarioId}`);
    const carrinho = await response.json();

    carrinho.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <h2>${item.nome}</h2>
            <p>Preço: R$ ${item.preco}</p>
            <p>Quantidade: ${item.quantidade}</p>
            <button onclick="removerDoCarrinho(${item.id})">Remover</button>
        `;
        carrinhoContainer.appendChild(itemDiv);
    });
}

async function adicionarAoCarrinho(produtoId) {
    const usuarioId = 1; 
    const response = await fetch(`${apiUrl}carrinho/adicionar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario_id: usuarioId, produto_id: produtoId, quantidade: 1 })
    });

    const result = await response.json();
    alert(result.message);
}

async function removerDoCarrinho(itemId) {
    const response = await fetch(`${apiUrl}/carrinho/${itemId}`, {
        method: 'DELETE'
    });

    const result = await response.json();
    alert(result.message);
    location.reload();
}

async function realizarLogin() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

const response = await fetch(`${apiUrl}/usuarios/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    });

    const result = await response.json();
    if (result) {
        alert(result.message);
        window.location.href = 'catalogo.html';
    } else {
        alert(result.message);
    }
}


async function cadastrarUsuario() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`${apiUrl}/usuarios/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        } else {
            alert('Erro no cadastro: ' + result.message);
        }
    } catch (error) {
        alert('Ocorreu um erro ao tentar realizar o cadastro.');
    }
}

    const listaProdutos = document.getElementById('lista-produtos');
    const formAdicionarProduto = document.getElementById('form-adicionar-produto');

    // Função para renderizar a lista de produtos
    const renderizarProdutos = async () => {
        listaProdutos.innerHTML = '';
        try {
            const response = await fetch(`${apiUrl}/produtos`);
            const produtos = await response.json();

            produtos.forEach(produto => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.innerHTML = `
                    <strong>${produto.nome}</strong> - R$${produto.preco}<br>
                    ${produto.descricao}<br>
                    <button class="edit-btn" data-id="${produto.id}">Editar</button>
                    <button class="delete-btn" data-id="${produto.id}">Remover</button>
                `;
                listaProdutos.appendChild(productItem);
            });

            // // Adicionar evento aos botões de editar e remover
            // document.querySelectorAll('.edit-btn').forEach(button => {
            //     button.addEventListener('click', editarProduto);
            // });

            // document.querySelectorAll('.delete-btn').forEach(button => {
            //     button.addEventListener('click', removerProduto);
            // });

        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    };

    // Função para adicionar produto
    // formAdicionarProduto.addEventListener('submit', async () => {
    //     const nome = document.getElementById('nome').value;
    //     const preco = parseFloat(document.getElementById('preco').value);
    //     const descricao = document.getElementById('descricao').value;

    //     try {
    //         const response = await fetch(`${apiUrl}/produto`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ nome, preco, descricao })
    //         });

    //         if (response.ok) {
    //             renderizarProdutos();
    //             formAdicionarProduto.reset();
    //         } else {
    //             console.error('Erro ao adicionar produto');
    //         }
    //     } catch (error) {
    //         console.error('Erro ao adicionar produto:', error);
    //     }
    // });

    // Função para editar produto
    const editarProduto = async (event) => {
        const id = event.target.getAttribute('data-id');
        const novoNome = prompt('Novo nome do produto:');
        const novoPreco = parseFloat(prompt('Novo preço do produto:'));
        const novaDescricao = prompt('Nova descrição do produto:');

        if (novoNome && novoPreco && novaDescricao) {
            try {
                const response = await fetch(`${apiUrl}/produto/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome: novoNome, preco: novoPreco, descricao: novaDescricao })
                });

                if (response.ok) {
                    renderizarProdutos();
                } else {
                    console.error('Erro ao editar produto');
                }
            } catch (error) {
                console.error('Erro ao editar produto:', error);
            }
        }
    };

    // Função para remover produto
    const removerProduto = async (event) => {
        const id = event.target.getAttribute('data-id');
        if (confirm('Tem certeza que deseja remover este produto?')) {
            try {
                const response = await fetch(`${apiUrl}/produto/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    renderizarProdutos();
                } else {
                    console.error('Erro ao remover produto');
                }
            } catch (error) {
                console.error('Erro ao remover produto:', error);
            }
        }
    };

    // Inicializa a lista de produtos ao carregar a página
    renderizarProdutos();

    async function favoritarProduto(usuarioId, produtoId) {
        try {
            const response = await fetch(`${apiUrl}/favoritos/adicionar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({usuario_id: usuarioId, produto_id: produtoId}),
            })
    
            if (response.ok) {
                console.log('Produto favoritado com sucesso');
            } else {
                console.error('Erro ao favoritar produto:', err);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }

    async function desfavoritarProduto(usuarioId, produtoId) {
        try {
            const response = await fetch(`${apiUrl}/favoritos/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario_id: usuarioId,
                    produto_id: produtoId,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Favorito removido com sucesso:', data.message);
            } else {
                console.error('Erro ao remover favorito:', data.erro);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }
    