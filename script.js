/**
 * OM — Minimal Editorial Developer Portfolio
 * Micro-interactions, Cursor-Following Image Reveal & Dialog Orchestration
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const editorialToast = document.getElementById('editorialToast');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  
  // Dialogs
  const contactDialog = document.getElementById('contactDialog');
  const closeDialogBtn = document.getElementById('closeDialogBtn');
  const copyEmailTrigger = document.getElementById('copyEmailTrigger');
  
  const projectsDialog = document.getElementById('projectsDialog');
  const closeProjectsBtn = document.getElementById('closeProjectsBtn');
  
  // Interactive triggers & Modals
  const dominantTitle = document.getElementById('dominantTitle');

  // Hero Reveal Elements
  const heroStage = document.getElementById('heroStage');
  const heroBgReveal = document.getElementById('heroBgReveal');
  const revealGlow = document.getElementById('revealGlow');

  // Helper: Show Editorial Status Toast
  let toastTimer;
  function showToast(message) {
    if (!editorialToast) return;
    editorialToast.textContent = message;
    editorialToast.classList.add('show');
    
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      editorialToast.classList.remove('show');
    }, 2600);
  }

  // 1. Universal Smooth Scroll Engine for In-Page Anchor Navigation
  function smoothScrollTo(targetSelector) {
    if (!targetSelector || targetSelector === '#' || targetSelector === '#home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    let targetEl = document.querySelector(targetSelector);
    // Fallback aliases if needed
    if (!targetEl) {
      if (targetSelector === '#about') {
        targetEl = document.getElementById('storytellingSection') || document.getElementById('about');
      } else if (targetSelector === '#projects') {
        targetEl = document.getElementById('projects') || document.getElementById('archive');
      } else if (targetSelector === '#contact') {
        targetEl = document.getElementById('contact') || document.querySelector('.magazine-footer');
      }
    }

    if (targetEl) {
      const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    }
  }

  // Bind smooth scrolling to all internal anchor links (Navbar, Drawer, Footer, Brand)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    // Preserve modal opener for the "LET'S BUILD SOMETHING" CTA button
    if (link.id === 'bigCtaTrigger') return;

    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();

        // Close mobile drawer if active
        if (mobileDrawer && mobileDrawer.classList.contains('active')) {
          mobileDrawer.classList.remove('active');
          if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
          }
        }

        smoothScrollTo(href);

        // Update URL hash cleanly
        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, href);
        }
      }
    });
  });

  // 2. Mobile Drawer Navigation
  if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuToggle.contains(e.target) && !mobileDrawer.contains(e.target)) {
        mobileDrawer.classList.remove('active');
      }
    });
  }

  // 3. Contact Dialog Modal Orchestration
  function openContactModal() {
    if (contactDialog && typeof contactDialog.showModal === 'function') {
      contactDialog.showModal();
    }
  }

  function closeContactModal() {
    if (contactDialog) {
      contactDialog.close();
    }
  }

  if (closeDialogBtn) {
    closeDialogBtn.addEventListener('click', closeContactModal);
  }

  // Click outside dialog to close
  if (contactDialog) {
    contactDialog.addEventListener('click', (e) => {
      const rect = contactDialog.getBoundingClientRect();
      const inBox = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!inBox) {
        closeContactModal();
      }
    });
  }

  // 3. Copy Email Trigger inside Contact Modal
  if (copyEmailTrigger) {
    copyEmailTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'omprakashmuduli30@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Copied omprakashmuduli30@gmail.com');
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }

  // 4. Explore Projects Dialog Orchestration
  function openProjectsModal() {
    if (projectsDialog && typeof projectsDialog.showModal === 'function') {
      projectsDialog.showModal();
    }
  }

  function closeProjectsModal() {
    if (projectsDialog) {
      projectsDialog.close();
    }
  }

  if (closeProjectsBtn) {
    closeProjectsBtn.addEventListener('click', closeProjectsModal);
  }

  if (projectsDialog) {
    projectsDialog.addEventListener('click', (e) => {
      const rect = projectsDialog.getBoundingClientRect();
      const inBox = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!inBox) {
        closeProjectsModal();
      }
    });
  }

  // 5. Cursor-Following Image Reveal Effect (BG_IMAGE_1 -> BG_IMAGE_2 Spotlight)
  if (heroStage && heroBgReveal) {
    let mouseX = -999;
    let mouseY = -999;
    let currX = -999;
    let currY = -999;
    let isHovering = false;
    let animId = null;

    function renderRevealSpotlight() {
      if (isHovering) {
        // Smooth easing towards cursor
        currX += (mouseX - currX) * 0.14;
        currY += (mouseY - currY) * 0.14;

        const xPos = `${currX.toFixed(1)}px`;
        const yPos = `${currY.toFixed(1)}px`;

        heroBgReveal.style.setProperty('--cursor-x', xPos);
        heroBgReveal.style.setProperty('--cursor-y', yPos);

        if (revealGlow) {
          revealGlow.style.left = xPos;
          revealGlow.style.top = yPos;
        }

        animId = requestAnimationFrame(renderRevealSpotlight);
      }
    }

    function onPointerEnter(clientX, clientY) {
      const rect = heroStage.getBoundingClientRect();
      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;
      currX = mouseX;
      currY = mouseY;

      isHovering = true;
      heroBgReveal.classList.add('active');
      if (revealGlow) revealGlow.classList.add('active');

      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(renderRevealSpotlight);
    }

    function onPointerMove(clientX, clientY) {
      const rect = heroStage.getBoundingClientRect();
      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;

      if (!isHovering) {
        onPointerEnter(clientX, clientY);
      }
    }

    function onPointerLeave() {
      isHovering = false;
      heroBgReveal.classList.remove('active');
      if (revealGlow) revealGlow.classList.remove('active');
      cancelAnimationFrame(animId);
    }

    // Desktop Mouse Events
    heroStage.addEventListener('mouseenter', (e) => onPointerEnter(e.clientX, e.clientY));
    heroStage.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    heroStage.addEventListener('mouseleave', onPointerLeave);

    // Mobile / Touch Events
    heroStage.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        onPointerEnter(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    heroStage.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    heroStage.addEventListener('touchend', onPointerLeave, { passive: true });
    heroStage.addEventListener('touchcancel', onPointerLeave, { passive: true });
  }

  // 6. Typographic Letterform Micro-Tilt
  if (dominantTitle && window.matchMedia('(pointer: fine)').matches) {
    dominantTitle.addEventListener('mousemove', (e) => {
      const rect = dominantTitle.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      dominantTitle.style.transform = `translate3d(${relX * 8}px, ${relY * 8}px, 0)`;
    });

    dominantTitle.addEventListener('mouseleave', () => {
      dominantTitle.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  // 7. Cinematic Scroll-Driven Storytelling Section (Crochet Retro TV Expansion)
  initStoryScrollSection();

  // 7.5. Visual Storytelling Frame Engine (ABOUT ME → SKILLS → WORK EXPERIENCE)
  initFrameStorytellingEngine();

  // 8. Project Discovery Section (Archive Reveal, Parallax & Interactivity)
  initDiscoveryArchive();
});

/**
 * Storytelling Section Controller
 * - Center card starts in vertical 9:16 portrait ratio with a relatively small size
 * - Progressively expands and smoothly scales only the center card into a full-screen immersive visual
 * - Smooth lerped scroll-linked progress with cubic acceleration/deceleration
 * - Asymmetric editorial text exits: staggered fades, slides, rotations & scaling
 */
