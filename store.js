document.addEventListener('DOMContentLoaded', () => {
    // Products Data
    const products = [
        {
            name: "Ovo de Páscoa ao Leite Pelúcia Snoopy Astronauta 170g",
            image: "pa1.webp",
            price: 65.90,
            originalPrice: 119.99,
            discount: 95,
            category: "Infantil",
            rating: 5.0
        },
        {
            name: "Ovo de Páscoa ao Leite Pelúcia Animadinha com LED Ursinhos",
            image: "pa2.webp",
            price: 68.90,
            originalPrice: 129.99,
            discount: 95,
            category: "Dreams",
            rating: 4.9
        },
        {
            name: "Ovo de Páscoa ao Leite Pelúcia Zangadinho com LED Ursinhos",
            image: "pa3.webp",
            price: 68.90,
            originalPrice: 129.99,
            discount: 95,
            category: "Bendito Cacao",
            rating: 4.7
        },
        {
            name: "Ovo de Páscoa Patrulha Canina Garrafa Chase 170g",
            image: "pa8.webp",
            price: 69.92,
            originalPrice: 149.99,
            discount: 95,
            category: "Infantil",
            rating: 4.8
        },
        {
            name: "Ovo de Páscoa Recheado laCreme ao Leite Zero Adição de Açúcar 400g",
            image: "pa9.webp",
            price: 59.90,
            originalPrice: 139.99,
            discount: 95,
            category: "LaCreme",
            rating: 4.9
        },
        {
            name: "Tablete ao Leite Pelúcia Chapéu Seletor Harry Potter 160g",
            image: "pa7.webp",
            price: 47.90,
            originalPrice: 149.99,
            discount: 95,
            category: "Tabletes",
            rating: 4.8
        },
        {
            name: "Ovo de Páscoa Dreams Brigadeiro 400g",
            image: "cho1.webp",
            price: 57.90,
            originalPrice: 119.99,
            discount: 95,
            category: "Dreams",
            rating: 4.9
        },
        {
            name: "Ovo de Páscoa Dreams Brownie 400g",
            image: "cho2.webp",
            price: 57.90,
            originalPrice: 119.99,
            discount: 95,
            category: "Dreams",
            rating: 4.8
        },
        {
            name: "Ovo de Páscoa Dreams Coco Caramelizado 400g",
            image: "cho3.webp",
            price: 57.90,
            originalPrice: 119.99,
            discount: 95,
            category: "Dreams",
            rating: 4.6
        }
    ];

    const promoProducts = [
        {
            name: "2 Ovos Dreams Cacau Show",
            image: "promo1.png",
            price: 69.90,
            originalPrice: 229.90,
            discount: 95,
            category: "Promoção",
            rating: 5.0
        },
        {
            name: "KIT PATRULHA CANINA + HARRY POTTER",
            image: "promo2.png",
            price: 79.90,
            originalPrice: 279.90,
            discount: 95,
            category: "Promoção",
            rating: 5.0
        }
    ];

    const productsGrid = document.getElementById('products-grid');
    const promoProductsGrid = document.getElementById('promo-products-grid');
    const sideCart = document.getElementById('side-cart');
    const sideOverlay = document.getElementById('side-cart-overlay');
    const sideItems = document.getElementById('side-cart-items');
    const sideSubtotal = document.getElementById('side-subtotal');
    const sideTotal = document.getElementById('side-total');

    function renderProducts() {
        productsGrid.innerHTML = '';
        products.forEach((product, index) => { 
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            const finalPrice = product.price.toFixed(2);
            const originalPrice = product.originalPrice.toFixed(2);

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <span class="discount-badge">-${product.discount}%</span>
                    <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                </div>
                <div class="product-info">
                    <div class="rating">
                        ${getStars(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="original-price">R$ ${originalPrice.replace('.', ',')}</span>
                        <span class="final-price">R$ ${finalPrice.replace('.', ',')}</span>
                    </div>
                    <div class="installments">
                        em até 3x de R$ ${(product.price / 3).toFixed(2).replace('.', ',')} sem juros
                    </div>
                    <button class="add-to-cart-btn" data-index="${index}" data-type="regular">COMPRAR AGORA</button>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
    }

    function renderPromoProducts() {
        if (!promoProductsGrid) return;
        promoProductsGrid.innerHTML = '';
        promoProducts.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            const finalPrice = product.price.toFixed(2);
            const originalPrice = product.originalPrice.toFixed(2);

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <span class="discount-badge badge-somente-hoje">SOMENTE HOJE</span>
                    <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                </div>
                <div class="product-info">
                    <div class="rating">
                        ${getStars(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="original-price">R$ ${originalPrice.replace('.', ',')}</span>
                        <span class="final-price">R$ ${finalPrice.replace('.', ',')}</span>
                    </div>
                    <div class="installments">
                        em até 3x de R$ ${(product.price / 3).toFixed(2).replace('.', ',')} sem juros
                    </div>
                    <button class="add-to-cart-btn" data-index="${index}" data-type="promo">COMPRAR AGORA</button>
                </div>
            `;
            
            promoProductsGrid.appendChild(productCard);
        });
    }

    function startTimer() {
        let duration = 600; // 10 minutes
        const display = document.getElementById('promo-timer');
        if (!display) return;

        // Initialize display immediately
        let minutes = parseInt(duration / 60, 10);
        let seconds = parseInt(duration % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;

        const timer = setInterval(() => {
            duration--;
            
            if (duration < 0) {
                duration = 0;
                display.textContent = "00:00";
                clearInterval(timer);
                // disablePromoButtons(); // Removido para não mostrar ESGOTADO
                return;
            }

            let minutes = parseInt(duration / 60, 10);
            let seconds = parseInt(duration % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;
        }, 1000);
    }

    function disablePromoButtons() {
        const promoBtns = document.querySelectorAll('.add-to-cart-btn[data-type="promo"]');
        promoBtns.forEach(btn => {
            btn.disabled = true;
            btn.textContent = "ESGOTADO";
            btn.style.backgroundColor = "#ccc";
            btn.style.cursor = "not-allowed";
        });
    }

    function getStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star filled"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt filled"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    renderProducts();

    // Cart Notification
    const cartCount = document.querySelector('.cart-count');
    
    // Initialize Cart from LocalStorage
    let cart = JSON.parse(localStorage.getItem('cs_cart')) || [];
    updateCartCount();

    // Helper function to append UTM parameters
    function appendUtm(url) {
        const currentParams = new URLSearchParams(window.location.search);
        if (currentParams.toString()) {
            const separator = url.includes('?') ? '&' : '?';
            return url + separator + currentParams.toString();
        }
        return url;
    }

    // Add to Cart Function
    window.addToCart = (index, type = 'regular') => {
        // Redirecionamento específico para o primeiro produto da promoção
        if (type === 'promo' && index === 0) {
            window.location.href = appendUtm('https://pagamento.pascoa-cacau2026.online/checkout?product=1a1f9ed5-11b0-11f1-b2a5-46da4690ad53');
            return;
        }

        // Redirecionamento específico para o segundo produto da promoção
        if (type === 'promo' && index === 1) {
            window.location.href = appendUtm('https://pagamento.pascoa-cacau2026.online/checkout?product=2654367d-11b0-11f1-b2a5-46da4690ad53');
            return;
        }

        // Redirecionamento específico para o produto regular index 0 (Snoopy Astronauta)
        if (type === 'regular' && index === 0) {
            window.location.href = appendUtm('https://pagamento.pascoa-cacau2026.online/checkout?product=05bc73c2-11b0-11f1-b2a5-46da4690ad53');
            return;
        }

        // Redirecionamento específico para o produto regular index 1 (Pelúcia Animadinha com LED Ursinhos)
        if (type === 'regular' && index === 1) {
            window.location.href = appendUtm('https://pagamento.pascoa-cacau2026.online/checkout?product=0f30b0fb-11b0-11f1-b2a5-46da4690ad53');
            return;
        }

        // Redirecionamento específico para o produto regular index 2 (Zangadinho com LED Ursinhos)
        if (type === 'regular' && index === 2) {
            window.location.href = appendUtm('https://pagamento.pascoa-cacau2026.online/checkout?product=32280a28-11b0-11f1-b2a5-46da4690ad53');
            return;
        }

        // Redirecionamento específico para o produto regular index 3 (Patrulha Canina Garrafa Chase)
        if (type === 'regular' && index === 3) {
            window.location.href = appendUtm('https://pagamento.pascoa-cacau2026.online/checkout?product=43a8aad4-11b0-11f1-b2a5-46da4690ad53');
            return;
        }

        // Redirecionamento específico para o produto regular index 4 (laCreme Zero Açúcar)
        if (type === 'regular' && index === 4) {
            window.location.href = appendUtm('https://pagamento.pascoa-cacau2026.online/checkout?product=4ce9e04e-11b0-11f1-b2a5-46da4690ad53');
            return;
        }

        // Redirecionamento específico para o produto regular index 5 (Chapéu Seletor Harry Potter)
        if (type === 'regular' && index === 5) {
            window.location.href = appendUtm('https://pagamento.pascoa-cacau2026.online/checkout?product=56248c17-11b0-11f1-b2a5-46da4690ad53');
            return;
        }



        // Redirecionamento específico para o produto regular index 6 (Dreams Brigadeiro)
        if (type === 'regular' && index === 6) {
            window.location.href = appendUtm('https://pagamento.pascoa-cacau2026.online/checkout?product=614fa3d6-11b0-11f1-b2a5-46da4690ad53');
            return;
        }

        // Redirecionamento específico para o produto regular index 7 (Dreams Brownie)
        if (type === 'regular' && index === 7) {
            window.location.href = appendUtm('https://pagamento.pascoa-cacau2026.online/checkout?product=68841540-11b0-11f1-b2a5-46da4690ad53');
            return;
        }

        // Redirecionamento específico para o produto regular index 8 (Dreams Coco Caramelizado)
        if (type === 'regular' && index === 8) {
            window.location.href = appendUtm('https://pagamento.pascoa-cacau2026.online/checkout?product=703124da-11b0-11f1-b2a5-46da4690ad53');
            return;
        }

        const product = type === 'promo' ? promoProducts[index] : products[index];
        const existingItem = cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1,
                finalPrice: product.price.toFixed(2)
            });
        }
        
        saveCart();
        updateCartCount();
        showToast("Produto adicionado ao carrinho!");
        openSideCart();
        renderSideCart();
    };

    function saveCart() {
        localStorage.setItem('cs_cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.add('bump');
            setTimeout(() => cartCount.classList.remove('bump'), 300);
        }
    }

    // Bind click events to rendered buttons
    function bindAddToCartButtons() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            const index = parseInt(btn.getAttribute('data-index'));
            const type = btn.getAttribute('data-type');
            btn.onclick = () => addToCart(index, type);
        });
    }

    renderProducts();
    renderPromoProducts();
    startTimer();
    bindAddToCartButtons();

    function openSideCart() {
        if (sideOverlay) sideOverlay.classList.add('visible');
        if (sideCart) sideCart.classList.add('open');
    }

    function closeSideCart() {
        if (sideOverlay) sideOverlay.classList.remove('visible');
        if (sideCart) sideCart.classList.remove('open');
    }

    function renderSideCart() {
        if (!sideItems) return;
        sideItems.innerHTML = '';
        let subtotal = 0;
        cart.forEach((item, index) => {
            const itemTotal = parseFloat(item.finalPrice) * item.quantity;
            subtotal += itemTotal;
            const row = document.createElement('div');
            row.className = 'side-item';
            row.innerHTML = `
                <div class="side-item-img"><img src="${item.image}" alt="${item.name}"></div>
                <div class="side-item-info">
                    <div class="name">${item.name}</div>
                    <div class="price">R$ ${item.finalPrice.replace('.', ',')}</div>
                </div>
                <div class="side-actions">
                    <div class="side-qty">
                        <button class="side-minus" data-index="${index}">-</button>
                        <span class="value">${item.quantity}</span>
                        <button class="side-plus" data-index="${index}">+</button>
                    </div>
                    <button class="side-remove" data-index="${index}"><i class="far fa-trash-alt"></i></button>
                </div>
            `;
            sideItems.appendChild(row);
        });
        if (sideSubtotal) sideSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        if (sideTotal) sideTotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        
        // Update links with UTMs
        const checkoutUrl = appendUtm('checkout.html');
        const cartUrl = appendUtm('cart.html');
        
        const sideCheckoutBtn = document.querySelector('.side-checkout-btn');
        const sideViewCartBtn = document.querySelector('.side-view-cart');
        
        if (sideCheckoutBtn) sideCheckoutBtn.href = checkoutUrl;
        if (sideViewCartBtn) sideViewCartBtn.href = cartUrl;
    }

    if (sideOverlay) sideOverlay.addEventListener('click', closeSideCart);
    const closeBtn = document.getElementById('close-side-cart');
    if (closeBtn) closeBtn.addEventListener('click', closeSideCart);

    if (sideItems) {
        sideItems.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const idx = parseInt(btn.dataset.index);
            if (btn.classList.contains('side-plus')) {
                cart[idx].quantity++;
            } else if (btn.classList.contains('side-minus')) {
                if (cart[idx].quantity > 1) cart[idx].quantity--;
            } else if (btn.classList.contains('side-remove')) {
                cart.splice(idx, 1);
            }
            saveCart();
            updateCartCount();
            renderSideCart();
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Social Proof: Notifications
    const notificationContainer = document.getElementById('notification-container');
    const names = ["Ana S.", "Carlos M.", "Beatriz L.", "João P.", "Fernanda R.", "Lucas T.", "Mariana C.", "Pedro H.", "Julia M.", "Rafael S."];
    const actions = [
        "acabou de ganhar 85% de desconto",
        "resgatou um Ovo de Páscoa",
        "ganhou 90% de desconto",
        "acabou de ganhar 75% de desconto",
        "ganhou 50% de desconto",
        "resgatou um cupom de 95% OFF"
    ];

    function showNotification() {
        if (!notificationContainer) return;
        
        const name = names[Math.floor(Math.random() * names.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-icon"><i class="fas fa-gift"></i></div>
            <div class="notification-text">
                <strong>${name}</strong>
                <span>${action}</span>
            </div>
        `;

        notificationContainer.appendChild(notification);

        // Remove after animation (5s total: 0.5s in + 4s wait + 0.5s out)
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Start notifications loop
    setTimeout(() => {
        if (notificationContainer) {
            showNotification();
            setInterval(() => {
                showNotification();
            }, 8000 + Math.random() * 4000); // Every 8-12 seconds
        }
    }, 2000);
});
