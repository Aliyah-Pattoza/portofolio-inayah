// Global variables
let typed = null;
let scrollTimeout = null;

/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeTypedAnimation();
    initializeSmoothScrolling();
    initializeActiveNavigation();
    initializeContactForm();
    initializeScrollAnimations();
    initializeLoadingAnimations();
    initializeMobileMenu();
    initializeThemeSwitcher();
    initializeLazyLoading();
    initializeProjectDetails();
    initializeProjectDocsGalleries();
    initializeScrollProgress();
    initializeRevealOnScroll();
    initializeProjectFilters();
    initializeCardTilt();
    initializeCustomCursor();
    initializeNavbarScrollState();
    initializeFooterYear();
});

/**
 * Initialize Typed.js animation for hero section
 */
function initializeTypedAnimation() {
    // Check if Typed is loaded and element exists
    const typedElement = document.querySelector('.text') || document.querySelector('.text-typing');
    
    if (typeof Typed !== 'undefined' && typedElement) {
        typed = new Typed(typedElement, {
            strings: [
                "Full-Stack Developer",
                "Machine Learning Engineer",
                "ITS Graduate",
                "Problem Solver",
                "Accessible Tech Enthusiast"
            ],
            typeSpeed: 100,
            backSpeed: 100,
            backDelay: 1000,
            loop: true
        });
    }
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            const navCollapse = document.querySelector('.navbar-collapse');
            if (navCollapse && navCollapse.classList.contains('show') && window.bootstrap) {
                const collapse = bootstrap.Collapse.getInstance(navCollapse);
                if (collapse) collapse.hide();
            }
        });
    });
}

/**
 * Initialize active navigation highlighting
 */
function initializeActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a, .navbar-nav .nav-link');
    
    // Function to update active navigation
    function updateActiveNavigation() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.pageYOffset || window.scrollY;
            
            if (scrollPosition >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active class on navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (linkHref === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Add scroll event listener with throttling
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(updateActiveNavigation, 10);
    });
    
    // Initialize on page load
    updateActiveNavigation();
}

/**
 * Initialize contact form functionality
 */
function initializeContactForm() {
    const contactForm = document.querySelector('form') || document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const nameInput = this.querySelector('input[type="text"]') || this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[type="email"]') || this.querySelector('input[name="email"]');
            const messageInput = this.querySelector('textarea') || this.querySelector('textarea[name="message"]');
            
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! I will get back to you soon.', 'success');
            this.reset();
        });
    }
}

/**
 * Initialize scroll animations using Intersection Observer
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll(
        '.project-card, .experience-item, .about-img, .about-text, .card, .skill-item'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initializeScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    const update = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = height > 0 ? (scrollTop / height) * 100 : 0;
        bar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
}

function initializeRevealOnScroll() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        items.forEach((el) => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach((el) => observer.observe(el));
}

function initializeProjectFilters() {
    const buttons = document.querySelectorAll('.project-filter');
    const columns = document.querySelectorAll('.project-col');
    if (!buttons.length || !columns.length) return;

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter || 'all';
            buttons.forEach((b) => b.classList.toggle('active', b === btn));

            columns.forEach((col) => {
                const match = filter === 'all' || col.dataset.category === filter;
                col.classList.toggle('is-hidden', !match);
            });
        });
    });
}

function initializeCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -8;
            const rotateY = ((x / rect.width) - 0.5) * 8;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('pointerleave', () => {
            card.style.transform = '';
        });
    });
}

function initializeCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 768px)').matches) return;

    document.body.classList.add('has-custom-cursor');
    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId = null;

    const animate = () => {
        ringX += (targetX - ringX) * 0.18;
        ringY += (targetY - ringY) * 0.18;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        dot.style.left = `${event.clientX}px`;
        dot.style.top = `${event.clientY}px`;
    });

    document.querySelectorAll('a, button, .project-card, .skill-item').forEach((el) => {
        el.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover'));
    });

    rafId = requestAnimationFrame(animate);
    window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
}

function initializeNavbarScrollState() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    const update = () => {
        nav.classList.toggle('scrolled', window.scrollY > 24);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
}

function initializeFooterYear() {
    const yearEl = document.getElementById('yearNow');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

/**
 * Initialize project detail functionality
 */
function initializeProjectDetails() {
    // Add event listeners for project detail buttons
    const projectDetailButtons = document.querySelectorAll('[onclick*="showProjectDetail"]');
    
    projectDetailButtons.forEach(button => {
        // Remove inline onclick and add event listener
        const onclickValue = button.getAttribute('onclick');
        if (onclickValue) {
            const projectId = onclickValue.match(/showProjectDetail\('([^']+)'\)/);
            if (projectId) {
                button.removeAttribute('onclick');
                button.addEventListener('click', () => showProjectDetail(projectId[1]));
            }
        }
    });
}

/**
 * Show project detail page
 * @param {string} projectId - ID of the project to show
 */
function showProjectDetail(projectId) {
    const mainContent = document.querySelector('.main-content');
    const projectDetail = document.getElementById(projectId);
    
    if (mainContent && projectDetail) {
        mainContent.classList.add('hidden');
        projectDetail.classList.add('active');
        window.scrollTo(0, 0);
    }
}

/**
 * Hide project detail page and return to main content
 */
function hideProjectDetail() {
    const mainContent = document.querySelector('.main-content');
    const projectDetails = document.querySelectorAll('.project-detail');
    
    if (mainContent) {
        mainContent.classList.remove('hidden');
    }
    
    projectDetails.forEach(detail => {
        detail.classList.remove('active');
    });
    
    window.scrollTo(0, 0);
}

