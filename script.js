// --- Navigation & Routing ---
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const menuBtn = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

function switchPage(pageId) {
    sections.forEach(sec => sec.classList.remove('active-section'));
    document.getElementById(pageId).classList.add('active-section');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) item.classList.add('active');
    });
    if (navLinks.classList.contains('show')) navLinks.classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add click event listeners to nav items
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        switchPage(item.dataset.page);
    });
});

// Mobile menu toggle
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

// --- Typing Effect ---
const typeText = ["Data Analyst", "AI Enthusiast", "C++ Developer", "Full-stack Dev"];
let typeIndex = 0,
    charIndex = 0,
    isDeleting = false;
const typeTarget = document.getElementById("typewriter");

function typeWriter() {
    if (!typeTarget) return;

    const currentText = typeText[typeIndex];
    typeTarget.textContent = isDeleting ? currentText.substring(0, charIndex - 1) : currentText.substring(0, charIndex + 1);
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        typeIndex = (typeIndex + 1) % typeText.length;
        typeSpeed = 500;
    }
    setTimeout(typeWriter, typeSpeed);
}

// --- 3D Tilt Effect ---
function initTiltEffect() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        });
    });
}

// --- Modal Logic ---
const modal = document.getElementById("certModal");
const modalImg = document.getElementById("modalImage");

// Make functions global so they can be called from HTML onclick
window.openModal = function(url) {
    if (!modal || !modalImg) return;
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add('show'), 10);
    modalImg.src = url;
    document.body.style.overflow = 'hidden';
}

window.closeModal = function() {
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }, 300);
}

window.onclick = function(event) {
    if (event.target == modal) closeModal();
};

// --- Toast & Form ---
function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i class="fas fa-check-circle" style="color:#4ade80"></i> ${msg}`;
    container.appendChild(t);

    setTimeout(() => {
        t.style.animation = 'slideIn 0.3s reverse forwards';
        setTimeout(() => t.remove(), 300);
    }, 3000);
}

// Make function global for form submission
window.handleFormSubmit = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    if (!btn) return;

    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        showToast("Message sent successfully!");
        e.target.reset();
        btn.innerHTML = original;
        btn.disabled = false;
    }, 1500);
}

// --- Canvas Network Animation ---
const canvas = document.getElementById('bgCanvas');
let ctx, particles = [];
let animationFrame;

function initCanvas() {
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    initParticles();
    animateParticles();
}

let mouse = { x: null, y: null };

window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        if (!ctx) return;
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    if (!canvas) return;
    particles = [];
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++)
        particles.push(new Particle());
}

function animateParticles() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();

        // Connect particles
        particles.forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 - dist/1200})`; // Indigo tint
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });

    animationFrame = requestAnimationFrame(animateParticles);
}

// Handle window resize
window.addEventListener('resize', () => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start typing effect
    typeWriter();

    // Initialize tilt effect
    initTiltEffect();

    // Initialize canvas
    initCanvas();

    // Add active class to current nav item based on visible section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.dataset.page === id) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
});

// Clean up animation frame on page unload
window.addEventListener('beforeunload', () => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
});