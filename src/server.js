const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
const port = 3000;
const db = require('./dbconfig')


app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ----------------------------------------------------------------------------

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TocaPedrilhante API',
            version: '1.0.0',
            description: 'API para gerenciar produtos e usuários da loja TocaPedrilhante',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ----------------------------------------------------------------------------

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     responses:
 *       200:
 *         description: Retorna uma lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Produtos listados com sucesso
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: "Produto A"
 *                       preco:
 *                         type: number
 *                         example: 10.99
 *                       descricao:
 *                         type: string
 *                         example: "Descrição do produto A"
 *                       imagem:
 *                         type: string
 *                         example: "/path/to/image.jpg"
 */

// Rota para buscar todos os produtos
app.get('/api/produtos', (req, res) => {
    const query = 'SELECT * FROM produtos';
    db.query(query, (err, results) => {
        if (err) {
            res.json({sucesso: false, message: 'Erro ao listar produtos', erro: err });
        } else {
            res.json({sucesso: true, message: 'Produtos listados com sucesso', data:results});
        }
    });
});

// ----------------------------------------------------------------------------

// Rota para buscar um produto específico pelo id

/**
 * @swagger
 * /api/produto/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retorna os dados do produto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Produto listado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                       example: "Produto A"
 *                     preco:
 *                       type: number
 *                       example: 10.99
 *                     descricao:
 *                       type: string
 *                       example: "Descrição do produto A"
 */

app.get('/api/produto/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT nome, preco, descricao FROM produtos WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.json({ sucesso: false, message: 'Erro ao listar produto', erro: err });
        } else if (results.length === 0) {
            res.json({ sucesso: false, message: 'Produto não encontrado' });
        } else {
            res.json({ sucesso: true, message: 'Produto listado com sucesso', data: results[0] });
        }
    });
});

// ----------------------------------------------------------------------------

/**
 * @swagger
 * /api/produto:
 *   post:
 *     summary: Adiciona um novo produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               descricao:
 *                 type: string
 *               imagem:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto adicionado com sucesso
 *       400:
 *         description: Erro ao adicionar produto
 */

// Rota para adicionar um novo produto
app.post('/api/produto', (req, res) => {
    const { nome, preco, descricao, imagem } = req.body;

    const query = 'INSERT INTO produtos (nome, preco, descricao, imagem) VALUES (?, ?, ?, ?)';
    db.query(query, [nome, preco, descricao, imagem], (err, results) => {
        if (err) {
            res.status(400).json({ sucesso: false, message: 'Erro ao adicionar produto', erro: err});
        } else {
            res.status(200).json({ sucesso: true, message: 'Produto adicionado com sucesso', data:results });
        }
    });
});

// ----------------------------------------------------------------------------

/**
 * @swagger
 * /api/produto/{id}:
 *   put:
 *     summary: Edita um produto existente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto editado com sucesso
 *       400:
 *         description: Erro ao editar produto
 */

// Rota para editar um produto existente
app.put('/api/produto/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, descricao } = req.body;
    const query = 'UPDATE produtos SET nome = ?, preco = ?, descricao = ? WHERE id = ?';
    db.query(query, [nome, preco, descricao, id], (err, results) => {
        if (err) {
            res.status(400).json({ sucesso: false, message: 'Erro ao editar produto', erro: err });
        } else {
            res.status(200).json({ sucesso: true, message: 'Produto editado com sucesso', data:results });
        }
    });
});

// ----------------------------------------------------------------------------

/**
 * @swagger
 * /api/produto/{id}:
 *   delete:
 *     summary: Remove um produto pelo ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       400:
 *         description: Erro ao remover produto
 */

// Rota para remover um produto
app.delete('/api/produto/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM produtos WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(400).json({ sucesso: false, message: 'Erro ao remover o produto', erro: err });
        } else {
            res.status(200).json({ sucesso: true, message: 'Produto removido com sucesso!', data:results });
        }
    });
});

// ----------------------------------------------------------------------------

// Cadastrar usuários

/**
 * @swagger
 * /api/usuarios/cadastrar:
 *   post:
 *     summary: Cadastra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               adm:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Erro ao cadastrar usuário
 */


app.post('/api/usuarios/cadastrar', (req, res) => {
    const { nome, email, senha, adm } = req.body;
    db.query('INSERT INTO Usuarios (nome, email, senha, adm) VALUES (?, ?, ?, ?)', [nome, email, senha, adm], (err, results) => {
        if (err) {
            res.status(400).json({ sucesso: false, message: 'Erro ao cadastrar usuario', erro: err });
        } else {
            res.status(200).json({ sucesso: true, message: 'Usuário cadastrado com sucesso!', data:results });
        }
    });
});

// ----------------------------------------------------------------------------

// Login de usuário

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */

