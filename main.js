"use strict";

window.addEventListener("load", () => {
  setTimeout(() => {
    const pre = document.getElementById("preloader");
    pre.style.transition = "opacity .8s ease";
    pre.style.opacity = "0";
    setTimeout(() => { pre.style.display = "none"; initAll(); }, 850);
  }, 2200);
});

function initAll() {
  // Reset scroll to top on every fresh page load, clear any hash
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
  }
  window.scrollTo(0, 0);

  const tryInit = (fn) => { try { fn(); } catch(e) { console.error('Error in', fn.name, e); } };
  
  tryInit(initCursor);
  tryInit(initNav);
  tryInit(initReveal);
  tryInit(initHeroParticles);
  tryInit(initProductCanvas);
  tryInit(initParallax);
  tryInit(initCounters);
  tryInit(initForm);
  tryInit(initReviewsCarousel);
  tryInit(initProductScroll);
  tryInit(initVideoModal);
  tryInit(initFaq);
  tryInit(initFloatNav);
  tryInit(initScrollReveal);
}

/** ══════════════════════════════════════════════
 *  FLOATING SECTION NAV
 *  ══════════════════════════════════════════════ */
function initFloatNav() {
  const toggle = document.getElementById('float-nav-toggle');
  const menu   = document.getElementById('float-nav-menu');
  const items  = document.querySelectorAll('.float-nav-item');
  if (!toggle || !menu) return;

  // Toggle open/close
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    const openIcon  = toggle.querySelector('.float-nav-open');
    const closeIcon = toggle.querySelector('.float-nav-close');
    if (openIcon)  openIcon.style.display  = isOpen ? 'none'  : 'flex';
    if (closeIcon) closeIcon.style.display = isOpen ? 'flex'  : 'none';
  });

  // Close on item click
  items.forEach(item => {
    item.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      const openIcon  = toggle.querySelector('.float-nav-open');
      const closeIcon = toggle.querySelector('.float-nav-close');
      if (openIcon)  openIcon.style.display  = 'flex';
      if (closeIcon) closeIcon.style.display = 'none';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#float-nav')) {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      const openIcon  = toggle.querySelector('.float-nav-open');
      const closeIcon = toggle.querySelector('.float-nav-close');
      if (openIcon)  openIcon.style.display  = 'flex';
      if (closeIcon) closeIcon.style.display = 'none';
    }
  });

  // Highlight active section on scroll
  const sections = ['hero','about','product','video','reviews','faq','contact'];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        items.forEach(item => {
          item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

/** ══════════════════════════════════════════════
 *  FAQ ACCORDION
 *  ══════════════════════════════════════════════ */
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer   = btn.nextElementSibling;
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
}

/** ══════════════════════════════════════════════
 *  VIDEO MODAL
 *  ══════════════════════════════════════════════ */
function initVideoModal() {
  const modal    = document.getElementById('videoModal');
  const iframe   = document.getElementById('videoModalIframe');
  const closeBtn = document.getElementById('videoModalClose');
  const backdrop = document.getElementById('videoModalBackdrop');
  const playBtn  = document.getElementById('heroPlayBtn');
  const VIDEO_URL = 'https://www.youtube.com/embed/PsedNm9wKIQ?autoplay=1&rel=0&modestbranding=1';

  if (!modal || !playBtn) return;

  function openModal() {
    iframe.src = VIDEO_URL;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    iframe.src = '';  // stops the video
    document.body.style.overflow = '';
  }

  playBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ══ CURSOR ══ */
function initCursor() {
  const cur = document.getElementById("cursor");
  const fol = document.getElementById("cursor-follower");

  // On touch devices → hide the custom cursor entirely, no effect needed
  const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  if (isTouch) {
    if (cur) cur.style.display = "none";
    if (fol) fol.style.display = "none";
    return;
  }

  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
    cur.style.left = mx + "px"; cur.style.top = my + "px";
    fol.style.left = fx + "px"; fol.style.top = fy + "px";
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll("a,button,input,textarea,.product-card,.review-card").forEach(el => {
    el.addEventListener("mouseenter", () => {
      cur.style.width = "18px"; cur.style.height = "18px";
      fol.style.width = "54px"; fol.style.height = "54px";
    });
    el.addEventListener("mouseleave", () => {
      cur.style.width = "10px"; cur.style.height = "10px";
      fol.style.width = "36px"; fol.style.height = "36px";
    });
  });
}

/* ══ NAV ══ */
function initNav() {
  // Smooth scroll for all internal links (navbar removed, float-nav handles navigation)
  document.querySelectorAll("[data-nav],.mob-link,.nav-cta,.btn-primary,.btn-ghost,.footer-nav a,.float-nav-item,.float-logo").forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const t = document.querySelector(href);
        if (t) t.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ══ REVEAL ══ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal-up,.reveal-left,.reveal-right").forEach(el => obs.observe(el));
}

/* ══ HERO PARTICLES (subtle – no mouse follow, no 3D object) ══ */
function initHeroParticles() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Soft red + cream particles
  const count = 900;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const cols = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random()-0.5)*22;
    pos[i*3+1] = (Math.random()-0.5)*14;
    pos[i*3+2] = (Math.random()-0.5)*8;
    // Mix red and cream
    const isRed = Math.random() > 0.4;
    cols[i*3]   = isRed ? 0.78 + Math.random()*0.2 : 0.96;
    cols[i*3+1] = isRed ? 0.1  + Math.random()*0.1 : 0.93;
    cols[i*3+2] = isRed ? 0.1  + Math.random()*0.05: 0.88;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
  const mat = new THREE.PointsMaterial({ size: 0.028, vertexColors: true, transparent: true, opacity: 0.55 });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Subtle ambient light
  scene.add(new THREE.AmbientLight(0x200000, 2));
  const redLight = new THREE.PointLight(0xC82B2B, 3, 20);
  redLight.position.set(0, 0, 4);
  scene.add(redLight);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.003;
    particles.rotation.y += 0.0002;
    particles.rotation.x += 0.0001;
    // Gentle breathing brightness
    mat.opacity = 0.45 + Math.sin(t) * 0.1;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ══ PRODUCT CANVAS (floating shapes) ══ */
function initProductCanvas() {
  const canvas = document.getElementById("product-canvas");
  const section = document.getElementById("product");
  if (!canvas || !section || typeof THREE === "undefined") return;

  const W = section.offsetWidth, H = Math.max(section.offsetHeight, window.innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 100);
  camera.position.z = 6;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const shapes = [];
  const solidMat = new THREE.MeshStandardMaterial({ color: 0xC82B2B, metalness: 0.7, roughness: 0.2 });
  const wireMat  = new THREE.MeshStandardMaterial({ color: 0x8B1A1A, metalness: 0.5, roughness: 0.4, wireframe: true });
  const greenMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32, metalness: 0.6, roughness: 0.3 });

  const geos = [
    new THREE.OctahedronGeometry(0.5),
    new THREE.IcosahedronGeometry(0.4),
    new THREE.TetrahedronGeometry(0.5),
    new THREE.TorusGeometry(0.35, 0.12, 10, 40),
    new THREE.OctahedronGeometry(0.3),
    new THREE.IcosahedronGeometry(0.3),
  ];
  const mats = [solidMat, wireMat, greenMat, wireMat, solidMat, greenMat];

  geos.forEach((g, i) => {
    const m = new THREE.Mesh(g, mats[i]);
    m.position.set((Math.random()-0.5)*12, (Math.random()-0.5)*7, (Math.random()-0.5)*4-1);
    m.userData = { rx: (Math.random()-0.5)*0.012, ry: (Math.random()-0.5)*0.015, fs: Math.random()*0.5+0.3, fa: Math.random()*0.25+0.08, by: m.position.y };
    scene.add(m); shapes.push(m);
  });

  scene.add(new THREE.AmbientLight(0x100000, 3));
  const pl = new THREE.PointLight(0xC82B2B, 6, 20); pl.position.set(0,3,4); scene.add(pl);
  const pl2 = new THREE.PointLight(0x2E7D32, 3, 15); pl2.position.set(-4,-2,2); scene.add(pl2);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    shapes.forEach(s => {
      s.rotation.x += s.userData.rx;
      s.rotation.y += s.userData.ry;
      s.position.y = s.userData.by + Math.sin(t * s.userData.fs) * s.userData.fa;
    });
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    const nW = section.offsetWidth, nH = section.offsetHeight || window.innerHeight;
    camera.aspect = nW/nH; camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });
}

