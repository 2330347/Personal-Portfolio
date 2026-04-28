/* ========== PARTICLE BACKGROUND ========== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108,99,255,${this.opacity})`; ctx.fill();
  }
}
for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.update(); p.draw();
    particles.slice(i + 1).forEach(p2 => {
      const dx = p.x - p2.x, dy = p.y - p2.y, dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(108,99,255,${0.1 * (1 - dist / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
      }
    });
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ========== CUSTOM CURSOR ========== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
if (cursor && follower && window.innerWidth > 768) {
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function updateCursor() {
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    fx += (mx - 18 - fx) * 0.3; fy += (my - 18 - fy) * 0.3;
    follower.style.transform = `translate(${fx}px, ${fy}px)`;
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
  document.querySelectorAll('a, button, .project-image-wrapper, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => { follower.style.width = '60px'; follower.style.height = '60px'; follower.style.borderColor = '#00d4ff'; });
    el.addEventListener('mouseleave', () => { follower.style.width = '36px'; follower.style.height = '36px'; follower.style.borderColor = '#00d4ff'; });
  });
}

/* ========== TYPEWRITER ========== */
const roles = ['Web Developer', 'ECS Student', 'Problem Solver', 'Tech Enthusiast'];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter');
function typewrite() {
  const current = roles[roleIdx];
  typeEl.textContent = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);
  let speed = isDeleting ? 40 : 80;
  if (!isDeleting && charIdx > current.length) { speed = 2000; isDeleting = true; }
  if (isDeleting && charIdx < 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; speed = 400; }
  setTimeout(typewrite, speed);
}
typewrite();

/* ========== NAVBAR ========== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // Back to top
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  // Active nav link
  const sections = document.querySelectorAll('section');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
  allNavLinks.forEach(l => { l.classList.toggle('active', l.getAttribute('data-section') === current); });
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});
allNavLinks.forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navLinks.classList.remove('active');
}));

/* ========== SCROLL ANIMATIONS ========== */
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.scroll-anim').forEach(el => scrollObserver.observe(el));

/* ========== COUNTER ANIMATION ========== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        const target = +counter.dataset.count;
        const duration = 2000, step = target / (duration / 16);
        let current = 0;
        const update = () => {
          current += step;
          if (current >= target) { counter.textContent = target; return; }
          counter.textContent = Math.floor(current);
          requestAnimationFrame(update);
        };
        update();
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.about-stats');
if (statsEl) counterObserver.observe(statsEl);

/* ========== BACK TO TOP ========== */
document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========== TILT EFFECT ON SKILL CARDS ========== */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ========== CONTACT FORM ========== */
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit span');
  btn.textContent = 'Message Sent!';
  setTimeout(() => { btn.textContent = 'Send Message'; e.target.reset(); }, 3000);
});

/* ========== SMOOTH SCROLL FOR ANCHORS ========== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
