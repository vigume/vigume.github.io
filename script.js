// ======== ANIMAÇÃO SCROLL (DESLIZAR E SUMIR) ========
const reveals = document.querySelectorAll('.reveal');

function handleScrollReveal() {
  reveals.forEach((element) => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;
    const revealPoint = 100;

    if (elementTop < windowHeight - revealPoint && elementBottom > 0) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);

// ======== MENU TOGGLE ========
const menuBtn = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');

// Abrir/fechar pelo botão
menuBtn.addEventListener('click', () => {
  sideMenu.classList.toggle('active');
});

// Fechar ao clicar fora do menu
document.addEventListener('click', (e) => {
  const isClickInside = sideMenu.contains(e.target) || menuBtn.contains(e.target);

  if (!isClickInside) {
    sideMenu.classList.remove('active');
  }
});

// ======== TEMA ESCURO/CLARO ========
const themeBtn = document.getElementById('themeToggle');

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  // Atualiza ícone
  themeBtn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});
// ====== ABAS DE SERVIÇOS ======
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.getAttribute('data-tab');

    // Remover classes 'active' anteriores
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Ativar o conteúdo atual
    button.classList.add('active');
    document.getElementById(tab).classList.add('active');
  });
});
// ====== POP-UP DO BOT WHATSAPP ======
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');

function abrirPopup() {
  popup.classList.add('active');
  overlay.classList.add('active');
}

function fecharPopup() {
  popup.classList.remove('active');
  overlay.classList.remove('active');
}

overlay.addEventListener('click', fecharPopup);

