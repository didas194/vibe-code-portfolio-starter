// =========================================================
// Portfolio scripts
// =========================================================

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Dark mode toggle (remembers your choice)
const toggle = document.getElementById("theme-toggle");
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  toggle.textContent = theme === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("theme", theme); } catch (e) {}
}

let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(saved || (prefersDark ? "dark" : "light"));

toggle.addEventListener("click", () => {
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// Rotate the decorative landmark photos, with a pause control and reduced-motion default.
const landmarkSlides = Array.from(document.querySelectorAll(".landmark-slide"));
const slideshowToggle = document.getElementById("slideshow-toggle");

if (landmarkSlides.length > 1 && slideshowToggle) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeSlide = landmarkSlides.findIndex((slide) => slide.classList.contains("is-active"));
  let slideshowPaused = prefersReducedMotion;
  let slideshowTimer = null;

  if (activeSlide < 0) activeSlide = 0;

  function updateSlideshowControl() {
    slideshowToggle.setAttribute("aria-pressed", String(slideshowPaused));
    slideshowToggle.setAttribute("aria-label", slideshowPaused ? "Resume landmark slideshow" : "Pause landmark slideshow");
    slideshowToggle.title = slideshowPaused ? "Resume landmark slideshow" : "Pause landmark slideshow";
    slideshowToggle.textContent = slideshowPaused ? "▶" : "Ⅱ";
  }

  function showNextLandmark() {
    landmarkSlides[activeSlide].classList.remove("is-active");
    activeSlide = (activeSlide + 1) % landmarkSlides.length;
    landmarkSlides[activeSlide].classList.add("is-active");
  }

  function stopSlideshow() {
    if (slideshowTimer !== null) {
      window.clearInterval(slideshowTimer);
      slideshowTimer = null;
    }
  }

  function startSlideshow() {
    if (!slideshowPaused && !document.hidden && slideshowTimer === null) {
      slideshowTimer = window.setInterval(showNextLandmark, 7000);
    }
  }

  slideshowToggle.addEventListener("click", () => {
    slideshowPaused = !slideshowPaused;
    updateSlideshowControl();
    stopSlideshow();
    startSlideshow();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSlideshow();
    else startSlideshow();
  });

  updateSlideshowControl();
  startSlideshow();
}

// Reveal content as it enters the viewport, without hiding content if motion is unavailable.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".hero-greeting, .hero-name, .hero-tagline, .hero-actions, .section-heading, .journal-page, .skills-list li, .project-card, #contact > p, .contact-links"
  );
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  root.classList.add("scroll-motion");
  revealTargets.forEach((target) => {
    target.setAttribute("data-reveal", "");
    revealObserver.observe(target);
  });
}
