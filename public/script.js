document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const questionSection = document.getElementById('question-section');
    const successSection = document.getElementById('success-section');
    const heartBackground = document.getElementById('heart-background');
    const canvas = document.getElementById('particle-mesh-canvas');
    const ctx = canvas.getContext('2d');

    const loopWrapper = document.getElementById('gallery-loop-wrapper');
    const galleryScrollArea = document.getElementById('gallery-scroll-area');
    const tvFrame = document.querySelector('.tv-frame');
    const happinessModal = document.getElementById('happiness-modal');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    // --- Asset Loading ---
    const assets = {
        barcelona: new Image(),
        realmadrid: new Image()
    };
    assets.barcelona.src = 'assets/pngimg.com%20-%20fcb_logo_PNG14.png';
    assets.realmadrid.src = 'assets/Real_madrid_logo_PNG1.png';

    // --- Floating Hearts Layer ---
    function createHeart() {
        if (successSection.classList.contains('active') && !happinessModal.classList.contains('active')) return;
        const heart = document.createElement('div');
        const theme = ['gold', 'outline', 'filled', 'soft'][Math.floor(Math.random() * 4)];
        heart.classList.add('floating-heart', theme);
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heart.style.opacity = Math.random() * 0.4;
        heartBackground.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }
    setInterval(createHeart, 1500);

    // --- Antigravity Attraction Canvas Engine ---
    let particles = [];
    const particleCount = 80;
    let mouse = { x: -1000, y: -1000 };
    let time = 0;

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            // Origin Coordinates (Fixed base)
            this.originX = Math.random() * canvas.width;
            this.originY = Math.random() * canvas.height;

            // Interaction Coordinates (Current state)
            this.x = this.originX;
            this.y = this.originY;

            this.size = 30;
            this.type = ['barcelona', 'realmadrid', 'heart'][Math.floor(Math.random() * 3)];
            this.phase = Math.random() * Math.PI * 2;

            // Physics Props
            this.vx = 0;
            this.vy = 0;
            this.friction = 0.88;
            this.springTension = 0.035;
        }

        update() {
            // 1. Antigravity Attraction Force (Towards Mouse)
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.hypot(dx, dy);
            const radius = 500;

            if (distance < radius && distance > 0) {
                const force = (radius - distance) / radius;
                // Attraction pull force
                this.vx += (dx / distance) * force * 1.5;
                this.vy += (dy / distance) * force * 1.5;
            }

            // 2. Elastic Spring-Back Force (Towards Origin)
            const sx = (this.originX - this.x) * this.springTension;
            const sy = (this.originY - this.y) * this.springTension;
            this.vx += sx;
            this.vy += sy;

            // 3. Physics Integration
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.x += this.vx;
            this.y += this.vy;

            // 4. Sea-Sway Visual Layer (Oscillation)
            this.swayX = Math.sin(time + this.phase) * 5;
            this.swayY = Math.cos(time * 0.8 + this.phase) * 5;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x + this.swayX, this.y + this.swayY);
            ctx.globalAlpha = 0.35;

            if (this.type === 'heart') {
                ctx.fillStyle = '#ff4d6d';
                ctx.font = '1.4rem serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('❤️', 0, 0);
            } else {
                const img = assets[this.type];
                if (img.complete) {
                    ctx.drawImage(img, -this.size / 2, -this.size / 2, this.size, this.size);
                }
            }
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    resizeCanvas();

    function animate() {
        if (successSection.classList.contains('active')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.02;

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();

    // --- Fluent No Button Behavior ---
    let hasInteractedWithNo = false;
    const noEmojis = ['😭', '🥺', '😢', '💔', '😤', '😵', '🤯', '😅', '🙃', '😭'];

    function moveNoButton(mouseX, mouseY) {
        const rect = noBtn.getBoundingClientRect();

        // --- FIX TELEPORTING ---
        // Capture current layout position before switching to 'fixed'
        if (!hasInteractedWithNo) {
            const initialX = rect.left;
            const initialY = rect.top;
            noBtn.style.left = `${initialX}px`;
            noBtn.style.top = `${initialY}px`;
            noBtn.classList.add('moving');
            hasInteractedWithNo = true;
        }

        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        let dx = btnCenterX - mouseX;
        let dy = btnCenterY - mouseY;
        const dist = Math.hypot(dx, dy);
        const pushDist = 220;

        let targetX = rect.left + (dx / dist) * pushDist;
        let targetY = rect.top + (dy / dist) * pushDist;

        const padding = 60;
        const maxX = window.innerWidth - rect.width - padding;
        const maxY = window.innerHeight - rect.height - padding;

        if (targetX < padding || targetX > maxX || targetY < padding || targetY > maxY) {
            targetX = Math.max(padding, Math.random() * maxX);
            targetY = Math.max(padding, Math.random() * maxY);
        }

        noBtn.style.left = `${targetX}px`;
        noBtn.style.top = `${targetY}px`;
        noBtn.innerText = `NO ${noEmojis[Math.floor(Math.random() * noEmojis.length)]}`;
    }

    questionSection.addEventListener('mousemove', (e) => {
        const rect = noBtn.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
        if (dist < 150) moveNoButton(e.clientX, e.clientY);
    });

    // --- MOBILE TOUCH SUPPORT ---
    questionSection.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const rect = noBtn.getBoundingClientRect();
        const dist = Math.hypot(touch.clientX - (rect.left + rect.width / 2), touch.clientY - (rect.top + rect.height / 2));
        if (dist < 150) {
            e.preventDefault(); // Prevent scrolling while interacting
            moveNoButton(touch.clientX, touch.clientY);
        }
    }, { passive: false });

    questionSection.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = noBtn.getBoundingClientRect();
        const dist = Math.hypot(touch.clientX - (rect.left + rect.width / 2), touch.clientY - (rect.top + rect.height / 2));
        if (dist < 150) {
            e.preventDefault();
            moveNoButton(touch.clientX, touch.clientY);
        }
    }, { passive: false });

    // --- Editorial Mosaic & Infinite Scroll Engine ---
    let worldCoords = { x: 0, y: 0 };
    let targetCoords = { x: 0, y: 0 };
    let gridDims = { width: 0, height: 0 };
    let isGalleryActive = false;
    const placeholderTexts = [
        "Every moment with you feels like a dream I never want to wake up from.",
        "You are the best thing that ever happened to me.",
        "You are my favorite view in the entire world.",
        "Life is beautiful since you came into it.",
        "I could travel the world, but my favorite place will always be right next to you.",
        "Every love story is beautiful, but ours is my favorite.",
        "You're my forever and always.",
        "My heart is and always will be yours.",
        "You are my today and all of my tomorrows.",
        "I love you more than words can say.",
        "You are my greatest adventure.",
        "Home is wherever I am with you."
    ];
    // --- Asset Helpers ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const galleryImages = [
        "20250219_122308.jpg",
        "IMG-20250114-WA0075.jpg",
        "IMG_20250304_145356_372.jpg",
        "IMG_20250306_220916_008.jpg",
        "IMG_20250329_000120_093.jpg",
        "IMG_20250330_133338_168.jpg",
        "IMG_20250519_194837_435.jpg",
        "IMG_20250522_201635_403.jpg",
        "IMG_20250601_172157_395.jpg",
        "IMG_20250824_021224_728.jpg",
        "IMG_20250914_165953_904.jpg",
        "IMG_20250914_170039_663.jpg",
        "IMG_20251010_000800_295.jpg",
        "IMG_20251011_151824_890.jpg",
        "IMG_20251011_151839_128.jpg",
        "IMG_20251130_220728_281(1).jpg",
        "IMG_20260122_213755_620.jpg",
        "IMG_20260213_201034_889.jpg",
        "IMG_20260213_201047_449.jpg",
        "IMG_20260213_201049_497.jpg",
        "IMG_20260213_201052_218.jpg",
        "IMG_20260213_201054_572.jpg",
        "IMG_20260213_201056_353.jpg",
        "IMG_20260213_201100_712.jpg",
        "IMG_20260213_201102_478.jpg",
        "IMG_20260213_201117_256.jpg",
        "IMG_8873.jpeg",
        "Picsart_25-04-16_12-20-49-363.jpg",
        "Screenshot_20250418_224118_Meet.jpg",
        "Screenshot_20250503_011633_Gmail.jpg",
        "Screenshot_20250503_123000_Meet.jpg",
        "Screenshot_20250810_004455_Instagram(3)(2)(1).jpg"
    ];

    function initGallery() {
        const shuffledImages = shuffleArray([...galleryImages]);
        const totalItems = 60; // Increased to ensure variety
        const textIndices = new Set();

        // Strict spacing logic: Ensure at least 4 items between text cards
        let lastTextIndex = -10;
        for (let i = 0; i < totalItems; i++) {
            if (i - lastTextIndex >= 5 && Math.random() > 0.8) {
                textIndices.add(i);
                lastTextIndex = i;
            }
        }

        const masterGrid = document.createElement('div');
        masterGrid.classList.add('portfolio-grid');

        // Track image consumption to avoid skipping photos
        let photoCounter = 0;
        for (let i = 0; i < totalItems; i++) {
            const isText = textIndices.has(i);
            const stagger = Math.floor(Math.random() * 40);

            if (isText) {
                const card = document.createElement('div');
                card.classList.add('gallery-text-card');
                card.style.marginTop = `${stagger}px`;
                card.innerHTML = `<p>${placeholderTexts[i % placeholderTexts.length]}</p>`;
                masterGrid.appendChild(card);
            } else {
                const typeRand = Math.random();
                let itemClass = 'portrait';
                if (typeRand > 0.8) itemClass = 'hero';
                else if (typeRand > 0.5) itemClass = 'landscape';

                const item = document.createElement('div');
                item.classList.add('gallery-item', itemClass);
                item.style.marginTop = `${stagger}px`;
                const img = document.createElement('img');
                const fileName = shuffledImages[photoCounter % shuffledImages.length];
                img.src = `Sho/${fileName}`;
                item.appendChild(img);
                item.addEventListener('click', () => { lightbox.style.display = 'flex'; lightboxImg.src = img.src; });
                masterGrid.appendChild(item);
                photoCounter++;
            }
        }

        for (let i = 0; i < 9; i++) {
            const clone = masterGrid.cloneNode(true);
            clone.querySelectorAll('.gallery-item').forEach((item, idx) => {
                const originalImg = masterGrid.querySelectorAll('.gallery-item img')[idx];
                item.addEventListener('click', () => { lightbox.style.display = 'flex'; lightboxImg.src = originalImg.src; });
            });
            loopWrapper.appendChild(clone);
        }
        setTimeout(() => {
            const firstGrid = loopWrapper.children[0];
            if (!firstGrid) return;
            gridDims.width = firstGrid.offsetWidth;
            gridDims.height = firstGrid.offsetHeight;
            targetCoords.x = gridDims.width;
            targetCoords.y = gridDims.height;
            worldCoords.x = targetCoords.x;
            worldCoords.y = targetCoords.y;
            isGalleryActive = true;
            requestAnimationFrame(renderLoop);
        }, 600);
        galleryScrollArea.addEventListener('wheel', (e) => {
            e.preventDefault();
            targetCoords.x += e.deltaX;
            targetCoords.y += e.deltaY;
        }, { passive: false });

        // --- Touch Interactions for Mobile & iPad ---
        let lastTouchX = 0;
        let lastTouchY = 0;
        let isTouching = false;

        galleryScrollArea.addEventListener('touchstart', (e) => {
            isTouching = true;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        }, { passive: false });

        galleryScrollArea.addEventListener('touchmove', (e) => {
            if (!isTouching) return;
            // Prevent default system scrolling
            e.preventDefault();

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;

            const dx = lastTouchX - currentX;
            const dy = lastTouchY - currentY;

            targetCoords.x += dx * 1.5; // Sensitivity boost for touch
            targetCoords.y += dy * 1.5;

            lastTouchX = currentX;
            lastTouchY = currentY;
        }, { passive: false });

        galleryScrollArea.addEventListener('touchend', () => {
            isTouching = false;
        });
    }

    function renderLoop() {
        if (!isGalleryActive) return;
        const lerp = 0.08;
        const prevX = worldCoords.x;
        const prevY = worldCoords.y;
        worldCoords.x += (targetCoords.x - worldCoords.x) * lerp;
        worldCoords.y += (targetCoords.y - worldCoords.y) * lerp;
        if (worldCoords.x >= gridDims.width * 2) { worldCoords.x -= gridDims.width; targetCoords.x -= gridDims.width; }
        else if (worldCoords.x <= 0) { worldCoords.x += gridDims.width; targetCoords.x += gridDims.width; }
        if (worldCoords.y >= gridDims.height * 2) { worldCoords.y -= gridDims.height; targetCoords.y -= gridDims.height; }
        else if (worldCoords.y <= 0) { worldCoords.y += gridDims.height; targetCoords.y += gridDims.height; }
        galleryScrollArea.scrollLeft = worldCoords.x;
        galleryScrollArea.scrollTop = worldCoords.y;

        const velocity = Math.hypot(worldCoords.x - prevX, worldCoords.y - prevY);
        const tvRect = tvFrame.getBoundingClientRect();
        const centerX = tvRect.left + tvRect.width / 2;
        const centerY = tvRect.top + tvRect.height / 2;
        const allItems = document.querySelectorAll('.gallery-item, .gallery-text-card');
        allItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.right < -100 || rect.left > window.innerWidth + 100 || rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
            const dx = (rect.left + rect.width / 2) - centerX;
            const dy = (rect.top + rect.height / 2) - centerY;
            const distNorm = Math.hypot(dx, dy) / 1000;
            const hDist = Math.abs(dx) / (tvRect.width / 2);
            const blurTrigger = Math.max(0, (hDist - 0.45) * 2);
            const blur = Math.min(velocity * 0.08 * blurTrigger, 5);
            item.style.filter = blur > 0.2 ? `blur(${blur}px)` : 'none';
            const z = -distNorm * 50;
            const rx = dy * -0.01;
            const ry = dx * 0.01;
            item.style.transform = `translate3d(0,0,${z}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            item.style.opacity = Math.max(0.6, 1 - distNorm * 0.5);
        });
        requestAnimationFrame(renderLoop);
    }

    yesBtn.addEventListener('click', () => {
        questionSection.style.display = 'none';
        canvas.style.display = 'none';
        successSection.classList.add('active');
        happinessModal.classList.add('active');
        initGallery();
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

        // Local Asset Priority with Remote Fallback
        const localTrack = 'assets/Even Now [wauY3JQ7gLM].mp3';
        const remoteTracks = [
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
        ];

        console.log("Attempting local track:", localTrack);
        bgMusic.src = localTrack;
        bgMusic.load();
        bgMusic.volume = 0.5;

        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log("Success! Playing local track.");
            }).catch(error => {
                console.warn("Local play failed, switching to remote stream:", error);
                const randomRemote = remoteTracks[Math.floor(Math.random() * remoteTracks.length)];
                bgMusic.src = randomRemote;
                bgMusic.load();
                bgMusic.play().catch(e => console.error("Remote playback also failed:", e));
            });
        }
    });

    // --- Music Toggle Logic ---
    let isMuted = false;
    musicToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        bgMusic.muted = isMuted;
        musicToggle.innerHTML = isMuted ? '🔇' : '🎵';
        musicToggle.classList.toggle('muted', isMuted);
    });

    closePopupBtn.addEventListener('click', () => { happinessModal.classList.remove('active'); });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('close-lightbox')) lightbox.style.display = 'none';
    });
});