/* ══ PARALLAX ══ */
function initParallax() {
  const bg = document.querySelector(".parallax-bg");
  const sec = document.getElementById("parallax-div");
  if (!bg || !sec) return;
  window.addEventListener("scroll", () => {
    const rect = sec.getBoundingClientRect();
    bg.style.transform = `translateY(${rect.top * 0.28}px)`;
  }, { passive: true });
}

/* ══ COUNTERS ══ */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const isDecimal = target % 1 !== 0;
      const start = performance.now();
      (function update(now) {
        const p = Math.min((now - start) / 1800, 1);
        const ease = 1 - Math.pow(1-p, 3);
        el.textContent = isDecimal ? (ease*target).toFixed(1) : Math.round(ease*target).toLocaleString();
        if (p < 1) requestAnimationFrame(update);
      })(start);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-num[data-count]").forEach(n => obs.observe(n));
}

/* ══ FORM ══ */
function initForm() {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  const btn = document.getElementById("form-submit");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    btn.querySelector("span").textContent = "Invio in corso...";
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      success.classList.add("show");
      btn.querySelector("span").textContent = "Richiedi Informazioni";
      btn.disabled = false;
      setTimeout(() => success.classList.remove("show"), 5000);
    }, 1500);
  });
}

/* ══ REVIEWS CAROUSEL ══ */
function initReviewsCarousel() {
  const outer    = document.querySelector(".reviews-track-outer");
  const track    = document.getElementById("reviews-track");
  const dotsWrap = document.getElementById("carousel-dots");
  const btnPrev  = document.getElementById("rev-prev");
  const btnNext  = document.getElementById("rev-next");
  if (!outer || !track || !dotsWrap || !btnPrev || !btnNext) return;

  const cards = Array.from(track.children);
  const total = cards.length;
  let current = 0;

  function visibleCount() { return window.innerWidth >= 900 ? 3 : 1; }

  function pages() { return Math.ceil(total / visibleCount()); }
  function maxPage() { return pages() - 1; }

  function setCardSizes() {
    const vis  = visibleCount();
    const gap  = vis > 1 ? 16 : 0;
    const cardW = (outer.offsetWidth - gap * (vis - 1)) / vis;
    cards.forEach((c, i) => {
      c.style.width       = cardW + "px";
      c.style.flex        = "0 0 " + cardW + "px";
      c.style.marginRight = i < cards.length - 1 ? gap + "px" : "0";
    });
    return { cardW, gap };
  }

  function goTo(page) {
    page = Math.max(0, Math.min(page, maxPage()));
    current = page;
    const { cardW, gap } = setCardSizes();
    const vis = visibleCount();
    const offset = current * vis * (cardW + gap);
    track.style.transform = "translateX(-" + offset + "px)";

    btnPrev.disabled = current === 0;
    btnNext.disabled = current >= maxPage();
    dotsWrap.querySelectorAll(".carousel-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
  }

  function buildDots() {
    dotsWrap.innerHTML = "";
    for (let i = 0; i < pages(); i++) {
      const d = document.createElement("button");
      d.className = "carousel-dot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", "Pagina " + (i + 1));
      d.addEventListener("click", () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(d);
    }
  }

  function next() { if (current < maxPage()) goTo(current + 1); else goTo(0); }
  function prev() { goTo(current - 1); }

  btnNext.addEventListener("click", () => { next(); });
  btnPrev.addEventListener("click", () => { prev(); });

  let touchStartX = 0;
  track.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  window.addEventListener("resize", () => {
    buildDots();
    // clamp current page after resize
    current = Math.min(current, maxPage());
    goTo(current);
  });

  // Init after a frame so layout is painted
  requestAnimationFrame(() => {
    buildDots();
    goTo(0);
  });
}

/** ══════════════════════════════════════════════
/** ══════════════════════════════════════════════
 *  SCROLL REVEAL (WhatsApp & Float Nav)
 *  ══════════════════════════════════════════════ */
function initScrollReveal() {
  const waFloatBtn = document.getElementById("wa-float");
  const floatNavMenu = document.getElementById("float-nav");
  
  if (!waFloatBtn && !floatNavMenu) return;

  window.addEventListener("scroll", () => {
    // Cross-browser scroll position
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    // Show after scrolling a safe distance (e.g. 300px) past the Hero top
    const threshold = 300;
    
    if (scrollPos > threshold) {
      if (waFloatBtn) waFloatBtn.classList.add("show");
      if (floatNavMenu) floatNavMenu.classList.add("show");
    } else {
      if (waFloatBtn) waFloatBtn.classList.remove("show");
      if (floatNavMenu) floatNavMenu.classList.remove("show");
    }
  }, { passive: true });

  // Trigger once on load in case the user loads halfway down the page
  window.dispatchEvent(new Event('scroll'));
}

function initProductScroll() {
  const container = document.querySelector('.product-cards');
  const dots = document.querySelectorAll('.p-dot');
  if (!container || dots.length === 0) return;

  container.addEventListener('scroll', () => {
    const scrollLeft = container.scrollLeft;
    const width = container.offsetWidth;
    const index = Math.round(scrollLeft / (width * 0.8));
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  });
}