app.post('/api/usuarios/login', (req, res) => {
    const { email, senha } = req.body;
    db.query('SELECT * FROM Usuarios WHERE email = ? AND senha = ?', [email, senha], (err, results) => {
        if (err) {
            res.status(401).json({ sucesso: false, message: 'Erro ao realizar login', erro: err });
        } else {
            if (results.length > 0) {
                const usuario = results[0];
                const isAdmin = usuario.adm === '1'; 

                res.status(200).json({ sucesso: true, message: 'Login realizado com sucesso!', user: usuario, admin: isAdmin });
            } else {
                res.status(401).json({ sucesso: false, message: 'Credenciais inválidas' });
            }
        }
    });
});

// ----------------------------------------------------------------------------

// Adicionar produto carrinho

/**
 * @swagger
 * /api/carrinho:
 *   post:
 *     summary: Adiciona produto ao carrinho ou atualiza a quantidade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               produto_id:
 *                 type: integer
 *               quantidade:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto adicionado ou atualizado no carrinho
 *       400:
 *         description: Erro ao adicionar ou atualizar carrinho
 */

app.post('/api/carrinho', (req, res) => {
    const { usuario_id, produto_id, quantidade } = req.body;

    db.query('SELECT id FROM Carrinho WHERE usuario_id = ? AND produto_id = ?', [usuario_id, produto_id], (err, results) => {
        if (err) {
            res.status(400).json({ sucesso: false, message: 'Erro ao tentar adicionar produto', erro: err });
        } else {
            if (results.length > 0) { // Verifica se o produto já está no carrinho
                db.query('UPDATE Carrinho SET quantidade = quantidade + ? WHERE usuario_id = ? AND produto_id = ?', [quantidade, usuario_id, produto_id], (err, results) => {
                    if (err) {
                        res.status(400).json({ sucesso: false, message: 'Erro ao tentar atualizar o carrinho', erro: err });
                    } else {
                        res.status(200).json({ sucesso: true, message: 'Quantidade do produto atualizada no carrinho com sucesso!' });
                    }
                });
            } else {
                db.query('INSERT INTO Carrinho (usuario_id, produto_id, quantidade) VALUES (?, ?, ?)', [usuario_id, produto_id, quantidade], (err, results) => {
                    if (err) {
                        res.status(400).json({ sucesso: false, message: 'Erro ao tentar adicionar produto ao carrinho', erro: err });
                    } else {
                        res.status(200).json({ sucesso: true, message: 'Produto adicionado ao carrinho com sucesso!' });
                    }
                });
            }
        }
    });
});

// ----------------------------------------------------------------------------

// Exibir carrinho do usuário

/**
 * @swagger
 * /api/carrinho/{usuario_id}:
 *   get:
 *     summary: Exibe o carrinho de um usuário
 *     parameters:
 *       - name: usuario_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrinho listado com sucesso
 *       400:
 *         description: Erro ao exibir o carrinho
 */

app.get('/api/carrinho/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;
    db.query('SELECT c.*, p.nome, p.preco, c.quantidade, (p.preco * c.quantidade) AS total FROM Carrinho c JOIN Produtos p ON c.produto_id = p.id WHERE c.usuario_id = ?', [usuario_id], (err, results) => {
        if (err) {
            res.status(400).json({sucesso: false, message: 'Erro ao tentar mostrar carrinho', erro: err });
        } else {
            res.status(200).json({sucesso: true, message: 'Carrinho atualizado com sucesso!', data:results });
        }
    });
});

// ----------------------------------------------------------------------------

// Deletar produto do carrinho

/**
 * @swagger
 * /api/carrinho/{usuario_id}/{produto_id}:
 *   delete:
 *     summary: Remove um produto do carrinho
 *     parameters:
 *       - name: usuario_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: produto_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido do carrinho
 *       400:
 *         description: Erro ao remover produto do carrinho
 */

app.delete('/api/carrinho/:usuario_id/:produto_id', (req, res) => {
    const { usuario_id, produto_id } = req.params;

    db.query('DELETE FROM Carrinho WHERE usuario_id = ? AND produto_id = ?', [usuario_id, produto_id], (err, results) => {
        if (err) {
            console.log("Erro ao tentar remover produto do carrinho:", err);
            res.status(400).json({sucesso: false, message: 'Erro ao tentar remover produto do carrinho', erro: err });
        } else {
            console.log("Remoção bem-sucedida:", results);
            res.status(200).json({sucesso: true, message: 'Produto removido com sucesso!', data: results });
        }
    });
});

// ----------------------------------------------------------------------------

// Rota para obter os favoritos de um usuário

/**
 * @swagger
 * /api/favoritos/{usuario_id}:
 *   get:
 *     summary: Obtém os produtos favoritos de um usuário
 *     parameters:
 *       - name: usuario_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favoritos listados com sucesso
 *       400:
 *         description: Erro ao listar favoritos
 */

