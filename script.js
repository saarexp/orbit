// ═══════════════════════════════════════════════════════════════════
// ORBIT WEBSITE - OPTIMIZED & INTERACTIVE JAVASCRIPT
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// PERFORMANCE OPTIMIZATIONS & UTILITIES
// ═══════════════════════════════════════════════════════════════════

// Optimized debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimized throttle function
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ═══════════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════════════

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;
    
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }, 2500);
}

// ═══════════════════════════════════════════════════════════════════
// ENHANCED INTERACTIVE MENU SYSTEM
// ═══════════════════════════════════════════════════════════════════

class InteractiveMenu {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.mainNav = document.getElementById('mainNav');
        this.header = document.getElementById('mainHeader');
        this.isExpanded = false;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        if (!this.menuToggle || !this.mainNav) return;
        
        // Auto-collapse menu after page load
        this.autoCollapseMenu();
        
        // Event listeners
        this.menuToggle.addEventListener('click', (e) => this.handleMenuToggle(e));
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Navigation link clicks
        this.mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }
    
    autoCollapseMenu() {
        // Initial state - menu starts expanded then animates to collapsed
        setTimeout(() => {
            if (!prefersReducedMotion) {
                this.mainNav.style.display = 'block';
                this.mainNav.classList.add('expanded');
                this.isExpanded = true;
                
                // Auto-collapse after 3 seconds
                setTimeout(() => {
                    this.closeMenu();
                }, 3000);
            }
        }, 3500); // After loading screen
    }
    
    handleMenuToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.isAnimating) return;
        
        this.isExpanded ? this.closeMenu() : this.openMenu();
    }
    
    openMenu() {
        if (this.isAnimating || this.isExpanded) return;
        
        this.isAnimating = true;
        this.isExpanded = true;
        
        // Update button state
        this.menuToggle.classList.add('active');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        
        // Show and animate menu
        this.mainNav.style.display = 'block';
        
        // Force reflow before adding expanded class
        this.mainNav.offsetHeight;
        
        requestAnimationFrame(() => {
            this.mainNav.classList.add('expanded');
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 400);
        });
    }
    
    closeMenu() {
        if (this.isAnimating || !this.isExpanded) return;
        
        this.isAnimating = true;
        this.isExpanded = false;
        
        // Update button state
        this.menuToggle.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        
        // Animate menu close
        this.mainNav.classList.remove('expanded');
        
        setTimeout(() => {
            this.mainNav.style.display = 'none';
            this.isAnimating = false;
        }, 400);
    }
    
    handleOutsideClick(e) {
        if (!this.isExpanded) return;
        
        if (!this.mainNav.contains(e.target) && 
            !this.menuToggle.contains(e.target)) {
            this.closeMenu();
        }
    }
    
    handleKeydown(e) {
        if (e.key === 'Escape' && this.isExpanded) {
            this.closeMenu();
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL PROGRESS INDICATOR
// ═══════════════════════════════════════════════════════════════════

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    const updateProgress = throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
        progressBar.style.width = scrollPercent + '%';
    }, 16);
    
    window.addEventListener('scroll', updateProgress, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════
// TYPEWRITER EFFECT FOR HERO
// ═══════════════════════════════════════════════════════════════════

function initTypewriterEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (!heroTitle || prefersReducedMotion) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.textContent = '|';
            heroTitle.appendChild(cursor);
        }
    }
    
    setTimeout(typeWriter, 3500);
}

// ═══════════════════════════════════════════════════════════════════
// OPTIMIZED COUNTER ANIMATION
// ═══════════════════════════════════════════════════════════════════

function initCounterAnimations() {
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        updateCounter();
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const inshortSection = document.querySelector('.Inshort-section');
    if (inshortSection) observer.observe(inshortSection);
}

// ═══════════════════════════════════════════════════════════════════
// ENHANCED PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════════

class OptimizedParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        
        this.options = {
            count: options.count || 15,
            size: options.size || 2,
            speed: options.speed || 0.8,
            color: options.color || '#4a9eff',
            ...options
        };
        
        if (!prefersReducedMotion) {
            this.init();
        }
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-canvas';
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        for (let i = 0; i < this.options.count; i++) {
            this.particles.push(this.createParticle());
        }
        
        this.start();
        
        // Optimized resize handler
        const resizeHandler = debounce(() => this.resize(), 250);
        window.addEventListener('resize', resizeHandler);
        
        // Intersection observer for performance
        this.setupVisibilityObserver();
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * this.options.speed,
            vy: (Math.random() - 0.5) * this.options.speed,
            size: Math.random() * this.options.size + 1,
            alpha: Math.random() * 0.6 + 0.3,
            pulse: Math.random() * Math.PI * 2
        };
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    setupVisibilityObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.start();
                } else {
                    this.stop();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(this.container);
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.pulse += 0.05;
            
            // Boundary collision
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Render particle
            const pulseFactor = Math.sin(particle.pulse) * 0.3 + 0.7;
            const currentAlpha = particle.alpha * pulseFactor;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * pulseFactor, 0, Math.PI * 2);
            this.ctx.fillStyle = this.options.color + Math.floor(currentAlpha * 255).toString(16).padStart(2, '0');
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ═══════════════════════════════════════════════════════════════════
// OPTIMIZED ROCKET ANIMATION
// ═══════════════════════════════════════════════════════════════════