/**
 * Initialize loading animations
 */
function initializeLoadingAnimations() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading class after page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 500);
    });
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (mobileMenuToggle && navbar) {
        mobileMenuToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navbar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbar.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

/**
 * Initialize theme switcher (dark/light mode toggle)
 */
function initializeThemeSwitcher() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        // Get saved theme from localStorage or default to 'dark'
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

/**
 * Performance optimization: Lazy load images
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

/**
 * Utility function to validate email
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show notification to user
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    // Set colors based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #00d4ff, #0084ff)';
            notification.style.color = '#ffffff';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';
            notification.style.color = '#ffffff';
            break;
        default:
            notification.style.background = 'rgba(26, 26, 46, 0.95)';
            notification.style.color = '#ffffff';
            notification.style.border = '1px solid rgba(0, 212, 255, 0.3)';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Project website documentation galleries + shared lightbox
 */
function initializeProjectDocsGalleries() {
    const galleries = Array.from(document.querySelectorAll('.project-docs'));
    const lightbox = document.getElementById('docsLightbox');
    if (!galleries.length || !lightbox) return;

    const imageEl = document.getElementById('docsLightboxImage');
    const captionEl = document.getElementById('docsLightboxCaption');
    const counterEl = document.getElementById('docsLightboxCounter');
    const prevBtn = document.getElementById('docsLightboxPrev');
    const nextBtn = document.getElementById('docsLightboxNext');
    const closeTargets = lightbox.querySelectorAll('[data-lightbox-close]');

    let activeGallery = null;

    function closeLightbox() {
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        activeGallery = null;
    }

    function updateLightbox() {
        if (!activeGallery) return;
        const { slides, currentIndex, getVisibleIndexes } = activeGallery;
        const slide = slides[currentIndex];
        if (!slide) return;

        imageEl.src = slide.src;
        imageEl.alt = slide.alt;
        captionEl.textContent = slide.caption;

        const visible = getVisibleIndexes();
        const position = visible.indexOf(currentIndex);
        counterEl.textContent = visible.length
            ? `${position + 1} / ${visible.length}`
            : '';
    }

    function openLightbox(galleryState, index) {
        activeGallery = galleryState;
        activeGallery.currentIndex = index;
        updateLightbox();
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        lightbox.querySelector('.docs-lightbox-close')?.focus();
    }

    function stepLightbox(direction) {
        if (!activeGallery) return;
        const visible = activeGallery.getVisibleIndexes();
        if (!visible.length) return;

        let position = visible.indexOf(activeGallery.currentIndex);
        if (position === -1) position = 0;
        position = (position + direction + visible.length) % visible.length;
        activeGallery.currentIndex = visible[position];
        updateLightbox();
    }

    galleries.forEach((gallery) => {
        const filterButtons = gallery.querySelectorAll('.docs-filter');
        const cards = Array.from(gallery.querySelectorAll('.docs-card'));
        const openButtons = gallery.querySelectorAll('[data-lightbox-index]');

        const slides = cards.map((card) => {
            const img = card.querySelector('img');
            const title = card.querySelector('h4')?.textContent?.trim() || '';
            const desc = card.querySelector('p')?.textContent?.trim() || '';
            return {
                src: img?.getAttribute('src') || '',
                alt: img?.getAttribute('alt') || title,
                caption: desc ? `${title} — ${desc}` : title,
                category: card.dataset.category || 'all',
                card
            };
        });

        const galleryState = {
            slides,
            currentIndex: 0,
            activeFilter: 'all',
            getVisibleIndexes() {
                return slides
                    .map((slide, index) => ({ slide, index }))
                    .filter(({ slide }) => galleryState.activeFilter === 'all' || slide.category === galleryState.activeFilter)
                    .map(({ index }) => index);
            }
        };

        function applyFilter(filter) {
            galleryState.activeFilter = filter;
            filterButtons.forEach((btn) => {
                const isActive = btn.dataset.filter === filter;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', String(isActive));
            });

            cards.forEach((card) => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('is-hidden', !match);
            });
        }

        filterButtons.forEach((btn) => {
            btn.addEventListener('click', () => applyFilter(btn.dataset.filter || 'all'));
        });

        openButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const index = Number(btn.dataset.lightboxIndex);
                if (!Number.isNaN(index)) openLightbox(galleryState, index);
            });
        });
    });

    prevBtn?.addEventListener('click', () => stepLightbox(-1));
    nextBtn?.addEventListener('click', () => stepLightbox(1));
    closeTargets.forEach((el) => el.addEventListener('click', closeLightbox));

    document.addEventListener('keydown', (event) => {
        if (lightbox.hidden) return;

        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') stepLightbox(-1);
        if (event.key === 'ArrowRight') stepLightbox(1);
    });
}

/**
 * Cleanup function to destroy typed instance
 */
function cleanup() {
    if (typed) {
        typed.destroy();
        typed = null;
    }
}

// Export functions for external use (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTypedAnimation,
        initializeSmoothScrolling,
        initializeActiveNavigation,
        initializeContactForm,
        showProjectDetail,
        hideProjectDetail,
        showNotification,
        isValidEmail,
        cleanup
    };
}

// Make functions available globally for inline event handlers
window.showProjectDetail = showProjectDetail;
window.hideProjectDetail = hideProjectDetail;
window.showNotification = showNotification;