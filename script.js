/* ============================================================
   VR CODE CITY — Interactivity
   Accordion, smooth scroll, video modal, nav scroll, mobile menu,
   and IntersectionObserver reveal animations.
   ============================================================ */

(function () {
  'use strict';

  // ---- DOM REFERENCES ----
  const kineticMenuOpen = document.getElementById('kinetic-menu-open');
  const kineticMenuClose = document.getElementById('kinetic-menu-close');
  const kineticMenu = document.getElementById('kinetic-menu');
  const kineticMenuInner = document.getElementById('kinetic-menu-inner');
  const kineticMenuItems = document.querySelectorAll('.kinetic-menu__item');
  const videoCards = document.querySelectorAll('.video-card');
  const videoModal = document.getElementById('video-modal');
  const videoModalClose = document.getElementById('video-modal-close');
  const videoModalContent = document.getElementById('video-modal-content');

  // ---- KINETIC MENU LOGIC ----
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

      // Animate items in
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
      item.addEventListener('click', closeMenu);
    });

    // Mouse movement to scroll and distort the menu
    window.addEventListener('mousemove', (e) => {
      if (!isMenuOpen || !kineticMenuInner) return;

      const windowHeight = window.innerHeight;
      // Normalizamos la posición del ratón de 0 a 1
      const progress = e.clientY / windowHeight;

      const menuHeight = kineticMenuInner.getBoundingClientRect().height;
      // Calculamos cuánto podemos hacer scroll
      const maxScroll = Math.max(0, menuHeight - windowHeight + 300);

      // Mapeamos el movimiento del ratón al scroll (-maxScroll/2 a maxScroll/2)
      targetY = - (progress * maxScroll - (maxScroll / 2));

      // La inclinación (skew) se basa en la velocidad simulada
      targetSkew = (currentY - targetY) * 0.15;
      targetSkew = Math.max(-12, Math.min(12, targetSkew));
    });

    // Bucle de animación (RequestAnimationFrame + GSAP)
    const renderKineticMenu = () => {
      if (isMenuOpen && kineticMenuInner) {
        // Interpolación lineal para movimiento suave (Lerp)
        currentY += (targetY - currentY) * 0.08;
        currentSkew += (targetSkew - currentSkew) * 0.08;

        targetSkew *= 0.9; // Fricción para que vuelva a 0

        gsap.set(kineticMenuInner, {
          y: currentY,
          skewY: currentSkew
        });
      }
      requestAnimationFrame(renderKineticMenu);
    };
    renderKineticMenu();
  }


  // ---- ACCORDION ----
  function initAccordions() {
    var accordions = document.querySelectorAll('.accordion');

    accordions.forEach(function (accordion) {
      var items = accordion.querySelectorAll('.accordion__item');

      items.forEach(function (item) {
        var header = item.querySelector('.accordion__header');
        var body = item.querySelector('.accordion__body');

        if (!header || !body) return;

        // Set initial state for pre-opened items
        if (item.classList.contains('accordion__item--open')) {
          var content = body.querySelector('.accordion__content');
          if (content) {
            body.style.maxHeight = content.scrollHeight + 'px';
          }
          header.setAttribute('aria-expanded', 'true');
        }

        header.addEventListener('click', function () {
          var isOpen = item.classList.contains('accordion__item--open');

          // Close all items in this accordion
          items.forEach(function (otherItem) {
            var otherBody = otherItem.querySelector('.accordion__body');
            var otherHeader = otherItem.querySelector('.accordion__header');
            otherItem.classList.remove('accordion__item--open');
            if (otherBody) otherBody.style.maxHeight = '0';
            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          });

          // Open clicked item if it was closed
          if (!isOpen) {
            item.classList.add('accordion__item--open');
            var content = body.querySelector('.accordion__content');
            if (content) {
              body.style.maxHeight = content.scrollHeight + 'px';
            }
            header.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
  }
  initAccordions();


  // ---- VIDEO MODAL ----
  if (videoModal && videoModalClose) {
    videoCards.forEach(function (card) {
      card.addEventListener('click', function () {
        videoModal.classList.add('video-modal--open');
        document.body.style.overflow = 'hidden';
        const videoElement = document.getElementById('demo-video');
        if (videoElement) {
          videoElement.play();
        }
      });
    });

    videoModalClose.addEventListener('click', function () {
      closeVideoModal();
    });

    videoModal.addEventListener('click', function (e) {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && videoModal.classList.contains('video-modal--open')) {
        closeVideoModal();
      }
    });
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('video-modal--open');
    document.body.style.overflow = '';
    const videoElement = document.getElementById('demo-video');
    if (videoElement) {
      videoElement.pause();
    }
  }


  // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var navHeight = 0; // Minimal nav doesn't require offset
        var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // ---- 3D HERO BACKGROUND (Three.js - Retro Rubber-Hose Style) ----
  function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    // Transparent background to let the CSS paper white show through
    scene.background = null; 
    
    // Add subtle fog to blend distant buildings into the white background
    scene.fog = new THREE.FogExp2(0xffffff, 0.012);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    
    // Base geometry for buildings
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // Solid white material for the interior
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    // Edges geometry for the thick black cartoon outlines
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }); 

    // Array to hold building references for animation
    const buildings = [];

    for (let i = 0; i < 80; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      
      // Add black outlines as a child of the mesh
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      mesh.add(edges);

      mesh.position.x = (Math.random() - 0.5) * 60;
      mesh.position.y = (Math.random() - 0.5) * 10 - 5;
      mesh.position.z = (Math.random() - 0.5) * 60;

      const scaleX = Math.random() * 3 + 1.5;
      const scaleZ = Math.random() * 3 + 1.5;
      const scaleY = Math.random() * 12 + 3;
      
      mesh.scale.set(scaleX, scaleY, scaleZ);

      group.add(mesh);
      
      buildings.push({
        mesh: mesh,
        baseScaleX: scaleX,
        baseScaleY: scaleY,
        baseScaleZ: scaleZ,
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 2 // Animation speed
      });
    }
    scene.add(group);

    camera.position.z = 25;
    camera.position.y = 8;
    camera.lookAt(0, 0, 0);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.0015;
      mouseY = (event.clientY - windowHalfY) * 0.0015;
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();

      targetX = mouseX * 2;
      targetY = mouseY * 2;

      // Slowly rotate the whole city
      group.rotation.y += 0.001;

      // Smooth camera parallax
      camera.position.x += (targetX * 10 - camera.position.x) * 0.05;
      camera.position.y += (-targetY * 10 - camera.position.y + 8) * 0.05;
      camera.lookAt(scene.position);

      // SQUASH AND STRETCH (Rubber-hose animation)
      buildings.forEach(b => {
        // Sine wave oscillating between -1 and 1
        const wave = Math.sin(time * b.speed + b.phase);
        
        // Stretch Y (10%), Squash X and Z (5%) to maintain visual volume
        const stretchY = 1 + wave * 0.10; 
        const squashXZ = 1 - wave * 0.05; 
        
        b.mesh.scale.y = b.baseScaleY * stretchY;
        b.mesh.scale.x = b.baseScaleX * squashXZ;
        b.mesh.scale.z = b.baseScaleZ * squashXZ;
      });

      renderer.render(scene, camera);
    }
    animate();
  }
  initThreeJS();


  // ---- GSAP ANIMATIONS ----
  function initGSAP() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero Entry Animation
    const heroTl = gsap.timeline();
    heroTl.fromTo('.hero__title-vr', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' })
      .fromTo('.hero__title-code-city', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }, '-=0.8')
      .fromTo('.hero__subtitle', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.6')
      .fromTo('.hero__ctas a', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.4')
      .fromTo('.hero__vertical-text', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '-=1');

    // Scroll Reveals
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Staggered cards reveal
    const cardSections = ['.memoria__cards', '.grid-3'];
    cardSections.forEach(selector => {
      const container = document.querySelector(selector);
      if (container) {
        const cards = container.children;
        gsap.fromTo(cards,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // Tech Manifesto Keyword Animation
    const techKeywords = document.querySelectorAll('.tech-keyword');
    if (techKeywords.length > 0) {
      gsap.fromTo(techKeywords,
        { scale: 0.8, opacity: 0, rotationX: 45 },
        {
          scale: 1,
          opacity: 1,
          rotationX: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: '.tech-manifesto',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAP);
  } else {
    initGSAP();
  }


  // Funcionalidad de 'Active Nav' eliminada por la integración de la Ruleta Cinética.

  // ---- ORACLE CHARACTER WIDGET ----
  function initOracle() {
    const oracleImg = document.getElementById('oracle-img');
    const oracleBubble = document.getElementById('oracle-bubble');
    const oracleAvatar = document.getElementById('oracle-avatar');
    if (!oracleImg || !oracleBubble || !oracleAvatar) return;

    // Show initial bubble
    setTimeout(() => {
      oracleBubble.classList.add('is-visible');
    }, 1500);

    // Mouse tracking to pan the face inside the circle mask
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX - windowHalfX) / windowHalfX; 
      const mouseY = (e.clientY - windowHalfY) / windowHalfY; 

      // Pan the image X and Y by up to 12px
      const translateX = mouseX * 12;
      const translateY = mouseY * 12;
      
      oracleImg.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });

    // Toggle bubble on click
    oracleAvatar.addEventListener('click', () => {
      oracleBubble.classList.toggle('is-visible');
    });

    // Change text on scroll
    let hideTimeout;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const sections = [
        { id: '#hero', text: '¡Bienvenido a VR Code City! La metrópolis del código.' },
        { id: '#videos', text: '¡Echa un vistazo a cómo me muevo en VR!' },
        { id: '#memoria', text: 'Toda la teoría detrás de mi cerebro.' },
        { id: '#features', text: '¡Tengo visión espacial y multijugador!' },
        { id: '#techstack', text: 'Node, A-Frame, WebRTC... Puro combustible.' },
        { id: '#setup', text: 'Clona, instala y conéctate. ¡Fácil!' }
      ];

      sections.forEach(sec => {
        ScrollTrigger.create({
          trigger: sec.id,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => updateBubble(sec.text),
          onEnterBack: () => updateBubble(sec.text)
        });
      });
    }

    function updateBubble(text) {
      if (oracleBubble.textContent === text) {
        oracleBubble.classList.add('is-visible');
        return;
      }
      
      oracleBubble.classList.remove('is-visible');
      
      setTimeout(() => {
        oracleBubble.textContent = text;
        oracleBubble.classList.add('is-visible');
        
        // Auto-hide after 5 seconds to not block UI forever
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          oracleBubble.classList.remove('is-visible');
        }, 5000);
      }, 400); // Wait for CSS transition out
    }
  }

  // ---- CUSTOM RETRO CURSOR ----
  function initCursor() {
    // Only init on devices with a mouse
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    document.body.classList.add('custom-cursor-enabled');

    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    document.addEventListener('mousedown', () => cursor.classList.add('is-active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('is-active'));

    const clickables = document.querySelectorAll('a, button, .video-card, .memoria__card, .feature-card, input, textarea');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initOracle();
      initCursor();
    });
  } else {
    initOracle();
    initCursor();
  }

})();
