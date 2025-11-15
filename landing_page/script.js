// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Dark Theme Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Check for saved theme preference or default to 'light' mode
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    updateThemeIcon("dark");
  } else if (currentTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    updateThemeIcon("light");
  } else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute("data-theme", "dark");
    updateThemeIcon("dark");
  }

  // Theme toggle functionality
  themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Add animation class
    document.body.style.transition =
      "background-color 0.3s ease, color 0.3s ease";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);

    // Add visual feedback
    this.style.transform = "scale(0.9)";
    setTimeout(() => {
      this.style.transform = "";
    }, 150);
  });

  function updateThemeIcon(theme) {
    const moonIcon = themeToggle.querySelector(".fa-moon");
    const sunIcon = themeToggle.querySelector(".fa-sun");

    if (theme === "dark") {
      moonIcon.style.display = "none";
      sunIcon.style.display = "inline-block";
    } else {
      moonIcon.style.display = "inline-block";
      sunIcon.style.display = "none";
    }
  }

  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId.startsWith("#")) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
      // Close mobile menu if open
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Navbar background change on scroll
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    if (window.scrollY > 50) {
      if (currentTheme === "dark") {
        navbar.style.background = "rgba(12, 20, 38, 0.98)";
        navbar.style.boxShadow = "0 2px 20px rgba(30, 41, 59, 0.3)";
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
        navbar.style.boxShadow = "0 2px 20px rgba(59, 130, 246, 0.1)";
      }
    } else {
      if (currentTheme === "dark") {
        navbar.style.background = "rgba(12, 20, 38, 0.95)";
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
      }
      navbar.style.boxShadow = "none";
    }
  });

  // Tab functionality for app preview section
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      this.classList.add("active");
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // FAQ Accordion functionality
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", function () {
      const isActive = item.classList.contains("active");

      // Close all FAQ items
      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // Enhanced Intersection Observer for animation triggers
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");

        // Add staggered animation for grid items
        if (entry.target.classList.contains("feature-card")) {
          const cards = document.querySelectorAll(".feature-card");
          cards.forEach((card, index) => {
            if (card === entry.target) {
              setTimeout(() => {
                card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
              }, index * 100);
            }
          });
        }
      }
    });
  }, observerOptions);

  // Observe elements for animations with reveal class
  const animatedElements = document.querySelectorAll(
    ".feature-card, .step, .faq-item, .preview-mockup"
  );
  animatedElements.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });

  // Reveal animation for scroll
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px",
    }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  // Authentication button event listeners
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const signinBtn = document.getElementById("signin-btn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => openAuthModal("signin"));
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", () => openAuthModal("signup"));
  }

  if (signinBtn) {
    signinBtn.addEventListener("click", () => openAuthModal("signin"));
  }

  // Password strength checker
  const signupPassword = document.getElementById("signup-password");
  if (signupPassword) {
    signupPassword.addEventListener("input", checkPasswordStrength);
  }

  // Real-time password confirmation
  const confirmPassword = document.getElementById("signup-confirm-password");
  if (confirmPassword) {
    confirmPassword.addEventListener("input", validatePasswordMatch);
  }

  // Enhanced parallax and scroll effects
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    // Parallax for hero background elements
    const heroElements = document.querySelectorAll(".hero::before");
    heroElements.forEach((element) => {
      element.style.transform = `translateY(${rate}px)`;
    });

    // Parallax for phone mockup
    const phoneElements = document.querySelectorAll(".phone-mockup");
    phoneElements.forEach((element) => {
      element.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
  });

  // Add mouse move parallax effect
  document.addEventListener("mousemove", function (e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const phoneElements = document.querySelectorAll(".phone-mockup");
    phoneElements.forEach((element) => {
      const moveX = (mouseX - 0.5) * 20;
      const moveY = (mouseY - 0.5) * 20;
      element.style.transform += ` rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
    });
  });

  // Form validation and newsletter signup (if needed)
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;

      if (validateEmail(email)) {
        // Handle newsletter signup
        showMessage("Thank you for subscribing!", "success");
        this.reset();
      } else {
        showMessage("Please enter a valid email address.", "error");
      }
    });
  }

  // Counter animation for statistics (if you add any)
  function animateCounters() {
    const counters = document.querySelectorAll(".counter");

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      const count = +counter.innerText;
      const increment = target / 200;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => animateCounters(), 1);
      } else {
        counter.innerText = target;
      }
    });
  }

  // Utility functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Authentication Modal Functions
  window.openAuthModal = function (mode = "signin") {
    const modal = document.getElementById("auth-modal");
    const signinForm = document.getElementById("signin-form");
    const signupForm = document.getElementById("signup-form");

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    if (mode === "signup") {
      signinForm.style.display = "none";
      signupForm.style.display = "block";
    } else {
      signinForm.style.display = "block";
      signupForm.style.display = "none";
    }
  };

  window.closeAuthModal = function () {
    const modal = document.getElementById("auth-modal");
    modal.classList.remove("active");
    document.body.style.overflow = "";

    // Clear form data
    document.querySelectorAll(".login-form").forEach((form) => {
      form.reset();
    });
  };

  window.switchAuthMode = function (mode) {
    const signinForm = document.getElementById("signin-form");
    const signupForm = document.getElementById("signup-form");

    if (mode === "signup") {
      signinForm.style.display = "none";
      signupForm.style.display = "block";
    } else {
      signinForm.style.display = "block";
      signupForm.style.display = "none";
    }
  };

  // Handle Sign In
  window.handleSignIn = async function (event) {
    event.preventDefault();

    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;
    const rememberMe = document.getElementById("remember-me").checked;

    showLoadingState(event.target);

    try {
      const response = await fetch("/api/landing-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "signin",
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign in failed");
      }

      hideLoadingState(event.target);
      showMessage("Sign in successful! Redirecting to app...", "success");

      // Store session data for the main app to pick up
      if (data.session) {
        sessionStorage.setItem(
          "eventhive_pending_session",
          JSON.stringify(data.session)
        );
      }

      // Store user session
      localStorage.setItem(
        "eventhive_user",
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || email.split("@")[0],
          loginTime: Date.now(),
          isAuthenticated: true,
          rememberMe: rememberMe,
        })
      );

      // Redirect to main app after 1 second
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      hideLoadingState(event.target);
      showMessage(
        error.message || "Sign in failed. Please try again.",
        "error"
      );
      console.error("Sign in error:", error);
    }
  };

  // Handle Sign Up
  window.handleSignUp = async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("signup-firstname").value;
    const lastName = document.getElementById("signup-lastname").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById(
      "signup-confirm-password"
    ).value;

    // Validate password match
    if (password !== confirmPassword) {
      showMessage("Passwords do not match!", "error");
      return;
    }

    // Validate password strength
    if (!isPasswordStrong(password)) {
      showMessage("Please choose a stronger password!", "error");
      return;
    }

    showLoadingState(event.target);

    try {
      const response = await fetch("/api/landing-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "signup",
          name: `${firstName} ${lastName}`,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign up failed");
      }

      hideLoadingState(event.target);
      showMessage(
        `Welcome to EventHive, ${firstName}! Redirecting to app...`,
        "success"
      );

      // Store session data for the main app to pick up
      if (data.session) {
        sessionStorage.setItem(
          "eventhive_pending_session",
          JSON.stringify(data.session)
        );
      }

      // Store user info
      localStorage.setItem(
        "eventhive_user",
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: `${firstName} ${lastName}`,
          loginTime: Date.now(),
          isAuthenticated: true,
        })
      );

      // Redirect to main app after 1 second
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      hideLoadingState(event.target);
      showMessage(
        error.message || "Sign up failed. Please try again.",
        "error"
      );
      console.error("Sign up error:", error);
    }
  };

  // Social Authentication Functions
  window.signInWithGoogle = function () {
    showMessage("Google sign-in integration coming soon!", "info");
  };

  window.signInWithFacebook = function () {
    showMessage("Facebook sign-in integration coming soon!", "info");
  };

  window.signUpWithGoogle = function () {
    showMessage("Google sign-up integration coming soon!", "info");
  };

  window.signUpWithFacebook = function () {
    showMessage("Facebook sign-up integration coming soon!", "info");
  };

  function showMessage(text, type = "info") {
    const message = document.createElement("div");
    message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#6366f1"};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10000;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
    message.textContent = text;

    document.body.appendChild(message);

    // Animate in
    setTimeout(() => {
      message.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      message.style.transform = "translateX(400px)";
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 3000);
  }

  // Lazy loading for images (when you add real images)
  function lazyLoadImages() {
    const images = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  // Initialize lazy loading
  lazyLoadImages();

  // Add loading states for better UX
  function addLoadingStates() {
    const buttons = document.querySelectorAll("button, .btn-primary");

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        if (!this.classList.contains("loading")) {
          this.classList.add("loading");
          const originalText = this.innerHTML;

          // Simulate loading (remove this in production)
          setTimeout(() => {
            this.classList.remove("loading");
            this.innerHTML = originalText;
          }, 2000);
        }
      });
    });
  }

  // Initialize loading states
  addLoadingStates();

  // Enhanced mobile menu functionality
  function enhancedMobileMenu() {
    const mobileMenuCSS = `
            @media (max-width: 768px) {
                .nav-menu {
                    position: fixed;
                    left: -100%;
                    top: 70px;
                    flex-direction: column;
                    background-color: rgba(255, 255, 255, 0.98);
                    width: 100%;
                    text-align: center;
                    transition: 0.3s;
                    box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
                    backdrop-filter: blur(10px);
                    padding: 2rem 0;
                }
                
                .nav-menu.active {
                    left: 0;
                }
                
                .nav-menu .nav-link {
                    display: block;
                    margin: 1rem 0;
                }
                
                .nav-menu .download-btn {
                    margin-top: 1rem;
                    display: inline-block;
                }
                
                .hamburger.active span:nth-child(1) {
                    transform: rotate(-45deg) translate(-5px, 6px);
                }
                
                .hamburger.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .hamburger.active span:nth-child(3) {
                    transform: rotate(45deg) translate(-5px, -6px);
                }
            }
        `;

    // Add mobile menu styles if not already present
    if (!document.querySelector("#mobile-menu-styles")) {
      const style = document.createElement("style");
      style.id = "mobile-menu-styles";
      style.textContent = mobileMenuCSS;
      document.head.appendChild(style);
    }
  }

  // Initialize enhanced mobile menu
  enhancedMobileMenu();

  // Performance optimization: Debounce scroll events
  function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // Optimized scroll handler
  const optimizedScrollHandler = debounce(function () {
    // Navbar background change
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "none";
    }
  }, 10);

  // Replace the existing scroll listener with the optimized one
  window.removeEventListener("scroll", optimizedScrollHandler);
  window.addEventListener("scroll", optimizedScrollHandler);

  // Enhanced hover effects for cards
  function addAdvancedHoverEffects() {
    const cards = document.querySelectorAll(".feature-card, .step");

    cards.forEach((card) => {
      card.addEventListener("mouseenter", function (e) {
        // Create ripple effect
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement("div");
        ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(99, 102, 241, 0.2);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;

        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = e.clientX - rect.left - size / 2 + "px";
        ripple.style.top = e.clientY - rect.top - size / 2 + "px";

        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  // Add ripple effect CSS
  const rippleCSS = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;

  const style = document.createElement("style");
  style.textContent = rippleCSS;
  document.head.appendChild(style);

  // Initialize advanced hover effects
  addAdvancedHoverEffects();

  // Add smooth reveal animations on page load
  setTimeout(() => {
    const heroContent = document.querySelector(".hero-content");
    const heroImage = document.querySelector(".hero-image");

    if (heroContent) {
      heroContent.style.animation = "slideInLeft 1s ease-out forwards";
    }
    if (heroImage) {
      heroImage.style.animation = "slideInRight 1s ease-out 0.3s forwards";
    }
  }, 100);

  // Performance optimization for scroll animations
  let ticking = false;

  function updateScrollAnimations() {
    // Your scroll animation code here
    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateScrollAnimations);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestScrollUpdate);

  // Add loading state management
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");

    // Trigger any load-based animations
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("active");
      }, index * 100);
    });
  });

  // Enhanced accessibility features
  function enhanceAccessibility() {
    // Add keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll(
      ".feature-card, .step, .faq-question, .theme-toggle"
    );

    interactiveElements.forEach((element) => {
      element.setAttribute("tabindex", "0");

      element.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Add focus indicators
    const focusCSS = `
            .feature-card:focus,
            .step:focus,
            .theme-toggle:focus,
            .faq-question:focus {
                outline: 3px solid #6366f1;
                outline-offset: 2px;
            }
        `;

    const focusStyle = document.createElement("style");
    focusStyle.textContent = focusCSS;
    document.head.appendChild(focusStyle);
  }

  // Initialize accessibility enhancements
  enhanceAccessibility();

  // Password Toggle Function
  window.togglePassword = function (inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector(".toggle-password");
    const icon = button.querySelector("i");

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  };

  // Password Strength Checker
  function checkPasswordStrength() {
    const password = document.getElementById("signup-password").value;
    const strengthBar = document.querySelector(".strength-bar");
    const strengthText = document.querySelector(".strength-text");

    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) score++;
    else feedback.push("at least 8 characters");

    // Uppercase check
    if (/[A-Z]/.test(password)) score++;
    else feedback.push("uppercase letter");

    // Lowercase check
    if (/[a-z]/.test(password)) score++;
    else feedback.push("lowercase letter");

    // Number check
    if (/\d/.test(password)) score++;
    else feedback.push("number");

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push("special character");

    // Update strength bar
    const percentage = (score / 5) * 100;
    strengthBar.style.setProperty("--strength", `${percentage}%`);

    // Update text
    if (score < 2) {
      strengthText.textContent = "Weak password";
      strengthText.style.color = "#ef4444";
    } else if (score < 4) {
      strengthText.textContent = "Medium password";
      strengthText.style.color = "#f59e0b";
    } else {
      strengthText.textContent = "Strong password";
      strengthText.style.color = "#10b981";
    }
  }

  function isPasswordStrong(password) {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password)
    );
  }

  function validatePasswordMatch() {
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById(
      "signup-confirm-password"
    ).value;
    const confirmInput = document.getElementById("signup-confirm-password");

    if (confirmPassword && password !== confirmPassword) {
      confirmInput.style.borderColor = "#ef4444";
    } else {
      confirmInput.style.borderColor = "";
    }
  }

  function showLoadingState(button) {
    button.disabled = true;
    button.classList.add("loading");
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.dataset.originalText = originalText;
  }

  function hideLoadingState(button) {
    button.disabled = false;
    button.classList.remove("loading");
    button.innerHTML = button.dataset.originalText;
  }

  // Close modal on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAuthModal();
    }
  });

  // Check if user is already logged in
  function checkUserSession() {
    const user = localStorage.getItem("eventhive_user");
    if (user) {
      const userData = JSON.parse(user);
      const loginBtn = document.getElementById("login-btn");
      if (loginBtn) {
        loginBtn.textContent = "Dashboard";
        loginBtn.onclick = () =>
          showMessage(
            `Welcome back, ${userData.name || userData.email}!`,
            "success"
          );
      }
    }
  }

  // Initialize user session check
  checkUserSession();

  console.log(
    "EventHive website loaded successfully with authentication system! 🎉✨"
  );
});
