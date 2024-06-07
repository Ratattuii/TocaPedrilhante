setTimeout(function() { alert("Clicai sobre a arca de moedas para desembolsar vosso ouro e pagar pela mercancia adquirida."); }, 100);

document.addEventListener('DOMContentLoaded', () => {
    const goToMenuButton = document.getElementById('go-to-menu');

    
    goToMenuButton.addEventListener('click', () => {
        alert("A transação está findada! Grato somos por vossa predileção!")
        window.location.href = '/pagina1/index.html';
    });
})