app.get('/api/favoritos/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;

    const query = "SELECT produto_id FROM favoritos WHERE usuario_id = ?";
    db.query(query, [usuario_id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar favoritos:', err);
            res.status(400).json({ erro: 'Erro ao buscar favoritos' });
            return;
        }
        res.json({ data: results.map(row => row.produto_id) });
    });
});

// ----------------------------------------------------------------------------

// Rota para favoritar um produto

/**
 * @swagger
 * /api/favoritos:
 *   post:
 *     summary: Adiciona um produto aos favoritos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               produto_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto adicionado aos favoritos
 *       400:
 *         description: Erro ao adicionar favorito
 */

app.post('/api/favoritos', (req, res) => {
    const { usuario_id, produto_id } = req.body;

    const query = "INSERT INTO favoritos (usuario_id, produto_id) VALUES (?, ?)";
    db.query(query, [usuario_id, produto_id], (err, results) => {
        if (err) {
            console.error('Erro ao favoritar produto:', err);
            res.status(400).json({ erro: 'Erro ao favoritar produto' });
            return;
        }
        res.json({ message: 'Produto favoritado com sucesso' });
    });
});

// ----------------------------------------------------------------------------

// Rota para desfavoritar um produto

/**
 * @swagger
 * /api/favoritos/{usuario_id}/{produto_id}:
 *   delete:
 *     summary: Remove um produto dos favoritos
 *
 *  *     parameters:
 *       - name: usuario_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: produto_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido dos favoritos
 *       400:
 *         description: Erro ao remover favorito
 */

app.delete('/api/favoritos/:usuario_id/:produto_id', (req, res) => {
    const { usuario_id, produto_id } = req.params;

    const query = "DELETE FROM favoritos WHERE usuario_id = ? AND produto_id = ?";
    db.query(query, [usuario_id, produto_id], (err, result) => {
        if (err) {
            console.error('Erro ao remover favorito:', err);
            res.status(400).json({ erro: 'Erro ao remover favorito' });
            return;
        }
        res.json({ message: 'Favorito removido com sucesso' });
    });
});

// ----------------------------------------------------------------------------

/**
 * @swagger
 * /api/finalizar-compra:
 *   post:
 *     summary: Finaliza a compra de um usuário
 *     description: Processa os itens do carrinho de um usuário, move os itens para a tabela de compras e limpa o carrinho.
 *     tags:
 *       - Carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *             properties:
 *               usuario_id:
 *                 type: int
 *                 description: ID do usuário que está finalizando a compra.
 *     responses:
 *       200:
 *         description: Compra finalizada com sucesso, carrinho foi limpo.
 *       400:
 *         description: O carrinho está vazio ou houve um erro na compra.
 *       500:
 *         description: Erro no processamento da compra ou na limpeza do carrinho.
 */

app.post('/api/finalizar-compra', (req, res) => {
    const { usuario_id } = req.body;

    db.query(`SELECT c.produto_id, c.quantidade, p.preco FROM Carrinho c JOIN Produtos p ON c.produto_id = p.id WHERE c.usuario_id = ?`, [usuario_id], (err, carrinho) => {
        if (err) {
            return res.status(500).json({ sucesso: false, message: 'Erro ao buscar o carrinho.' });
        }

        if (carrinho.length === 0) {
            return res.status(400).json({ sucesso: false, message: 'Carrinho vazio.' });
        }

        // Variável para contar quantos itens já foram processados
        let itensProcessados = 0;
        const totalItens = carrinho.length;

        console.log(itensProcessados, totalItens);

        carrinho.forEach((item) => {
            const total = item.quantidade * item.preco;

            db.query('INSERT INTO Compras (usuario_id, produto_id, total) VALUES (?, ?, ?)', [usuario_id, item.produto_id, total], (err, result) => {
                if (err) {
                    return res.status(500).json({ sucesso: false, message: 'Erro ao processar compra.' });
                }

                itensProcessados++;

                // Se todos os itens forem processados, limpar o carrinho e enviar a resposta
                if (itensProcessados === totalItens) {
                    db.query('DELETE FROM Carrinho WHERE usuario_id = ?', [usuario_id], (err) => {
                        if (err) {
                            console.error('Erro ao limpar o carrinho:', err.message); // Mostra o erro completo
                            return res.status(500).json({ sucesso: false, message: 'Erro ao limpar o carrinho.' });
                        }
                    
                        // Se a deleção for bem-sucedida
                        res.status(200).json({ sucesso: true, message: 'Compra finalizada com sucesso!' });
                    });
                }
            });
        });
    });
});

// ----------------------------------------------------------------------------

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});