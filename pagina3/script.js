document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-to-cart');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartButton = document.getElementById('empty-cart');
    const goToCartButton = document.getElementById('go-to-cart');
    var cartTotal = 0;


    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product');
            const price = parseFloat(productElement.dataset.price);
            addToCart(price);
        });
    });

    emptyCartButton.addEventListener('click', () => {
        emptyCart();
    });

    goToCartButton.addEventListener('click', () => {
        window.location.href = '/pagina4/index.html';
    });

    function addToCart(price) {
        cartTotal += price;
        updateCartTotal();
        showNotification('Um artefato foi acrescentado ao alforje!');
    }

    function emptyCart() {
        cartTotal = 0;
        updateCartTotal();
        showNotification('O alforje está vazio novamente!');
    }

    function updateCartTotal() {
        cartTotalElement.firstChild.textContent = `Total: R$ ${cartTotal.toFixed(2)}`;
    }

    function showNotification(message) {
        alert(message);
    }
});
