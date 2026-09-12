const featuredLifeLinkScreens = [
  { file: 'lifelink.png', title: 'Welcome' },
  { file: 'lifelink-home.png', title: 'Home' },
  { file: 'lifelink-sos.png', title: 'SOS request' },
  { file: 'lifelink-tracking.png', title: 'Tracking' },
  { file: 'lifelink-ai.png', title: 'AI assistant' },
  { file: 'lifelink-donation.png', title: 'Donation' },
];

const allLifeLinkScreens = [
  { file: 'lifelink.png', title: 'Welcome' },
  { file: 'lifelink-home.png', title: 'Home' },
  { file: 'lifelink-sos.png', title: 'SOS request' },
  { file: 'lifelink-tracking.png', title: 'Tracking' },
  { file: 'lifelink-ai.png', title: 'AI assistant' },
  { file: 'lifelink-donation.png', title: 'Donation' },
  { file: 'lifelink-statistics.png', title: 'Statistics' },
  { file: 'lifelink-statistics2.png', title: 'Statistics overview' },
  { file: 'lifelink-liveconversation.png', title: 'Live conversation' },
];

document.querySelectorAll('[data-lifelink-gallery]').forEach((gallery) => {
  const screens = gallery.dataset.galleryMode === 'full' ? allLifeLinkScreens : featuredLifeLinkScreens;
  screens.forEach((screen, index) => {
    const card = document.createElement('figure');
    card.className = 'screen-card';
    card.innerHTML = `<div class="screen-frame"><img src="assets/images/${screen.file}" alt="LifeLink ${screen.title} screen"><div class="screen-placeholder"><span aria-hidden="true">+</span><strong>LifeLink</strong><small>${screen.title}<br>Screenshot placeholder</small></div></div><figcaption>${String(index + 1).padStart(2, '0')} / ${screen.title}</figcaption>`;
    const img = card.querySelector('img');
    const update = () => {
      const loaded = img.complete && img.naturalWidth > 0;
      img.parentElement.classList.toggle('has-image', loaded);
      img.hidden = !loaded;
    };
    img.addEventListener('load', update);
    img.addEventListener('error', update);
    update();
    gallery.append(card);
  });
});

const viewport = document.querySelector('.screenshot-window');
if (viewport) {
  const pause = document.querySelector('.gallery-pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let hovering = false;
  let touching = false;
  let direction = 1;
  let previous = 0;
  let resumeAt = 0;
  let position = viewport.scrollLeft;
  const updateButton = () => {
    pause.textContent = paused ? 'Play motion' : 'Pause motion';
    pause.setAttribute('aria-pressed', String(paused));
  };
  pause.addEventListener('click', () => { paused = !paused; updateButton(); });
  reducedMotion.addEventListener('change', (event) => { paused = event.matches; updateButton(); });
  viewport.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') hovering = true; });
  viewport.addEventListener('pointerleave', () => { hovering = false; });
  viewport.addEventListener('pointerdown', () => { touching = true; });
  window.addEventListener('pointerup', () => { touching = false; resumeAt = performance.now() + 2000; });
  window.addEventListener('pointercancel', () => { touching = false; });
  viewport.addEventListener('wheel', () => { resumeAt = performance.now() + 2000; }, { passive: true });
  function animate(now) {
    const elapsed = previous ? Math.min(now - previous, 50) : 0;
    previous = now;
    if (!paused && !hovering && !touching && !viewport.matches(':focus-within') && !document.hidden && now > resumeAt) {
      const max = viewport.scrollWidth - viewport.clientWidth;
      if (max > 0) {
        position = Math.max(0, Math.min(max, position + direction * elapsed * 0.025));
        viewport.scrollLeft = position;
        if (viewport.scrollLeft >= max - 1) direction = -1;
        else if (viewport.scrollLeft <= 0) direction = 1;
      }
    } else {
      position = viewport.scrollLeft;
    }
    requestAnimationFrame(animate);
  }
  updateButton();
  requestAnimationFrame(animate);
}
