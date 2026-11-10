// Motion brought across from the base sites, rebuilt on Vellum's tokens.
//   1. Fade up on scroll       [data-reveal]   (333 South Wabash .reveal)
//   2. Smooth in-page links    a[href^="#"]    (Airloom menu and contact links)
//   3. Section name in the bar [data-label]    (Airloom header label)
//   4. Lamp line sweep         [data-sweep]    (Airloom feature rule sweep)
// With prefers-reduced-motion, 1 and 4 never hide or move anything, 2 jumps, and 3 swaps text without sliding.
// (?motion=on in the address overrides that for reviewing, see Base.astro.)

// Respect the reduce-motion setting, unless ?motion=on was added for reviewing (sets html.force-motion, see Base.astro).
const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
const reduce = {
  get matches() { return reduceQuery.matches && !document.documentElement.classList.contains('force-motion'); },
  addEventListener: (type: 'change', fn: () => void) => reduceQuery.addEventListener(type, fn),
};
const io = 'IntersectionObserver' in window;

/* 1. Fade up on scroll */
const reveals = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
if (io && !reduce.matches) {
  const seen = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        seen.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -5% 0px' },
  );
  for (const el of reveals) {
    // anything already on screen when the page opens stays put
    if (el.getBoundingClientRect().top < innerHeight) continue;
    el.classList.add('rv');
    seen.observe(el);
  }
}

/* 4. Lamp line sweep along hairline rules */
const sweeps = [...document.querySelectorAll<HTMLElement>('[data-sweep]')];
if (io && !reduce.matches) {
  const swept = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-swept');
        swept.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -15% 0px' },
  );
  for (const el of sweeps) {
    el.classList.add('sweep');
    swept.observe(el);
  }
}

reduce.addEventListener('change', () => {
  if (!reduce.matches) return;
  reveals.forEach((el) => el.classList.add('is-in'));
  sweeps.forEach((el) => el.classList.remove('sweep'));
});

/* 2. Smooth in-page links. The bar's height is kept clear by scroll-padding-top in the CSS. */
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
  if (!a || a.target) return;
  const url = new URL(a.href, location.href);
  if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname) return;
  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;
  e.preventDefault();

  const behavior: ScrollBehavior = reduce.matches ? 'auto' : 'smooth';
  if (target.id === 'top') scrollTo({ top: 0, behavior });
  else if (getComputedStyle(target).position === 'fixed') {
    // the contact footer sits fixed under the page on large screens: reveal it by scrolling to the end
    scrollTo({ top: document.documentElement.scrollHeight - innerHeight, behavior });
  } else target.scrollIntoView({ behavior, block: 'start' });

  if (location.hash !== url.hash) history.pushState(null, '', url.hash);
  // move keyboard and screen reader focus with the view
  if (!target.matches('a[href],button,input,select,textarea,[tabindex]')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
});

/* 3. Section name in the bar */
const bar = document.querySelector<HTMLElement>('.bar');
const label = bar?.querySelector<HTMLElement>('.bar-section span');
const sections = [...document.querySelectorAll<HTMLElement>('[data-label]')];
if (bar && label && sections.length) {
  let current = '';
  let lastY = scrollY;
  let queued = false;

  const show = (text: string, down: boolean) => {
    if (text === current) return;
    current = text;
    label.textContent = text;
    if (reduce.matches || !label.animate) return;
    label.animate(
      [
        { transform: `translateY(${down ? 100 : -100}%)`, opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 500, easing: 'cubic-bezier(.19,1,.22,1)' },
    );
  };

  const update = () => {
    queued = false;
    const b = bar.getBoundingClientRect();
    // in-page links stop scroll-padding-top below the top, so read sections at that same line
    const line = Math.max(b.bottom, parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 1;
    const docked = b.top <= (parseFloat(getComputedStyle(bar).top) || 0) + 1;
    let text = '';
    if (docked) {
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) text = s.dataset.label || '';
      }
    }
    show(text, scrollY >= lastY);
    lastY = scrollY;
  };

  addEventListener('scroll', () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  addEventListener('resize', update);
  update();
}