function initStoryScrollSection() {
  const section = document.getElementById('storytelling');
  const mediaCard = document.getElementById('storyMediaCard');
  const mediaImg = document.getElementById('storyMediaImg');
  const scrollBarFill = document.getElementById('scrollBarFill');
  const scrollHint = document.getElementById('storyScrollIndicator');
  const immersiveOverlay = document.getElementById('storyImmersiveOverlay');

  const pieceTopLeft = document.getElementById('pieceTopLeft');
  const pieceTopRight = document.getElementById('pieceTopRight');
  const pieceBottomLeft = document.getElementById('pieceBottomLeft');
  const pieceBottomRight = document.getElementById('pieceBottomRight');
  const pieceCenterBottom = document.getElementById('pieceCenterBottom');

  if (!section || !mediaCard) return;

  let targetProgress = 0;
  let currentProgress = 0;
  let isTicking = false;

  function calculateProgress() {
    const rect = section.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDist = rect.height - windowH;

    if (totalDist <= 0) return 0;

    const scrolled = -rect.top;
    const p = scrolled / totalDist;
    return Math.max(0, Math.min(1, p));
  }

  function getDimensions() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Initial 9:16 portrait card dimensions:
    // Keeps a relatively small size centered with generous negative space
    let w0 = Math.min(Math.max(vw * 0.17, 210), 280);
    if (vw <= 768) {
      w0 = Math.min(Math.max(vw * 0.48, 175), 230);
    }
    let h0 = w0 * (16 / 9);

    // Ensure height does not exceed 52% of viewport height initially
    const maxAllowedH0 = vh * 0.52;
    if (h0 > maxAllowedH0) {
      h0 = maxAllowedH0;
      w0 = h0 * (9 / 16);
    }

    // Target full-screen dimensions (covers entire viewport + subtle bleed)
    const targetW = vw * 1.02;
    const targetH = vh * 1.02;

    return { w0, h0, targetW, targetH };
  }

  let dims = getDimensions();
  window.addEventListener('resize', () => {
    dims = getDimensions();
    onScroll();
  }, { passive: true });

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  function updateStoryAnimation() {
    // Lerp progress for smooth cinematic inertia
    currentProgress += (targetProgress - currentProgress) * 0.15;

    const p = currentProgress;
    
    // 1. Center Featured Project Card: Progressively expands from 9:16 portrait to full-screen
    const scaleProgress = clamp01(p / 0.85);
    // Smooth cubic acceleration and deceleration
    const easedP = scaleProgress < 0.5 
      ? 2 * scaleProgress * scaleProgress 
      : 1 - Math.pow(-2 * scaleProgress + 2, 2) / 2;

    const currentW = dims.w0 + (dims.targetW - dims.w0) * easedP;
    const currentH = dims.h0 + (dims.targetH - dims.h0) * easedP;
    const currentBr = Math.max(0, 16 * (1 - scaleProgress * 1.4));

    mediaCard.style.width = `${currentW.toFixed(1)}px`;
    mediaCard.style.height = `${currentH.toFixed(1)}px`;
    mediaCard.style.borderRadius = `${currentBr.toFixed(1)}px`;
    mediaCard.style.transform = 'none';

    // Softening shadow & lens sheen as it expands
    const shadowOpacity = (1 - scaleProgress).toFixed(2);
    mediaCard.style.boxShadow = `0 30px 80px -15px rgba(50, 35, 24, ${(0.35 * (1 - scaleProgress)).toFixed(3)}), 0 10px 30px -10px rgba(182, 148, 204, ${(0.28 * (1 - scaleProgress)).toFixed(3)}), 0 0 0 1px rgba(224, 172, 198, ${(0.35 * (1 - scaleProgress)).toFixed(3)})`;

    const lensSheen = mediaCard.querySelector('.media-lens-sheen');
    if (lensSheen) {
      lensSheen.style.opacity = (1 - scaleProgress).toFixed(3);
    }

    // Subtle optical depth on the inner image as it fills the view
    if (mediaImg) {
      const imgScale = 1.0 + 0.05 * easedP;
      mediaImg.style.transform = `scale(${imgScale.toFixed(4)})`;
    }

    // 2. Staggered Text Animations (Fades, Slides, Rotations, Scales)
    
    // Top-Left: "CREATIVE DEVELOPER" (Exits up-left with negative rotation)
    const t1 = clamp01((p - 0.02) / 0.36);
    if (pieceTopLeft) {
      pieceTopLeft.style.opacity = (1 - t1).toFixed(3);
      pieceTopLeft.style.transform = `translate3d(-${(t1 * 120).toFixed(1)}px, -${(t1 * 80).toFixed(1)}px, 0) rotate(-${(t1 * 6).toFixed(2)}deg) scale(${(1 - t1 * 0.14).toFixed(3)})`;
    }

    // Top-Right: "Turning Ideas Into Experiences" (Exits up-right with positive rotation)
    const t2 = clamp01((p - 0.05) / 0.38);
    if (pieceTopRight) {
      pieceTopRight.style.opacity = (1 - t2).toFixed(3);
      pieceTopRight.style.transform = `translate3d(${(t2 * 130).toFixed(1)}px, -${(t2 * 85).toFixed(1)}px, 0) rotate(${(t2 * 5.5).toFixed(2)}deg) scale(${(1 - t2 * 0.12).toFixed(3)})`;
    }

    // Bottom-Left: "React / Next.js / TypeScript" (Exits down-left)
    const t3 = clamp01((p - 0.08) / 0.40);
    if (pieceBottomLeft) {
      pieceBottomLeft.style.opacity = (1 - t3).toFixed(3);
      pieceBottomLeft.style.transform = `translate3d(-${(t3 * 105).toFixed(1)}px, ${(t3 * 90).toFixed(1)}px, 0) rotate(-${(t3 * 5).toFixed(2)}deg) scale(${(1 - t3 * 0.14).toFixed(3)})`;
    }

    // Bottom-Right: "Experimenting with AI & 3D" (Exits down-right)
    const t4 = clamp01((p - 0.11) / 0.42);
    if (pieceBottomRight) {
      pieceBottomRight.style.opacity = (1 - t4).toFixed(3);
      pieceBottomRight.style.transform = `translate3d(${(t4 * 115).toFixed(1)}px, ${(t4 * 80).toFixed(1)}px, 0) rotate(${(t4 * 6).toFixed(2)}deg) scale(${(1 - t4 * 0.12).toFixed(3)})`;
    }

    // Center-Bottom: "DESIGN × DEVELOPMENT" (Drops down and scales out)
    const t5 = clamp01((p - 0.06) / 0.34);
    if (pieceCenterBottom) {
      pieceCenterBottom.style.opacity = (1 - t5).toFixed(3);
      pieceCenterBottom.style.transform = `translate3d(-50%, ${(t5 * 65).toFixed(1)}px, 0) scale(${(1 - t5 * 0.2).toFixed(3)})`;
    }

    // 3. Scroll Progress Indicator
    if (scrollBarFill) {
      scrollBarFill.style.width = `${(p * 100).toFixed(1)}%`;
    }
    if (scrollHint) {
      scrollHint.style.opacity = (1 - clamp01(p / 0.15)).toFixed(3);
    }

    // 4. Immersive Full-Screen Reveal Overlay (Fades in at p >= 0.65)
    if (immersiveOverlay) {
      const tCap = clamp01((p - 0.65) / 0.25);
      immersiveOverlay.style.opacity = tCap.toFixed(3);
      immersiveOverlay.style.transform = `translateY(${((1 - tCap) * 20).toFixed(1)}px)`;
    }

    // Continue ticking until settled
    if (Math.abs(targetProgress - currentProgress) > 0.0004) {
      requestAnimationFrame(updateStoryAnimation);
    } else {
      isTicking = false;
    }
  }

  function onScroll() {
    targetProgress = calculateProgress();
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(updateStoryAnimation);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Project Discovery Archive Controller
 * - IntersectionObserver staggered card reveals with opacity, scale & translation
 * - Interactive 3D micro-tilt and cursor sheen on cards
 * - Big CTA modal trigger
 */
function initDiscoveryArchive() {
  const cards = document.querySelectorAll('.archive-card');
  const bigCta = document.getElementById('bigCtaTrigger');
  const contactDialog = document.getElementById('contactDialog');

  if (bigCta && contactDialog) {
    bigCta.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof contactDialog.showModal === 'function') {
        contactDialog.showModal();
      }
    });
  }

  // Staggered Scroll Reveal
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const idx = parseInt(card.getAttribute('data-index') || '1', 10);
          setTimeout(() => {
            card.classList.add('revealed');
          }, (idx % 3) * 120);
          observer.unobserve(card);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    cards.forEach((card) => observer.observe(card));
  } else {
    // Fallback for older browsers
    cards.forEach((card) => card.classList.add('revealed'));
  }

  // Interactive 3D Micro-Tilt & Sheen on Desktop
  if (window.matchMedia('(pointer: fine)').matches) {
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3.5;
        const rotateY = ((x - centerX) / centerX) * 3.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Click on cards: external link or dedicated project modal
  const projectsDialog = document.getElementById('projectsDialog');
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // If user clicked directly on or inside an anchor tag, allow normal navigation
      if (e.target.closest('a')) {
        return;
      }

      // If the card has a live external link action, open it in a new tab
      const actionLink = card.querySelector('.card-footer-action[href]');
      if (actionLink && actionLink.getAttribute('href')) {
        window.open(actionLink.getAttribute('href'), '_blank', 'noopener,noreferrer');
        return;
      }

      if (projectsDialog && typeof projectsDialog.showModal === 'function') {
        projectsDialog.showModal();
      }
    });
  });
}

