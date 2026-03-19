/* ═══════════════════════════════════════════
   ISO HUB — JavaScript Engine
   Companion script for OS sub-pages
═══════════════════════════════════════════ */
'use strict';

// ── FAQ Toggle ──
function toggleFaq(btn) {
  const a = btn.nextElementSibling;
  const isOpen = a.classList.contains('open');
  document.querySelectorAll('.faq-a.open').forEach(x => x.classList.remove('open'));
  document.querySelectorAll('.faq-q.open').forEach(x => x.classList.remove('open'));
  if (!isOpen) { a.classList.add('open'); btn.classList.add('open'); }
}
window.toggleFaq = toggleFaq;

// ── Scroll Reveal ──
const io = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
  }),
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ── Hamburger ──
  const hbtn = document.getElementById('hbtn');
  const mmenu = document.getElementById('mmenu');
  if (hbtn && mmenu) {
    hbtn.addEventListener('click', () => {
      hbtn.classList.toggle('open');
      mmenu.classList.toggle('open');
    });
    mmenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        hbtn.classList.remove('open');
        mmenu.classList.remove('open');
      })
    );
  }

  // ── Search (sub-pages) ──
  const si = document.getElementById('searchInput');
  if (si) {
    si.addEventListener('input', () => {
      const q = si.value.toLowerCase().trim();
      document.querySelectorAll('.os-card').forEach(c => {
        const txt = (c.innerText + ' ' + (c.dataset.s || '')).toLowerCase();
        c.classList.toggle('hidden', q.length > 0 && !txt.includes(q));
      });
    });
  }

  // ── Quiz (if present on page) ──
  const quizEl = document.getElementById('quiz');
  if (!quizEl) return;

  const Qs = [
    { q: "What will you primarily use this machine for?", opts: [
      { t: "Gaming & entertainment", i: "🎮", s: { w:3,u:1,m:0,l:1 } },
      { t: "Work & productivity", i: "💼", s: { w:2,u:2,m:3,l:2 } },
      { t: "Programming & dev", i: "💻", s: { w:1,u:3,m:3,l:1 } },
      { t: "Casual browsing", i: "🌐", s: { w:2,u:2,m:2,l:3 } },
    ]},
    { q: "How old is your target machine?", opts: [
      { t: "Brand new (2022+)", i: "✨", s: { w:3,u:2,m:2,l:1 } },
      { t: "A few years (2017–21)", i: "🗓", s: { w:2,u:3,m:1,l:2 } },
      { t: "Old machine (pre-2016)", i: "🖥", s: { w:0,u:2,m:0,l:3 } },
      { t: "It's a Mac", i: "🍎", s: { w:0,u:0,m:4,l:0 } },
    ]},
    { q: "Rate your technical comfort level", opts: [
      { t: "Complete beginner", i: "🌱", s: { w:3,u:1,m:3,l:3 } },
      { t: "Know the basics", i: "👍", s: { w:2,u:2,m:2,l:3 } },
      { t: "Pretty comfortable", i: "🔧", s: { w:2,u:3,m:2,l:2 } },
      { t: "Advanced user", i: "⚡", s: { w:1,u:3,m:2,l:2 } },
    ]},
    { q: "How important is privacy to you?", opts: [
      { t: "Not a priority", i: "😊", s: { w:3,u:1,m:2,l:1 } },
      { t: "Somewhat important", i: "🔒", s: { w:2,u:2,m:2,l:2 } },
      { t: "Very important", i: "🛡", s: { w:0,u:3,m:2,l:3 } },
      { t: "Maximum privacy", i: "🕵", s: { w:0,u:2,m:1,l:2 } },
    ]},
    { q: "What's your software budget?", opts: [
      { t: "I want everything free", i: "🆓", s: { w:1,u:3,m:0,l:3 } },
      { t: "Happy to pay for quality", i: "💳", s: { w:2,u:1,m:3,l:1 } },
      { t: "Already have a license", i: "🔑", s: { w:3,u:1,m:2,l:1 } },
      { t: "No preference", i: "🤷", s: { w:2,u:2,m:2,l:2 } },
    ]},
  ];

  const Rs = {
    w: { name:"Windows 11", color:"#0ea5e9", icon:"🪟",
         desc:"Windows 11 is your perfect match — unbeatable gaming support, widest software library, and familiar interface.",
         link:"windows11.html", btn:"bw" },
    u: { name:"Ubuntu Linux", color:"#f97316", icon:"🐧",
         desc:"Ubuntu is ideal for you — powerful, completely free, secure, with the largest Linux community behind it.",
         link:"ubuntu.html", btn:"bu" },
    m: { name:"macOS Sequoia", color:"#a855f7", icon:"🍎",
         desc:"macOS is your match — beautifully polished, incredibly secure, and perfect for creative professionals.",
         link:"macos.html", btn:"bm" },
    l: { name:"Linux Mint", color:"#10b981", icon:"🌿",
         desc:"Linux Mint is perfect for you — Windows-like UI, runs great on older hardware, completely free.",
         link:"mint.html", btn:"bl" },
  };

  let cur = 0;
  const scores = { w:0, u:0, m:0, l:0 };

  function render() {
    const q = Qs[cur];
    const pct = Math.round((cur / Qs.length) * 100);
    quizEl.innerHTML = `
      <div class="quiz-bar"><div class="quiz-fill" id="qfill" style="width:${pct}%"></div></div>
      <div class="quiz-meta">Question ${cur+1} of ${Qs.length}</div>
      <div class="quiz-q">${q.q}</div>
      <div class="quiz-opts">
        ${q.opts.map((o,i) => `
          <div class="quiz-opt" onclick="pickOpt(${i})">
            <div class="quiz-opt-icon">${o.i}</div>
            <span>${o.t}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  window.pickOpt = function(i) {
    const s = Qs[cur].opts[i].s;
    Object.keys(s).forEach(k => scores[k] += s[k]);
    cur++;
    if (cur < Qs.length) { render(); } else { showResult(); }
  };

  function showResult() {
    const winner = Object.keys(scores).reduce((a,b) => scores[a] > scores[b] ? a : b);
    const r = Rs[winner];
    try { localStorage.setItem('iso-hub-rec', JSON.stringify({ os:winner, name:r.name, ts:Date.now() })); } catch(e) {}
    quizEl.innerHTML = `
      <div class="quiz-bar"><div class="quiz-fill" style="width:100%"></div></div>
      <div class="quiz-result">
        <div class="result-badge" style="background:${r.color}18;border:1px solid ${r.color}33">${r.icon}</div>
        <h3>Your perfect OS: <span style="color:${r.color}">${r.name}</span></h3>
        <p>${r.desc}</p>
        <div class="quiz-actions">
          <a class="dl-btn ${r.btn}" href="${r.link}" style="width:auto;padding:.75rem 1.75rem">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            View Download
          </a>
          <button class="quiz-retry" onclick="retryQuiz()">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
            Retake Quiz
          </button>
        </div>
      </div>
    `;
  }

  window.retryQuiz = function() {
    cur = 0; Object.keys(scores).forEach(k => scores[k] = 0); render();
  };

  render();
});
