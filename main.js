// DOM Elements
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navList = document.querySelector(".nav-list");

// Mobile Menu Toggle
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    navList.classList.toggle("active");
  });
}

// Load Header and Footer
async function loadComponent(componentName) {
  try {
    const response = await fetch(`${componentName}.html`);
    const html = await response.text();
    document.querySelector(`.${componentName}`).innerHTML = html;

    // Initialize mobile menu after header is loaded
    if (componentName === "header") {
      initMobileMenu();
    }
  } catch (error) {
    console.error(`Error loading ${componentName}:`, error);
  }
}

// Load JSON Content
async function loadContent() {
  try {
    const response = await fetch("content.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading content:", error);
    return null;
  }
}

// Render How to Play section
function renderHowToPlay(data) {
  if (!data.howToPlay) return;

  const section = document.getElementById("how-to-play");
  if (!section) return;

  // Update title and subtitle
  section.querySelector(".how-to-play-title").textContent =
    data.howToPlay.title;
  section.querySelector(".how-to-play-subtitle").textContent =
    data.howToPlay.subtitle;

  // Update steps
  const grid = section.querySelector(".how-to-play-grid");
  grid.innerHTML = data.howToPlay.steps
    .map(
      (step) => `
    <div class="how-to-play-step fade-in">
      <div class="how-to-play-icon">${step.icon}</div>
      <h3 class="how-to-play-step-title">${step.title}</h3>
      <p class="how-to-play-step-content">${step.content}</p>
    </div>
  `
    )
    .join("");
}

// Initialize Components
document.addEventListener("DOMContentLoaded", async () => {
  // Load header and footer
  await loadComponent("header");
  await loadComponent("footer");

  const content = await loadContent();
  if (!content) return;

  // Featured News Content
  const featuredNews = document.querySelector(".featured-news");
  if (featuredNews && content.featuredNews) {
    content.featuredNews.forEach((story) => {
      const storyElement = document.createElement("article");
      storyElement.className = "featured-story fade-in";
      storyElement.innerHTML = `
                <img src="${story.image}" alt="${
        story.title
      }" class="featured-story-image">
                <div class="featured-story-content">
                    <h3 class="featured-story-title">${story.title}</h3>
                    <p class="featured-story-excerpt">${story.excerpt}</p>
                    <div class="featured-story-meta">
                        <span class="featured-story-category">${
                          story.category
                        }</span>
                        <time class="featured-story-date" datetime="${
                          story.date
                        }">
                            ${new Date(story.date).toLocaleDateString()}
                        </time>
                    </div>
                </div>
            `;
      featuredNews.appendChild(storyElement);
    });
  }

  // Home Page Content
  const homeBlocks = document.querySelector(".block-grid");
  if (homeBlocks && content.homeBlocks) {
    content.homeBlocks.forEach((block) => {
      const blockElement = document.createElement("div");
      blockElement.className = "block-item fade-in";
      blockElement.innerHTML = `
        <div class="block-icon">${block.icon}</div>
        <h3>${block.title}</h3>
        <p>${block.content}</p>
      `;
      homeBlocks.appendChild(blockElement);
    });
  }

  // Render How to Play section
  renderHowToPlay(content);

  // Load Additional Sections
  if (content.additionalSections) {
    content.additionalSections.forEach((section) => {
      const sectionElement = document.getElementById(section.id);
      if (sectionElement) {
        const container = sectionElement.querySelector(".container");
        container.innerHTML = `
                    <div class="feature-content fade-in">
                        <div class="feature-text">
                            <h2 class="section-title">${section.title}</h2>
                            <h3 class="section-subtitle">${
                              section.subtitle
                            }</h3>
                            <p>${section.content}</p>
                            <ul class="feature-list">
                                ${section.features
                                  .map((feature) => `<li>${feature}</li>`)
                                  .join("")}
                            </ul>
                        </div>
                        <div class="feature-image">
                            <img src="${section.image}" alt="${section.title}">
                        </div>
                    </div>
                `;
      }
    });
  }

  // News Grid Content
  const newsGrid = document.querySelector(".news-grid");
  if (newsGrid && content.news) {
    content.news.forEach((news) => {
      const newsElement = document.createElement("article");
      newsElement.className = "news-card fade-in";
      newsElement.innerHTML = `
                <img src="${news.image}" alt="${news.title}" class="news-image">
                <div class="news-content">
                    <h3>${news.title}</h3>
                    <time datetime="${news.date}">${new Date(
        news.date
      ).toLocaleDateString()}</time>
                    <p>${news.content}</p>
                </div>
            `;
      newsGrid.appendChild(newsElement);
    });
  }

  // Contact Page Content
  const contactInfo = document.querySelector(".contact-info");
  if (contactInfo && content.contact) {
    contactInfo.innerHTML = `
            <div class="contact-details fade-in">
                <p><strong>Address:</strong> ${content.contact.address}</p>
                <p><strong>Phone:</strong> ${content.contact.phone}</p>
                <p><strong>Email:</strong> ${content.contact.email}</p>
            </div>
        `;

    const mapContainer = document.querySelector(".map-container");
    if (mapContainer) {
      mapContainer.innerHTML = `
            <iframe
                src="${content.contact.mapEmbed}"
                style="border:0; width:100%; height:100%;"
                allowfullscreen=""
                loading="lazy"
                title="Mario & Sonic Adventures Office Location Map"
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        `;
    }
  }
});

// Form Validation
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('[name="name"]').value;
    const email = contactForm.querySelector('[name="email"]').value;
    const message = contactForm.querySelector('[name="message"]').value;

    if (!name || !email || !message) {
      alert("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Here you would typically send the form data to a server
    console.log("Form submitted:", { name, email, message });
    alert("Thank you for your message! We will get back to you soon.");
    contactForm.reset();
  });
}

// Email Validation Helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Mobile Menu Functionality
const initMobileMenu = () => {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navList = document.querySelector(".nav-list");
  const header = document.querySelector(".header");
  let isMenuOpen = false;

  // Create menu icon
  const menuIcon = `
        <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    `;

  // Create close icon
  const closeIcon = `
        <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;

  // Set initial menu icon if button exists
  if (mobileMenuBtn) {
    mobileMenuBtn.innerHTML = menuIcon;
  }

  const toggleMenu = () => {
    if (!mobileMenuBtn || !navList || !header) return;

    isMenuOpen = !isMenuOpen;
    navList.classList.toggle("active");
    header.classList.toggle("menu-open");
    mobileMenuBtn.innerHTML = isMenuOpen ? closeIcon : menuIcon;

    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    // Add animation class
    if (isMenuOpen) {
      navList.classList.add("slide-in");
    } else {
      navList.classList.remove("slide-in");
    }
  };

  // Handle menu button click
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Close menu when clicking on a link
  if (navList) {
    navList.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (isMenuOpen) {
          toggleMenu();
        }
      });
    });
  }

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      isMenuOpen &&
      navList &&
      !navList.contains(e.target) &&
      mobileMenuBtn &&
      !mobileMenuBtn.contains(e.target)
    ) {
      toggleMenu();
    }
  });

  // Handle resize events
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        toggleMenu();
      }
    }, 250);
  });
};