/**
 * Visual Storytelling Frame Engine Controller
 * - Sequence: ABOUT ME (150 frames) → SKILLS (100 frames) → WORK EXPERIENCE (299 frames)
 * - Load image frames in correct numerical order from frame folders without duplication or renaming
 * - HTML Canvas 60fps rendering with 0% distortion (drawFramePreservingAspect)
 * - 16:9 large visual with corresponding information displayed alongside
 * - Scroll transitions: visual transforms smoothly to 9:16 portrait, shifts left, shrinks, and fades out
 * - Simultaneously, incoming sequence enters from right as 9:16 portrait and expands into large 16:9 visual
 * - RequestAnimationFrame smooth interpolation (lerping) & smart batch preloader
 */
function initFrameStorytellingEngine() {
  const section = document.getElementById('storytellingSection');
  if (!section) return;

  const hudSeqKicker = document.getElementById('hudSeqKicker');
  const hudFrameCounter = document.getElementById('hudFrameCounter');
  const storyWatermark = document.getElementById('storyWatermark');
  const storyProgressBar = document.getElementById('storyProgressBar');
  const tabs = document.querySelectorAll('.seq-tab');
  const milestones = document.querySelectorAll('.milestone-label');

  // Sequence Configuration
  const SEQUENCES = [
    {
      index: 0,
      id: 'aboutMe',
      name: 'ABOUT ME',
      kicker: '01 ABOUT ME',
      folder: 'about me',
      prefix: 'ezgif-frame-',
      digits: 3,
      ext: '.jpg',
      totalFrames: 150,
      stageEl: document.getElementById('stageAboutMe'),
      cardEl: document.getElementById('visualCardAboutMe'),
      aspectWrapEl: document.getElementById('aspectWrapAboutMe'),
      canvasEl: document.getElementById('canvasAboutMe'),
      infoPanelEl: document.getElementById('infoPanelAboutMe'),
      aspectTagEl: document.getElementById('aspectTagAboutMe'),
      activeRange: [0.00, 0.35],
      playRange: [0.00, 0.22],
      exitRange: [0.22, 0.35],
    },
    {
      index: 1,
      id: 'skills',
      name: 'SKILLS',
      kicker: '02 SKILLS',
      folder: 'skills',
      prefix: 'ezgif-frame-',
      digits: 3,
      ext: '.jpg',
      totalFrames: 100,
      stageEl: document.getElementById('stageSkills'),
      cardEl: document.getElementById('visualCardSkills'),
      aspectWrapEl: document.getElementById('aspectWrapSkills'),
      canvasEl: document.getElementById('canvasSkills'),
      infoPanelEl: document.getElementById('infoPanelSkills'),
      aspectTagEl: document.getElementById('aspectTagSkills'),
      enterRange: [0.22, 0.35],
      activeRange: [0.32, 0.68],
      playRange: [0.35, 0.55],
      exitRange: [0.55, 0.68],
    },
    {
      index: 2,
      id: 'workExperience',
      name: 'WORK EXPERIENCE',
      kicker: '03 WORK EXPERIENCE',
      folder: 'work experience',
      prefix: 'ezgif-frame-',
      digits: 3,
      ext: '.jpg',
      totalFrames: 299,
      stageEl: document.getElementById('stageWork'),
      cardEl: document.getElementById('visualCardWork'),
      aspectWrapEl: document.getElementById('aspectWrapWork'),
      canvasEl: document.getElementById('canvasWork'),
      infoPanelEl: document.getElementById('infoPanelWork'),
      aspectTagEl: document.getElementById('aspectTagWork'),
      enterRange: [0.55, 0.68],
      activeRange: [0.65, 1.00],
      playRange: [0.68, 0.93],
      exitRange: [0.93, 1.00],
    }
  ];

  // 1. Frame Caching System
  const frameCache = [
    new Array(151),
    new Array(101),
    new Array(300)
  ];

  // Contexts
  const contexts = SEQUENCES.map(seq => seq.canvasEl ? seq.canvasEl.getContext('2d', { alpha: false }) : null);

  function getFramePath(seqIdx, frameNum) {
    const seq = SEQUENCES[seqIdx];
    const padded = String(frameNum).padStart(seq.digits, '0');
    return `${encodeURIComponent(seq.folder)}/${seq.prefix}${padded}${seq.ext}`;
  }

  function loadSingleFrame(seqIdx, frameNum, callback) {
    if (frameCache[seqIdx][frameNum]) {
      const existing = frameCache[seqIdx][frameNum];
      if (existing.complete && existing.naturalWidth > 0) {
        if (callback) callback(existing);
        return existing;
      }
    }
    const img = new Image();
    img.decoding = 'async';
    img.src = getFramePath(seqIdx, frameNum);
    frameCache[seqIdx][frameNum] = img;
    img.onload = () => {
      if (callback) callback(img);
    };
    return img;
  }

  // Draw frame with aspect ratio preservation (cover)
  function drawFramePreservingAspect(seqIdx, targetFrame) {
    const canvas = SEQUENCES[seqIdx].canvasEl;
    const ctx = contexts[seqIdx];
    if (!canvas || !ctx) return;

    const total = SEQUENCES[seqIdx].totalFrames;
    const clampedFrame = Math.max(1, Math.min(total, targetFrame));

    let img = frameCache[seqIdx][clampedFrame];

    // Fallback: look for closest loaded frame to avoid any blank canvas
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let f = clampedFrame - 1; f >= 1; f--) {
        if (frameCache[seqIdx][f] && frameCache[seqIdx][f].complete && frameCache[seqIdx][f].naturalWidth > 0) {
          img = frameCache[seqIdx][f];
          break;
        }
      }
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let f = clampedFrame + 1; f <= total; f++) {
          if (frameCache[seqIdx][f] && frameCache[seqIdx][f].complete && frameCache[seqIdx][f].naturalWidth > 0) {
            img = frameCache[seqIdx][f];
            break;
          }
        }
      }
    }

    if (img && img.complete && img.naturalWidth > 0) {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const canvasAspect = cw / ch;
      const imgAspect = iw / ih;

      let rw, rh, ox, oy;
      if (canvasAspect > imgAspect) {
        rw = cw;
        rh = cw / imgAspect;
        ox = 0;
        oy = (ch - rh) / 2;
      } else {
        rh = ch;
        rw = ch * imgAspect;
        ox = (cw - rw) / 2;
        oy = 0;
      }

      ctx.drawImage(img, ox, oy, rw, rh);
    }
  }

  // Preload Priority 1: First frame of all 3 sequences immediately
  SEQUENCES.forEach((seq, idx) => {
    loadSingleFrame(idx, 1, () => {
      drawFramePreservingAspect(idx, 1);
    });
  });

  // Preload Priority 2: Staggered batch background preloading
  function startProgressivePreload() {
    let currentSeq = 0;
    let currentFrame = 2;

    function loadNextBatch() {
      let batchCount = 0;
      while (currentSeq < SEQUENCES.length && batchCount < 8) {
        const seq = SEQUENCES[currentSeq];
        if (currentFrame <= seq.totalFrames) {
          loadSingleFrame(currentSeq, currentFrame);
          currentFrame++;
          batchCount++;
        } else {
          currentSeq++;
          currentFrame = 2;
        }
      }

      if (currentSeq < SEQUENCES.length) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadNextBatch, { timeout: 160 });
        } else {
          setTimeout(loadNextBatch, 25);
        }
      }
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadNextBatch, { timeout: 300 });
    } else {
      setTimeout(loadNextBatch, 80);
    }
  }
  startProgressivePreload();

  // 2. Stage Dimensions Calculation for 16:9 vs 9:16 Morph
  function getDimensions() {
    const isMobile = window.innerWidth <= 1024;
    const vW = window.innerWidth;
    const vH = window.innerHeight;

    let w16_9, h16_9, w9_16, h9_16;

    if (isMobile) {
      const targetW = Math.min(vW * 0.90, 560);
      w16_9 = targetW;
      h16_9 = targetW * (9 / 16);

      h9_16 = Math.min(vH * 0.42, 340);
      w9_16 = h9_16 * (9 / 16);
    } else {
      const maxH = Math.min(vH * 0.48, 390);
      const targetW = Math.min(vW * 0.42, 680);

      w16_9 = targetW;
      h16_9 = targetW * (9 / 16);
      if (h16_9 > maxH) {
        h16_9 = maxH;
        w16_9 = h16_9 * (16 / 9);
      }

      h9_16 = h16_9 * 1.10;
      w9_16 = h9_16 * (9 / 16);
    }

    return { w16_9, h16_9, w9_16, h9_16, isMobile };
  }

  // 3. Scroll & Progress Tracking
  let targetProgress = 0;
  let currentProgress = 0;
  let isTicking = false;
  let lastDrawnFrames = [-1, -1, -1];

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function calculateProgress() {
    const rect = section.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDist = rect.height - windowH;

    if (totalDist <= 0) return 0;
    const scrolled = -rect.top;
    return clamp01(scrolled / totalDist);
  }

  // Apply Visual Transformation to a Sequence
  // state: 'steady16_9', 'exiting', 'entering', 'inactive'
  function applySequenceTransform(seq, state, factor, dims) {
    const { stageEl, cardEl, aspectWrapEl, infoPanelEl, aspectTagEl } = seq;
    if (!stageEl || !cardEl || !aspectWrapEl) return;

    const shiftDistance = window.innerWidth * (dims.isMobile ? 0.75 : 0.55);

    if (state === 'inactive') {
      stageEl.classList.remove('active');
      stageEl.style.opacity = '0';
      stageEl.style.visibility = 'hidden';
      stageEl.style.pointerEvents = 'none';
      return;
    }

    stageEl.classList.add('active');
    stageEl.style.visibility = 'visible';
    stageEl.style.pointerEvents = 'auto';

    if (state === 'steady16_9') {
      // 16:9 Large Visual State with Info Panel alongside
      stageEl.style.opacity = '1';
      cardEl.style.transform = 'translate3d(0, 0, 0) scale(1)';
      cardEl.style.opacity = '1';

      aspectWrapEl.style.width = `${dims.w16_9.toFixed(1)}px`;
      aspectWrapEl.style.height = `${dims.h16_9.toFixed(1)}px`;
      aspectWrapEl.style.borderRadius = '8px';

      if (infoPanelEl) {
        infoPanelEl.style.transform = 'translate3d(0, 0, 0)';
        infoPanelEl.style.opacity = '1';
      }
      if (aspectTagEl) {
        aspectTagEl.textContent = '16:9 CINEMATIC';
      }
    } 
    else if (state === 'exiting') {
      // factor: 0 (just starting to exit) -> 1 (fully exited to left)
      // Smoothly transform visual into 9:16 portrait, move left, shrink, fade out
      const m = easeInOutQuad(factor);
      const curW = dims.w16_9 + (dims.w9_16 - dims.w16_9) * m;
      const curH = dims.h16_9 + (dims.h9_16 - dims.h16_9) * m;
      const curBr = 8 + 14 * m;

      aspectWrapEl.style.width = `${curW.toFixed(1)}px`;
      aspectWrapEl.style.height = `${curH.toFixed(1)}px`;
      aspectWrapEl.style.borderRadius = `${curBr.toFixed(1)}px`;

      const translateX = -m * shiftDistance;
      const scale = 1.0 - m * 0.32; // shrinks from 1.0 down to 0.68
      const opacity = Math.max(0, 1.0 - m);

      cardEl.style.transform = `translate3d(${translateX.toFixed(1)}px, 0, 0) scale(${scale.toFixed(3)})`;
      cardEl.style.opacity = opacity.toFixed(3);

      if (infoPanelEl) {
        const infoX = -m * 80;
        infoPanelEl.style.transform = `translate3d(${infoX.toFixed(1)}px, 0, 0)`;
        infoPanelEl.style.opacity = Math.max(0, 1.0 - m * 1.4).toFixed(3);
      }
      if (aspectTagEl) {
        aspectTagEl.textContent = m > 0.4 ? '9:16 PORTRAIT' : '16:9 CINEMATIC';
      }
      stageEl.style.opacity = opacity.toFixed(3);
    } 
    else if (state === 'entering') {
      // factor: 0 (entering from right as 9:16 portrait) -> 1 (expanded to 16:9)
      // Simultaneously, bring next sequence from right and expand into position
      const e = easeInOutQuad(factor);
      const m = 1 - e; // 1 = 9:16 portrait, 0 = 16:9 expanded
      const curW = dims.w16_9 + (dims.w9_16 - dims.w16_9) * m;
      const curH = dims.h16_9 + (dims.h9_16 - dims.h16_9) * m;
      const curBr = 8 + 14 * m;

      aspectWrapEl.style.width = `${curW.toFixed(1)}px`;
      aspectWrapEl.style.height = `${curH.toFixed(1)}px`;
      aspectWrapEl.style.borderRadius = `${curBr.toFixed(1)}px`;

      const translateX = (1 - e) * shiftDistance;
      const scale = 0.68 + e * 0.32; // expands from 0.68 to 1.0
      const opacity = clamp01(e);

      cardEl.style.transform = `translate3d(${translateX.toFixed(1)}px, 0, 0) scale(${scale.toFixed(3)})`;
      cardEl.style.opacity = opacity.toFixed(3);

      if (infoPanelEl) {
        const infoX = (1 - e) * 80;
        infoPanelEl.style.transform = `translate3d(${infoX.toFixed(1)}px, 0, 0)`;
        infoPanelEl.style.opacity = clamp01((e - 0.15) / 0.85).toFixed(3);
      }
      if (aspectTagEl) {
        aspectTagEl.textContent = e < 0.6 ? '9:16 PORTRAIT' : '16:9 CINEMATIC';
      }
      stageEl.style.opacity = opacity.toFixed(3);
    }
  }

  // 4. Main Render Loop
  function updateStoryVisuals(p) {
    const dims = getDimensions();

    // Overall Progress Bar
    if (storyProgressBar) {
      storyProgressBar.style.width = `${(p * 100).toFixed(1)}%`;
    }

    // Determine Active Sequence & Frame Playback
    let activeSeqIdx = 0;
    if (p < 0.33) {
      activeSeqIdx = 0;
    } else if (p < 0.66) {
      activeSeqIdx = 1;
    } else {
      activeSeqIdx = 2;
    }

    // Synchronize Top HUD & Watermark
    const activeSeq = SEQUENCES[activeSeqIdx];
    if (hudSeqKicker) {
      hudSeqKicker.textContent = activeSeq.kicker;
    }
    if (storyWatermark) {
      storyWatermark.textContent = activeSeq.name;
    }

    tabs.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === activeSeqIdx);
    });
    milestones.forEach((ms, idx) => {
      ms.classList.toggle('active', idx === activeSeqIdx);
    });

    // ---------------- Sequence 0: ABOUT ME (150 frames) ----------------
    let s0Frame = 1;
    if (p <= 0.22) {
      const lp = clamp01(p / 0.22);
      s0Frame = Math.floor(lp * 149) + 1;
      applySequenceTransform(SEQUENCES[0], 'steady16_9', 0, dims);
    } else if (p <= 0.35) {
      s0Frame = 150;
      const exitFactor = (p - 0.22) / (0.35 - 0.22);
      applySequenceTransform(SEQUENCES[0], 'exiting', exitFactor, dims);
    } else {
      applySequenceTransform(SEQUENCES[0], 'inactive', 0, dims);
    }

    if (s0Frame !== lastDrawnFrames[0]) {
      drawFramePreservingAspect(0, s0Frame);
      lastDrawnFrames[0] = s0Frame;
    }

    // ---------------- Sequence 1: SKILLS (100 frames) ----------------
    let s1Frame = 1;
    if (p < 0.22) {
      applySequenceTransform(SEQUENCES[1], 'inactive', 0, dims);
    } else if (p < 0.35) {
      const enterFactor = (p - 0.22) / (0.35 - 0.22);
      applySequenceTransform(SEQUENCES[1], 'entering', enterFactor, dims);
      s1Frame = 1;
    } else if (p <= 0.55) {
      const lp = clamp01((p - 0.35) / (0.55 - 0.35));
      s1Frame = Math.floor(lp * 99) + 1;
      applySequenceTransform(SEQUENCES[1], 'steady16_9', 0, dims);
    } else if (p <= 0.68) {
      s1Frame = 100;
      const exitFactor = (p - 0.55) / (0.68 - 0.55);
      applySequenceTransform(SEQUENCES[1], 'exiting', exitFactor, dims);
    } else {
      applySequenceTransform(SEQUENCES[1], 'inactive', 0, dims);
    }

    if (s1Frame !== lastDrawnFrames[1]) {
      drawFramePreservingAspect(1, s1Frame);
      lastDrawnFrames[1] = s1Frame;
    }

    // ---------------- Sequence 2: WORK EXPERIENCE (299 frames) ----------------
    let s2Frame = 1;
    if (p < 0.55) {
      applySequenceTransform(SEQUENCES[2], 'inactive', 0, dims);
    } else if (p < 0.68) {
      const enterFactor = (p - 0.55) / (0.68 - 0.55);
      applySequenceTransform(SEQUENCES[2], 'entering', enterFactor, dims);
      s2Frame = 1;
    } else if (p <= 0.93) {
      const lp = clamp01((p - 0.68) / (0.93 - 0.68));
      s2Frame = Math.floor(lp * 298) + 1;
      applySequenceTransform(SEQUENCES[2], 'steady16_9', 0, dims);
    } else {
      s2Frame = 299;
      applySequenceTransform(SEQUENCES[2], 'steady16_9', 0, dims);
    }

    if (s2Frame !== lastDrawnFrames[2]) {
      drawFramePreservingAspect(2, s2Frame);
      lastDrawnFrames[2] = s2Frame;
    }

    // Update Live Frame Counter in HUD
    if (hudFrameCounter) {
      let activeNum = 1;
      let totalNum = activeSeq.totalFrames;
      if (activeSeqIdx === 0) activeNum = s0Frame;
      else if (activeSeqIdx === 1) activeNum = s1Frame;
      else if (activeSeqIdx === 2) activeNum = s2Frame;

      hudFrameCounter.textContent = `FRAME ${String(activeNum).padStart(3, '0')} / ${totalNum}`;
    }
  }

  // 5. RAF Animation Ticker
  function onScroll() {
    targetProgress = calculateProgress();
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(tickLoop);
    }
  }

  function tickLoop() {
    // Smooth lerping to eliminate jitter and stutter
    const diff = targetProgress - currentProgress;
    currentProgress += diff * 0.12;

    if (Math.abs(diff) < 0.0001) {
      currentProgress = targetProgress;
    }

    updateStoryVisuals(currentProgress);

    if (currentProgress !== targetProgress) {
      requestAnimationFrame(tickLoop);
    } else {
      isTicking = false;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    targetProgress = calculateProgress();
    currentProgress = targetProgress;
    updateStoryVisuals(currentProgress);
  }, { passive: true });

  // 6. Interactive Tab Clicks (Direct Navigation to Chapter)
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const seqTarget = parseInt(tab.getAttribute('data-target-seq') || '0', 10);
      const targetP = [0.02, 0.42, 0.76][seqTarget];
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
      const totalDist = section.offsetHeight - window.innerHeight;
      const targetScroll = sectionTop + targetP * totalDist;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    });
  });

  // Initial draw & call
  targetProgress = calculateProgress();
  currentProgress = targetProgress;
  updateStoryVisuals(currentProgress);
}
