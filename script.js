document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Background
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${Math.random() * 10}s`;

        particlesContainer.appendChild(particle);
    }

    // 2. Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Trigger progress bars if it's the skills section
                if (entry.target.id === 'skills') {
                    // Trigger horizontal progress bars
                    document.querySelectorAll('.progress-fill-horizontal').forEach(p => {
                        const width = p.style.width;
                        p.style.width = '0%';
                        setTimeout(() => {
                            p.style.width = width;
                        }, 100);
                    });
                    
                    // Trigger vertical progress bars (resetting them to trigger CSS animation)
                    document.querySelectorAll('.vertical-progress').forEach(p => {
                        const height = p.style.height;
                        p.style.height = '0%';
                        setTimeout(() => {
                            p.style.height = height;
                        }, 100);
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('scroll-reveal');
        observer.observe(section);
    });

    // 4. Form Submission Handling (AJAX with Formspree)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            const formData = new FormData(contactForm);

            btn.innerText = 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    btn.innerText = 'Message Sent!';
                    btn.classList.add('btn-success');
                    btn.style.background = '#22c55e'; // Green for success
                    contactForm.reset();

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.disabled = false;
                        btn.classList.remove('btn-success');
                        btn.style.background = '';
                    }, 5000);
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        throw new Error(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        throw new Error('Oops! There was a problem submitting your form');
                    }
                }
            } catch (error) {
                console.error('Form Submission Error:', error);
                btn.innerText = 'Error! Try Again';
                btn.style.background = '#ef4444'; // Red for error
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    // 5. Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        const icon = themeToggle.querySelector('i');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');

            if (body.classList.contains('light-theme')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // About Stat Card 3D Tilt & Mouse Glow
    const statCard = document.querySelector('#about-stat-card');
    if (statCard) {
        statCard.addEventListener('mousemove', (e) => {
            const rect = statCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            statCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
            statCard.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            statCard.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        });
        
        statCard.addEventListener('mouseleave', () => {
            statCard.style.transform = `rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
        });
    }
});
