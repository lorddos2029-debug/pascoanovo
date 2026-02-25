document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCount = document.querySelector('.cart-count');
    const emptyCartMessage = document.querySelector('.empty-cart-message');

    let cart = JSON.parse(localStorage.getItem('cs_cart')) || [];

    function renderCart() {
        // Clear items but keep empty message
        const items = cartItemsContainer.querySelectorAll('.cart-item');
        items.forEach(item => item.remove());

        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            document.querySelector('.cart-summary').style.display = 'none';
            cartCount.textContent = 0;
            return;
        }

        emptyCartMessage.classList.add('hidden');
        document.querySelector('.cart-summary').style.display = 'block';

        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = parseFloat(item.finalPrice) * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <div class="item-price">R$ ${item.finalPrice.replace('.', ',')}</div>
                </div>
                <div class="item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-btn" data-index="${index}"><i class="far fa-trash-alt"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        totalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Event Delegation
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const index = parseInt(target.dataset.index);

        if (target.classList.contains('plus')) {
            cart[index].quantity++;
        } else if (target.classList.contains('minus')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            }
        } else if (target.classList.contains('remove-btn')) {
            cart.splice(index, 1);
        }

        saveCart();
        renderCart();
    });

    checkoutBtn.addEventListener('click', () => {
        const currentParams = window.location.search;
        window.location.href = 'checkout.html' + currentParams;
    });

    function saveCart() {
        localStorage.setItem('cs_cart', JSON.stringify(cart));
    }

    renderCart();
});
