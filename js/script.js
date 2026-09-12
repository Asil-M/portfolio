const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.site-nav a');
const header = document.querySelector('.site-header');
const themeToggle = document.querySelector('.theme-toggle');

function setTheme(theme, savePreference = true) {
  document.documentElement.dataset.theme = theme;
  if (savePreference) { try { localStorage.setItem('portfolio-theme', theme); } catch {} }
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
  themeToggle.setAttribute('title', `Switch to ${nextTheme} mode`);
}

setTheme(document.documentElement.dataset.theme, false);

themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

function setMenuState(isOpen) {
  body.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
}

menuToggle.addEventListener('click', () => {
  setMenuState(!body.classList.contains('menu-open'));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('img[data-fallback]').forEach((image) => {
  const showFallback = () => {
    image.closest('.project-visual, .about-photo').classList.remove('has-image');
  };

  image.addEventListener('load', () => {
    image.closest('.project-visual, .about-photo').classList.add('has-image');
  });
  image.addEventListener('error', showFallback);

  if (image.complete) image.closest('.project-visual, .about-photo').classList.toggle('has-image', image.naturalWidth > 0);
});

// Dismiss the compact mobile menu without locking page scrolling.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && body.classList.contains('menu-open')) {
    setMenuState(false);
    menuToggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) setMenuState(false);
});
header.addEventListener('focusout', () => {
  requestAnimationFrame(() => {
    if (!header.contains(document.activeElement)) setMenuState(false);
  });
});
window.matchMedia('(min-width: 851px)').addEventListener('change', (event) => {
  if (event.matches) setMenuState(false);
});

const copyEmailButton = document.querySelector('[data-copy-email]');
copyEmailButton?.addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText(copyEmailButton.dataset.copyEmail);
    status.textContent = 'Email address copied.';
  } catch {
    status.textContent = 'Select the email address above to copy it, or use Send an email.';
  }
});
