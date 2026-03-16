function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const isOpen = ans.classList.contains('open');
  document.querySelectorAll('.faq-a.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q.open').forEach(q => q.classList.remove('open'));
  if (!isOpen) { ans.classList.add('open'); btn.classList.add('open'); }
}
window.toggleFaq = toggleFaq;

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); mobileMenu.classList.toggle('open'); });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); }));
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      document.querySelectorAll('.os-card').forEach(card => {
        const text = (card.innerText + ' ' + (card.dataset.search||'')).toLowerCase();
        card.classList.toggle('hidden', q.length > 0 && !text.includes(q));
      });
    });
  }

  const questions = [
    { q: "What will you mainly use your computer for?", options: [{ text:"Gaming & entertainment",icon:"🎮",scores:{win:3,ubuntu:1,mint:1,mac:0}},{text:"Work & office tasks",icon:"💼",scores:{win:2,ubuntu:2,mint:2,mac:3}},{text:"Programming & coding",icon:"💻",scores:{win:1,ubuntu:3,mint:1,mac:3}},{text:"Browsing & social media",icon:"🌐",scores:{win:2,ubuntu:2,mint:3,mac:2}}]},
    { q: "How old is your computer?", options: [{text:"Brand new (2021+)",icon:"✨",scores:{win:3,ubuntu:2,mint:1,mac:2}},{text:"A few years old (2016-20)",icon:"📅",scores:{win:2,ubuntu:3,mint:2,mac:1}},{text:"Old machine (before 2016)",icon:"🖥",scores:{win:0,ubuntu:2,mint:3,mac:0}},{text:"It's a Mac",icon:"🍎",scores:{win:0,ubuntu:0,mint:0,mac:4}}]},
    { q: "How comfortable are you with computers?", options: [{text:"Total beginner",icon:"🌱",scores:{win:3,ubuntu:1,mint:3,mac:3}},{text:"I know the basics",icon:"👍",scores:{win:2,ubuntu:2,mint:3,mac:2}},{text:"Fairly comfortable",icon:"🔧",scores:{win:2,ubuntu:3,mint:2,mac:2}},{text:"Advanced / power user",icon:"⚡",scores:{win:1,ubuntu:3,mint:2,mac:2}}]},
    { q: "How important is privacy to you?", options: [{text:"Not a priority",icon:"😊",scores:{win:3,ubuntu:1,mint:1,mac:2}},{text:"Somewhat important",icon:"🔒",scores:{win:2,ubuntu:2,mint:2,mac:2}},{text:"Very important",icon:"🛡",scores:{win:0,ubuntu:3,mint:3,mac:2}},{text:"Maximum privacy",icon:"🕵",scores:{win:0,ubuntu:2,mint:2,mac:1}}]},
    { q: "What's your budget for software?", options: [{text:"I want everything free",icon:"🆓",scores:{win:1,ubuntu:3,mint:3,mac:0}},{text:"Happy to pay for quality",icon:"💳",scores:{win:2,ubuntu:1,mint:1,mac:3}},{text:"I already have a license",icon:"🔑",scores:{win:3,ubuntu:1,mint:1,mac:2}},{text:"No preference",icon:"🤷",scores:{win:2,ubuntu:2,mint:2,mac:2}}]}
  ];

  const results = {
    win:    {name:"Windows 11",   icon:"🪟",color:"#0ea5e9",desc:"You'll love Windows 11! Great for gaming, widest software library, and familiar feel.",link:"windows11.html",btnClass:"btn-win"},
    ubuntu: {name:"Ubuntu Linux", icon:"🐧",color:"#f97316",desc:"Ubuntu is your match! Powerful, free, super secure, with a massive support community.",link:"ubuntu.html",   btnClass:"btn-ubu"},
    mint:   {name:"Linux Mint",   icon:"🌿",color:"#10b981",desc:"Linux Mint is perfect! Looks like Windows, runs great on older hardware, completely free.",link:"mint.html",     btnClass:"btn-lin"},
    mac:    {name:"macOS Sequoia",icon:"🍎",color:"#a855f7",desc:"macOS is ideal! Polished, secure, seamlessly connected with Apple's ecosystem.",link:"macos.html",    btnClass:"btn-mac"}
  };

  let current = 0;
  const scores = {win:0,ubuntu:0,mint:0,mac:0};
  const quizEl = document.getElementById('quiz');
  if (!quizEl) return;

  function renderQuestion() {
    const q = questions[current];
    const pct = (current / questions.length) * 100;
    quizEl.innerHTML = `<div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div><p style="color:var(--muted);font-size:0.8rem;font-family:var(--mono);margin-bottom:0.75rem">Question ${current+1} of ${questions.length}</p><div class="quiz-question">${q.q}</div><div class="quiz-options">${q.options.map((o,i)=>`<div class="quiz-option" onclick="pickOption(${i})"><span style="font-size:1.2rem">${o.icon}</span><span>${o.text}</span></div>`).join('')}</div>`;
  }

  window.pickOption = function(i) {
    const opts = questions[current].options[i].scores;
    Object.keys(opts).forEach(k => scores[k] += opts[k]);
    current++;
    if (current < questions.length) { renderQuestion(); } else { showResult(); }
  };

  function showResult() {
    const winner = Object.keys(scores).reduce((a,b) => scores[a]>scores[b]?a:b);
    const r = results[winner];
    quizEl.innerHTML = `<div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:100%"></div></div><div class="quiz-result"><div class="quiz-result-icon" style="background:${r.color}22;border:1px solid ${r.color}44"><span style="font-size:2rem">${r.icon}</span></div><h3>Your perfect OS: <span style="color:${r.color}">${r.name}</span></h3><p>${r.desc}</p><div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap"><a class="download-btn ${r.btnClass}" href="${r.link}" style="width:auto;padding:0.75rem 1.75rem">View Download Options</a><button class="quiz-restart" onclick="restartQuiz()">↺ Retake Quiz</button></div></div>`;
  }

  window.restartQuiz = function() { current=0; Object.keys(scores).forEach(k=>scores[k]=0); renderQuestion(); };
  renderQuestion();
});
