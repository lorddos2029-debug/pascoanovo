document.addEventListener('DOMContentLoaded', () => {
    const summaryItems = document.getElementById('summary-items');
    const chkSubtotal = document.getElementById('chk-subtotal');
    const chkTotal = document.getElementById('chk-total');
    const finalizeBtn = document.getElementById('finalize-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const pixModal = document.getElementById('pix-modal');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const confirmPaymentBtn = document.getElementById('confirm-payment');
    const copyPixBtn = document.querySelector('.copy-pix-btn');
    const pixCodeInput = document.getElementById('pix-code-input');
    const qrImg = document.querySelector('.qr-code-container img');
    const qrBox = document.querySelector('.qr-code-container');
    const pixBox = document.querySelector('.pix-code-box');
    const pixLoading = document.getElementById('pix-loading');
    const emailInput = document.getElementById('email');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('phone');
    const cepInput = document.getElementById('cep');
    const stateInput = document.getElementById('state');
    const cityInput = document.getElementById('city');
    const neighborhoodInput = document.getElementById('neighborhood');
    const streetInput = document.getElementById('street');
    const numberInput = document.getElementById('number');
    const shippingOptions = document.getElementById('shipping-options');
    const personalBox = document.getElementById('personal-box');
    const addressBox = document.getElementById('address-box');
    const paymentBox = document.getElementById('payment-box');
    const toAddressBtn = document.getElementById('to-address-btn');
    const toPaymentBtn = document.getElementById('to-payment-btn');

    let cart = JSON.parse(localStorage.getItem('cs_cart')) || [];
    let shippingCost = 0;

    function renderSummary() {
        if (cart.length === 0) {
            window.location.href = 'store.html';
            return;
        }

        let subtotal = 0;
        summaryItems.innerHTML = '';

        cart.forEach(item => {
            const itemTotal = parseFloat(item.finalPrice) * item.quantity;
            subtotal += itemTotal;

            const itemEl = document.createElement('div');
            itemEl.className = 'summary-item';
            itemEl.innerHTML = `
                <div class="img-wrapper"><img src="${item.image}" alt="${item.name}"></div>
                <div class="info">
                    <p class="name">${item.name}</p>
                    <p class="qty">Qtd: ${item.quantity}</p>
                    <p class="price">R$ ${item.finalPrice.replace('.', ',')}</p>
                </div>
            `;
            summaryItems.appendChild(itemEl);
        });

        chkSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        const shippingEl = document.getElementById('chk-shipping');
        if (shippingEl) shippingEl.textContent = `R$ ${shippingCost.toFixed(2).replace('.', ',')}`;
        const grand = subtotal + shippingCost;
        chkTotal.textContent = `R$ ${grand.toFixed(2).replace('.', ',')}`;

        if (pixCodeInput) pixCodeInput.value = '';
        if (qrImg) qrImg.src = '';
    }

    renderSummary();

    function allAddressValid() {
        const cepDigits = normalizeDigits(cepInput.value);
        return (
            cepDigits.length === 8 &&
            stateInput.value.trim() &&
            cityInput.value.trim() &&
            neighborhoodInput.value.trim() &&
            streetInput.value.trim() &&
            numberInput.value.trim()
        );
    }

    if (toAddressBtn) {
        toAddressBtn.addEventListener('click', () => {
            emailInput.setCustomValidity('');
            firstNameInput.setCustomValidity('');
            lastNameInput.setCustomValidity('');
            cpfInput.setCustomValidity('');
            phoneInput.setCustomValidity('');
            if (!isValidCPF(cpfInput.value)) {
                cpfInput.setCustomValidity('CPF inválido. Use 000.000.000-00 ou apenas dígitos.');
            }
            if (!isValidPhone(phoneInput.value)) {
                phoneInput.setCustomValidity('Celular inválido. Use (00) 00000-0000 ou apenas dígitos.');
            }
            if (checkoutForm.checkValidity()) {
                addressBox.classList.remove('hidden');
                addressBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                checkoutForm.reportValidity();
            }
        });
    }

    function maybeRevealShipping() {
        if (allAddressValid()) {
            shippingOptions.classList.remove('hidden');
        } else {
            shippingOptions.classList.add('hidden');
            paymentBox.classList.add('hidden');
            toPaymentBtn.classList.add('hidden');
            finalizeBtn.disabled = true;
            finalizeBtn.classList.add('disabled');
        }
    }

    [cepInput, stateInput, cityInput, neighborhoodInput, streetInput, numberInput].forEach(el => {
        if (!el) return;
        el.addEventListener('input', maybeRevealShipping);
        el.addEventListener('blur', maybeRevealShipping);
    });

    if (shippingOptions) {
        shippingOptions.addEventListener('click', (e) => {
            const option = e.target.closest('.payment-option');
            if (!option) return;
            const all = shippingOptions.querySelectorAll('.payment-option');
            all.forEach(op => op.classList.remove('active'));
            option.classList.add('active');
            const radio = option.querySelector('.radio-custom');
            all.forEach(op => {
                const r = op.querySelector('.radio-custom');
                if (r) r.classList.remove('selected');
            });
            if (radio) radio.classList.add('selected');
            const val = parseFloat(option.dataset.shipping || '0');
            shippingCost = isNaN(val) ? 0 : val;
            renderSummary();
            toPaymentBtn.classList.remove('hidden');
        });
    }

    if (toPaymentBtn) {
        toPaymentBtn.addEventListener('click', () => {
            paymentBox.classList.remove('hidden');
            paymentBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
            finalizeBtn.disabled = false;
            finalizeBtn.classList.remove('disabled');
        });
    }

    if (cepInput) {
        cepInput.addEventListener('blur', async () => {
            const raw = normalizeDigits(cepInput.value);
            if (raw.length !== 8) return;
            try {
                const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
                const data = await res.json();
                if (data && !data.erro) {
                    stateInput.value = data.uf || stateInput.value;
                    cityInput.value = data.localidade || cityInput.value;
                    neighborhoodInput.value = data.bairro || neighborhoodInput.value;
                    streetInput.value = data.logradouro || streetInput.value;
                }
            } catch (_) {}
        });
    }

    // Form Submission
    finalizeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        emailInput.setCustomValidity('');
        firstNameInput.setCustomValidity('');
        lastNameInput.setCustomValidity('');
        cpfInput.setCustomValidity('');
        phoneInput.setCustomValidity('');
        cepInput.setCustomValidity('');
        stateInput.setCustomValidity('');
        cityInput.setCustomValidity('');
        neighborhoodInput.setCustomValidity('');
        streetInput.setCustomValidity('');
        numberInput.setCustomValidity('');

        if (!isValidCPF(cpfInput.value)) {
            cpfInput.setCustomValidity('CPF inválido. Use 000.000.000-00 ou apenas dígitos.');
        }
        if (!isValidPhone(phoneInput.value)) {
            phoneInput.setCustomValidity('Celular inválido. Use (00) 00000-0000 ou apenas dígitos.');
        }
        const cepDigits = normalizeDigits(cepInput.value);
        if (cepDigits.length !== 8) {
            cepInput.setCustomValidity('CEP inválido. Use 00000-000 ou apenas dígitos.');
        }

        if (checkoutForm.checkValidity()) {
            pixModal.classList.remove('hidden');
            if (pixLoading) pixLoading.classList.add('show');
            const pixError = document.getElementById('pix-error');
            if (pixError) pixError.classList.add('hidden');
            if (qrBox) qrBox.style.display = 'none';
            if (pixBox) pixBox.style.display = 'none';
            if (confirmPaymentBtn) confirmPaymentBtn.style.display = 'none';
            startTimer();
            createPixCharge().then(() => {
                if (pixLoading) pixLoading.classList.remove('show');
                if (qrBox) qrBox.style.display = 'block';
                if (pixBox) pixBox.style.display = 'block';
                if (confirmPaymentBtn) confirmPaymentBtn.style.display = 'block';
            }).catch(() => {
                if (pixLoading) pixLoading.classList.remove('show');
                if (pixError) pixError.classList.remove('hidden');
                if (qrBox) qrBox.style.display = 'block';
                if (pixBox) pixBox.style.display = 'block';
                if (confirmPaymentBtn) confirmPaymentBtn.style.display = 'block';
            });
        } else {
            checkoutForm.reportValidity();
        }
    });

    // Modal Actions
    closeModalBtn.addEventListener('click', () => {
        pixModal.classList.add('hidden');
    });

    copyPixBtn.addEventListener('click', async () => {
        const text = pixCodeInput.value;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                pixCodeInput.select();
                document.execCommand('copy');
            }
            copyPixBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        } catch (_) {
            copyPixBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Falhou';
        }
        setTimeout(() => {
            copyPixBtn.innerHTML = '<i class="far fa-copy"></i> Copiar Código';
        }, 2000);
    });

    confirmPaymentBtn.addEventListener('click', () => {
        pixModal.classList.add('hidden');
        successModal.classList.remove('hidden');
        const orderIdEl = document.querySelector('.order-id');
        const rand = Math.floor(Math.random() * 900000) + 100000;
        if (orderIdEl) {
            orderIdEl.textContent = `Pedido #CS-${rand}`;
        }
        localStorage.removeItem('cs_cart');
    });

    // Countdown Timer
    function startTimer() {
        let duration = 600;
        const display = document.querySelector('#countdown');
        const timer = setInterval(() => {
            let minutes = parseInt(duration / 60, 10);
            let seconds = parseInt(duration % 60, 10);

            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            display.textContent = minutes + ':' + seconds;

            if (--duration < 0) {
                clearInterval(timer);
            }
        }, 1000);
    }

    function buildPixPayload(amount) {
        const key = '123e4567-e89b-12d3-a456-426614174000';
        const merchant = 'CACAU SHOW';
        const city = 'SAO PAULO';
        return `00020126580014BR.GOV.BCB.PIX0136${key}52040000530398654${amount.replace('.', '')}5802BR59${merchant.length}${merchant}60${city.length}${city}62070503***6304ABCD`;
    }

    function normalizeDigits(str) {
        return (str || '').replace(/\D/g, '');
    }

    function isValidCPF(cpf) {
        const digits = normalizeDigits(cpf);
        if (!/^\d{11}$/.test(digits)) return false;
        if (/^(\d)\1{10}$/.test(digits)) return false;
        let sum = 0;
        for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
        let check1 = (sum * 10) % 11; if (check1 === 10) check1 = 0;
        if (check1 !== parseInt(digits[9])) return false;
        sum = 0;
        for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
        let check2 = (sum * 10) % 11; if (check2 === 10) check2 = 0;
        return check2 === parseInt(digits[10]);
    }

    function isValidPhone(phone) {
        const d = normalizeDigits(phone);
        return d.length === 10 || d.length === 11;
    }

    async function createPixCharge() {
        const subtotalText = chkSubtotal.textContent.replace('R$ ', '').replace('.', '').replace(',', '.');
        const shippingText = document.getElementById('chk-shipping').textContent.replace('R$ ', '').replace('.', '').replace(',', '.');
        const amount = parseFloat(subtotalText || '0') + parseFloat(shippingText || '0');
        const name = `${firstNameInput.value} ${lastNameInput.value}`.trim();
        const customer = {
            name,
            email: emailInput.value,
            document: normalizeDigits(cpfInput.value),
            phone: normalizeDigits(phoneInput.value)
        };
        const description = 'Pedido PIX';
        const res = await fetch('/api/pix/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, customer, description })
        });
        if (!res.ok) throw new Error('pix_failed');
        const data = await res.json();
        const payload = (data && data.payload) || '';
        const qr = (data && data.qrCode) || '';
        if (payload) pixCodeInput.value = payload;
        const qrUrl = qr ? qr : (payload ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payload)}` : '');
        if (qrImg) qrImg.src = qrUrl;
        if (!payload && !qrUrl) throw new Error('pix_empty_response');
    }
});
