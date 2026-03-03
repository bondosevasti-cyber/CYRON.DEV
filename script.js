// ====== Mouse Glow Effect ======
document.addEventListener('mousemove', (e) => {
    const glow = document.getElementById('mouse-glow');
    if (glow) {
        glow.style.setProperty('--x', `${e.clientX}px`);
        glow.style.setProperty('--y', `${e.clientY}px`);
    }
});

// ====== Math Canvas Particle Network ======
const canvas = document.getElementById('math-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    let width, height;
    let particles = [];
    const connectionDistance = 350; // Increased for long LED lines effect
    let mouse = { x: null, y: null };
    let hoveredRect = null;

    // Track mouse for interactive glow and card connections
    window.addEventListener('mousemove', (e) => {
        // Use pageX/pageY instead of clientX/clientY because the canvas is now Absolute
        mouse.x = e.pageX;
        mouse.y = e.pageY;

        // Efficiently find if we are hovering over a glass card
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const card = el ? el.closest('.rounded-3xl, .bg-white\\/5') : null;

        if (card) {
            const rect = card.getBoundingClientRect();
            hoveredRect = {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY,
                right: rect.right + window.scrollX,
                bottom: rect.bottom + window.scrollY
            };
        } else {
            hoveredRect = null;
        }
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
        hoveredRect = null;
    });

    function initCanvas() {
        width = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, window.innerWidth);
        height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, window.innerHeight);
        canvas.width = width;
        canvas.height = height;

        particles = [];
        // Calculate a stable number of particles scaling across the full height of the site, maxing at 140
        const numParticles = Math.min(140, Math.floor((width * height) / 35000));

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2, // Personal glowing pulse phase
                // Card connection properties
                cornerIndex: i % 4,
                lineProgress: 0,
                targetX: 0,
                targetY: 0
            });
        }
    }

    function animateCanvas() {
        requestAnimationFrame(animateCanvas);
        ctx.clearRect(0, 0, width, height);

        // Screen mode for bright overlapping neon lights
        ctx.globalCompositeOperation = 'screen';

        // Update Position & Draw Nodes
        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.phase += 0.02; // Pulsating frequency

            // Wrap edges for a continuous infinite flow
            if (p.x < -100) p.x = width + 100;
            if (p.x > width + 100) p.x = -100;
            if (p.y < -100) p.y = height + 100;
            if (p.y > height + 100) p.y = -100;

            // Draw glowing node without heavy shadowBlur (which causes extreme lag)
            const pulse = (Math.sin(p.phase) + 1) / 2;

            // Outer glow layer
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(250, 204, 21, ${(0.1 + pulse * 0.2)})`;
            ctx.fill();

            // Inner solid node
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(250, 204, 21, ${0.4 + pulse * 0.6})`;
            ctx.fill();
        });

        // Fast LED lines
        ctx.lineWidth = 1.2;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    let mouseDist = 1000;
                    if (mouse.x !== null && mouse.y !== null) {
                        const midX = (p1.x + p2.x) / 2;
                        const midY = (p1.y + p2.y) / 2;
                        mouseDist = Math.hypot(midX - mouse.x, midY - mouse.y);
                    }

                    const distanceRatio = 1 - (distance / connectionDistance);
                    // Light up intensely near the cursor
                    const interactBoost = mouseDist < 250 ? 0.5 : 0;
                    const finalOpacity = Math.max(0.02, distanceRatio * 0.4 + interactBoost);

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(250, 204, 21, ${finalOpacity})`;
                    ctx.stroke();
                }
            }
        }

        // --- Magnetic Card Connections (Laser Beams) ---
        let activeCorners = [];
        let cx = 0, cy = 0;
        if (hoveredRect) {
            activeCorners = [
                { x: hoveredRect.left, y: hoveredRect.top },
                { x: hoveredRect.right, y: hoveredRect.top },
                { x: hoveredRect.right, y: hoveredRect.bottom },
                { x: hoveredRect.left, y: hoveredRect.bottom }
            ];
            cx = (hoveredRect.left + hoveredRect.right) / 2;
            cy = (hoveredRect.top + hoveredRect.bottom) / 2;
        }

        let connectedLines = 0;
        particles.forEach((p, i) => {
            let shouldConnect = false;
            if (activeCorners.length > 0 && i % 3 === 0 && connectedLines < 10) { // Limit to 10 lines max
                const distDist = Math.hypot(p.x - cx, p.y - cy);
                if (distDist < 800) { // Seek particles within 800px range
                    shouldConnect = true;
                    connectedLines++;
                    p.targetX = activeCorners[p.cornerIndex].x;
                    p.targetY = activeCorners[p.cornerIndex].y;
                }
            }

            // Smoothly animate the laser progress
            if (shouldConnect) {
                p.lineProgress += 0.05;
                if (p.lineProgress > 1) p.lineProgress = 1;
            } else {
                p.lineProgress -= 0.05;
                if (p.lineProgress < 0) p.lineProgress = 0;
            }

            // Draw the targeting laser if active
            if (p.lineProgress > 0) {
                const currentX = p.x + (p.targetX - p.x) * p.lineProgress;
                const currentY = p.y + (p.targetY - p.y) * p.lineProgress;

                // Generate realistic optical laser beam using Canvas Gradients
                const gradient = ctx.createLinearGradient(p.x, p.y, currentX, currentY);
                gradient.addColorStop(0, `rgba(250, 204, 21, 0)`); // Fades out at origin point
                gradient.addColorStop(0.5, `rgba(250, 204, 21, ${p.lineProgress * 0.4})`); // Beam body
                gradient.addColorStop(0.95, `rgba(250, 204, 21, ${p.lineProgress})`); // Bright neon tip

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(currentX, currentY);

                // Add real glow property (heavy but fine for just 10 maximum lines)
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.6;
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(250, 204, 21, ${p.lineProgress})`;
                ctx.stroke();

                // Draw an intense collision 'spark/impact element' exactly AT the corner
                if (p.lineProgress > 0.95) {
                    ctx.beginPath();
                    ctx.arc(currentX, currentY, 3.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, 1)`; // White hot core at impact
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = 'rgba(250, 204, 21, 1)'; // Neon yellow surrounding explosion glow
                    ctx.fill();
                }

                ctx.shadowBlur = 0; // Essential reset: prevent lag on other particles
            }
        });

        ctx.globalCompositeOperation = 'source-over'; // Reset
    }

    window.addEventListener('resize', initCanvas);
    initCanvas();
    animateCanvas();
}

// ====== GSAP Scroll Animations ======
document.addEventListener("DOMContentLoaded", (event) => {
    // Ensure GSAP & ScrollTrigger are loaded
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Staggered wave animations for individual reveal elements
        const reveals = document.querySelectorAll('.gs-reveal');

        reveals.forEach((reveal) => {
            gsap.fromTo(reveal,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: reveal,
                        start: "top 85%", // Trigger when top of element hits 85% of viewport
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Add stagger for grid items (Services/Projects/Cards), but exclude grids inside Modals
        const groups = document.querySelectorAll('main .grid, section .grid');
        groups.forEach((group) => {
            const children = Array.from(group.children);
            // Ignore if empty or is a grid without actual cards
            if (children && children.length > 0) {
                gsap.fromTo(children,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.15, // Staggered wave effect
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: group,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        });

    }
});