function initRocketAnimation() {
    const rocketContainer = document.querySelector('.rocket-fullwidth-container');
    if (!rocketContainer) return;

    const rocketWrapper = rocketContainer.querySelector('.about-image-wrapper');
    const textEl = rocketContainer.querySelector('.about-text');
    const wordSpans = textEl.querySelectorAll('.about-word');

    let isAnimating = false;
    let particleSystem;

    // Initialize particle system
    if (!prefersReducedMotion) {
        particleSystem = new OptimizedParticleSystem(rocketContainer, {
            count: 20,
            color: '#4a9eff',
            speed: 1.2,
            size: 3
        });
    }

    // Mouse interactions
    rocketWrapper.addEventListener('mouseenter', function() {
        if (!prefersReducedMotion) {
            this.style.filter = 'drop-shadow(0 0 30px rgba(74, 158, 255, 1)) brightness(1.2)';
            this.style.transform += ' scale(1.08)';
        }
    });

    rocketWrapper.addEventListener('mouseleave', function() {
        if (!prefersReducedMotion) {
            this.style.filter = 'drop-shadow(0 0 20px rgba(74, 158, 255, 0.6)) brightness(1.1)';
            this.style.transform = this.style.transform.replace(' scale(1.08)', '');
        }
    });

    function animateRocket() {
        const rect = rocketContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const containerTop = rect.top;
        const containerHeight = rect.height;

        const triggerPoint = windowHeight * 0.7;
        const endPoint = -containerHeight * 0.3;
        
        if (containerTop <= triggerPoint && containerTop >= endPoint) {
            const progress = Math.min(Math.max((triggerPoint - containerTop) / (triggerPoint - endPoint), 0), 1);
            const easedProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const containerWidth = rocketContainer.offsetWidth;
            const rocketWidth = 80;
            const maxX = containerWidth - rocketWidth;
            const rocketX = easedProgress * maxX;

            rocketWrapper.style.transform = `translateY(-50%) translateX(${rocketX}px)`;

            if (easedProgress > 0.85) {
                textEl.style.opacity = 1;
                wordSpans.forEach((span, index) => {
                    setTimeout(() => span.classList.add('flame'), index * 150);
                });
            }
        }
    }

    const throttledAnimate = throttle(() => {
        if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(() => {
                animateRocket();
                isAnimating = false;
            });
        }
    }, 16);

    window.addEventListener('scroll', throttledAnimate, { passive: true });
    
    const resizeHandler = debounce(animateRocket, 100);
    window.addEventListener('resize', resizeHandler);
    
    animateRocket();
}

// ═══════════════════════════════════════════════════════════════════
// OPTIMIZED COMET ANIMATION
// ═══════════════════════════════════════════════════════════════════

function initCometAnimation() {
    const cometContainer = document.querySelector('.comet-fullwidth-container');
    if (!cometContainer) return;

    const cometWrapper = cometContainer.querySelector('.comet-image-wrapper');
    const textEl = cometContainer.querySelector('.comet-text');
    const wordSpans = textEl.querySelectorAll('.comet-word');

    let isAnimating = false;
    let particleSystem;

    // Initialize particle system
    if (!prefersReducedMotion) {
        particleSystem = new OptimizedParticleSystem(cometContainer, {
            count: 18,
            color: '#ff6b35',
            speed: 1.5,
            size: 2.5
        });
    }

    // Mouse interactions
    cometWrapper.addEventListener('mouseenter', function() {
        if (!prefersReducedMotion) {
            this.style.filter = 'drop-shadow(0 0 35px rgba(255, 107, 53, 1)) brightness(1.3)';
            this.style.transform += ' scale(1.08)';
        }
    });

    cometWrapper.addEventListener('mouseleave', function() {
        if (!prefersReducedMotion) {
            this.style.filter = 'drop-shadow(0 0 25px rgba(255, 107, 53, 0.8)) brightness(1.1)';
            this.style.transform = this.style.transform.replace(' scale(1.08)', '');
        }
    });

    function animateComet() {
        const rect = cometContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const containerTop = rect.top;
        const containerHeight = rect.height;

        const triggerPoint = windowHeight * 0.7;
        const endPoint = -containerHeight * 0.3;
        
        if (containerTop <= triggerPoint && containerTop >= endPoint) {
            const progress = Math.min(Math.max((triggerPoint - containerTop) / (triggerPoint - endPoint), 0), 1);
            const easedProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const containerWidth = cometContainer.offsetWidth;
            const cometWidth = 80;
            const maxX = containerWidth - cometWidth;
            const cometX = maxX - (easedProgress * maxX);

            cometWrapper.style.transform = `translateY(-50%) translateX(${cometX}px) rotate(180deg)`;

            if (easedProgress > 0.85) {
                textEl.style.opacity = 1;
                wordSpans.forEach((span, index) => {
                    setTimeout(() => span.classList.add('flame'), index * 150);
                });
            }
        }
    }

    const throttledAnimate = throttle(() => {
        if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(() => {
                animateComet();
                isAnimating = false;
            });
        }
    }, 16);

    window.addEventListener('scroll', throttledAnimate, { passive: true });
    
    const resizeHandler = debounce(animateComet, 100);
    window.addEventListener('resize', resizeHandler);
    
    animateComet();
}

