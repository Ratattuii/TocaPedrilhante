const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const db = require('./dbconfig')

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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

// Rota para buscar um produto específico pelo id
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



// Rota para adicionar um novo produto
app.post('/api/produto', (req, res) => {
    const { nome, preco, descricao } = req.body;

    const query = 'INSERT INTO produtos (nome, preco, descricao) VALUES (?, ?, ?)';
    db.query(query, [nome, preco, descricao], (err, results) => {
        if (err) {
            res.status(400).json({ sucesso: false, message: 'Erro ao adicionar produto', erro: err});
        } else {
            res.status(200).json({ sucesso: true, message: 'Produto adicionado com sucesso', data:results });
        }
    });
});

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

// Endpoints de usuários (Cadastro e Login)
app.post('/api/usuarios/cadastrar', (req, res) => {
    const { nome, email, senha } = req.body;
    db.query('INSERT INTO Usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha], (err, results) => {
        if (err) {
            res.status(400).json({ sucesso: false, message: 'Erro ao cadastrar usuario', erro: err });
        } else {
            res.status(200).json({ sucesso: true, message: 'Usuário cadastrado com sucesso!', data:results });
        }
    });
});

app.post('/api/usuarios/login', (req, res) => {
    const { email, senha } = req.body;
    db.query('SELECT * FROM Usuarios WHERE email = ? AND senha = ?', [email, senha], (err, results) => {
        if (err) {
            res.status(401).json({sucesso: false, message: 'Erro ao realizar login', erro: err });
        } else {
            if (results.length > 0) {
                res.status(200).json({ sucesso: true, message: 'Login realizado com sucesso!', user: results[0] });
            } else {
                res.status(401).json({ sucesso: false, message: 'Credenciais inválidas' });
            }
        }
    });
});

// Endpoints do carrinho
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

// Rota para obter os favoritos de um usuário
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

// Rota para favoritar um produto
app.post('/api/favoritos', (req, res) => {
    const { usuario_id, produto_id } = req.body;

    const query = "INSERT INTO favoritos (usuario_id, produto_id) VALUES (?, ?)";
    db.query(query, [usuario_id, produto_id], (err, result) => {
        if (err) {
            console.error('Erro ao favoritar produto:', err);
            res.status(400).json({ erro: 'Erro ao favoritar produto' });
            return;
        }
        res.json({ message: 'Produto favoritado com sucesso' });
    });
});

// Rota para desfavoritar um produto
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

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});