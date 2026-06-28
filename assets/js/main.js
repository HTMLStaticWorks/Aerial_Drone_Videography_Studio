
// Navbar Scroll Effect
const navbar = document.getElementById('mainNavbar');
if (navbar) {
    // Add background if page is not index (has content at top)
    if (!document.querySelector('.hero-section')) {
        navbar.classList.add('navbar-scrolled');
    } else {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
}

// Navigation Close Functionality
function initNavigationClose() {
    const navbarCollapse = document.getElementById('navbarNav');
    if (!navbarCollapse) return;

    // Function to close navigation
    function closeNavigation() {
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    }

    // Close button (X) click handler
    const closeBtn = document.getElementById('navCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeNavigation);
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
        const navbar = document.getElementById('mainNavbar');
        const navbarToggler = document.querySelector('.navbar-toggler');
        
        // Check if click is outside navbar and navigation is open
        if (navbarCollapse.classList.contains('show') && 
            !navbar.contains(e.target) && 
            !navbarToggler?.contains(e.target)) {
            closeNavigation();
        }
    });

    // Close on window resize (when screen size increases)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close navigation if window width is greater than lg breakpoint (992px)
            if (window.innerWidth >= 992 && navbarCollapse.classList.contains('show')) {
                closeNavigation();
            }
        }, 100);
    });

    // Close navigation when clicking on nav links (mobile) - but NOT dropdown toggles
    const navLinks = navbarCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only close if it's an actual navigation link (has href) and not just a toggle
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                // Small delay to allow navigation to happen first
                setTimeout(() => {
                    if (window.innerWidth < 992) {
                        closeNavigation();
                    }
                }, 100);
            }
        });
    });
}

// Initialize navigation close functionality
document.addEventListener('DOMContentLoaded', () => {
    initNavigationClose();
});

// Active Link Highlighter (Bulletproof)
const currentUrl = window.location.href.split('#')[0].split('?')[0]; // Remove hash and query
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    // Check if the absolute URL of the link matches the current window URL
    if (link.href === currentUrl || (currentUrl.endsWith('/') && link.href.endsWith('index.html'))) {
        link.classList.add('active');
    }
});

// Contact Form Handler with Validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const formAlert = document.getElementById('formAlert');

    // Add Bootstrap validation styles on input
    const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
            } else {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        const honeypot = document.getElementById('honeypot').value;

        // Honeypot spam check
        if (honeypot) {
            showAlert('An error occurred. Please try again.', 'danger');
            return;
        }

        // Validate all fields
        let isValid = true;
        formInputs.forEach(input => {
            if (input.value.trim() === '') {
                input.classList.add('is-invalid');
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        });

        if (!isValid) {
            showAlert('Please fill in all required fields correctly.', 'danger');
            return;
        }

        // Get submit button and update state
        const btn = contactForm.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const originalText = btnText.textContent;

        btn.disabled = true;
        btnText.textContent = 'Sending...';

        try {
            // Save to database
            const success = await saveContactForm({
                name,
                email,
                subject,
                message,
                timestamp: new Date()
            });

            if (success) {
                showAlert('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                contactForm.reset();
                formInputs.forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
                btnText.textContent = originalText;
                btn.disabled = false;
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showAlert('Sorry, there was an error sending your message. Please try again or contact us directly.', 'danger');
            btnText.textContent = originalText;
            btn.disabled = false;
        }
    });

    // Helper function to show alerts
    function showAlert(message, type) {
        formAlert.className = `alert alert-${type} mb-4`;
        formAlert.textContent = message;
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formAlert.classList.add('d-none');
            }, 5000);
        }
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
// Drone-Themed Animations Script (OPTIMIZED)
// Author: SkyLens Development Team

// ============================================
// SCROLL ANIMATIONS (FASTER)
// ============================================

// Intersection Observer for Scroll Animations - Immediate trigger
const observerOptions = {
    threshold: 0.05, // Trigger earlier (was 0.1)
    rootMargin: '0px 0px -20px 0px' // Reduced margin for faster trigger
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements - No stagger delay
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to service cards
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Add fade-in to other sections
    const sections = document.querySelectorAll('.row.g-4, .text-center.mb-5');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
});

// ============================================
// STATS COUNTER ANIMATION (FASTER)
// ============================================

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target') || element.textContent.replace(/[^0-9]/g, ''));
    const duration = 1000; // Reduced from 2000ms to 1000ms
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
            const originalText = element.getAttribute('data-original');
            if (originalText) {
                const suffix = originalText.replace(/[0-9,]/g, '');
                element.textContent = target.toLocaleString() + suffix;
            }
        }
    };

    updateCounter();
}

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.display-6, .h1, .h2, .h3, .h4');
    statNumbers.forEach(stat => {
        if (/\d/.test(stat.textContent)) {
            stat.setAttribute('data-original', stat.textContent);
            stat.setAttribute('data-target', stat.textContent.replace(/[^0-9]/g, ''));
            stat.classList.add('stat-number');
            statsObserver.observe(stat);
        }
    });
});

