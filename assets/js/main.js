(function () {
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const navCollapse = document.querySelector(".navbar-collapse");
  const sections = document.querySelectorAll("main section[id]");
  const backToTop = document.querySelector(".back-to-top");
  const portfolioSlider = document.querySelector(".portfolio-slider");
  const portfolioFilterButtons = document.querySelectorAll(".portfolio-tabs button");
  const deviceButtons = document.querySelectorAll(".device-tabs button");

  document
    .querySelectorAll(
      [
        "main section:not(.hero-section) .eyebrow",
        "main section:not(.hero-section) .section-title",
        "main section:not(.hero-section) .muted",
        ".stat-item",
        ".industry-grid > div",
        ".cta-banner",
        ".service-card",
        ".client-logo-card",
        ".project-card",
        ".accordion-item",
        ".contact-form",
        ".contact-card",
        ".footer-about",
        ".footer-links",
        ".footer-contact-social",
        ".footer-bottom"
      ].join(", ")
    )
    .forEach((item, index) => {
      if (!item.classList.contains("reveal") && !item.closest(".hero-section")) {
        item.classList.add("reveal");
        item.style.transitionDelay = `${Math.min(index % 4, 3) * 0.08}s`;
      }
    });

  const revealItems = document.querySelectorAll(".reveal");

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  function updateBackToTop() {
    if (backToTop) {
      backToTop.classList.toggle("is-visible", window.scrollY > 420);
    }
  }

  updateHeader();
  updateBackToTop();
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("scroll", updateBackToTop, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  let portfolioSwiper = null;

  if (portfolioSlider && window.Swiper) {
    portfolioSwiper = new window.Swiper(portfolioSlider, {
      loop: false,
      spaceBetween: 24,
      speed: 650,
      grabCursor: true,
      autoplay: {
        delay: 3200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      keyboard: {
        enabled: true
      },
      pagination: {
        el: ".portfolio-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".portfolio-next",
        prevEl: ".portfolio-prev"
      },
      breakpoints: {
        0: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 2
        },
        1200: {
          slidesPerView: 3
        }
      }
    });
  }

  function refreshPortfolioSlider() {
    if (portfolioSwiper) {
      portfolioSwiper.update();
      portfolioSwiper.slideTo(0);
    }
  }

  portfolioFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      portfolioFilterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      document.querySelectorAll(".portfolio-slider .swiper-slide").forEach((slide) => {
        const shouldShow = filter === "all" || slide.dataset.category === filter;
        slide.classList.toggle("is-filtered", !shouldShow);
      });

      refreshPortfolioSlider();
    });
  });

  deviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const device = button.dataset.device || "desktop";

      deviceButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      if (portfolioSlider) {
        portfolioSlider.classList.remove("preview-desktop", "preview-tablet", "preview-mobile");
        portfolioSlider.classList.add(`preview-${device}`);
      }
    });
  });

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        return;
      }

      const projectUrl = card.dataset.projectUrl;
      if (projectUrl) {
        window.location.href = projectUrl;
      }
    });
  });

  function updateActiveLink() {
    let current = "home";

    sections.forEach((section) => {
      const top = section.offsetTop - 140;
      if (window.scrollY >= top) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");

      if (navCollapse && navCollapse.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  if (!window.bootstrap) {
    document.querySelectorAll("[data-bs-toggle='collapse']").forEach((button) => {
      const target = document.querySelector(button.getAttribute("data-bs-target"));
      const parent = button.closest(".accordion");

      button.addEventListener("click", () => {
        const isOpen = target.classList.contains("show");

        if (parent) {
          parent.querySelectorAll(".accordion-collapse.show").forEach((panel) => {
            panel.classList.remove("show");
            const trigger = parent.querySelector(`[data-bs-target="#${panel.id}"]`);
            if (trigger) {
              trigger.classList.add("collapsed");
              trigger.setAttribute("aria-expanded", "false");
            }
          });
        }

        target.classList.toggle("show", !isOpen);
        button.classList.toggle("collapsed", isOpen);
        button.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  });
})();
