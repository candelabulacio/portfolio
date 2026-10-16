// Interacciones del sitio. Todo funciona también sin JS (contenido visible),
// esto solo agrega navegación, carruseles y pestañas.

(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Encabezado: borde al hacer scroll ---------- */
  const header = $('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Índice desplegable (pantallas chicas) ---------- */
  const toggle = $('[data-nav-toggle]');
  const panel = $('[data-nav-panel]');
  if (toggle && panel) {
    const label = $('.nav__toggle-label', toggle);
    const compact = matchMedia('(max-width: 68rem)');
    const setOpen = (open, { focus = true } = {}) => {
      toggle.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      panel.inert = compact.matches && !open;
      label.textContent = open ? 'Cerrar' : 'Índice';
      if (open && focus) $('a', panel)?.focus();
      if (!open && focus) toggle.focus();
    };
    // En pantalla chica el panel cerrado no debe recibir foco
    const syncInert = () => {
      const closed = compact.matches && !panel.classList.contains('is-open');
      panel.inert = closed;
    };
    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      syncInert();
    });
    panel.addEventListener('click', (e) => {
      if (e.target.closest('a') && compact.matches) {
        setOpen(false, { focus: false });
        syncInert();
      }
    });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        setOpen(false);
        syncInert();
      }
    });
    compact.addEventListener('change', () => {
      if (!compact.matches) setOpen(false, { focus: false });
      syncInert();
    });
    syncInert();
  }

  /* ---------- Sección actual en la navegación ---------- */
  const links = $$('[data-nav-link]');
  // En páginas propias (Experiencia, Formación) la pestaña ya viene marcada: no se recalcula
  const enPagina = document.querySelector('.nav__link[aria-current="page"]');
  const sections = links.length && !enPagina ? $$('main section[id]') : [];
  if (sections.length) {
    const visible = new Map();
    const update = () => {
      let current = null;
      for (const s of sections) if (visible.get(s)) current = s.id;
      // al llegar al final de la página, marcar la última sección
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = sections.at(-1).id;
      links.forEach((a) =>
        a.dataset.navLink === current ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')
      );
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target, e.boundingClientRect.top < innerHeight * 0.4));
        update();
      },
      { rootMargin: '0px 0px -60% 0px', threshold: [0, 0.01] }
    );
    sections.forEach((s) => io.observe(s));
    addEventListener('scroll', () => {
      sections.forEach((s) => visible.set(s, s.getBoundingClientRect().top < innerHeight * 0.4));
      update();
    }, { passive: true });
  }

  /* ---------- Aparición de encabezados ---------- */
  const heads = $$('.section-head');
  if (heads.length && !reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }),
      { rootMargin: '0px 0px -10% 0px' }
    );
    heads.forEach((h) => {
      if (h.getBoundingClientRect().top > innerHeight) {
        h.classList.add('reveal');
        io.observe(h);
      }
    });
  }

  /* ---------- Experiencia: abrir / cerrar todas ---------- */
  const expandAll = $('[data-expand-all]');
  if (expandAll) {
    const all = $$('.timeline details');
    const sync = () => {
      const open = all.every((d) => d.open);
      expandAll.textContent = open ? 'Cerrar todas' : 'Abrir todas';
      expandAll.setAttribute('aria-pressed', String(open));
    };
    expandAll.addEventListener('click', () => {
      const open = !all.every((d) => d.open);
      all.forEach((d) => (d.open = open));
      sync();
    });
    all.forEach((d) => d.addEventListener('toggle', sync));
    sync();
  }

  /* ---------- Estanterías horizontales (proyectos y galerías) ---------- */
  $$('[data-shelf]').forEach((shelf) => {
    const track = $('[data-shelf-track]', shelf);
    const prev = $('[data-shelf-prev]', shelf);
    const next = $('[data-shelf-next]', shelf);
    const pos = $('[data-shelf-pos]', shelf);
    if (!track) return;
    const all = [...track.children];
    let cards = all;

    const step = () => {
      const first = cards[0];
      if (!first) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const per = Math.max(1, Math.floor((track.clientWidth - 2 * parseFloat(getComputedStyle(track).paddingLeft) + gap) / (first.offsetWidth + gap)));
      return per * (first.offsetWidth + gap);
    };

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const overflow = max > 2;
      shelf.classList.toggle('has-overflow', overflow);
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      if (pos) {
        if (!overflow) return (pos.textContent = '');
        const box = track.getBoundingClientRect();
        const inView = cards
          .map((c, i) => [c.getBoundingClientRect(), i])
          .filter(([r]) => r.left >= box.left - 2 && r.right <= box.right + 2)
          .map(([, i]) => i + 1);
        if (inView.length) {
          const a = inView[0], b = inView.at(-1);
          pos.textContent = `${a === b ? a : `${a}–${b}`} de ${cards.length}`;
        }
      }
    };

    const go = (dir) => track.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));

    let raf;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }, { passive: true });
    addEventListener('resize', update);
    // Las tarjetas que reciben foco con teclado se acomodan a la vista
    track.addEventListener('focusin', (e) => e.target.closest('li')?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }));
    // Filtros por categoría (si la estantería los tiene)
    const filters = $('[data-filters]', shelf);
    if (filters) {
      filters.hidden = false;
      const btns = $$('[data-cat]', filters);
      btns.forEach((btn) =>
        btn.addEventListener('click', () => {
          const cat = btn.dataset.cat;
          btns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
          all.forEach((li) => (li.hidden = Boolean(cat) && li.dataset.cat !== cat));
          cards = all.filter((li) => !li.hidden);
          track.scrollLeft = 0;
          update();
        })
      );
    }

    update();
  });

  /* ---------- Proyectos: cinta que avanza de derecha a izquierda + filtros ---------- */
  $$('[data-marquee]').forEach((marquee) => {
    const track = $('[data-filter-list]', marquee);
    const originals = [...track.children];
    const filters = $('[data-filters]', marquee.closest('section'));

    // Duplica las tarjetas visibles para que la cinta no tenga cortes.
    // Las copias no las leen los lectores de pantalla ni reciben foco con Tab.
    const build = () => {
      $$('[data-clone]', track).forEach((n) => n.remove());
      track.classList.remove('is-moving');
      const visibles = originals.filter((li) => !li.hidden);
      if (!visibles.length || reduceMotion) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const largo = visibles.reduce((w, li) => w + li.offsetWidth + gap, 0);
      let total = largo;
      while (total < marquee.clientWidth + largo) {
        visibles.forEach((li) => {
          const c = li.cloneNode(true);
          c.dataset.clone = '';
          c.setAttribute('aria-hidden', 'true');
          // se pueden clickear con el mouse, pero no entran en el recorrido con Tab
          $$('a, button', c).forEach((el) => el.setAttribute('tabindex', '-1'));
          track.append(c);
        });
        total += largo;
      }
      track.style.setProperty('--recorrido', `-${largo}px`);
      track.style.setProperty('--duracion', `${Math.max(visibles.length, 3) * 7}s`);
      void track.offsetWidth; // reinicia la animación
      track.classList.add('is-moving');
    };

    if (filters) {
      filters.hidden = false;
      const btns = $$('[data-cat]', filters);
      btns.forEach((btn) =>
        btn.addEventListener('click', () => {
          const cat = btn.dataset.cat;
          btns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
          originals.forEach((li) => (li.hidden = Boolean(cat) && li.dataset.cat !== cat));
          marquee.scrollLeft = 0;
          build();
        })
      );
    }

    let t;
    addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(build, 200);
    });
    document.fonts?.ready.then(build);
    build();
  });

  /* ---------- Pestañas de habilidades ---------- */
  $$('[data-tabs]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    list.hidden = false;

    const select = (i, focus = false) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };

    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        select((map[e.key] + tabs.length) % tabs.length, true);
      });
    });
    panels.forEach((p) => p.setAttribute('tabindex', '0'));
    select(0);
  });
})();
