// Enhanced navigation and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    console.log('Found navigation links:', navLinks.length);
    navLinks.forEach((link, index) => {
        console.log(`Nav link ${index}:`, link.textContent, 'href:', link.getAttribute('href'));
    });

    // Initialize navigation - set Home as active by default
    function initializeNavigation() {
        navLinks.forEach(link => link.classList.remove('active'));
        const homeLink = document.querySelector('a[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
            console.log('Initialized Home as active');
        }
    }

    // Call initialization
    initializeNavigation();

    // Simple navigation handler - override any existing handlers
    function setActiveNavigation(targetHref) {
        console.log('Setting active navigation for:', targetHref);

        // Remove active from all navigation links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            // Clear inline styles
            link.style.background = '';
            link.style.color = '';
            link.style.fontWeight = '';
            console.log('Removed active from:', link.textContent, 'Classes now:', link.className);
        });

        // Add active to target link
        const targetLink = document.querySelector(`.nav-menu a[href="${targetHref}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
            // Force the styling with inline styles as backup
            targetLink.style.background = 'rgba(139, 69, 19, 0.8)';
            targetLink.style.color = '#D4A574';
            targetLink.style.fontWeight = '600';
            console.log('Added active to:', targetLink.textContent, 'Classes now:', targetLink.className);
        } else {
            console.log('Target link not found:', targetHref);
        }
    }

    // Test the function
    setTimeout(() => {
        console.log('Testing navigation function...');
        setActiveNavigation('#about-full');
    }, 2000);
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Smooth scrolling for navigation links with active highlighting
    const allSections = document.querySelectorAll('section');

    // New simplified click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            console.log('Navigation clicked:', this.textContent, 'Target:', targetId);

            // Use our new function to set active state
            setActiveNavigation(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.log('Target section not found:', targetId);
            }
        });
    });

    // Navbar background change, active section highlighting, and breadcrumbs on scroll
    const navbar = document.querySelector('.navbar');
    const breadcrumbs = document.getElementById('breadcrumbs');
    const currentSection = document.getElementById('current-section');

    function scrollHandler() {
        // Navbar background change
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show/hide breadcrumbs
        if (window.scrollY > 200) {
            breadcrumbs.style.display = 'block';
        } else {
            breadcrumbs.style.display = 'none';
        }

        // Active section highlighting and breadcrumb update
        let current = '';
        let maxVisibleArea = 0;

        // Find the section with the most visible area
        allSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;
            const viewportTop = window.scrollY;
            const viewportBottom = viewportTop + window.innerHeight;

            // Calculate visible area of this section
            const visibleTop = Math.max(sectionTop, viewportTop);
            const visibleBottom = Math.min(sectionBottom, viewportBottom);
            const visibleArea = Math.max(0, visibleBottom - visibleTop);

            // If this section has more visible area, make it current
            if (visibleArea > maxVisibleArea && section.getAttribute('id')) {
                maxVisibleArea = visibleArea;
                current = section.getAttribute('id');
            }
        });

        // Update navigation active states
        if (current) {
            navLinks.forEach(link => {
                const wasActive = link.classList.contains('active');
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                    if (!wasActive) {
                        console.log('Scroll: Active section changed to:', current, 'Link:', link.textContent);
                    }
                }
            });
        }

        // Update breadcrumb
        if (current && currentSection) {
            const sectionNames = {
                'home': 'Home',
                'about': 'About',
                'about-full': 'About',
                'menu': 'Bestsellers',
                'menu-full': 'Menu',
                'contact-full': 'Contact',
                'contact': 'Contact'
            };
            currentSection.textContent = sectionNames[current] || 'Home';
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', scrollHandler);

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('.coffee-heaven, .jeans-coffee, .best-selling, .reviews, .newsletter');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button click animations
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Floating coffee beans animation enhancement
    const beans = document.querySelectorAll('.bean');
    
    beans.forEach((bean, index) => {
        bean.addEventListener('mouseenter', function() {
            this.style.animationDuration = '1s';
            this.style.transform = 'scale(1.2) rotate(360deg)';
        });
        
        bean.addEventListener('mouseleave', function() {
            this.style.animationDuration = '3s';
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Enhanced Newsletter subscription functionality
    const subscribeBtn = document.querySelector('.btn-subscribe');
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = newsletterForm ? newsletterForm.querySelector('input[type="email"]') : null;
    const newsletterSuccess = document.getElementById('newsletter-success');

    if (subscribeBtn && newsletterForm && newsletterInput) {
        // Handle form submission
        const handleSubscription = (e) => {
            e.preventDefault();

            const email = newsletterInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Reset previous states
            newsletterForm.classList.remove('error', 'success');
            if (newsletterSuccess) {
                newsletterSuccess.classList.remove('show');
            }

            // Validate email
            if (!email) {
                newsletterForm.classList.add('error');
                showNotification('Please enter your email address', 'error');
                return;
            }

            if (!emailRegex.test(email)) {
                newsletterForm.classList.add('error');
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            subscribeBtn.classList.add('loading');
            subscribeBtn.textContent = 'Subscribing...';
            subscribeBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Success state
                newsletterForm.classList.add('success');
                subscribeBtn.classList.remove('loading');
                subscribeBtn.textContent = 'Subscribed!';
                subscribeBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

                // Show success message
                if (newsletterSuccess) {
                    newsletterSuccess.classList.add('show');
                }

                // Clear input
                newsletterInput.value = '';

                // Reset button after delay
                setTimeout(() => {
                    subscribeBtn.textContent = 'Subscribe';
                    subscribeBtn.style.background = '';
                    subscribeBtn.disabled = false;
                    newsletterForm.classList.remove('success');

                    if (newsletterSuccess) {
                        newsletterSuccess.classList.remove('show');
                    }
                }, 3000);

                showNotification('Successfully subscribed to our newsletter!', 'success');
            }, 1500);
        };

        // Add event listeners
        subscribeBtn.addEventListener('click', handleSubscription);

        // Handle Enter key in input
        newsletterInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSubscription(e);
            }
        });

        // Clear error state on input
        newsletterInput.addEventListener('input', () => {
            newsletterForm.classList.remove('error');
        });
    }

    // Order button functionality (mock)
    const orderButtons = document.querySelectorAll('.btn-order');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.parentElement.querySelector('h3').textContent;
            
            // Simple feedback animation
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.background = '#28a745';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '#D4A574';
            }, 1500);
            
            console.log(`${productName} added to cart`);
        });
    });

    // Pagination functionality
    const pageButtons = document.querySelectorAll('.page-btn');
    
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            pageButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button (unless it's the arrow)
            if (this.textContent !== '→') {
                this.classList.add('active');
            }
            
            console.log(`Page ${this.textContent} clicked`);
        });
    });

    // Search and cart icon functionality (mock)
    const searchIcon = document.querySelector('.search-icon');
    const cartIcon = document.querySelector('.cart-icon');
    
    searchIcon.addEventListener('click', function() {
        console.log('Search clicked');
        // You could implement search functionality here
    });
    
    cartIcon.addEventListener('click', function() {
        console.log('Cart clicked');
        // You could implement cart functionality here
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');

        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Menu search and filter functionality
    const menuSearch = document.getElementById('menu-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuItems = document.querySelectorAll('.menu-item');

    // Search functionality
    if (menuSearch) {
        menuSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();

            menuItems.forEach(item => {
                const itemName = item.querySelector('h4').textContent.toLowerCase();
                const itemDesc = item.querySelector('p').textContent.toLowerCase();

                if (itemName.includes(searchTerm) || itemDesc.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });

            // Hide empty categories
            menuCategories.forEach(category => {
                const visibleItems = category.querySelectorAll('.menu-item[style*="flex"]');
                if (visibleItems.length === 0 && searchTerm !== '') {
                    category.style.display = 'none';
                } else {
                    category.style.display = 'block';
                }
            });
        });
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            menuCategories.forEach(category => {
                if (filter === 'all') {
                    category.style.display = 'block';
                } else {
                    const categoryType = category.getAttribute('data-category');
                    if (categoryType === filter) {
                        category.style.display = 'block';
                    } else {
                        category.style.display = 'none';
                    }
                }
            });

            // Reset search when filtering
            if (menuSearch) {
                menuSearch.value = '';
                menuItems.forEach(item => {
                    item.style.display = 'flex';
                });
            }
        });
    });

    // Contact form validation and submission
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            document.querySelectorAll('.form-error').forEach(error => {
                error.classList.remove('show');
            });

            let isValid = true;

            // Validate name
            const name = document.getElementById('name');
            if (!name.value.trim()) {
                showError('name-error', 'Name is required');
                isValid = false;
            }

            // Validate email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError('email-error', 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(email.value)) {
                showError('email-error', 'Please enter a valid email');
                isValid = false;
            }

            // Validate message
            const message = document.getElementById('message');
            if (!message.value.trim()) {
                showError('message-error', 'Message is required');
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('.btn-submit');
                const btnText = submitBtn.querySelector('.btn-text');
                const btnLoading = submitBtn.querySelector('.btn-loading');

                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';

                // Simulate form submission
                setTimeout(() => {
                    alert('Thank you for your message! We\'ll get back to you soon.');
                    contactForm.reset();

                    // Reset button state
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                }, 2000);
            }
        });
    }

    function showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Advanced interaction enhancements

    // Add micro-animations to elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Add appropriate animation class based on element type
                if (element.classList.contains('product-card')) {
                    element.classList.add('slide-up');
                } else if (element.classList.contains('feature')) {
                    element.classList.add('scale-in');
                } else if (element.classList.contains('stat-item')) {
                    element.classList.add('bounce-in');
                } else {
                    element.classList.add('fade-in');
                }

                // Stop observing once animated
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatableElements = document.querySelectorAll('.product-card, .feature, .stat-item, .menu-category, .contact-item');
    animatableElements.forEach(element => {
        animationObserver.observe(element);
    });

    // Enhanced button state management
    function setButtonState(button, state, options = {}) {
        const { text, duration = 2000 } = options;

        // Remove all state classes
        button.classList.remove('loading', 'btn-success', 'btn-error', 'show-check');

        switch (state) {
            case 'loading':
                button.classList.add('loading');
                button.disabled = true;
                if (text) button.textContent = text;
                break;

            case 'success':
                button.classList.add('btn-success');
                button.disabled = true;
                setTimeout(() => {
                    button.classList.add('show-check');
                }, 100);

                setTimeout(() => {
                    resetButton(button);
                }, duration);
                break;

            case 'error':
                button.classList.add('btn-error');
                button.disabled = true;
                if (text) button.textContent = text;

                setTimeout(() => {
                    resetButton(button);
                }, duration);
                break;

            case 'normal':
            default:
                resetButton(button);
                break;
        }
    }

    function resetButton(button) {
        button.classList.remove('loading', 'btn-success', 'btn-error', 'show-check');
        button.disabled = false;

        // Restore original text if it exists
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.textContent = originalText;
        }
    }

    // Store original button texts
    document.querySelectorAll('button').forEach(button => {
        if (!button.getAttribute('data-original-text')) {
            button.setAttribute('data-original-text', button.textContent);
        }
    });

    // Enhanced order button functionality with states
    const orderButtons = document.querySelectorAll('.btn-order');

    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('h3').textContent;

            // Set loading state
            setButtonState(this, 'loading', { text: 'Adding...' });

            // Simulate API call
            setTimeout(() => {
                // Randomly succeed or fail for demo
                const success = Math.random() > 0.2;

                if (success) {
                    setButtonState(this, 'success');
                    showNotification(`${productName} added to cart!`, 'success');
                } else {
                    setButtonState(this, 'error', { text: 'Failed' });
                    showNotification('Failed to add item. Please try again.', 'error');
                }
            }, 1500);
        });
    });

    // Notification system
    function showNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; margin-left: 10px;">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }

    // Progress bar for form submission
    function showProgress(container, progress) {
        let progressBar = container.querySelector('.progress-bar');

        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.innerHTML = '<div class="progress-fill"></div>';
            container.appendChild(progressBar);
        }

        const fill = progressBar.querySelector('.progress-fill');
        fill.style.width = `${progress}%`;

        if (progress >= 100) {
            setTimeout(() => {
                progressBar.remove();
            }, 500);
        }
    }

    // Enhanced form validation with real-time feedback
    const formInputs = document.querySelectorAll('input, textarea');

    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Clear error state on input
            const formGroup = this.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('error');
                const errorElement = formGroup.querySelector('.form-error');
                if (errorElement) {
                    errorElement.classList.remove('show');
                }
            }
        });
    });

    function validateField(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = `${field.name} is required`;
        }

        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Update form group state
        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');

            const errorElement = formGroup.querySelector('.form-error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            }
        }

        return isValid;
    }

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.product-card, .feature, .contact-item');

    interactiveElements.forEach(element => {
        element.classList.add('hover-lift');
    });

    // Add glow effect to primary buttons
    const primaryButtons = document.querySelectorAll('.btn-primary, .btn-order');
    primaryButtons.forEach(button => {
        button.classList.add('hover-glow');
    });

    console.log('Advanced interaction design loaded successfully!');
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
