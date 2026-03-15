// ============================
// FAQ Toggle Functionality
// ============================
function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const isOpen = ans.classList.contains('open');

  // Close all open FAQs
  document.querySelectorAll('.faq-a.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q.open').forEach(q => q.classList.remove('open'));

  // Open clicked FAQ if it wasn't already open
  if (!isOpen) {
    ans.classList.add('open');
    btn.classList.add('open');
  }
}

// ============================
// Scroll Reveal Animation
// ============================
const observeRevealElements = () => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', observeRevealElements);

// Export for use in HTML
window.toggleFaq = toggleFaq;