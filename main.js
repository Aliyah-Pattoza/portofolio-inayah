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
                "Informatics Student", 
                "Future Developer", 
                "Tech Enthusiast", 
                "Problem Solver",
                "Student",
                "Developer",
                "Programmer"
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
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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
    
    // Observe project cards and experience items
    const animatedElements = document.querySelectorAll(
        '.project-card, .experience-item, .about-img, .about-text, .card, .skill-item'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
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