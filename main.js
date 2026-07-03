document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // STICKY HEADER
    // ==========================================================================
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // ==========================================================================
    // MOBILE NAVIGATION & MEGA MENU
    // ==========================================================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('open')) {
                hamburger.classList.remove('open');
                navMenu.classList.remove('open');
            }
        });
    }

    // Toggle mega menu on mobile
    const dropdownItems = document.querySelectorAll('.nav-item');
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        if (link && item.querySelector('.mega-menu')) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    item.classList.toggle('open-mobile');
                }
            });
        }
    });

    // ==========================================================================
    // DARK MODE TOGGLE
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = 'light';
            if (document.body.classList.contains('dark-mode')) {
                theme = 'dark';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // ==========================================================================
    // REQUEST QUOTE MODAL
    // ==========================================================================
    const modalOverlay = document.getElementById('quote-modal');
    const openModalBtns = document.querySelectorAll('[data-open-quote]');
    const closeModalBtn = document.querySelector('.modal-close');
    const quoteForm = document.getElementById('modal-quote-form');

    const openModal = (productName = '') => {
        if (modalOverlay) {
            modalOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (productName && quoteForm) {
                const productSelect = quoteForm.querySelector('#modal-product');
                if (productSelect) {
                    productSelect.value = productName;
                }
            }
        }
    };

    const closeModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = btn.getAttribute('data-product') || '';
            openModal(product);
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Handle ESC key for modal & lightbox
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeLightbox();
        }
    });

    // Form Submissions
    const handleFormSubmit = (form, successMsg) => {
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Simple feedback toast/alert
                alert(successMsg);
                form.reset();
                closeModal();
            });
        }
    };

    handleFormSubmit(quoteForm, 'Thank you! Your quote request has been sent. Our team will contact you shortly.');
    handleFormSubmit(document.getElementById('contact-form'), 'Thank you! Your message has been sent successfully. We will get back to you soon.');
    
    // Newsletter signup
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            form.reset();
        });
    });

    // ==========================================================================
    // PRODUCTS FILTER & SEARCH (PRODUCTS PAGE)
    // ==========================================================================
    const searchInput = document.getElementById('product-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-grid-item');

    const filterProducts = () => {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeFilter = document.querySelector('.filter-btn.active');
        const category = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';

        productCards.forEach(card => {
            const cardName = card.querySelector('.product-title').textContent.toLowerCase();
            const cardDesc = card.querySelector('.product-desc').textContent.toLowerCase();
            const cardCats = card.getAttribute('data-category').split(' ');

            const matchesSearch = cardName.includes(query) || cardDesc.includes(query);
            const matchesCategory = category === 'all' || cardCats.includes(category);

            if (matchesSearch && matchesCategory) {
                if (card.style.display === 'none') {
                    card.style.display = '';
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
                    }
                }
            } else {
                if (card.style.display !== 'none') {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, { 
                            opacity: 0, 
                            scale: 0.95, 
                            duration: 0.2, 
                            ease: 'power2.in',
                            onComplete: () => {
                                card.style.display = 'none';
                            }
                        });
                    } else {
                        card.style.display = 'none';
                    }
                }
            }
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts();
        });
    });

    // ==========================================================================
    // FAQ ACCORDION (FAQ PAGE & HOME FAQ PREVIEW)
    // ==========================================================================
    const faqHeaders = document.querySelectorAll('.faq-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const faqItem = header.parentElement;
            const content = faqItem.querySelector('.faq-content');
            
            // Toggle current
            faqItem.classList.toggle('active');
            
            if (faqItem.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }

            // Close other accordions
            const siblings = Array.from(faqItem.parentElement.children).filter(child => child !== faqItem);
            siblings.forEach(sibling => {
                if (sibling.classList.contains('active')) {
                    sibling.classList.remove('active');
                    sibling.querySelector('.faq-content').style.maxHeight = '0';
                }
            });
        });
    });

    // ==========================================================================
    // LIGHTBOX GALLERY (GALLERY PAGE)
    // ==========================================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryTriggers = document.querySelectorAll('[data-lightbox]');
    
    let currentGalleryIndex = 0;
    let galleryImagesArray = [];

    // Initialize gallery arrays
    if (galleryTriggers.length > 0) {
        galleryImagesArray = Array.from(galleryTriggers).map(trigger => trigger.getAttribute('href') || trigger.getAttribute('data-image'));
        
        galleryTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                currentGalleryIndex = index;
                openLightbox(galleryImagesArray[currentGalleryIndex]);
            });
        });
    }

    const openLightbox = (src) => {
        if (lightbox && lightboxImg) {
            lightboxImg.src = src;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeLightbox = () => {
        if (lightbox) {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    const navigateLightbox = (direction) => {
        if (galleryImagesArray.length === 0) return;
        currentGalleryIndex += direction;
        
        if (currentGalleryIndex < 0) {
            currentGalleryIndex = galleryImagesArray.length - 1;
        } else if (currentGalleryIndex >= galleryImagesArray.length) {
            currentGalleryIndex = 0;
        }
        
        if (lightboxImg) {
            lightboxImg.src = galleryImagesArray[currentGalleryIndex];
        }
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox(1));
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('open')) {
            if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        }
    });

    // ==========================================================================
    // BACK TO TOP BUTTON
    // ==========================================================================
    const totopBtn = document.getElementById('back-to-top');
    if (totopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                totopBtn.classList.add('visible');
            } else {
                totopBtn.classList.remove('visible');
            }
        });

        totopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // CANVASES & HIGH PERFORMANCE PARTICLES (THROTTLED FOR MOBILE)
    // ==========================================================================
    const initHeroParticles = () => {
        const canvas = document.getElementById('hero-particles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let particles = [];
        let isMobile = window.innerWidth < 768;
        let particleCount = isMobile ? 15 : 45; // reduced particle density on mobile
        let maxDistance = 100;
        let animationFrameId;
        
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = document.body.classList.contains('dark-mode') ? 'rgba(249, 115, 22, 0.4)' : 'rgba(15, 23, 42, 0.15)';
                ctx.fill();
            }
        }
        
        const init = () => {
            particles = [];
            isMobile = window.innerWidth < 768;
            particleCount = isMobile ? 15 : 45;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        init();
        
        // Throttling mechanism: draw only at 30 FPS on mobile, 60 FPS on desktop
        let lastTime = 0;
        const fpsInterval = isMobile ? 1000 / 30 : 1000 / 60;
        
        const animate = (timestamp) => {
            animationFrameId = requestAnimationFrame(animate);
            
            const elapsed = timestamp - lastTime;
            if (elapsed < fpsInterval) return;
            lastTime = timestamp - (elapsed % fpsInterval);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            // Render network connections only on desktop to prevent mobile CPU overload
            if (!isMobile) {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < maxDistance) {
                           ctx.beginPath();
                           ctx.moveTo(particles[i].x, particles[i].y);
                           ctx.lineTo(particles[j].x, particles[j].y);
                           const alpha = (1 - dist / maxDistance) * 0.12;
                           ctx.strokeStyle = document.body.classList.contains('dark-mode') ? `rgba(249, 115, 22, ${alpha})` : `rgba(15, 23, 42, ${alpha})`;
                           ctx.lineWidth = 0.5;
                           ctx.stroke();
                        }
                    }
                }
            }
        };
        
        // Use standard timing callback
        requestAnimationFrame((timestamp) => {
            lastTime = timestamp;
            animate(timestamp);
        });
        
        // Clean up animation on dark mode theme toggles
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                cancelAnimationFrame(animationFrameId);
                setTimeout(() => {
                    requestAnimationFrame((t) => {
                        lastTime = t;
                        animate(t);
                    });
                }, 100);
            });
        }
    };
    initHeroParticles();

    // ==========================================================================
    // TESTIMONIALS SLIDER
    // ==========================================================================
    const initTestimonials = () => {
        const wrapper = document.getElementById('testimonial-wrapper');
        const dots = document.querySelectorAll('.slider-dot');
        const slides = document.querySelectorAll('.testimonial-slide');
        if (!wrapper || slides.length === 0) return;
        
        let currentIndex = 0;
        let intervalId;
        
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                dots[i].classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                    dots[i].classList.add('active');
                }
            });
            wrapper.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };
        
        const startAutoSlide = () => {
            intervalId = setInterval(() => {
                let next = currentIndex + 1;
                if (next >= slides.length) next = 0;
                showSlide(next);
            }, 6000);
        };
        
        const stopAutoSlide = () => {
            clearInterval(intervalId);
        };
        
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                stopAutoSlide();
                const index = parseInt(dot.getAttribute('data-index'));
                showSlide(index);
                startAutoSlide();
            });
        });
        
        // Drag/Swipe support for mobile devices
        let startX = 0;
        let isDragging = false;
        
        wrapper.addEventListener('touchstart', (e) => {
            stopAutoSlide();
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        wrapper.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diffX = e.changedTouches[0].clientX - startX;
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // swipe right, prev
                    let prev = currentIndex - 1;
                    if (prev < 0) prev = slides.length - 1;
                    showSlide(prev);
                } else {
                    // swipe left, next
                    let next = currentIndex + 1;
                    if (next >= slides.length) next = 0;
                    showSlide(next);
                }
            }
            startAutoSlide();
        });
        
        startAutoSlide();
    };
    initTestimonials();

    // ==========================================================================
    // GSAP SCROLL ANIMATIONS & REVEALS
    // ==========================================================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // 1. Reveal up effect on general blocks
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-left, .reveal-right, .gsap-reveal');
        revealElements.forEach(elem => {
            // Check performance setting: use simpler values for mobile
            const isMobile = window.innerWidth < 768;
            
            gsap.fromTo(elem, 
                { 
                    opacity: 0, 
                    y: elem.classList.contains('reveal-scale') ? 0 : 30,
                    scale: elem.classList.contains('reveal-scale') ? 0.95 : 1
                },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: isMobile ? 0.6 : 0.9, 
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                        // Disable heavy animations on mobile for scroll speed
                        fastScrollEnd: isMobile,
                        preventOverlaps: isMobile
                    }
                }
            );
        });

        // 2. Timeline Progress Bar Scroll Animation
        const timelineProgress = document.getElementById('timeline-progress');
        if (timelineProgress) {
            const blocks = gsap.utils.toArray('.timeline-block');
            blocks.forEach((block, index) => {
                gsap.to(block, {
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 70%',
                        end: 'bottom 70%',
                        onEnter: () => {
                            block.classList.add('active');
                            const progressHeight = ((index + 0.5) / blocks.length) * 100;
                            gsap.to(timelineProgress, { height: `${progressHeight}%`, duration: 0.3 });
                        },
                        onLeaveBack: () => {
                            block.classList.remove('active');
                            const progressHeight = (index / blocks.length) * 100;
                            gsap.to(timelineProgress, { height: `${progressHeight}%`, duration: 0.3 });
                        }
                    }
                });
            });
        }

        // 3. Stats Numbers Counter Animation
        gsap.utils.toArray('.stat-number').forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix') || '';
            
            gsap.fromTo(stat, 
                { textContent: 0 },
                { 
                    textContent: targetValue,
                    duration: window.innerWidth < 768 ? 1.5 : 2.2, // faster counters on mobile
                    ease: 'power1.out',
                    snap: { textContent: 1 },
                    scrollTrigger: {
                        trigger: stat,
                        start: 'top 92%'
                    },
                    onUpdate: function() {
                        stat.textContent = Math.floor(stat.textContent) + suffix;
                    }
                }
            );
        });
    } else {
        // Fallback static activations if GSAP CDN fails to load
        const animatedElements = document.querySelectorAll('.scroll-animate, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .gsap-reveal');
        animatedElements.forEach(element => {
            element.classList.add('animated');
            element.style.opacity = 1;
            element.style.transform = 'none';
        });
        
        // Fallback counters
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            stat.textContent = target + (stat.getAttribute('data-suffix') || '');
        });
    }

    // ==========================================================================
    // CONTACT FORM VALIDATION ANIMATIONS
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const requiredInputs = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    e.preventDefault();
                    input.classList.add('invalid');
                    isValid = false;
                    setTimeout(() => input.classList.remove('invalid'), 400);
                }
            });
            
            if (isValid) {
                // Success action already handled in handleFormSubmit
            }
        });
    }
});
