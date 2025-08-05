// Main JavaScript for AI Playground Landing Page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormValidation();
    initializeFloatingCards();
    initializeFlashMessages();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    // Handle navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(13, 17, 23, 0.98)';
        } else {
            navbar.style.backgroundColor = 'rgba(13, 17, 23, 0.95)';
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
    
    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const animateElements = document.querySelectorAll('.card, .feature-item, .about-stat, .contact-info');
    
    // Add animation class to elements
    animateElements.forEach(element => {
        element.classList.add('scroll-animate');
    });
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Form validation and enhancement
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add loading state to form submissions
        form.addEventListener('submit', function(e) {
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            
            // Re-enable button after a delay if form doesn't redirect
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }, 3000);
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('is-invalid');
    removeFieldError(field);
    
    // Validate based on field type
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
    }
    
    if (!isValid) {
        field.classList.add('is-invalid');
        showFieldError(field, errorMessage);
    }
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('is-invalid');
    removeFieldError(field);
}

function showFieldError(field, message) {
    removeFieldError(field); // Remove any existing error
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Floating card animations
function initializeFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add slight delay to each card for staggered animation
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translate(-50%, -50%) translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = '';
        });
    });
}

// Flash message handling
function initializeFlashMessages() {
    const flashMessages = document.querySelectorAll('.flash-messages .alert');
    
    // Auto-dismiss flash messages after 5 seconds
    flashMessages.forEach(message => {
        setTimeout(() => {
            if (message && message.parentNode) {
                message.style.opacity = '0';
                message.style.transform = 'translateX(100%)';
                
                setTimeout(() => {
                    message.remove();
                }, 300);
            }
        }, 5000);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimized scroll handler
const optimizedScrollHandler = debounce(updateActiveNavLink, 10);
window.addEventListener('scroll', optimizedScrollHandler);

// Loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loading');
    
    // Stagger animation of main sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Handle playground demo interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.playground-demo')) {
        // Add subtle interaction feedback
        const demo = e.target.closest('.playground-demo');
        demo.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            demo.style.transform = '';
        }, 150);
    }
});

// Add typing effect to hero terminal
function initializeTypingEffect() {
    const terminalLines = document.querySelectorAll('.terminal-content p');
    
    terminalLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            typeText(line, text, 50);
        }, index * 1000);
    });
}

function typeText(element, text, speed) {
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Initialize typing effect when hero section is in view
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initializeTypingEffect();
            heroObserver.unobserve(entry.target);
        }
    });
});

const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Add easter egg for developers
console.log(`
    ╔══════════════════════════════════════╗
    ║        AI Playground v1.0            ║
    ║     Built with ❤️  for developers     ║
    ║                                      ║
    ║  Interested in our tech stack?       ║
    ║  We're hiring! hello@aiplayground.com║
    ╚══════════════════════════════════════╝
`);
