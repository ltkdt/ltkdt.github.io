/**
 * Portfolio JavaScript - Trung Kien Le (ltkdt)
 * Features:
 * - Dynamic tab switching with history & deep-linking support
 * - Dark / Light theme toggle with persistence in localStorage
 * - Interactive Lightbox Modal for gallery and awards
 * - Category filter pills for gallery and awards
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Determine initial theme: saved in localStorage or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // Listen for system changes if user hasn't set an explicit preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });


  // --------------------------------------------------------------------------
  // 2. Tab Navigation & Hash Routing
  // --------------------------------------------------------------------------
  const headerTabs = document.querySelectorAll('.nav-tab');
  const mobileTabs = document.querySelectorAll('.mobile-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const tabNavTriggers = document.querySelectorAll('[data-tab-nav]');

  const validTabs = ['home', 'resume', 'gallery', 'awards'];

  function switchTab(tabId, updateHash = true) {
    if (!validTabs.includes(tabId)) {
      tabId = 'home';
    }

    // Update Desktop Header Tabs
    headerTabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === tabId) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // Update Mobile Tabs
    mobileTabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === tabId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update Tab Content Panes
    tabPanes.forEach(pane => {
      if (pane.id === `tab-${tabId}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Update URL hash
    if (updateHash) {
      if (history.pushState) {
        history.pushState(null, null, `#${tabId}`);
      } else {
        window.location.hash = `#${tabId}`;
      }
    }

    // Scroll smoothly to top on tab switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Header Desktop Tabs Click
  headerTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      switchTab(target);
    });
  });

  // Mobile Tabs Click
  mobileTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      switchTab(target);
    });
  });

  // Quick Action Buttons (e.g. from Hero or Branding)
  tabNavTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-tab-nav');
      switchTab(target);
    });
  });

  // Handle URL hash changes & initial page load with hash
  function handleHash() {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (validTabs.includes(hash)) {
      switchTab(hash, false);
    } else {
      switchTab('home', false);
    }
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();


  // --------------------------------------------------------------------------
  // 3. Lightbox Modal for Gallery & Awards
  // --------------------------------------------------------------------------
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');

  const photoCards = document.querySelectorAll('.photo-card');

  function openLightbox(src, caption, desc) {
    if (!lightboxModal) return;
    lightboxImg.src = src;
    lightboxTitle.textContent = caption || '';
    lightboxDesc.textContent = desc || '';
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  photoCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-src') || card.querySelector('img')?.src;
      const caption = card.getAttribute('data-caption') || card.querySelector('.overlay-title')?.textContent;
      const desc = card.getAttribute('data-desc') || card.querySelector('.overlay-sub')?.textContent;
      if (src) {
        openLightbox(src, caption, desc);
      }
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });


  // --------------------------------------------------------------------------
  // 4. Interactive Showcase Filter Pills
  // --------------------------------------------------------------------------
  document.querySelectorAll('.showcase-container').forEach(container => {
    const filters = container.querySelectorAll('.filter-pill');
    const cards = container.querySelectorAll('.photo-card');

    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const filterText = filter.textContent.trim().toLowerCase();
        
        cards.forEach(card => {
          if (filterText.includes('all')) {
            card.style.display = '';
          } else {
            const cardCaption = (card.getAttribute('data-caption') || '').toLowerCase();
            const cardDesc = (card.getAttribute('data-desc') || '').toLowerCase();
            const badge = (card.querySelector('.overlay-badge')?.textContent || '').toLowerCase();
            const title = (card.querySelector('.overlay-title')?.textContent || '').toLowerCase();

            const combined = `${cardCaption} ${cardDesc} ${badge} ${title}`;
            if (combined.includes(filterText)) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    });
  });
});
