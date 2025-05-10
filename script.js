document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links li');

    // Smooth Scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile nav if open after clicking a link
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    navLinkItems.forEach((link, index) => {
                        link.style.animation = '';
                    });
                }
            }
        });
    });

    // Toggle Nav for Mobile
    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');

            // Animate Links
            if (nav.classList.contains('nav-active')) {
                navLinkItems.forEach((link, index) => {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                });
            } else {
                navLinkItems.forEach((link, index) => {
                    link.style.animation = '';
                });
            }
        });
    }

    // Active Nav Link Highlighting on Scroll (Optional but good UX)
    const sections = document.querySelectorAll('main section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
        // Special case for home when at the top
        if (pageYOffset < sections[0].offsetTop - sections[0].clientHeight / 3) {
             navLinks.forEach(link => link.classList.remove('active'));
             const homeLink = document.querySelector('.nav-links a[href="#home"] ');
             if(homeLink) homeLink.classList.add('active');
        } 
    });

    // Testimonial Slider
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentSlide = 0;

    function showSlide(index) {
        testimonialItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    }

    if (testimonialItems.length > 0) {
        showSlide(currentSlide);

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % testimonialItems.length;
                showSlide(currentSlide);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + testimonialItems.length) % testimonialItems.length;
                showSlide(currentSlide);
            });
        }
        
        // Optional: Auto-slide testimonials
        // setInterval(() => {
        //     currentSlide = (currentSlide + 1) % testimonialItems.length;
        //     showSlide(currentSlide);
        // }, 5000); // Change slide every 5 seconds
    }

    // Function to set active navigation link based on current page
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop();
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href').split('/').pop().split('#')[0];
            
            if (currentPage === '' && (linkPage === 'index.html' || linkPage === '' || link.getAttribute('href') === '#home')) {
                // Special handling for homepage (index.html or root)
                if (link.getAttribute('href') === 'index.html#home' || link.getAttribute('href') === '#home' || link.getAttribute('href') === 'index.html') {
                    link.classList.add('active');
                }
            } else if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }
    setActiveNavLink(); // Call it on page load

    // Adjust active link on hash change (e.g., for internal page links, though less common now)
    window.addEventListener('hashchange', setActiveNavLink);
    
    // Re-evaluate active link after smooth scroll finishes (if possible, or rely on current scroll logic)
    // The existing scroll listener will handle active states for sections on the homepage.
});

// Keyframes for nav link fade-in (needs to be in JS for dynamic delay or ensure it's in CSS)
// Adding this to CSS directly is better if static, but here for completeness if dynamic aspects were needed.
// If this is in your style.css already with @keyframes navLinkFade, you can remove this part.
const styleSheet = document.styleSheets[0];
const keyframes = 
  `@keyframes navLinkFade {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0px);
    }
}`;

try {
    if (styleSheet && styleSheet.insertRule) {
        // Check if the rule already exists to avoid errors on multiple script runs (e.g. hot reload)
        let ruleExists = false;
        try {
            for (let rule of styleSheet.cssRules) {
                if (rule.name === 'navLinkFade') {
                    ruleExists = true;
                    break;
                }
            }
        } catch (e) { /* Security error for cross-origin stylesheets - ignore */ }

        if (!ruleExists) {
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        }
    }
} catch (e) {
    console.warn('Could not insert navLinkFade keyframes dynamically:', e);
} 