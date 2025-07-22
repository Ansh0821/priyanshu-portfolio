// Personal Landing Page JavaScript - Fixed Version
// Author: Priyanshu Kumar

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScrolling();
    initTypingEffect();
    initScrollToTop();
    
    console.log('All functionality initialized successfully!');
});

// Global scroll to section function (used by CTA buttons)
window.scrollToSection = function(targetId) {
    console.log('Scrolling to section:', targetId);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        const navbarHeight = document.getElementById('navbar').offsetHeight || 80;
        const targetPosition = targetSection.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        console.error('Target section not found:', targetId);
    }
};

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100; // Offset for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Add scroll effect to navbar
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
    
    // Event listeners
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        handleNavbarScroll();
        throttle(handleScrollAnimations, 16)(); // ~60fps
    });
    
    // Initial call
    updateActiveNavLink();
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    console.log('Initializing smooth scrolling...');
    
    // Handle navigation link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            console.log('Nav link clicked:', href);
            
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
        });
    });
    
    // Handle CTA button clicks (backup in case onclick doesn't work)
    document.querySelectorAll('[data-scroll-target]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-scroll-target');
            scrollToSection(targetId);
        });
    });
    
    console.log('Smooth scrolling initialized');
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            
            // Toggle menu visibility
            if (isMenuOpen) {
                navLinks.style.display = 'flex';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'rgba(255, 255, 255, 0.98)';
                navLinks.style.flexDirection = 'column';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                navLinks.style.borderRadius = '0 0 0.5rem 0.5rem';
                navLinks.style.zIndex = '1000';
                
                // Animate hamburger to X
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                navLinks.style.display = 'none';
                
                // Reset hamburger
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                    isMenuOpen = false;
                    
                    // Reset hamburger
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.style.display = 'flex';
                navLinks.style.position = 'static';
                navLinks.style.flexDirection = 'row';
                navLinks.style.background = 'none';
                navLinks.style.padding = '0';
                navLinks.style.boxShadow = 'none';
                isMenuOpen = false;
                
                // Reset hamburger
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            } else if (!isMenuOpen) {
                navLinks.style.display = 'none';
            }
        });
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for specific elements
                if (entry.target.classList.contains('timeline-item')) {
                    animateTimelineItem(entry.target);
                }
                if (entry.target.classList.contains('stat')) {
                    animateCounter(entry.target);
                }
                if (entry.target.classList.contains('skill-tag')) {
                    animateSkillTag(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(`
        .about-content,
        .timeline-item,
        .skill-category,
        .project-card,
        .achievement-card,
        .contact-method,
        .stat
    `);
    
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function handleScrollAnimations() {
    // This function is called on scroll for performance-critical animations
    const scrollY = window.scrollY;
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero-section');
    if (hero) {
        const heroBackground = hero.querySelector('.hero-background');
        if (heroBackground && scrollY < hero.offsetHeight) {
            heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    }
}

// Timeline item animation
function animateTimelineItem(item) {
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
    
    // Animate timeline dot
    const dot = item.querySelector('.timeline-dot');
    if (dot) {
        setTimeout(() => {
            dot.style.transform = 'scale(1.2)';
            setTimeout(() => {
                dot.style.transform = 'scale(1)';
            }, 200);
        }, 300);
    }
}

// Counter animation for stats
function animateCounter(statElement) {
    statElement.style.opacity = '1';
    statElement.style.transform = 'translateY(0)';
    
    const numberElement = statElement.querySelector('.stat-number');
    if (numberElement) {
        const finalNumber = numberElement.textContent;
        const isDecimal = finalNumber.includes('.');
        const hasPlus = finalNumber.includes('+');
        
        let numericValue = parseFloat(finalNumber.replace(/[^\d.]/g, ''));
        let currentValue = 0;
        const increment = numericValue / 60; // Animate over ~1 second at 60fps
        
        const animateNumber = () => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
            }
            
            let displayValue = isDecimal ? currentValue.toFixed(2) : Math.floor(currentValue).toString();
            if (hasPlus && currentValue >= numericValue) {
                displayValue += '+';
            }
            
            numberElement.textContent = displayValue;
            
            if (currentValue < numericValue) {
                requestAnimationFrame(animateNumber);
            }
        };
        
        // Start animation after a short delay
        setTimeout(animateNumber, 200);
    }
}

// Skill tag animation
function animateSkillTag(tag) {
    const delay = Math.random() * 200; // Random delay for staggered effect
    setTimeout(() => {
        tag.style.opacity = '1';
        tag.style.transform = 'scale(1)';
    }, delay);
}

// Typing effect for hero section
function initTypingEffect() {
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        const text = heroDescription.textContent;
        heroDescription.textContent = '';
        heroDescription.style.opacity = '1';
        
        let index = 0;
        const typeWriter = () => {
            if (index < text.length) {
                heroDescription.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 30);
            }
        };
        
        // Start typing effect after hero loads
        setTimeout(typeWriter, 1500);
    }
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    // Style the button
    Object.assign(scrollToTopBtn.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
        color: 'white',
        fontSize: '1.2rem',
        cursor: 'pointer',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.3s ease',
        zIndex: '1000',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
    });
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(20px)';
        }
    });
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effects
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'scale(1.1) translateY(0)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'scale(1) translateY(0)';
    });
}

