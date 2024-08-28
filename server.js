require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'tocapedrilhante',
    password: 'tocapedrilhante',
    database: 'TocaPedrilhante'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota de cadastro de usuário
app.post('/usuario/cadastrar', (req, res) => {
    const { name, email, password } = req.body;

    const query = `INSERT INTO Usuarios (nome, email, senha) VALUES (?, ?, ?)`;

    db.query(query, [name, email, password], (err, results) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário' });
        }
        res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
    });
});

// Rota de login de usuário
app.post('/usuario/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM Usuarios WHERE email = ?`;

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Erro ao realizar login:', err);
            return res.status(500).json({ success: false, message: 'Erro ao realizar login' });
        }

        if (results.length > 0) {
            const user = results[0];
            if (password === user.senha) {
                res.json({ success: true, message: 'Login realizado com sucesso!' });
            } else {
                res.json({ success: false, message: 'Senha incorreta' });
            }
        } else {
            res.json({ success: false, message: 'Usuário não encontrado' });
        }
    });
});

const port = 3000
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