// ═══════════════════════════════════════════════════════════════════
// OPTIMIZED PARALLAX SCROLLING
// ═══════════════════════════════════════════════════════════════════

function initParallaxScrolling() {
    const hero = document.querySelector('.hero');
    if (!hero || prefersReducedMotion) return;
    
    const updateParallax = throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        hero.style.transform = `translateY(${rate}px)`;
    }, 16);
    
    window.addEventListener('scroll', updateParallax, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════
// SERVICE CARDS INTERSECTION OBSERVER
// ═══════════════════════════════════════════════════════════════════

function initServiceCardsAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(40px)';
        item.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
        observer.observe(item);
    });
}

// ═══════════════════════════════════════════════════════════════════
// STICKY CTA BUTTON (MOBILE)
// ═══════════════════════════════════════════════════════════════════

function initStickyCTA() {
    if (window.innerWidth > 768) return;
    
    const stickyCTA = document.createElement('div');
    stickyCTA.className = 'sticky-cta';
    stickyCTA.innerHTML = '<a href="#contact" class="btn">Contact Opnemen</a>';
    document.body.appendChild(stickyCTA);
    
    let lastScrollY = window.scrollY;
    
    const handleStickyCTA = throttle(() => {
        const currentScrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        
        if (currentScrollY > heroHeight && currentScrollY < lastScrollY) {
            stickyCTA.style.transform = 'translateY(0)';
        } else {
            stickyCTA.style.transform = 'translateY(100px)';
        }
        
        lastScrollY = currentScrollY;
    }, 16);
    
    window.addEventListener('scroll', handleStickyCTA, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════
// SMOOTH SCROLL NAVIGATION
// ═══════════════════════════════════════════════════════════════════

function initSmoothScrollNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"], .nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════════
// DYNAMIC HEADER WITH GLASSMORPHISM
// ═══════════════════════════════════════════════════════════════════

function initDynamicHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    const updateHeader = throttle(() => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.85)';
            header.style.backdropFilter = 'blur(25px) saturate(180%)';
            header.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.backdropFilter = 'blur(15px)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
            header.style.borderBottom = 'none';
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }, 16);
    
    header.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    window.addEventListener('scroll', updateHeader, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════
// FORM VALIDATION AND ENHANCEMENT
// ═══════════════════════════════════════════════════════════════════

function initFormEnhancements() {
    const form = document.querySelector('form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });

    function validateField(e) {
        const field = e.target;
        const errorSpan = document.getElementById(field.name + '-error');
        
        if (!errorSpan) return;
        
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Dit veld is verplicht';
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Voer een geldig e-mailadres in';
            }
        }

        if (!isValid) {
            errorSpan.textContent = errorMessage;
            errorSpan.classList.add('show');
            field.style.borderColor = 'var(--accent-orange)';
        } else {
            errorSpan.classList.remove('show');
            field.style.borderColor = '';
        }
    }

    function clearError(e) {
        const field = e.target;
        const errorSpan = document.getElementById(field.name + '-error');
        
        if (errorSpan && errorSpan.classList.contains('show')) {
            errorSpan.classList.remove('show');
            field.style.borderColor = '';
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
// IMAGE LOADING OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════

function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
}

// ═══════════════════════════════════════════════════════════════════
// PERFORMANCE MONITORING
// ═══════════════════════════════════════════════════════════════════

function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`🎯 Page load: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
            
            // Core Web Vitals monitoring
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'largest-contentful-paint') {
                            console.log(`🎯 LCP: ${Math.round(entry.startTime)}ms`);
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    initLoadingScreen();
    
    // Interactive menu system
    new InteractiveMenu();
    
    // Performance optimizations
    initScrollProgress();
    initImageLoading();
    initPerformanceMonitoring();
    
    // Animations and effects
    initTypewriterEffect();
    initCounterAnimations();
    initRocketAnimation();
    initCometAnimation();
    initParallaxScrolling();
    initServiceCardsAnimation();
    
    // Navigation and UI
    initSmoothScrollNavigation();
    initDynamicHeader();
    initFormEnhancements();
    initStickyCTA();
    
    console.log('🚀 Orbit website fully initialized and optimized!');
});

// ═══════════════════════════════════════════════════════════════════
// END OF OPTIMIZED ORBIT JAVASCRIPT
// ═══════════════════════════════════════════════════════════════════