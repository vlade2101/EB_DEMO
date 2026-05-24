(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.querySelector(".nav-panel");
  const navClose = document.querySelector(".nav-close");
  const dropdownToggles = document.querySelectorAll("[data-dropdown-toggle]");
  const heroSlides = document.querySelectorAll(".hero__slide");
  const heroPrev = document.querySelector(".hero__arrow--prev");
  const heroNext = document.querySelector(".hero__arrow--next");
  const backToTop = document.querySelector(".back-to-top");
  const cookieBanner = document.querySelector(".cookie-banner");
  const cookieAccept = document.querySelector(".cookie-accept");
  const cookieReject = document.querySelector(".cookie-reject");
  const COOKIE_KEY = "eb-cookie-choice";

  let heroIndex = 0;
  let heroTimer;

  /* Header: transparent → solid on scroll */
  function updateHeader() {
    if (!header) return;
    header.classList.toggle("site-header--scrolled", window.scrollY > 60);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* Mobile navigation */
  function openNav() {
    navPanel?.classList.add("is-open");
    navToggle?.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }

  function closeNav() {
    navPanel?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  navToggle?.addEventListener("click", openNav);
  navClose?.addEventListener("click", closeNav);

  navPanel?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992) closeNav();
    });
  });

  /* Dropdown (mobile accordion + desktop hover handled in CSS) */
  dropdownToggles.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (window.innerWidth >= 992) return;
      e.preventDefault();
      const parent = btn.closest(".nav-item--has-dropdown");
      const isOpen = parent?.classList.contains("is-open");
      document.querySelectorAll(".nav-item--has-dropdown.is-open").forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
      });
      if (!isOpen && parent) {
        parent.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* Hero slider */
  function showHeroSlide(index) {
    if (!heroSlides.length) return;
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === heroIndex);
    });
  }

  function startHeroAutoplay() {
    clearInterval(heroTimer);
    if (heroSlides.length > 1) {
      heroTimer = setInterval(() => showHeroSlide(heroIndex + 1), 6000);
    }
  }

  heroPrev?.addEventListener("click", () => {
    showHeroSlide(heroIndex - 1);
    startHeroAutoplay();
  });

  heroNext?.addEventListener("click", () => {
    showHeroSlide(heroIndex + 1);
    startHeroAutoplay();
  });

  if (heroSlides.length) {
    showHeroSlide(0);
    startHeroAutoplay();
  }

  /* Back to top */
  window.addEventListener(
    "scroll",
    () => {
      if (!backToTop) return;
      backToTop.classList.toggle("is-visible", window.scrollY > 400);
    },
    { passive: true }
  );

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* Cookie banner */
  function hideCookieBanner(choice) {
    localStorage.setItem(COOKIE_KEY, choice);
    if (cookieBanner) cookieBanner.hidden = true;
  }

  if (cookieBanner && !localStorage.getItem(COOKIE_KEY)) {
    cookieBanner.hidden = false;
  }

  cookieAccept?.addEventListener("click", () => hideCookieBanner("accepted"));
  cookieReject?.addEventListener("click", () => hideCookieBanner("rejected"));

  /* Count-up statistike */
  const statNumbers = document.querySelectorAll(".stat__number[data-count]");

  function animateCount(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 2200;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (statNumbers.length && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.dataset.animated) return;
          el.dataset.animated = "true";
          animateCount(el);
          statsObserver.unobserve(el);
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -40px 0px" }
    );

    statNumbers.forEach((el) => statsObserver.observe(el));
  } else {
    statNumbers.forEach((el) => {
      el.textContent = el.dataset.count + (el.dataset.suffix || "");
    });
  }

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