// ============================================
// ENHANCED HOVER EFFECTS
// ============================================

// Add propeller spin to icons on card hover
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.icon-box i, .icon-box');
            if (icon) {
                icon.style.animation = 'propellerSpin 0.5s ease-in-out'; // Faster
            }
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.icon-box i, .icon-box');
            if (icon) {
                icon.style.animation = '';
            }
        });
    });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Handle anchor links from footer to services page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'services.html' && window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                target.style.animation = 'highlight 1s ease-out'; // Faster highlight
            }
        }, 100);
    }
});

// Highlight animation for anchored sections
const style = document.createElement('style');
style.textContent = `
    @keyframes highlight {
        0%, 100% { background-color: transparent; }
        50% { background-color: rgba(56, 189, 248, 0.1); }
    }
`;
document.head.appendChild(style);

// ============================================
// PAGE TRANSITION EFFECT (DISABLED FOR SPEED)
// ============================================
// Removed fade-out transition for instant navigation

// ============================================
// FLYING SYMBOLS ANIMATION - 5 DRONE PATTERN
// ============================================

const flyingSymbols = ['✈', '🚁', '🛸'];

function createFlyingSymbol(emoji, direction, topPosition, duration = 10) {
    const symbol = document.createElement('div');
    symbol.className = 'flying-symbol';

    // Set emoji
    symbol.textContent = emoji;

    // Set vertical position
    symbol.style.top = `${topPosition}%`;

    // Set direction and animation - use helicopter-specific classes for 🚁
    const isHelicopter = emoji === '🚁';
    if (isHelicopter) {
        symbol.classList.add(`heli-${direction}`);
    } else {
        symbol.classList.add(`fly-${direction}`);
    }

    symbol.style.animationDuration = `${duration}s`;

    // Add to page
    document.body.appendChild(symbol);

    // Remove after animation completes
    setTimeout(() => {
        symbol.remove();
    }, duration * 1000);
}

// Create the 5-drone pattern
function launchDronePattern() {
    // IMMEDIATE LAUNCH (Time 0s)
    // Left #1: ✈ at 15% height
    createFlyingSymbol('✈', 'left-to-right', 15, 10);

    // Right #1: 🚁 at 30% height
    createFlyingSymbol('🚁', 'right-to-left', 30, 10);

    // Right #2: 🛸 at 60% height
    createFlyingSymbol('🛸', 'right-to-left', 60, 10);

    // === DIAGONAL CORNER DRONE (1 from top-right only) ===

    // Top-Right to Bottom-Left: ✈
    createFlyingSymbol('✈', 'diagonal-tr-bl', 0, 12);

    // Bottom-Left to Top-Right: 🛸
    createFlyingSymbol('🛸', 'diagonal-bl-tr', 0, 12);

    // Bottom-Right to Top-Left: 🚁
    createFlyingSymbol('🚁', 'diagonal-br-tl', 0, 12);

    // DELAYED LAUNCH (Time 3s)
    setTimeout(() => {
        // Left #2: 🛸 at 45% height
        createFlyingSymbol('🛸', 'left-to-right', 45, 10);

        // Right #3: ✈ at 75% height
        createFlyingSymbol('✈', 'right-to-left', 75, 10);
    }, 3000);
}

// Start the animation pattern
function startFlyingSymbols() {
    // Launch first pattern immediately
    launchDronePattern();

    // Repeat pattern every 15 seconds (10s flight + 5s gap)
    setInterval(() => {
        launchDronePattern();
    }, 15000);
}

// Start the animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    // startFlyingSymbols();
});

console.log('🚁 SkyLens animations loaded! (Optimized)');




/*==================================
      BACK TO TOP BUTTON
===================================*/

const initBackToTop = () => {
    const backToTop = document.getElementById("backToTop");
    if (!backToTop) return;
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBackToTop);
} else {
    initBackToTop();
}

/*==================================
      EQUALIZE CARD HEIGHTS
===================================*/

const equalizeCardHeights = () => {
    const rows = document.querySelectorAll('.row');
    rows.forEach(row => {
        const cards = row.querySelectorAll('.service-card');
        if (cards.length > 1) {
            // Reset min-height first to get natural height
            cards.forEach(card => card.style.minHeight = '0px');
            
            if (window.innerWidth >= 768) {
                let maxHeight = 0;
                cards.forEach(card => {
                    const h = card.offsetHeight;
                    if (h > maxHeight) maxHeight = h;
                });
                cards.forEach(card => card.style.minHeight = maxHeight + 'px');
            } else {
                cards.forEach(card => card.style.minHeight = 'auto');
            }
        }
    });
};

if (document.readyState === "complete") {
    equalizeCardHeights();
} else {
    window.addEventListener('load', equalizeCardHeights);
}
window.addEventListener('resize', equalizeCardHeights);
