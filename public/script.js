document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // --- NEW: PARTICLE LOADER FUNCTION ---
  /**
   * Loads particles.js with a configuration based on the current theme.
   * @param {boolean} isLight - True if light mode is active, false otherwise.
   */
  function loadParticles(isLight) {
    const particleColors = isLight
      ? ["#888888", "#555555", "#6a1b9a"]
      : ["#ffffff", "#e0f7fa", "#f3e5f5"];

    tsParticles.load("particles-js", {
      particles: {
        number: {
          value: 150,
          density: { enable: true, value_area: 800 },
        },
        color: {
          value: particleColors,
        },
        shape: { type: "circle" },
        opacity: {
          value: 0.8,
          random: true,
          anim: { enable: true, speed: 1.5, opacity_min: 0.2, sync: false },
        },
        size: {
          value: 2.5,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.1, sync: false },
        },
        links: { enable: false },
        move: {
          enable: true,
          speed: 0.5,
          direction: "top-right",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: {
            enable: true,
            mode: "bubble",
            parallax: {
              enable: true,
              force: 60,
              smooth: 10,
            },
          },
          onClick: { enable: true, mode: "repulse" },
          resize: true,
        },
        modes: {
          bubble: { distance: 250, size: 4, duration: 2, opacity: 1, speed: 3 },
          repulse: { distance: 150, duration: 0.4 },
        },
      },

      // 🌠 Emitters (ยิงดาวตก)
      emitters: {
        direction: "top-right",
        rate: {
          delay: 5,
          quantity: 1,
        },
        position: {
          x: 0,
          y: 50,
        },
        size: {
          width: 0,
          height: 100,
        },
        particles: {
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          size: { value: 2.5 },
          move: {
            speed: 25,
            straight: true,
            direction: "top-right",
            outModes: "destroy",
          },
          links: { enable: false },
        },
      },
    });
  }

  // --- THEME TOGGLE LOGIC (UPDATED) ---
  const applySavedTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      body.classList.add("light-mode");
    }
    // Load particles with the correct theme color on initial page load
    loadParticles(body.classList.contains("light-mode"));
  };

  applySavedTheme();

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
    // Reload particles with the new theme color after toggling
    loadParticles(body.classList.contains("light-mode"));
  });

  // --- HOBBIES TOGGLE LOGIC ---
  const hobbiesToggleBtn = document.getElementById("hobbies-toggle");
  if (hobbiesToggleBtn) {
    hobbiesToggleBtn.addEventListener("click", () => {
      const hiddenHobbies = document.querySelectorAll(".hobby-hidden");
      const isShowingMore = hobbiesToggleBtn.textContent === "Show Less";

      hiddenHobbies.forEach((hobby) => {
        hobby.style.display = isShowingMore ? "none" : "list-item";
      });

      hobbiesToggleBtn.textContent = isShowingMore ? "Show More" : "Show Less";
    });
  }

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-header nav a");

  // --- SMOOTH SCROLLING LOGIC (REVISED FOR NATIVE BROWSER BEHAVIOR) ---
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      // Ensure it's an anchor link on the current page
      if (href.startsWith("#")) {
        e.preventDefault(); // Prevent the default jump
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // ✨ CHANGE: Updated breakpoint to 1024px to include iPads
          const headerOffset = window.innerWidth <= 1024 ? 80 : 100;

          // Calculate the position of the target element relative to the document
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          // ✨ CHANGE: Updated breakpoint to 1024px to include iPads
          //const scrollBehavior = window.innerWidth <= 1024 ? 'auto' : 'smooth';

          // Use the browser's built-in scrolling with dynamic behavior
          window.scrollTo({
            top: offsetPosition,
            behavior: "auto",
          });
        }
      }
    });
  });

  // --- NAVIGATION SCROLLSPY LOGIC ---
  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.4,
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(
          `.main-header nav a[href="#${id}"]`,
        );
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  if (window.location.hash) {
    const activeLink = document.querySelector(
      `.main-header nav a[href="${window.location.hash}"]`,
    );
    if (activeLink) activeLink.classList.add("active");
  } else {
    const homeLink = document.querySelector('.main-header nav a[href="#home"]');
    if (homeLink) homeLink.classList.add("active");
  }

  const tagToggles = document.querySelectorAll(".tag-toggle-btn");

  tagToggles.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault(); // กันไม่ให้ลิงก์ของโปรเจกต์ทำงาน
      e.stopPropagation(); // กันไม่ให้ Event ส่งต่อไปยังตัวการ์ด

      const container = this.closest(".project-tags");
      const hiddenTags = container.querySelectorAll(".tag-hidden");
      const isExpanded = this.textContent === "Show Less";

      hiddenTags.forEach((tag) => {
        tag.style.display = isExpanded ? "none" : "inline-block";
      });

      // อัปเดตข้อความบนปุ่ม
      if (isExpanded) {
        const count = hiddenTags.length;
        this.textContent = `+${count} more`;
        this.style.backgroundColor = "var(--border-color)";
      } else {
        this.textContent = "Show Less";
        this.style.backgroundColor = "var(--active-nav-bg)";
      }
    });
  });
});