// Utility function for throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .skill-tag {
        opacity: 0;
        transform: scale(0.8);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .scroll-to-top:hover {
        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4) !important;
    }
    
    /* Ensure CTA buttons are visible and properly styled */
    .hero-buttons {
        display: flex !important;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 2rem;
    }
    
    .hero-buttons .btn {
        display: inline-flex !important;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
        border-radius: 0.5rem;
        border: none;
    }
    
    @media (max-width: 768px) {
        .scroll-to-top {
            bottom: 1rem !important;
            right: 1rem !important;
            width: 45px !important;
            height: 45px !important;
            font-size: 1rem !important;
        }
        
        .hero-buttons {
            flex-direction: column;
            align-items: center;
        }
        
        .hero-buttons .btn {
            width: 200px;
            justify-content: center;
        }
    }
    
    /* Focus styles for accessibility */
    [data-focus-visible] {
        outline: 2px solid #2563eb !important;
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);

// Handle form submissions (if any forms are added later)
document.addEventListener('submit', function(e) {
    // Prevent default form submission for demo purposes
    if (e.target.tagName === 'FORM') {
        e.preventDefault();
        console.log('Form submission handled by JavaScript');
    }
});

// Add loading animation
window.addEventListener('load', function() {
    // Remove any loading screens
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
    
    // Initialize entrance animations
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px)';
        hero.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Ensure CTA buttons are visible
    const ctaButtons = document.querySelector('.hero-buttons');
    if (ctaButtons) {
        ctaButtons.style.display = 'flex';
        console.log('CTA buttons should now be visible');
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // Handle Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (navLinks && window.getComputedStyle(navLinks).position === 'absolute') {
            navLinks.style.display = 'none';
            
            // Reset hamburger
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
});

// Add focus management for accessibility
document.addEventListener('focusin', function(e) {
    // Add focus ring for keyboard navigation
    if (e.target.matches('button, a, input, textarea, select')) {
        e.target.setAttribute('data-focus-visible', '');
    }
});

document.addEventListener('focusout', function(e) {
    e.target.removeAttribute('data-focus-visible');
});

// Handle mouse interactions to remove focus-visible
document.addEventListener('mousedown', function(e) {
    if (e.target.matches('button, a, input, textarea, select')) {
        e.target.removeAttribute('data-focus-visible');
    }
});

// Debug function to check if elements exist
function debugElements() {
    const elements = [
        'navbar',
        'hero',
        'about', 
        'experience',
        'skills',
        'projects',
        'achievements',
        'contact'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`Element ${id}:`, element ? 'Found' : 'Missing');
    });
    
    const ctaButtons = document.querySelector('.hero-buttons');
    console.log('CTA buttons container:', ctaButtons ? 'Found' : 'Missing');
    
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Navigation links found:', navLinks.length);
}

// Run debug on load
window.addEventListener('load', debugElements);

console.log('Personal Landing Page JavaScript initialized successfully!');