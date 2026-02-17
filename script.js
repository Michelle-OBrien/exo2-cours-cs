// ============================================
// EFFETS VISUELS & INTERACTIVITÉ - CAVE LUXE
// ============================================

// État du panier
let cartItems = [];
let cartCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  initializeParticles();
  initializeScrollAnimations();
  initializeFormEffects();
  initializeCartButtons();
  initializeNavigationEffects();
  initializeRippleEffects();
});

// ============================================
// 1. PARTICULES FLOTTANTES (EFFET BULLE)
// ============================================
function initializeParticles() {
  const header = document.querySelector('header');
  
  function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      border: 2px solid rgba(212, 175, 55, 0.3);
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.6;
    `;
    
    const size = Math.random() * 40 + 20;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = -size + 'px';
    
    header.appendChild(particle);
    
    const duration = Math.random() * 3 + 4;
    const delay = Math.random() * 2;
    
    particle.animate([
      { transform: 'translateY(0) translateX(0)', opacity: 0.6 },
      { transform: `translateY(${header.offsetHeight + 100}px) translateX(${Math.random() * 100 - 50}px)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      delay: delay * 1000,
      easing: 'ease-in'
    });
    
    setTimeout(() => particle.remove(), (duration + delay) * 1000 + 100);
  }
  
  setInterval(createParticle, 2000);
}

