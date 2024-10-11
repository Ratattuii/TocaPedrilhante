
# 🪄 TocaPedrilhante 🛍️

**TocaPedrilhante** é uma loja online que oferece produtos mágicos e extraordinários. Este projeto foi desenvolvido para permitir que os usuários naveguem pelo catálogo de produtos, gerenciem suas compras e, para administradores, a capacidade de gerenciar os itens à venda.

## 🌟 Funcionalidades Principais

- 🔐 **Login de Usuários**
- 📝 **Cadastro de Novos Usuários**
- 📦 **Catálogo de Produtos**
- ❤️ **Favoritar Produtos**
- 🛒 **Carrinho de Compras**
- 🛠️ **Administração de Produtos** (para usuários com permissão de administrador)
- ✏️ **Edição e Cadastro de Produtos**

---

## 🖥️ Páginas do Sistema

### 1. Página de Login

- **Descrição**: Esta é a página inicial que o usuário visualiza ao acessar o site.
- **Funcionalidade**:
  - Pede o **email** e **senha** do usuário.
  - Botão "Login" que, ao ser clicado, redireciona o usuário à página **Home** (Página Inicial).
  - Botão "Cadastre-se" que redireciona o usuário à página de **Cadastro**.

### 2. Página de Cadastro de Usuário

- **Descrição**: Página onde novos usuários podem criar uma conta.
- **Funcionalidade**:
  - Pede o **nome**, **email** e **senha**.
  - Checkbox para o usuário marcar caso seja um administrador.
  - Após o cadastro, o usuário é redirecionado à **Página de Login**.

### 3. Página Inicial / Home

- **Descrição**: Página de boas-vindas ao site após o login.
- **Funcionalidade**:
  - Contém três links:
    - 🛍️ **Catálogo**: Redireciona o usuário à **Página de Catálogo**.
    - 🚪 **Sair**: Faz o logout do usuário e o redireciona à **Página de Login**.
    - 🛠️ **Administração de Produtos**: Visível apenas para administradores, redireciona o usuário à página de **Administração de Produtos**.

### 4. Página de Catálogo

- **Descrição**: Exibe todos os produtos da loja.
- **Funcionalidade**:
  - Cada produto tem uma imagem, nome, descrição e preço.
  - Dois botões:
    - ➕ **Adicionar ao Carrinho**: Adiciona o produto ao carrinho, que é exibido na mesma página.
    - ❤️ **Favoritar Produto**: Permite ao usuário favoritar o produto.
  - 🛒 **Carrinho**: Apresenta os produtos adicionados ao carrinho, que o usuário pode revisar.

### 5. Página de Administração de Produtos (somente para admins)

- **Descrição**: Permite aos administradores gerenciar os produtos da loja.
- **Funcionalidade**:
  - Tabela que lista todos os produtos com:
    - Nome
    - Descrição
    - Preço
  - Ao lado de cada produto há dois botões:
    - ✏️ **Editar Produto**: Redireciona para a página de **Edição de Produto**.
    - 🗑️ **Remover Produto**: Remove o produto do banco de dados.
  - No topo da página, há dois botões:
    - 🔙 **Voltar**: Leva o usuário de volta à **Página Inicial**.
    - ➕ **Cadastrar Produto**: Redireciona à página de **Cadastro de Produto**.

### 6. Página de Cadastro de Produtos

- **Descrição**: Permite aos administradores cadastrar novos produtos.
- **Funcionalidade**:
  - Formulário solicitando:
    - **Nome do Produto**
    - **Preço**
    - **Descrição**

### 7. Página de Edição de Produtos

- **Descrição**: Permite editar os detalhes de um produto já existente.
- **Funcionalidade**:
  - Exibe um formulário com os dados do produto selecionado (nome, preço, descrição).
  - Os administradores podem alterar essas informações e salvar as alterações.

---

## 🛠️ Tecnologias Utilizadas

- **HTML**
- **CSS**
- **JavaScript**
- **SQL** para gerenciamento dos dados (produtos, usuários, etc.)
- **Express** para gerenciamento das rotas e API
- **MySQL** para o banco de dados
- **Nodemon** para facilitar o desenvolvimento
- **CORS** para controle de acesso

---

## 🚀 Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-repo/tocapedrilhante.git
   ```

2. Instale as dependências:
   ```bash
   npm install mysql2 nodemon cors express
   ```

3. Configure o banco de dados:
    O código está disponível no arquivo /documentacao/tabelas.sql

4. Execute o projeto:
   ```bash
   npm start
   ```

5. O site estará disponível no endereço `http://localhost:3000`.