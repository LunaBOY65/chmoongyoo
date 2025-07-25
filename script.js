document.addEventListener('DOMContentLoaded', function() {
    // --- THEME TOGGLE LOGIC ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Function to apply the saved theme on page load
    const applySavedTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        // If there's a saved theme and it's 'light', add the light-mode class
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
        }
    };

    // Apply theme as soon as the DOM is loaded
    applySavedTheme();

    // Event listener for the toggle button
    themeToggle.addEventListener('click', () => {
        // Toggle the 'light-mode' class on the body
        body.classList.toggle('light-mode');

        // Save the current theme preference to localStorage
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
            // Or remove the item to default to dark
            // localStorage.removeItem('theme'); 
        }
    });
    
    // --- HOBBIES TOGGLE LOGIC (NEW) ---
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
            // Ensure it's an internal anchor link
            if (href.startsWith('#')) {
                e.preventDefault(); // Prevent the default jump

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerOffset = 100; // Offset to account for the sticky header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    // Call the custom smooth scroll function
                    smoothScrollTo(offsetPosition, 1000);
                }
            }
        });
    });

    /**
     * Smoothly scrolls the page to a target position.
     * @param {number} targetPosition - The final vertical position to scroll to.
     * @param {number} duration - The duration of the scroll animation in milliseconds.
     */
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

        /**
         * Easing function for a smooth acceleration and deceleration.
         * @param {number} t - current time
         * @param {number} b - start value
         * @param {number} c - change in value
         * @param {number} d - duration
         */
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
        rootMargin: '0px', // Adjust as needed
        threshold: 0.4      // Trigger when 40% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove 'active' from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                // Add 'active' to the corresponding link
                const activeLink = document.querySelector(`.main-header nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });

    // Set initial active link on page load based on hash
    if (window.location.hash) {
        const activeLink = document.querySelector(`.main-header nav a[href="${window.location.hash}"]`);
        if (activeLink) activeLink.classList.add('active');
    } else {
        const homeLink = document.querySelector('.main-header nav a[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
    }
});