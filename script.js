const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Theme Manager
(function initTheme() {
  function getPreferredTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const toggles = document.querySelectorAll(".theme-toggle");
    toggles.forEach((btn) => {
      btn.setAttribute("aria-checked", theme === "light" ? "true" : "false");
    });
  }

  applyTheme(getPreferredTheme());

  const bindEvents = () => {
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.onclick = function (e) {
        e.preventDefault();
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        const nextTheme = isLight ? "dark" : "light";
        applyTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
      };
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindEvents);
  } else {
    bindEvents();
  }
})();

if (window.lucide) {
  lucide.createIcons();
}

if (window.Lenis && !reducedMotion) {
  const lenis = new Lenis({ autoRaf: true, duration: 1.1 });
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -12 });
    });
  });
}

const progress = document.querySelector(".page-progress span");
if (progress) {
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

if (window.gsap && document.querySelector(".hero-title")) {
  const headline = document.querySelector(".hero-title");

  if (!reducedMotion && window.SplitType) {
    const split = new SplitType(headline, { types: "lines, words" });
    split.lines.forEach((line) => {
      line.style.overflow = "hidden";
      line.style.display = "block";
    });
    gsap.from(split.words, {
      yPercent: 110,
      duration: 0.9,
      stagger: 0.035,
      ease: "power3.out",
    });
  }

  gsap.from(".hero-lede, .hero-actions", {
    y: reducedMotion ? 0 : 18,
    opacity: 0,
    duration: 0.7,
    delay: reducedMotion ? 0 : 0.35,
    stagger: 0.08,
    ease: "power2.out",
  });

  gsap.from(".impact-card", {
    y: reducedMotion ? 0 : 22,
    opacity: 0,
    duration: 0.7,
    delay: reducedMotion ? 0 : 0.28,
    stagger: 0.08,
    ease: "power2.out",
  });

  document.querySelectorAll("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count);
    if (reducedMotion) {
      el.textContent = String(end);
      return;
    }
    const counter = { value: 0 };
    gsap.to(counter, {
      value: end,
      duration: 1.25,
      delay: 0.45,
      ease: "power2.out",
      onUpdate() {
        el.textContent = String(Math.round(counter.value));
      },
    });
  });
}

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".company-row, .think-section, .quest-headline, .home-contact h2").forEach((el) => {
    gsap.from(el, {
      y: reducedMotion ? 0 : 28,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });
}

const questViewport = document.querySelector(".quest-viewport");
if (questViewport && window.EmblaCarousel) {
  const embla = EmblaCarousel(questViewport, {
    loop: true,
    align: "center",
    skipSnaps: false,
  });
  const prev = document.getElementById("questPrev");
  const next = document.getElementById("questNext");
  if (prev) prev.addEventListener("click", () => embla.scrollPrev());
  if (next) next.addEventListener("click", () => embla.scrollNext());
}

const questWord = document.getElementById("questWord");
const openFeatureFromHash = () => {
  const id = window.location.hash.slice(1);
  const el = id ? document.getElementById(id) : null;
  if (el && el.matches("details.feature-dive")) {
    el.open = true;
  }
};
openFeatureFromHash();
window.addEventListener("hashchange", openFeatureFromHash);

const caseNav = document.querySelector(".case-nav");
if (caseNav) {
  const links = [...caseNav.querySelectorAll("a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const setActive = () => {
    let current = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top < 140) current = section;
    });
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
    });
  };
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();
}

if (questWord && !reducedMotion) {
  const words = ["light", "texture", "contrast", "composition"];
  let index = 0;
  setInterval(() => {
    questWord.classList.add("is-out");
    window.setTimeout(() => {
      index = (index + 1) % words.length;
      questWord.textContent = words[index];
      questWord.classList.remove("is-out");
    }, 380);
  }, 2800);
}
