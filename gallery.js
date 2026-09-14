/* ============================================================
   VR CODE CITY — Gallery Page Interactivity
   Lightbox, character guide, GSAP scroll reveals, keyboard nav
   ============================================================ */

(function () {
  'use strict';

  // ---- GALLERY DATA ----
  // Each image has a src, caption, and a character comment
  const galleryItems = document.querySelectorAll('#image-gallery .gallery-card');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const guideBubble = document.getElementById('guide-bubble');
  const guideCharacter = document.getElementById('guide-character');

  let currentIndex = 0;
  let isLightboxOpen = false;

  // ---- TOGGLE LOGIC ----
  const btnShowImages = document.getElementById('btn-show-images');
  const btnShowVideos = document.getElementById('btn-show-videos');
  const imageGallery = document.getElementById('image-gallery');
  const videoGallery = document.getElementById('video-gallery');
  const galleryHeading = document.getElementById('gallery-heading');
  const galleryCount = document.getElementById('gallery-count');

  if (btnShowImages && btnShowVideos) {
    btnShowImages.addEventListener('click', function() {
      btnShowImages.classList.add('is-active');
      btnShowVideos.classList.remove('is-active');
      imageGallery.style.display = 'grid';
      videoGallery.style.display = 'none';
      if (galleryHeading) galleryHeading.textContent = 'La Ciudad en Imágenes';
      if (galleryCount) galleryCount.textContent = '08 capturas';
    });

    btnShowVideos.addEventListener('click', function() {
      btnShowVideos.classList.add('is-active');
      btnShowImages.classList.remove('is-active');
      videoGallery.style.display = 'grid';
      imageGallery.style.display = 'none';
      if (galleryHeading) galleryHeading.textContent = 'La Ciudad en Vídeos';
      if (galleryCount) galleryCount.textContent = '01 vídeo';
    });
  }

  // ---- CHARACTER GUIDE COMMENTS ----
  const characterComments = [
    '¡Esta es la vista general de mi ciudad! Cada edificio es un archivo.',
    'El modo Rayos X revela la actividad de commits con un heatmap.',
    '¡Mira cómo se ven los distritos! Cada carpeta es un barrio.',
    'The Oracle analiza el código que estás mirando en tiempo real.',
    'Sesión multijugador: ¡mis amigos también recorren la ciudad!',
    'El panel de control permite cargar cualquier repositorio de GitHub.',
    'Vista aérea de la metrópolis digital. ¡Impresionante, ¿eh?!',
    'Los edificios más altos tienen más líneas de código. ¡Cuidado con los rascacielos!'
  ];

  // ---- LIGHTBOX LOGIC ----
  function openLightbox(index) {
    if (!lightbox) return;
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    isLightboxOpen = true;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
    isLightboxOpen = false;
  }

  function updateLightboxContent() {
    const card = galleryItems[currentIndex];
    if (!card) return;

    const img = card.querySelector('.gallery-card__image');
    const captionEl = card.querySelector('.gallery-card__caption');

    if (lightboxImage && img) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
    }
    if (lightboxCaption && captionEl) {
      lightboxCaption.textContent = captionEl.textContent;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryItems.length;
    }

    // Update character comment
    updateGuideComment(currentIndex);
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightboxContent();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent();
  }

  // Bind lightbox events
  galleryItems.forEach(function (card, index) {
    card.addEventListener('click', function () {
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', nextImage);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', prevImage);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!isLightboxOpen) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
    }
  });


  // ---- CHARACTER GUIDE ----
  function updateGuideComment(index) {
    if (!guideBubble) return;

    const comment = characterComments[index % characterComments.length];

    // Animate out
    guideBubble.classList.remove('is-visible');

    setTimeout(function () {
      guideBubble.textContent = comment;
      guideBubble.classList.add('is-visible');
    }, 300);
  }

  // Show initial comment
  setTimeout(function () {
    if (guideBubble) {
      guideBubble.textContent = '¡Bienvenido a mi galería! Haz clic en cualquier imagen para verla en grande.';
      guideBubble.classList.add('is-visible');
    }
  }, 1200);

  // Toggle bubble on character click
  if (guideCharacter) {
    guideCharacter.addEventListener('click', function () {
      guideBubble.classList.toggle('is-visible');
    });
  }

  // Auto-hide initial bubble after 6 seconds
  setTimeout(function () {
    if (guideBubble && !isLightboxOpen) {
      guideBubble.classList.remove('is-visible');
    }
  }, 7200);


  // ---- GSAP SCROLL ANIMATIONS ----
  function initGalleryGSAP() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero entry
    const heroTl = gsap.timeline();
    heroTl.fromTo('.gallery-hero__tag',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    )
      .fromTo('.gallery-hero__title',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out' },
        '-=0.3'
      )
      .fromTo('.gallery-hero__subtitle',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo('.gallery-hero__back',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo('.gallery-hero__character',
        { x: 60, opacity: 0, rotation: 5 },
        { x: 0, opacity: 1, rotation: 0, duration: 1, ease: 'back.out(1.4)' },
        '-=0.8'
      );

    // Gallery cards staggered reveal
    const cards = document.querySelectorAll('.gallery-card');
    if (cards.length > 0) {
      gsap.fromTo(cards,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Guide character entrance
    gsap.fromTo('.gallery-guide',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1.5 }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryGSAP);
  } else {
    initGalleryGSAP();
  }


  // ---- KINETIC MENU (Duplicated for gallery page) ----
  const kineticMenuOpen = document.getElementById('kinetic-menu-open');
  const kineticMenuClose = document.getElementById('kinetic-menu-close');
  const kineticMenu = document.getElementById('kinetic-menu');
  const kineticMenuInner = document.getElementById('kinetic-menu-inner');
  const kineticMenuItems = document.querySelectorAll('.kinetic-menu__item');

  if (kineticMenu && kineticMenuOpen && kineticMenuClose) {
    let targetY = 0;
    let currentY = 0;
    let targetSkew = 0;
    let currentSkew = 0;
    let isMenuOpen = false;

    kineticMenuOpen.addEventListener('click', () => {
      kineticMenu.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      isMenuOpen = true;

      gsap.fromTo(kineticMenuItems,
        { y: 100, opacity: 0, rotateX: 45 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.05, ease: 'power3.out', delay: 0.4 }
      );
    });

    const closeMenu = () => {
      kineticMenu.classList.remove('is-active');
      document.body.style.overflow = '';
      isMenuOpen = false;
    };

    kineticMenuClose.addEventListener('click', closeMenu);
    kineticMenuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Don't prevent default for links to other pages
        const href = item.getAttribute('href');
        if (href && !href.startsWith('#')) {
          // Let the browser navigate
          closeMenu();
          return;
        }
        closeMenu();
      });
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMenuOpen || !kineticMenuInner) return;
      const windowHeight = window.innerHeight;
      const progress = e.clientY / windowHeight;
      const menuHeight = kineticMenuInner.getBoundingClientRect().height;
      const maxScroll = Math.max(0, menuHeight - windowHeight + 300);
      targetY = -(progress * maxScroll - (maxScroll / 2));
      targetSkew = (currentY - targetY) * 0.15;
      targetSkew = Math.max(-12, Math.min(12, targetSkew));
    });

    const renderKineticMenu = () => {
      if (isMenuOpen && kineticMenuInner) {
        currentY += (targetY - currentY) * 0.08;
        currentSkew += (targetSkew - currentSkew) * 0.08;
        targetSkew *= 0.9;
        gsap.set(kineticMenuInner, { y: currentY, skewY: currentSkew });
      }
      requestAnimationFrame(renderKineticMenu);
    };
    renderKineticMenu();
  }

})();
