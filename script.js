document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const heroSection = document.getElementById('hero');
    const quizSection = document.getElementById('quiz');
    const loadingSection = document.getElementById('loading');
    const resultSection = document.getElementById('result');
    const startBtn = document.getElementById('start-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const userCountElement = document.getElementById('user-count');
    const notificationContainer = document.getElementById('notification-container');
    const bodyEl = document.body;

    // Quiz Data
    const questions = [
        {
            question: "Qual tipo de chocolate da Cacau Show você prefere?",
            img: "coelho.jpg",
            options: [
                { text: "Ao Leite" },
                { text: "Meio Amargo 55%" },
                { text: "Amargo 70%+" },
                { text: "Branco" }
            ]
        },
        {
            question: "Qual linha da Cacau Show é a sua favorita?",
            img: "ovo.jpg",
            options: [
                { text: "LaCreme" },
                { text: "Dreams" },
                { text: "Bendito Cacao" },
                { text: "Trufas e Bombons" }
            ]
        },
        {
            question: "Para quem você vai comprar nesta Páscoa?",
            img: "chapeu.jpg",
            options: [
                { text: "Para mim" },
                { text: "Família" },
                { text: "Namorado(a)" },
                { text: "Amigos" }
            ]
        },
        {
            question: "Qual recheio você mais ama?",
            img: "ovo2.jpg",
            options: [
                { text: "Brigadeiro Cremoso" },
                { text: "Avelã / Nutella" },
                { text: "Doce de Leite" },
                { text: "Caramelo Salgado" }
            ]
        },
        {
            question: "Qual formato de chocolate você quer hoje?",
            img: "ovo3.jpg",
            options: [
                { text: "Ovo de Páscoa" },
                { text: "Barra" },
                { text: "Trufas/Bombons" },
                { text: "Cestas/Kit Presente" }
            ]
        },
        {
            question: "O que mais pesa na sua escolha?",
            img: "mulherpascoa.png",
            options: [
                { text: "Sabor e Qualidade" },
                { text: "Desconto/Preço" },
                { text: "Variedade de Opções" },
                { text: "Embalagens para Presente" }
            ]
        }
    ];

    let currentQuestionIndex = 0;

    // Start Quiz
    startBtn.addEventListener('click', () => {
        const bunny = document.getElementById('bunny-pointer');
        if (bunny) bunny.remove();
        heroSection.classList.remove('active');
        heroSection.style.display = 'none';
        quizSection.classList.add('active');
        quizSection.style.display = 'block';
        
        // Update total questions count in UI
        document.getElementById('total-q').textContent = questions.length;
        
        loadQuestion();
    });

    // Load Question
    function loadQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        questionText.style.opacity = 0;
        const imgEl = document.getElementById('question-image');
        const mediaBox = imgEl ? imgEl.parentElement : null;
        if (imgEl && mediaBox) {
            if (currentQuestion.img) {
                mediaBox.style.display = 'block';
                imgEl.onerror = () => {
                    mediaBox.style.display = 'none';
                    imgEl.onerror = null;
                };
                imgEl.src = currentQuestion.img;
            } else {
                imgEl.removeAttribute('src');
                mediaBox.style.display = 'none';
            }
        }
        
        // Update question number
        document.getElementById('current-q').textContent = currentQuestionIndex + 1;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Animate question text in
        setTimeout(() => {
            questionText.style.opacity = 1;
            questionText.style.transition = 'opacity 0.5s ease-in';
        }, 100);

        // Update Progress Bar
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;

        // Create Options
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            
            // Text Element
            const span = document.createElement('div');
            span.className = 'option-text';
            span.innerHTML = option.text; 
            
            button.appendChild(span);
            
            button.style.opacity = 0;
            button.style.animation = `fadeIn 0.5s ease-out forwards ${index * 0.1}s`;
            
            button.addEventListener('click', () => handleAnswer(option.text));
            optionsContainer.appendChild(button);
        });
    }

    // Handle Answer
    function handleAnswer(selectedOption) {
        // Here you could save the answer if needed
        
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            // Fade out current content
            questionText.style.opacity = 0;
            const buttons = document.querySelectorAll('.option-btn');
            buttons.forEach(btn => btn.style.opacity = 0);

            setTimeout(() => {
                loadQuestion();
            }, 500);
        } else {
            finishQuiz();
        }
    }

    // Finish Quiz
    function finishQuiz() {
        quizSection.classList.remove('active');
        quizSection.style.display = 'none';
        loadingSection.classList.add('active');
        loadingSection.style.display = 'block';
        progressBar.style.width = '100%';

        // Validation Steps Animation
        const steps = [
            { id: 'step1', delay: 1000 },
            { id: 'step2', delay: 2500 },
            { id: 'step3', delay: 4000 }
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                const stepEl = document.getElementById(step.id);
                const iconContainer = stepEl.querySelector('.icon-container');
                
                stepEl.classList.add('active');
                iconContainer.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; 
                
                setTimeout(() => {
                    stepEl.classList.remove('active');
                    stepEl.classList.add('completed');
                    iconContainer.innerHTML = '<i class="fas fa-check-circle"></i>';
                }, 1200);
            }, step.delay);
        });

        // Show Result
        setTimeout(() => {
            loadingSection.classList.remove('active');
            loadingSection.style.display = 'none';
            resultSection.classList.add('active');
            resultSection.style.display = 'block';
            startConfetti();
        }, 6000); // Increased total time to match steps
    }

    const MIN_USERS = 50;
    const MAX_USERS = 212;
    let activeUsers = Math.floor(Math.random() * (MAX_USERS - MIN_USERS + 1)) + MIN_USERS;
    function updateActiveUsers() {
        let delta = Math.floor(Math.random() * 9) - 2;
        if (Math.random() < 0.25) {
            delta += Math.floor(Math.random() * 10);
        }
        activeUsers = Math.max(MIN_USERS, Math.min(MAX_USERS, activeUsers + delta));
        userCountElement.textContent = activeUsers;
        const delay = 500 + Math.random() * 500;
        setTimeout(updateActiveUsers, delay);
    }
    updateActiveUsers();

    // Social Proof: Notifications
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
        showNotification();
        setInterval(showNotification, 8000 + Math.random() * 4000); // Every 8-12 seconds
    }, 2000);

    // Copy Code Functionality
    const copyBtn = document.querySelector('.copy-btn');
    const codeSpan = document.querySelector('.coupon-code span');

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = codeSpan.innerText;
            navigator.clipboard.writeText(code).then(() => {
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.style.color = '#4CAF50';
                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                    copyBtn.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }

    // Confetti Effect
    function startConfetti() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#C5A059', '#3D1F14', '#FFF8F0', '#FFD700'];

        for (let i = 0; i < 100; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 10 + 5,
                h: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 2,
                angle: Math.random() * Math.PI * 2,
                spin: Math.random() * 0.2 - 0.1
            });
        }

        let running = true;
        function animate() {
            if (!running) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                p.y += p.speed;
                p.angle += p.spin;
                p.x += Math.sin(p.angle) * 2;

                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });
            requestAnimationFrame(animate);
        }

        animate();

        // Stop confetti after 5 seconds
        setTimeout(() => {
            running = false;
            canvas.remove();
        }, 5000);
    }

    // Preserve UTM parameters for store link
    const storeLink = document.querySelector('a[href="store.html"]');
    if (storeLink) {
        const currentParams = window.location.search;
        if (currentParams) {
            storeLink.href = 'store.html' + currentParams;
        }
    }

    // Bunny Pointer (dynamic, points to start button)
    function createBunnyPointer() {
        if (!startBtn) return;
        const bunny = document.createElement('div');
        bunny.id = 'bunny-pointer';
        bunny.className = 'bunny-pointer';
        bunny.innerHTML = `
            <span class="bunny-emoji" aria-hidden="true">🐰</span>
            <span class="bunny-speech" aria-hidden="true">Comece aqui!</span>
        `;
        bodyEl.appendChild(bunny);
        positionBunny();
        // Reposition on resize/scroll
        window.addEventListener('resize', positionBunny, { passive: true });
        window.addEventListener('scroll', positionBunny, { passive: true });
    }

    function positionBunny() {
        const bunny = document.getElementById('bunny-pointer');
        if (!bunny || !startBtn) return;
        const btnRect = startBtn.getBoundingClientRect();
        const vw = window.innerWidth;
        const bunnyW = bunny.offsetWidth || 180;
        const bunnyH = bunny.offsetHeight || 60;
        const spacing = 8; // always above the button (slightly lower than antes)
        let top = btnRect.top - bunnyH - spacing;
        let left = btnRect.left + btnRect.width / 2 - bunnyW / 2;
        left = Math.max(8, Math.min(vw - bunnyW - 8, left));
        if (top < 8) top = 8;
        bunny.style.top = `${top}px`;
        bunny.style.left = `${left}px`;
    }

    // Create bunny after a short delay to ensure layout is stable
    setTimeout(createBunnyPointer, 500);
});
