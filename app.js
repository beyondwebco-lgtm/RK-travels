/* ==========================================================================
   SKYBRIDGE UNIVERSAL LLP - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileDrawer();
  initEnquiryModals();
  initForms();
  initSmoothScroll();
  initActiveNavSpy();
  initStatCounters();
});

/* 1. Navbar Sticky & Blur Effect */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* 2. Mobile Drawer Navigation */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const drawerEnquireBtn = document.getElementById('btn-drawer-enquire');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  if (drawerEnquireBtn) {
    drawerEnquireBtn.addEventListener('click', () => {
      closeDrawer();
      openEnquiryModal('General Inquiry');
    });
  }
}

/* 3. Enquiry Modal Controller */
const modalBackdrop = document.getElementById('enquiry-modal');
const modalServiceTitle = document.getElementById('modal-service-title');
const modalHiddenService = document.getElementById('modal-hidden-service');

function openEnquiryModal(serviceName = 'General Inquiry') {
  if (!modalBackdrop) return;
  
  if (modalServiceTitle) {
    modalServiceTitle.textContent = `Enquire: ${serviceName}`;
  }
  if (modalHiddenService) {
    modalHiddenService.value = serviceName;
  }

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEnquiryModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

// Global scope export for inline onclick triggers
window.openEnquiryModal = openEnquiryModal;
window.closeEnquiryModal = closeEnquiryModal;

function initEnquiryModals() {
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const headerEnquireBtn = document.getElementById('btn-header-enquire');

  if (headerEnquireBtn) {
    headerEnquireBtn.addEventListener('click', () => openEnquiryModal('Corporate & Travel Services'));
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeEnquiryModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeEnquiryModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeEnquiryModal();
    }
  });
}

/* 4. Form Handlers & Feedback */
function initForms() {
  // Hero Quick Selector Form
  const quickForm = document.getElementById('hero-quick-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const service = document.getElementById('quick-service').value;
      const region = document.getElementById('quick-region').value;
      const type = document.getElementById('quick-type').value;
      const budget = document.getElementById('quick-budget').value;

      openEnquiryModal(`${service} (${region})`);
      
      const notesEl = document.getElementById('modal-notes');
      if (notesEl) {
        notesEl.value = `Selected Requirements:\n• Service: ${service}\n• Region: ${region}\n• Type: ${type}\n• Investment/Budget: ${budget}`;
      }
      
      const regionSelect = document.getElementById('modal-region');
      if (regionSelect && regionSelect.querySelector(`option[value="${region}"]`)) {
        regionSelect.value = region;
      }
    });
  }

  // Modal Enquiry Form
  const modalForm = document.getElementById('modal-enquiry-form');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-name').value.trim();
      const phone = document.getElementById('modal-phone').value.trim();
      const service = modalHiddenService ? modalHiddenService.value : 'Inquiry';

      if (!name || !phone) {
        showToast('Please fill in required contact fields.', 'error');
        return;
      }

      closeEnquiryModal();
      modalForm.reset();
      showToast(`Thank you, ${name}! Your consultation request for ${service} has been received. Our senior advisor will reach out shortly.`, 'success');
    });
  }

  // Main Contact Section Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const service = document.getElementById('contact-service').value;

      if (!name || !phone || !service) {
        showToast('Please complete all mandatory fields.', 'error');
        return;
      }

      contactForm.reset();
      showToast(`Thank you, ${name}! Your inquiry for ${service} has been submitted to Skybridge Universal LLP.`, 'success');
    });
  }
}

/* 5. Luxury Toast Notification System */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const icon = type === 'success' 
    ? '<i class="fa-solid fa-circle-check toast-icon"></i>' 
    : '<i class="fa-solid fa-triangle-exclamation toast-icon" style="color:#ef4444;"></i>';

  toast.innerHTML = `
    ${icon}
    <div style="font-size: 0.9rem; line-height: 1.4;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4800);
}

/* 6. Active Navigation Link Spy */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* 7. Smooth Scroll for internal anchors */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* 8. Number Animation for Stats */
function initStatCounters() {
  const stats = document.querySelectorAll('.about-stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach(stat => {
          const rawText = stat.textContent.trim();
          const target = parseInt(rawText.replace(/\D/g, ''), 10);
          const hasPlus = rawText.includes('+');
          const hasPercent = rawText.includes('%');
          
          if (!isNaN(target)) {
            let count = 0;
            const step = Math.max(1, Math.floor(target / 20));
            const timer = setInterval(() => {
              count += step;
              if (count >= target) {
                count = target;
                clearInterval(timer);
              }
              stat.textContent = `${count}${hasPlus ? '+' : ''}${hasPercent ? '%' : ''}`;
            }, 50);
          }
        });
      }
    });
  }, { threshold: 0.5 });

  const statSection = document.querySelector('.about-stats');
  if (statSection) {
    observer.observe(statSection);
  }
}