// --- UPDATED: DURATION CALCULATION FUNCTION ---
/**
 * Calculates the duration between two dates from a string and updates the element.
 * Handles multiple date formats:
 * - "Month Year - Month Year" (e.g., Feb 2025 - Apr 2025)
 * - "Month - Month Year" (e.g., Feb - Apr 2025)
 * - "Month Year - Present" (e.g., Jun 2025 - Present)
 * @param {string} elementId - The ID of the element containing the date string.
 */
function calculateAndDisplayDuration(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const originalText = element.textContent;
  // รองรับทั้งแบบ "Intern · Jun 2025" และแบบ "Dec 2025"
  const dateString = originalText.includes("·")
    ? originalText.split("·")[1]?.trim()
    : originalText.trim();
  if (!dateString) return;

  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  let startDate, endDate;

  // --- NEW: Logic to handle different date formats ---
  if (dateString.toLowerCase().includes("present")) {
    // Case 1: Handles "Month Year - Present"
    const [startStr] = dateString.split(" - ");
    const startParts = startStr.split(" ");
    const startMonth = monthMap[startParts[0]];
    const startYear = parseInt(startParts[1], 10);
    startDate = new Date(startYear, startMonth);
    endDate = new Date(); // Use current date
  } else {
    // Case 2: Handles "Month - Month Year" and "Month Year - Month Year"
    const [startStr, endStr] = dateString.split(" - ");
    const endParts = endStr.split(" ");

    const endMonth = monthMap[endParts[0]];
    const year = parseInt(endParts[endParts.length - 1], 10);

    // Check if start string includes a year or not
    const startParts = startStr.split(" ");
    const startMonth = monthMap[startParts[0]];
    const startYear =
      startParts.length > 1 ? parseInt(startParts[1], 10) : year;

    startDate = new Date(startYear, startMonth);
    endDate = new Date(year, endMonth);
  }

  if (isNaN(startDate) || isNaN(endDate)) return; // Exit if dates are invalid

  // --- Calculation logic (remains the same) ---
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  let totalMonths = yearDiff * 12 + monthDiff + 1;

  if (totalMonths <= 0) totalMonths = 1;

  let durationText = "";
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0) {
    durationText += `${years} yr `;
  }
  if (months > 0) {
    durationText += `${months} mos`;
  }

  if (durationText.trim() === "") {
    durationText = totalMonths > 0 ? `${totalMonths} mos` : "";
  }

  if (durationText) {
    // ถ้าเป็น Project Date ให้แสดงวันที่ตามด้วยระยะเวลาโดยใช้ bullet คั่น
    if (!originalText.includes("·")) {
      element.innerHTML = `${originalText} &middot; ${durationText.trim()}`;
    } else {
      element.innerHTML = `${originalText} &middot; ${durationText.trim()}`;
    }
  }
}

// --- เรียกใช้ฟังก์ชันสำหรับแต่ละรายการ ---
calculateAndDisplayDuration("job-1");
calculateAndDisplayDuration("job-2");
calculateAndDisplayDuration("project-date-1");
