// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contact-form');
const counters = document.querySelectorAll('.counter');
const skillBars = document.querySelectorAll('.skill-progress');
const currentYear = document.getElementById('current-year');
const visitCounter = document.getElementById('visit-counter');

// Theme Toggle
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile Menu Toggle
function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
            
            // Scroll to the target section
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Form Validation
function validateForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    // Validate name
    if (name.value.trim() === '') {
        document.getElementById('name-error').textContent = 'Por favor ingresa tu nombre';
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        document.getElementById('email-error').textContent = 'Por favor ingresa un correo válido';
        isValid = false;
    }
    
    // Validate message
    if (message.value.trim() === '') {
        document.getElementById('message-error').textContent = 'Por favor ingresa un mensaje';
        isValid = false;
    }
    
    // If form is valid, show success message (in a real app, you would submit the form here)
    if (isValid) {
        alert('¡Mensaje enviado con éxito! (Esta es una demostración, el formulario no se ha enviado realmente)');
        contactForm.reset();
    }
}

// Animate Counter
function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const duration = 2000; // Animation duration in ms
    const increment = target / (duration / 16); // 60fps
    
    const updateCount = () => {
        count += increment;
        
        if (count < target) {
            counter.textContent = Math.ceil(count);
            requestAnimationFrame(updateCount);
        } else {
            counter.textContent = target;
        }
    };
    
    updateCount();
}

// Animate Skill Bars with 3D effects and loading animation
function animateSkillBars() {
    if (!skillBars.length) return;
    
    skillBars.forEach((bar, index) => {
        if (!bar || !bar.getAttribute) return;
        
        const width = bar.getAttribute('data-width') || '0';
        const percentElement = bar.nextElementSibling;
        
        // Skip if width is not valid
        if (!width || isNaN(parseInt(width))) {
            console.warn('Invalid width for skill bar:', width);
            return;
        }
        
        // Reset styles
        bar.style.width = '0';
        bar.style.opacity = '1';
        bar.style.transition = 'none';
        bar.style.transform = 'translateZ(0)';
        
        // Set the final color based on skill level
        let color;
        const percent = parseInt(width);
        if (percent >= 80) {
            color = '#10B981'; // Green for expert
        } else if (percent >= 50) {
            color = '#3B82F6'; // Blue for intermediate
        } else {
            color = '#F59E0B'; // Yellow for beginner
        }
        
        // Apply the color gradient
        bar.style.background = `linear-gradient(90deg, ${color}, ${adjustColor(color, 20)})`;
        
        // Add a small delay for each bar
        setTimeout(() => {
            // Animate the width
            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease';
            bar.style.width = `${width}%`;
            
            // Add a subtle bounce effect when animation completes
            setTimeout(() => {
                bar.style.transform = 'translateZ(10px) scale(1.02)';
                setTimeout(() => {
                    bar.style.transform = 'translateZ(0)';
                }, 100);
            }, 1500);
            
            // Animate the percentage counter
            if (percentElement && percentElement.classList.contains('skill-percent')) {
                let current = 0;
                const duration = 1500; // ms
                const increment = Math.ceil(percent / (duration / 16)); // 60fps
                
                const updateCounter = () => {
                    current = Math.min(current + increment, percent);
                    percentElement.textContent = `${current}%`;
                    
                    if (current < percent) {
                        requestAnimationFrame(updateCounter);
                    }
                };
                
                requestAnimationFrame(updateCounter);
            }
        }, 100 * index); // Stagger the animations
    });
}

// Helper function to adjust color brightness
function adjustColor(color, amount) {
    try {
        // Handle RGB and RGBA colors
        if (color.startsWith('rgb')) {
            const parts = color.match(/\d+/g).map(Number);
            return `rgb(${parts.map(p => Math.min(255, Math.max(0, p + amount))).join(',')})`;
        }
        
        // Handle HEX colors
        if (color.startsWith('#')) {
            const hex = color.replace(/^#/, '');
            const num = parseInt(hex, 16);
            const r = Math.min(255, Math.max(0, (num >> 16) + amount));
            const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
            const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
            return `#${(g | (b << 8) | (r << 16)).toString(16).padStart(6, '0')}`;
        }
        
        // Default return if color format is not recognized
        console.warn('Unsupported color format:', color);
        return color;
    } catch (error) {
        console.error('Error adjusting color:', error);
        return color; // Return original color on error
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Handle scroll animations with Intersection Observer for better performance
function handleScrollAnimations() {
    // Animate elements with fade-in-up class when they come into view
    const animatedElements = document.querySelectorAll('.fade-in-up:not(.animated)');
    
    animatedElements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('animated');
        }
    });
    
    // Animate counters when experience section is in view
    const experienceSection = document.getElementById('experiencia');
    if (experienceSection && isInViewport(experienceSection)) {
        counters.forEach(counter => {
            if (!counter.classList.contains('animated')) {
                counter.classList.add('animated');
                animateCounter(counter);
            }
        });
    }
    
    // Animate skill bars when skills section is in view
    const skillsSection = document.getElementById('habilidades');
    if (skillsSection && isInViewport(skillsSection)) {
        if (!skillsSection.classList.contains('animated')) {
            skillsSection.classList.add('animated');
            
            // Add a small delay to ensure the section is fully visible
            setTimeout(() => {
                // Reset any previous animations
                skillBars.forEach(bar => {
                    bar.style.width = '0';
                    bar.style.opacity = '1';
                    bar.style.transition = 'none';
                    bar.style.transform = 'translateZ(0)';
                });
                
                // Trigger the animations
                animateSkillBars();
            }, 300);
        }
    }
}

// Update visit counter
function updateVisitCounter() {
    let visits = localStorage.getItem('visits');
    
    if (visits) {
        visits = parseInt(visits) + 1;
    } else {
        visits = 1;
    }
    
    localStorage.setItem('visits', visits);
    visitCounter.setAttribute('data-target', visits);
    
    // Animate the counter if the experience section is already in view
    if (visitCounter.classList.contains('animated')) {
        animateCounter(visitCounter);
    }
}

// Initialize
function init() {
    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Set initial theme icon
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Update visit counter
    updateVisitCounter();
    
    // Add fade-in-up class to sections for scroll animations
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-up');
    });
    
    // Add fade-in-up class to project cards with staggered delay
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add fade-in-up class to skill items with staggered delay
    document.querySelectorAll('.skill-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add fade-in-up class to experience items with staggered delay
    document.querySelectorAll('.experience-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.15}s`;
    });
    
    // Add fade-in-up class to gallery items with staggered delay
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Initial check for elements in viewport
    handleScrollAnimations();
    
    // Check for elements in viewport on scroll
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMenu);
    
    // Form submission
    contactForm.addEventListener('submit', validateForm);
});