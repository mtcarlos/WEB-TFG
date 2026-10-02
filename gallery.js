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
    let isAnimating = false;

    function switchGallery(hideElement, showElement, headingText, countText) {
      if (isAnimating || hideElement.style.display === 'none') return;
      isAnimating = true;

      // 1. Animate out current gallery
      gsap.to(hideElement, {
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          hideElement.style.display = 'none';

          // 2. Prepare new gallery
          showElement.style.display = 'grid';
          gsap.set(showElement, { opacity: 0, y: -20, scale: 0.98 });

          // 3. Update texts with a quick flash effect
          if (galleryHeading) {
            gsap.to(galleryHeading, {
              opacity: 0, duration: 0.15, onComplete: () => {
                galleryHeading.textContent = headingText;
                gsap.to(galleryHeading, { opacity: 1, duration: 0.15 });
              }
            });
          }
          if (galleryCount) {
            gsap.to(galleryCount, {
              opacity: 0, duration: 0.15, onComplete: () => {
                galleryCount.textContent = countText;
                gsap.to(galleryCount, { opacity: 1, duration: 0.15 });
              }
            });
          }

          // 4. Animate in new gallery
          gsap.to(showElement, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power3.out',
            onComplete: () => {
              isAnimating = false;
              // Refresh scroll trigger calculations just in case heights changed
              if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
            }
          });
        }
      });
    }

    const toggleContainer = document.getElementById('gallery-toggle-container');

    btnShowImages.addEventListener('click', function () {
      if (btnShowImages.classList.contains('is-active')) return;
      btnShowImages.classList.add('is-active');
      btnShowVideos.classList.remove('is-active');
      if (toggleContainer) toggleContainer.classList.remove('is-video');
      switchGallery(videoGallery, imageGallery, 'La Ciudad en Imágenes', '07 capturas');
    });

    btnShowVideos.addEventListener('click', function () {
      if (btnShowVideos.classList.contains('is-active')) return;
      btnShowVideos.classList.add('is-active');
      btnShowImages.classList.remove('is-active');
      if (toggleContainer) toggleContainer.classList.add('is-video');
      switchGallery(imageGallery, videoGallery, 'La Ciudad en Vídeos', '05 vídeos');
    });
  }

  // ---- CHARACTER GUIDE COMMENTS ----
  const characterComments = [
    '¡Esta es la vista general de mi ciudad! Cada edificio es un archivo.',
    'El modo Rayos X revela la actividad de commits con un heatmap.',
    '¡Mira cómo se ven los distritos! Cada carpeta es un barrio.',
    'The Oracle analiza el código que estás mirando en tiempo real.',
    'Sesión multijugador: ¡mis amigos también recorren la ciudad!',
    'Los edificios más altos tienen más líneas de código. ¡Cuidado con los rascacielos!',
    'Vista aérea de la metrópolis digital. ¡Impresionante, ¿eh?!'
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

  // ---- 3D MUSEUM HALLWAY (Three.js) ----
  function initGalleryThreeJS() {
    const canvas = document.getElementById('gallery-hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const heroSection = document.getElementById('gallery-hero');
    if (!heroSection) return;

    const width = heroSection.clientWidth;
    const height = heroSection.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;
    // Stronger fog for a mysterious fade-out in the distance
    scene.fog = new THREE.FogExp2(0xffffff, 0.022);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Enable cinematic shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const hallwayGroup = new THREE.Group();

    // Cinematic Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x2b2b36, 0.6); // Cool dark blue/grey ambient
    scene.add(ambientLight);

    const pillarGeo = new THREE.BoxGeometry(1.5, 20, 2);
    const beamGeo = new THREE.BoxGeometry(22, 1.5, 2);

    // Switch to physically based materials that react to light
    const matWhite = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.9,
      metalness: 0.1
    });

    const matRed = new THREE.MeshStandardMaterial({
      color: 0xE63946,
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0x330000 // Slight inner glow
    });

    const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });

    const pillarEdges = new THREE.EdgesGeometry(pillarGeo);
    const beamEdges = new THREE.EdgesGeometry(beamGeo);

    const segmentLength = 12;
    const segmentsCount = 25;

    // Create a series of brutalist "portals" or structural ribs
    for (let i = 0; i < segmentsCount; i++) {
      const zOffset = -i * segmentLength;
      const portalGroup = new THREE.Group();

      // Left Pillar
      const pL = new THREE.Mesh(pillarGeo, matWhite);
      pL.position.set(-10, 0, 0);
      pL.castShadow = true; pL.receiveShadow = true;
      pL.add(new THREE.LineSegments(pillarEdges, edgeMat));
      portalGroup.add(pL);

      // Right Pillar
      const pR = new THREE.Mesh(pillarGeo, matWhite);
      pR.position.set(10, 0, 0);
      pR.castShadow = true; pR.receiveShadow = true;
      pR.add(new THREE.LineSegments(pillarEdges, edgeMat));
      portalGroup.add(pR);

      // Top Beam
      const bT = new THREE.Mesh(beamGeo, matWhite);
      bT.position.set(0, 9.25, 0);
      bT.castShadow = true; bT.receiveShadow = true;
      bT.add(new THREE.LineSegments(beamEdges, edgeMat));
      portalGroup.add(bT);

      // Bottom Beam
      const bB = new THREE.Mesh(beamGeo, matWhite);
      bB.position.set(0, -9.25, 0);
      bB.castShadow = true; bB.receiveShadow = true;
      bB.add(new THREE.LineSegments(beamEdges, edgeMat));
      portalGroup.add(bB);

      // Occasionally add a red accent block (Art piece / Data node)
      if (i % 3 === 0) {
        const isLeft = Math.random() > 0.5;
        const accentGeo = new THREE.BoxGeometry(2, 4, 1.5);
        const accent = new THREE.Mesh(accentGeo, matRed);
        accent.position.set(
          (isLeft ? -8.5 : 8.5),
          (Math.random() * 8 - 4),
          0
        );
        accent.castShadow = true;
        accent.add(new THREE.LineSegments(new THREE.EdgesGeometry(accentGeo), edgeMat));
        portalGroup.add(accent);

        // Add a dramatic red point light near the accent block
        const redLight = new THREE.PointLight(0xE63946, 2.5, 25);
        redLight.position.set((isLeft ? -6 : 6), accent.position.y, 0);
        portalGroup.add(redLight);
      }

      // Add overhead dramatic lighting every few segments
      if (i % 4 === 0) {
        const overheadLight = new THREE.PointLight(0xffffff, 2, 35);
        overheadLight.position.set(0, 8, 0); // Just under the top beam
        overheadLight.castShadow = true;
        overheadLight.shadow.bias = -0.002;
        portalGroup.add(overheadLight);
      }

      portalGroup.position.z = zOffset;
      hallwayGroup.add(portalGroup);
    }

    scene.add(hallwayGroup);

    // Parallax mouse variables
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
      // Much more subtle parallax factor to prevent breaking perspective
      mouseX = (event.clientX - windowHalfX) * 0.0008;
      mouseY = (event.clientY - windowHalfY) * 0.0008;
    });

    window.addEventListener('resize', () => {
      const newWidth = heroSection.clientWidth;
      const newHeight = heroSection.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

    let cameraZ = 10;
    const hallwayEndZ = -(segmentsCount * segmentLength) + 50;

    function animate() {
      requestAnimationFrame(animate);

      // Move camera forward slightly faster
      cameraZ -= 0.12;

      if (cameraZ < hallwayEndZ) {
        cameraZ = 10;
      }

      camera.position.z = cameraZ;

      // Smooth dampening for position
      const targetX = mouseX * 12;
      const targetY = -mouseY * 8;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;

      // Force camera to always look straight ahead to maintain perspective symmetry
      camera.lookAt(camera.position.x, camera.position.y, cameraZ - 50);

      renderer.render(scene, camera);
    }
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initGalleryGSAP();
      initGalleryThreeJS();
    });
  } else {
    initGalleryGSAP();
    initGalleryThreeJS();
  }

})();
