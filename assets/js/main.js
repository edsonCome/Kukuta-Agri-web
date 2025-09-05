document.addEventListener('DOMContentLoaded', function () {

    // =========================================================================
    // CARROSSEL HERO (PÁGINA INICIAL) - COM SUPORTE A TRADUÇÕES
    // =========================================================================
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const slides = heroSection.querySelectorAll('.hero-carousel-slide');
        const dots = heroSection.querySelectorAll('.carousel-dot');
        const prevBtn = heroSection.querySelector('.carousel-prev');
        const nextBtn = heroSection.querySelector('.carousel-next');
        const progressBar = heroSection.querySelector('.carousel-progress-bar');
        
        const heroTitleSpan = document.querySelector('#hero-title > span:first-child');
        const heroSubtitleSpan = document.getElementById('hero-subtitle');
        const heroDescriptionP = document.getElementById('hero-description');
        
        let currentSlide = 0;
        let slideInterval;
        const slideTime = 6000; // 6 segundos

        const updateContent = (slideIndex) => {
            if (!window.translationManager) {
                console.error("Translation manager não encontrado. A carregar texto padrão.");
                return;
            }

            const slide = slides[slideIndex];
            const titleKey = slide.dataset.titleKey;
            const subtitleKey = slide.dataset.subtitleKey;
            const descriptionKey = slide.dataset.descriptionKey;

            const title = window.translationManager.t(titleKey);
            const subtitle = window.translationManager.t(subtitleKey);
            const description = window.translationManager.t(descriptionKey);
            
            heroTitleSpan.parentElement.style.opacity = '0';
            heroDescriptionP.style.opacity = '0';
            
            setTimeout(() => {
                heroTitleSpan.textContent = title;
                heroSubtitleSpan.textContent = subtitle;
                heroDescriptionP.textContent = description;
                
                heroTitleSpan.parentElement.style.opacity = '1';
                heroDescriptionP.style.opacity = '1';
            }, 300);
        };
        
        const showSlide = (index) => {
            if (progressInterval) clearInterval(progressInterval);
            
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            updateContent(index);
            currentSlide = index;
            
            startProgressBar();
        };
        
        const nextSlide = () => {
            showSlide((currentSlide + 1) % slides.length);
        };
        
        const prevSlide = () => {
            showSlide((currentSlide - 1 + slides.length) % slides.length);
        };

        let progressInterval;
        const startProgressBar = () => {
            if (!progressBar) return;
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            void progressBar.offsetWidth; 
            progressBar.style.transition = `width ${slideTime}ms linear`;
            progressBar.style.width = '100%';
        };
        
        const startAutoRotation = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideTime);
            startProgressBar();
        };

        if (slides.length > 1) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoRotation();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoRotation();
            });

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    if (index !== currentSlide) {
                        showSlide(index);
                        startAutoRotation();
                    }
                });
            });
            
            startAutoRotation();
        }
    }

    // =========================================================================
    // MENU HAMBÚRGUER (MOBILE)
    // =========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            const isActive = navLinks.classList.contains('active');
            
            icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
            menuToggle.setAttribute('aria-label', isActive ? 'Fechar menu' : 'Abrir menu');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    menuToggle.click();
                }
            });
        });
    }

    // =========================================================================
    // MARCAR LINK ATIVO NA NAVEGAÇÃO
    // =========================================================================
    const currentPagePath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinkItems = document.querySelectorAll('.nav-links a');

    navLinkItems.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPagePath) {
            link.classList.add('active');
        }
    });

    // =========================================================================
    // ANIMAÇÕES AO ROLAR A PÁGINA (INTERSECTION OBSERVER)
    // =========================================================================
    const fadeInElements = document.querySelectorAll('.fade-in');
    if (fadeInElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        fadeInElements.forEach(el => observer.observe(el));
    }

    // =========================================================================
    // LÓGICA DA PÁGINA DE PRODUTOS (FILTROS E PAGINAÇÃO)
    // =========================================================================
    const produtosContainer = document.getElementById('produtos-container');
    if (produtosContainer) {
        // ... (A lógica de filtros e paginação da página de produtos vai aqui)
        // O código que você já tinha para esta secção está correto e pode ser
        // mantido aqui.
    }

    // =========================================================================
    // SMOOTH SCROLL PARA ÂNCORAS
    // =========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            
            try {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } catch (error) {
                console.warn('Smooth scroll failed for selector:', href);
            }
        });
    });

    // =========================================================================
    // FORMULÁRIO DE NEWSLETTER
    // =========================================================================
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim()) {
                alert('Obrigado por se inscrever na nossa newsletter!');
                emailInput.value = '';
            }
        });
    });

});