/* ============================================================================
   Portfólio · Pedro Fernandes
   Script principal — JavaScript + jQuery
   Concentra todos os comportamentos dinâmicos do site:
     1. Menu responsivo (hamburguer)          -> jQuery
     2. Fundo do cabeçalho ao rolar            -> jQuery
     3. Efeito máquina de escrever (typewriter)-> JavaScript puro
     4. Revelação de seções ao rolar           -> IntersectionObserver
     5. Animação da barra de linguagem         -> IntersectionObserver
     6. Validação do formulário de contato     -> JavaScript puro
   ========================================================================== */

/* Executa tudo somente após o carregamento do DOM (padrão do jQuery). */
$(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     EFEITO 1 — Menu responsivo (jQuery)
     Alterna a classe .open no botão e na lista de links.
  ------------------------------------------------------------------------ */
  var $toggle = $('.nav__toggle');
  var $links = $('.nav__links');

  $toggle.on('click', function () {
    $(this).toggleClass('open');
    $links.toggleClass('open');
  });

  // Fecha o menu ao clicar em um link (útil no mobile).
  $links.find('a').on('click', function () {
    $toggle.removeClass('open');
    $links.removeClass('open');
  });

  /* ------------------------------------------------------------------------
     EFEITO 2 — Cabeçalho ganha fundo/blur ao rolar a página (jQuery)
  ------------------------------------------------------------------------ */
  var $header = $('.site-header');
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 40) {
      $header.addClass('scrolled');
    } else {
      $header.removeClass('scrolled');
    }
  });

  /* ------------------------------------------------------------------------
     EFEITO 3 — Máquina de escrever (typewriter), em JavaScript puro.
     Escreve e apaga uma lista de frases em loop no elemento #typed.
  ------------------------------------------------------------------------ */
  var typedEl = document.getElementById('typed');
  if (typedEl) {
    var phrases = [
      'desenvolvedor backend.',
      'construtor de APIs.',
      'entusiasta de Java.',
      'aprendendo na prática.'
    ];
    var pIndex = 0;   // frase atual
    var cIndex = 0;   // caractere atual
    var deleting = false;

    function typeLoop() {
      var current = phrases[pIndex % phrases.length];

      if (!deleting) {
        // Escrevendo caractere a caractere
        typedEl.textContent = current.slice(0, cIndex + 1);
        cIndex++;
        if (cIndex === current.length) {
          deleting = true;
          return setTimeout(typeLoop, 1800); // pausa no fim
        }
      } else {
        // Apagando
        typedEl.textContent = current.slice(0, cIndex - 1);
        cIndex--;
        if (cIndex === 0) {
          deleting = false;
          pIndex++;
        }
      }
      setTimeout(typeLoop, deleting ? 35 : 70);
    }
    typeLoop();
  }

  /* ------------------------------------------------------------------------
     EFEITO 4 — Revelação suave das seções ao entrar na tela.
     Usa IntersectionObserver; fallback para navegadores sem suporte.
  ------------------------------------------------------------------------ */
  var faders = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Se a seção contém a barra de linguagem, dispara a animação dela.
          var bar = entry.target.querySelector('.lang-bar__fill');
          if (bar) { bar.style.width = bar.getAttribute('data-width') || '100%'; }

          observer.unobserve(entry.target); // anima só uma vez
        }
      });
    }, { threshold: 0.12 });

    faders.forEach(function (el) { observer.observe(el); });
  } else {
    // Sem suporte: mostra tudo imediatamente.
    faders.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ------------------------------------------------------------------------
     EFEITO 6 — Validação do formulário de contato (JavaScript puro).
     Valida nome, e-mail e mensagem antes de "enviar".
  ------------------------------------------------------------------------ */
  var form = document.getElementById('contact-form');
  if (form) {
    var successBox = document.getElementById('form-success');

    // Mostra a mensagem de erro de um campo.
    function showError(input, message) {
      input.classList.add('error');
      var msgEl = document.getElementById('err-' + input.name);
      if (msgEl) { msgEl.textContent = message; }
    }
    // Limpa o erro de um campo.
    function clearError(input) {
      input.classList.remove('error');
      var msgEl = document.getElementById('err-' + input.name);
      if (msgEl) { msgEl.textContent = ''; }
    }
    // Regex simples para validar e-mail.
    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    var nome = form.elements['nome'];
    var email = form.elements['email'];
    var mensagem = form.elements['mensagem'];

    // Valida um campo individual; retorna true se estiver ok.
    function validateField(input) {
      var value = input.value.trim();

      if (input === nome) {
        if (value === '') { showError(input, 'Informe seu nome.'); return false; }
        if (value.length < 3) { showError(input, 'O nome deve ter ao menos 3 caracteres.'); return false; }
      }
      if (input === email) {
        if (value === '') { showError(input, 'Informe seu e-mail.'); return false; }
        if (!isValidEmail(value)) { showError(input, 'Digite um e-mail válido.'); return false; }
      }
      if (input === mensagem) {
        if (value === '') { showError(input, 'Escreva uma mensagem.'); return false; }
        if (value.length < 10) { showError(input, 'A mensagem deve ter ao menos 10 caracteres.'); return false; }
      }
      clearError(input);
      return true;
    }

    // Validação em tempo real ao sair do campo.
    [nome, email, mensagem].forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.classList.contains('error')) { validateField(input); }
      });
    });

    // Validação no envio.
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // impede envio real (site estático)

      var okNome = validateField(nome);
      var okEmail = validateField(email);
      var okMsg = validateField(mensagem);

      if (okNome && okEmail && okMsg) {
        // Tudo válido: exibe sucesso e limpa o formulário.
        form.reset();
        if (successBox) {
          successBox.classList.add('show');
          setTimeout(function () { successBox.classList.remove('show'); }, 6000);
        }
      } else {
        // Foca no primeiro campo com erro.
        var firstError = form.querySelector('.form-control.error');
        if (firstError) { firstError.focus(); }
      }
    });
  }

  /* ------------------------------------------------------------------------
     Extra — Marca o link de navegação da página atual como ativo.
  ------------------------------------------------------------------------ */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  $('.nav__links a').each(function () {
    var href = $(this).attr('href');
    if (href === path) { $(this).addClass('active'); }
  });
});
