CREATE DATABASE IF NOT EXISTS TocaPedrilhante;

USE TocaPedrilhante;

CREATE TABLE IF NOT EXISTS Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    adm VARCHAR(1) NOT NULL
);

CREATE TABLE IF NOT EXISTS Produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
	imagem TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    FOREIGN KEY (produto_id) REFERENCES Produtos(id)
);

CREATE TABLE IF NOT EXISTS Carrinho (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    produto_id INT,
    quantidade INT DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    FOREIGN KEY (produto_id) REFERENCES Produtos(id)
);

CREATE TABLE IF NOT EXISTS Compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    FOREIGN KEY (produto_id) REFERENCES Produtos(id)
);

SELECT User, Host FROM mysql.user WHERE User = 'tocapedrilhante' AND Host = 'localhost';
DROP USER 'tocapedrilhante'@'localhost';
CREATE USER 'tocapedrilhante'@'localhost' IDENTIFIED BY 'tocapedrilhante';
GRANT ALL PRIVILEGES ON TocaPedrilhante.* TO 'tocapedrilhante'@'localhost';
FLUSH PRIVILEGES;

SELECT * FROM Usuarios;
SELECT * FROM Produtos;
SELECT * FROM Favoritos;
SELECT * FROM Compras;
SELECT * FROM Carrinho;