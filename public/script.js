document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // --- NEW: PARTICLE LOADER FUNCTION ---
    /**
     * Loads particles.js with a configuration based on the current theme.
     * @param {boolean} isLight - True if light mode is active, false otherwise.
     */
    function loadParticles(isLight) {
        const particleColor = isLight ? '#333333' : '#ffffff'; // Dark particles on light bg, white on dark
        const lineColor = isLight ? '#555555' : '#ffffff';     // Same logic for lines

        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 60,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": particleColor // DYNAMIC COLOR
                },
                "shape": {
                    "type": "circle",
                    "stroke": { "width": 0, "color": "#000000" },
                    "polygon": { "nb_sides": 5 }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": { "enable": true, "speed": 0.5, "opacity_min": 0.1, "sync": false }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": lineColor, // DYNAMIC COLOR
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": false, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 0.7 } },
                    "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
                    "repulse": { "distance": 200, "duration": 0.4 },
                    "push": { "particles_nb": 4 },
                    "remove": { "particles_nb": 2 }
                }
            },
            "retina_detect": true
        });
    }

    // --- THEME TOGGLE LOGIC (UPDATED) ---
    const applySavedTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
        }
        // Load particles with the correct theme color on initial page load
        loadParticles(body.classList.contains('light-mode'));
    };

    applySavedTheme();

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');

        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
        // Reload particles with the new theme color after toggling
        loadParticles(body.classList.contains('light-mode'));
    });
    
    // --- HOBBIES TOGGLE LOGIC ---
    const hobbiesToggleBtn = document.getElementById('hobbies-toggle');
    if (hobbiesToggleBtn) {
        hobbiesToggleBtn.addEventListener('click', () => {
            const hiddenHobbies = document.querySelectorAll('.hobby-hidden');
            const isShowingMore = hobbiesToggleBtn.textContent === 'Show Less';

            hiddenHobbies.forEach(hobby => {
                hobby.style.display = isShowingMore ? 'none' : 'list-item';
            });

            hobbiesToggleBtn.textContent = isShowingMore ? 'Show More' : 'Show Less';
        });
    }


    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-header nav a');

    // --- SMOOTH SCROLLING LOGIC ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    smoothScrollTo(offsetPosition, 1000);
                }
            }
        });
    });

    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
        requestAnimationFrame(animation);
    }


    // --- NAVIGATION SCROLLSPY LOGIC ---
    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.main-header nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    if (window.location.hash) {
        const activeLink = document.querySelector(`.main-header nav a[href="${window.location.hash}"]`);
        if (activeLink) activeLink.classList.add('active');
    } else {
        const homeLink = document.querySelector('.main-header nav a[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
    }
});