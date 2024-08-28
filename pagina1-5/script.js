document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:3000/usuario/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    alert(result.message);
});

document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('http://localhost:3000/usuario/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    const result = await response.json();
    alert(result.message);
});

// Alternar entre os formulários
document.getElementById('showRegister').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('registerContainer').style.display = 'block';
    document.getElementById('loginForm').parentElement.style.display = 'none';
});

document.getElementById('showLogin').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('loginForm').parentElement.style.display = 'block';
    document.getElementById('registerContainer').style.display = 'none';
});