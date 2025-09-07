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
    // LÓGICA DA PÁGINA DE PRODUTOS - SISTEMA DE FILTROS E PESQUISA
    // =========================================================================
    const produtosContainer = document.getElementById('produtos-container');
    
    if (produtosContainer) {
        const searchInput = document.getElementById('produto-search');
        const searchBtn = document.querySelector('.search-btn');
        const categoriaFilter = document.getElementById('categoria-filter');
        const sazonalidadeFilter = document.getElementById('sazonalidade-filter');
        const sortSelect = document.getElementById('sort-select');
        
        // Obter todos os produtos
        let allProducts = Array.from(produtosContainer.querySelectorAll('.product-card'));
        let filteredProducts = [...allProducts];
        
        // Estado atual dos filtros
        let currentFilters = {
            search: '',
            categoria: '',
            sazonalidade: '',
            sort: 'populares'
        };

        // =========================================================================
        // FUNÇÃO PRINCIPAL DE FILTROS
        // =========================================================================
        const applyFilters = () => {
            filteredProducts = allProducts.filter(product => {
                // Filtro de pesquisa
                if (currentFilters.search.trim()) {
                    const productName = product.querySelector('h3').textContent.toLowerCase();
                    const productDesc = product.querySelector('.description').textContent.toLowerCase();
                    const searchTerm = currentFilters.search.toLowerCase();
                    
                    if (!productName.includes(searchTerm) && !productDesc.includes(searchTerm)) {
                        return false;
                    }
                }

                // Filtro de categoria
                if (currentFilters.categoria) {
                    const productCategory = product.dataset.category;
                    if (productCategory !== currentFilters.categoria) {
                        return false;
                    }
                }

                // Filtro de sazonalidade (baseado em categorias para simular)
                if (currentFilters.sazonalidade) {
                    // Para demonstração, vamos associar sazonalidade às categorias
                    const productCategory = product.dataset.category;
                    let productSeason = 'ano-inteiro'; // padrão
                    
                    if (productCategory === 'frutas') {
                        productSeason = 'epoca-chuvas'; // frutas na época das chuvas
                    } else if (productCategory === 'graos') {
                        productSeason = 'epoca-seca'; // grãos na época seca
                    }
                    // hortaliças e tubérculos ficam "ano-inteiro"
                    
                    if (currentFilters.sazonalidade !== productSeason && productSeason !== 'ano-inteiro') {
                        return false;
                    }
                }

                return true;
            });

            // Aplicar ordenação
            applySorting();
            
            // Mostrar produtos filtrados
            displayProducts();
            
            // Mostrar mensagem se não houver resultados
            showNoResultsMessage();
        };

        // =========================================================================
        // FUNÇÃO DE ORDENAÇÃO
        // =========================================================================
        const applySorting = () => {
            switch (currentFilters.sort) {
                case 'nome-asc':
                    filteredProducts.sort((a, b) => {
                        const nameA = a.querySelector('h3').textContent;
                        const nameB = b.querySelector('h3').textContent;
                        return nameA.localeCompare(nameB);
                    });
                    break;
                case 'nome-desc':
                    filteredProducts.sort((a, b) => {
                        const nameA = a.querySelector('h3').textContent;
                        const nameB = b.querySelector('h3').textContent;
                        return nameB.localeCompare(nameA);
                    });
                    break;
                case 'preco-asc':
                case 'preco-desc':
                    // Para demonstração, ordenamos por nome já que não temos preços
                    // Em produção, você ordenaria pelos preços reais
                    filteredProducts.sort((a, b) => {
                        const nameA = a.querySelector('h3').textContent;
                        const nameB = b.querySelector('h3').textContent;
                        return currentFilters.sort === 'preco-asc' ? 
                               nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
                    });
                    break;
                case 'populares':
                default:
                    // Manter ordem original (mais populares)
                    break;
            }
        };

        // =========================================================================
        // FUNÇÃO PARA MOSTRAR PRODUTOS
        // =========================================================================
        const displayProducts = () => {
            // Limpar container
            produtosContainer.innerHTML = '';
            
            // Mostrar produtos filtrados
            filteredProducts.forEach((product, index) => {
                // Adicionar animação escalonada
                product.style.animationDelay = `${index * 0.1}s`;
                produtosContainer.appendChild(product);
            });

            // Reativar animações de fade-in
            const newFadeElements = produtosContainer.querySelectorAll('.fade-in');
            newFadeElements.forEach(el => {
                el.classList.remove('visible');
                // Pequeno delay para retriggerar a animação
                setTimeout(() => {
                    el.classList.add('visible');
                }, 50);
            });
        };

        // =========================================================================
        // FUNÇÃO PARA MOSTRAR MENSAGEM DE "SEM RESULTADOS"
        // =========================================================================
        const showNoResultsMessage = () => {
            const existingMessage = document.getElementById('no-results-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            if (filteredProducts.length === 0) {
                const noResultsHTML = `
                    <div id="no-results-message" class="no-results-container">
                        <div class="no-results-content">
                            <i class="fas fa-search"></i>
                            <h3>Nenhum produto encontrado</h3>
                            <p>Tente ajustar os filtros ou termos de pesquisa.</p>
                            <button class="btn btn-green" onclick="clearAllFilters()">
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                `;
                produtosContainer.innerHTML = noResultsHTML;
            }
        };

        // =========================================================================
        // FUNÇÃO PARA LIMPAR TODOS OS FILTROS
        // =========================================================================
        window.clearAllFilters = () => {
            currentFilters = {
                search: '',
                categoria: '',
                sazonalidade: '',
                sort: 'populares'
            };

            // Reset form elements
            if (searchInput) searchInput.value = '';
            if (categoriaFilter) categoriaFilter.value = '';
            if (sazonalidadeFilter) sazonalidadeFilter.value = '';
            if (sortSelect) sortSelect.value = 'populares';

            // Aplicar filtros limpos
            applyFilters();
        };

        // =========================================================================
        // EVENT LISTENERS DOS FILTROS
        // =========================================================================

        // Pesquisa - input em tempo real com debounce
        if (searchInput) {
            let searchTimeout;
            const handleSearch = () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentFilters.search = searchInput.value.trim();
                    applyFilters();
                }, 300); // Debounce de 300ms
            };

            searchInput.addEventListener('input', handleSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    clearTimeout(searchTimeout);
                    currentFilters.search = searchInput.value.trim();
                    applyFilters();
                }
            });
        }

        // Botão de pesquisa
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (searchInput) {
                    currentFilters.search = searchInput.value.trim();
                    applyFilters();
                }
            });
        }

        // Filtro de categoria
        if (categoriaFilter) {
            categoriaFilter.addEventListener('change', () => {
                currentFilters.categoria = categoriaFilter.value;
                applyFilters();
            });
        }

        // Filtro de sazonalidade
        if (sazonalidadeFilter) {
            sazonalidadeFilter.addEventListener('change', () => {
                currentFilters.sazonalidade = sazonalidadeFilter.value;
                applyFilters();
            });
        }

        // Ordenação
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                currentFilters.sort = sortSelect.value;
                applyFilters();
            });
        }

        // =========================================================================
        // ATUALIZAR FILTROS QUANDO IDIOMA MUDA
        // =========================================================================
        document.addEventListener('languageChanged', () => {
            // Reagrupear produtos após mudança de idioma
            allProducts = Array.from(produtosContainer.querySelectorAll('.product-card'));
            applyFilters();
        });

        // =========================================================================
        // INICIALIZAÇÃO
        // =========================================================================
        
        // Aplicar filtros iniciais
        applyFilters();
        
        console.log(`Sistema de filtros iniciado com ${allProducts.length} produtos`);
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

    // =========================================================================
    // FORMULÁRIO DE CONTACTO (Se existir)
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aqui você pode adicionar lógica para enviar o formulário
            // Por exemplo, via AJAX para um endpoint do servidor
            
            alert('Mensagem enviada com sucesso! Entraremos em contacto brevemente.');
            contactForm.reset();
        });
    }

    // =========================================================================
    // FAQ ACCORDION (Se existir na página de contacto)
    // =========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Fechar outros itens
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle do item atual
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });

    // =========================================================================
    // FILTROS DO BLOG (Se existir)
    // =========================================================================
    const blogContainer = document.getElementById('blog-container');
    if (blogContainer) {
        const blogSearch = document.getElementById('blog-search');
        const categoryBtns = document.querySelectorAll('.category-btn');
        
        // Filtro de categoria do blog
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                const articles = blogContainer.querySelectorAll('.blog-card');
                
                articles.forEach(article => {
                    if (category === 'all' || article.dataset.category === category) {
                        article.style.display = 'block';
                    } else {
                        article.style.display = 'none';
                    }
                });
            });
        });
        
        // Pesquisa do blog
        if (blogSearch) {
            blogSearch.addEventListener('input', () => {
                const searchTerm = blogSearch.value.toLowerCase();
                const articles = blogContainer.querySelectorAll('.blog-card');
                
                articles.forEach(article => {
                    const title = article.querySelector('h3').textContent.toLowerCase();
                    const desc = article.querySelector('p').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                        article.style.display = 'block';
                    } else {
                        article.style.display = 'none';
                    }
                });
            });
        }
    }

});