// ============================================
// 2. ANIMATIONS AU SCROLL (REVEAL)
// ============================================
function initializeScrollAnimations() {
  const articles = document.querySelectorAll('article');
  const sections = document.querySelectorAll('main > section');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.animation = 'fadeInScale 0.8s ease-out forwards';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  articles.forEach(article => observer.observe(article));
  sections.forEach(section => {
    if (section !== document.querySelector('main > section:first-child')) {
      section.style.animation = 'fadeInUp 0.8s ease-out forwards';
    }
  });
  
  // Ajouter les animations CSS
  if (!document.querySelector('style[data-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animations', '');
    style.textContent = `
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulseGlow {
        0%, 100% {
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        50% {
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.8);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================
// 3. EFFECTS FORMULAIRES
// ============================================
function initializeFormEffects() {
  const inputs = document.querySelectorAll('input, select, textarea');
  const submitButtons = document.querySelectorAll('form button[type="submit"]');
  
  // Focus effects
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.transition = 'all 0.3s ease';
      this.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.4)';
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.style.boxShadow = 'none';
      }
    });
  });
  
  // Validation feedback
  submitButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const form = this.closest('form');
      if (form && form.checkValidity()) {
        this.style.animation = 'scaleButton 0.6s ease';
        
        // Afficher confirmation
        const originalText = this.textContent;
        this.textContent = '✓ Validé !';
        this.style.background = '#4CAF50';
        
        setTimeout(() => {
          this.textContent = originalText;
          this.style.background = '';
          this.style.animation = '';
        }, 2000);
      }
    });
  });
  
  // Ajouter animation scaleButton
  if (!document.querySelector('style[data-button-anim]')) {
    const style = document.createElement('style');
    style.setAttribute('data-button-anim', '');
    style.textContent = `
      @keyframes scaleButton {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================
// 4. BOUTONS "AJOUTER AU PANIER" - EFFET SPARKLE
// ============================================
function initializeCartButtons() {
  const cartButtons = document.querySelectorAll('article form button');
  
  cartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (e.target.tagName !== 'BUTTON') return;
      
      // Créer un compteur de panier
      if (!document.querySelector('.cart-badge')) {
        const badge = document.createElement('div');
        badge.className = 'cart-badge';
        badge.style.cssText = `
          position: fixed;
          top: 90px;
          right: 20px;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.9), rgba(240, 217, 168, 0.9));
          border: 2px solid #D4AF37;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #1a1a1a;
          font-size: 20px;
          z-index: 999;
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
        `;
        badge.textContent = '0';
        document.body.appendChild(badge);
      }
      
      const badge = document.querySelector('.cart-badge');
      cartCount++;
      badge.textContent = cartCount;
      
      // Animation du badge
      badge.animate([
        { transform: 'scale(1.3)', offset: 0 },
        { transform: 'scale(1)', offset: 1 }
      ], {
        duration: 400,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      });
      
      // Créer des sparkles autour du bouton
      createSparkles(e.pageX, e.pageY);
      
      // Feedback sur le bouton
      button.style.animation = 'pulse 0.6s ease';
      setTimeout(() => button.style.animation = '', 600);
    });
  });
  
  // Animation pulse
  if (!document.querySelector('style[data-pulse]')) {
    const style = document.createElement('style');
    style.setAttribute('data-pulse', '');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { 
          transform: scale(1);
          box-shadow: 0 6px 15px rgba(212, 175, 55, 0.3);
        }
        50% { 
          transform: scale(1.08);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.6);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Créer des étincelles animées
function createSparkles(x, y) {
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 8px;
      height: 8px;
      background: radial-gradient(circle, #D4AF37, rgba(212, 175, 55, 0));
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
    `;
    
    document.body.appendChild(sparkle);
    
    const angle = (i / 5) * Math.PI * 2;
    const distance = 100;
    
    sparkle.animate([
      { 
        transform: 'translate(0, 0) scale(1)', 
        opacity: 1 
      },
      { 
        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, 
        opacity: 0 
      }
    ], {
      duration: 800,
      easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
    });
    
    setTimeout(() => sparkle.remove(), 800);
  }
}

// ============================================
// 5. EFFETS DE NAVIGATION
// ============================================
function initializeNavigationEffects() {
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.textShadow = '0 0 20px rgba(212, 175, 55, 0.5)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.textShadow = 'none';
    });
    
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Petit flash sur l'élément cible
        targetElement.animate([
          { backgroundColor: 'rgba(212, 175, 55, 0.2)' },
          { backgroundColor: 'transparent' }
        ], {
          duration: 1000,
          easing: 'ease-out'
        });
      }
    });
  });
}

// ============================================
// 6. EFFETS RIPPLE AU CLIC
// ============================================
function initializeRippleEffects() {
  const buttons = document.querySelectorAll('button, a[href]');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Ne pas créer de ripple sur les liens de navigation
      if (this.closest('nav')) return;
      
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      
      // Si le clic vient du clavier
      if (e.clientX === 0 && e.clientY === 0) {
        x = rect.width / 2;
        y = rect.height / 2;
      }
      
      ripple.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: translate(-50%, -50%);
      `;
      
      if (this.style.position === 'static') {
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
      }
      
      this.insertBefore(ripple, this.firstChild);
      
      ripple.animate([
        { 
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1
        },
        { 
          transform: 'translate(-50%, -50%) scale(20)',
          opacity: 0
        }
      ], {
        duration: 600,
        easing: 'ease-out'
      });
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ============================================
// 7. EFFET PARALLAXE LÉGER SUR SCROLL
// ============================================
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const scrolled = window.scrollY;
  
  if (header) {
    header.style.backgroundPosition = `0 ${scrolled * 0.3}px`;
  }
  
  // Glow effect sur le titre au scroll
  const title = document.querySelector('header h1');
  if (title && scrolled > 100) {
    title.style.textShadow = `0 0 ${20 + scrolled / 20}px rgba(212, 175, 55, 0.4)`;
  }
});

// ============================================
// 8. EFFET GLOW SUR LES PRIX AU HOVER
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const priceElements = document.querySelectorAll('article p:nth-child(2)');
  
  priceElements.forEach(price => {
    price.addEventListener('mouseenter', function() {
      this.style.animation = 'priceGlow 0.6s ease';
    });
    
    price.addEventListener('mouseleave', function() {
      this.style.animation = 'none';
    });
  });
  
  // Animation pour les prix
  if (!document.querySelector('style[data-price-glow]')) {
    const style = document.createElement('style');
    style.setAttribute('data-price-glow', '');
    style.textContent = `
      @keyframes priceGlow {
        0% {
          text-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
          transform: scale(1);
        }
        50% {
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.8);
          transform: scale(1.05);
        }
        100% {
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  }
});

// ============================================
// 9. ANIMATION DES DÉTAILS (DETAILS TAG)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const details = document.querySelectorAll('details');
  
  details.forEach(detail => {
    detail.addEventListener('toggle', function() {
      const content = this.querySelector('p');
      if (content) {
        if (this.open) {
          content.style.animation = 'slideDown 0.4s ease-out';
        } else {
          content.style.animation = 'slideUp 0.4s ease-out';
        }
      }
    });
  });
  
  // Animations pour les détails
  if (!document.querySelector('style[data-details-anim]')) {
    const style = document.createElement('style');
    style.setAttribute('data-details-anim', '');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
          max-height: 0;
        }
        to {
          opacity: 1;
          transform: translateY(0);
          max-height: 500px;
        }
      }
      
      @keyframes slideUp {
        from {
          opacity: 1;
          transform: translateY(0);
          max-height: 500px;
        }
        to {
          opacity: 0;
          transform: translateY(-10px);
          max-height: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
});

// ============================================
// 10. MESSAGE DE BIENVENUE AVEC ANIMATION
// ============================================
window.addEventListener('load', () => {
  const header = document.querySelector('header');
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glowIn {
      0% {
        opacity: 0;
        filter: blur(10px);
      }
      100% {
        opacity: 1;
        filter: blur(0);
      }
    }
    
    header {
      animation: glowIn 0.8s ease-out !important;
    }
  `;
  document.head.appendChild(style);
});

console.log('✨ Effets visuels luxueux activés!');
