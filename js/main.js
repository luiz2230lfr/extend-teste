/*
 * Agência Extend · comportamento da página
 * Formulário (componente único), WhatsApp, rastreamento, consentimento,
 * cabeçalho, barra fixa do celular, sanfona e reveal.
 * O título dinâmico (H1) fica num script inline logo depois do H1, para rodar antes da primeira pintura.
 */
(function () {
  'use strict';

  var doc = document;
  var reduzMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Armazenamento seguro (pode falhar em aba anônima) ---------- */
  function ler(chave) { try { return window.localStorage.getItem(chave); } catch (e) { return null; } }
  function gravar(chave, valor) { try { window.localStorage.setItem(chave, valor); } catch (e) { /* sem armazenamento */ } }
  function apagar(chave) { try { window.localStorage.removeItem(chave); } catch (e) { /* sem armazenamento */ } }

  var CHAVE_CONSENTIMENTO = 'extend_consentimento';
  var CHAVE_ATRIBUICAO = 'extend_atribuicao';
  var CAMPOS_ATRIBUICAO = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'wbraid', 'gbraid', 'fbclid'];

  function consentimento() { return ler(CHAVE_CONSENTIMENTO); }

  /* ---------- Atribuição (UTMs e IDs de clique), só para as tags ---------- */
  var atribuicaoDaUrl = {};
  (function () {
    var p = new URLSearchParams(window.location.search);
    CAMPOS_ATRIBUICAO.forEach(function (k) {
      var v = p.get(k);
      if (v) atribuicaoDaUrl[k] = v.slice(0, 200);
    });
  })();

  function atribuicaoSalva() {
    var bruto = ler(CHAVE_ATRIBUICAO);
    if (!bruto) return {};
    try {
      var o = JSON.parse(bruto);
      if (!o || typeof o.expira !== 'number' || o.expira < Date.now()) { apagar(CHAVE_ATRIBUICAO); return {}; }
      return o.dados || {};
    } catch (e) { apagar(CHAVE_ATRIBUICAO); return {}; }
  }

  /* Guarda por ATRIBUICAO_DIAS, mas só depois do aceite (LGPD). */
  function salvarAtribuicao() {
    if (!Object.keys(atribuicaoDaUrl).length) return;
    var dias = typeof ATRIBUICAO_DIAS === 'number' ? ATRIBUICAO_DIAS : 90;
    gravar(CHAVE_ATRIBUICAO, JSON.stringify({ expira: Date.now() + dias * 864e5, dados: atribuicaoDaUrl }));
  }

  function atribuicao() {
    if (Object.keys(atribuicaoDaUrl).length) return atribuicaoDaUrl;
    return consentimento() === 'aceito' ? atribuicaoSalva() : {};
  }

  /* utm_source normalizado. Sem utm_source, os IDs de clique indicam a plataforma. */
  function origemAtual() {
    var a = atribuicao();
    var fonte = String(a.utm_source || '').toLowerCase();
    if (fonte) return fonte;
    if (a.gclid || a.gbraid || a.wbraid) return 'google';
    if (a.fbclid) return 'meta';
    return '';
  }

  /* ---------- Mensagem do WhatsApp ---------- */
  var limpar = function (v, max) {
    return String(v || '')
      .replace(/[*_~`\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  };

  function codigoOrigem(fonte) {
    return { google: 'g', meta: 'm', facebook: 'm', instagram: 'm' }[String(fonte || '').toLowerCase()] || 'o';
  }

  function montarMensagem(d) {
    var linhas = [MENSAGEM_CURTA, ''];
    [['Nome', limpar(d.nome, 60)], ['Empresa', limpar(d.empresa, 80)],
     ['Segmento', limpar(d.segmento, 40)], ['Já investe em anúncios', limpar(d.investe, 40)]]
      .forEach(function (par) { if (par[1]) linhas.push('*' + par[0] + ':* ' + par[1]); });
    linhas.push('', '#' + codigoOrigem(d.utm_source));
    return linhas.join('\n');
  }

  function mensagemCurta(fonte) {
    return MENSAGEM_CURTA + '\n\n#' + codigoOrigem(fonte);
  }

  function linkWhatsApp(texto) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(texto);
  }

  /* ---------- Rastreamento ---------- */
  window.dataLayer = window.dataLayer || [];

  var EVENTOS_META = { scroll_50: 'ViewContent', lead_form: 'Lead', whatsapp_click: 'Contact' };

  /* Nunca envia nome nem empresa para as tags. page_view das plataformas sai pelos próprios scripts ao carregar. */
  function track(evento, dados) {
    var seguro = {};
    if (dados) {
      ['segmento', 'investe', 'local', 'formulario'].forEach(function (k) { if (dados[k]) seguro[k] = dados[k]; });
    }
    var payload = { event: evento };
    Object.keys(seguro).forEach(function (k) { payload[k] = seguro[k]; });
    window.dataLayer.push(payload);

    if (evento === 'page_view') return;
    if (typeof window.gtag === 'function') window.gtag('event', evento, seguro);
    if (typeof window.fbq === 'function' && EVENTOS_META[evento]) window.fbq('track', EVENTOS_META[evento]);
  }

  var tagsCarregadas = false;
  function carregarScript(src) {
    var s = doc.createElement('script');
    s.async = true;
    s.src = src;
    doc.head.appendChild(s);
  }

  /* Só carrega com aceite e com IDs preenchidos em config.js (validados por formato). */
  function carregarTags() {
    if (tagsCarregadas || consentimento() !== 'aceito') return;
    tagsCarregadas = true;

    if (/^GTM-[A-Z0-9]+$/.test(GTM_ID)) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      carregarScript('https://www.googletagmanager.com/gtm.js?id=' + GTM_ID);
    }
    if (/^AW-\d+$/.test(GOOGLE_ADS_ID)) {
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GOOGLE_ADS_ID);
      carregarScript('https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS_ID);
    }
    if (/^\d+$/.test(META_PIXEL_ID)) {
      /* Snippet oficial do Pixel, reescrito sem minificação */
      var fbq = window.fbq = function () {
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments); else fbq.queue.push(arguments);
      };
      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
      carregarScript('https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', META_PIXEL_ID);
      fbq('track', 'PageView');
    }
  }

  /* ---------- Aviso de cookies ---------- */
  function iniciarCookies() {
    var aviso = doc.getElementById('cookie');
    if (!aviso) return;
    var atual = consentimento();
    if (atual === 'aceito') { salvarAtribuicao(); carregarTags(); return; }
    if (atual === 'recusado') return;

    aviso.hidden = false;
    doc.body.classList.add('cookie-open');
    aviso.addEventListener('click', function (e) {
      var botao = e.target.closest('[data-consent]');
      if (!botao) return;
      var escolha = botao.getAttribute('data-consent');
      gravar(CHAVE_CONSENTIMENTO, escolha);
      aviso.hidden = true;
      doc.body.classList.remove('cookie-open');
      if (escolha === 'aceito') { salvarAtribuicao(); carregarTags(); }
      else apagar(CHAVE_ATRIBUICAO);
    });
  }

  /* ---------- Botões de WhatsApp fora do formulário ---------- */
  function iniciarBotoesWhatsApp() {
    doc.querySelectorAll('[data-wa]').forEach(function (a) {
      a.href = linkWhatsApp(mensagemCurta(origemAtual()));
      a.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        var url = linkWhatsApp(mensagemCurta(origemAtual()));
        track('whatsapp_click', { local: a.getAttribute('data-wa') });
        setTimeout(function () { window.location.assign(url); }, 300);
      });
    });
  }

  /* ---------- Formulário: um componente, várias instâncias ---------- */
  var leadRegistrado = false;   /* lead_form dispara uma única vez por página */
  var contadorFormularios = 0;

  function criarFormulario(ponto) {
    var tpl = doc.getElementById('tpl-form');
    if (!tpl || !ponto) return null;
    var frag = tpl.content.cloneNode(true);
    var uid = 'form' + (++contadorFormularios);

    frag.querySelectorAll('[data-id]').forEach(function (el) { el.id = uid + '-' + el.getAttribute('data-id'); });
    frag.querySelectorAll('[data-for]').forEach(function (el) { el.htmlFor = uid + '-' + el.getAttribute('data-for'); });
    frag.querySelectorAll('[data-describedby]').forEach(function (el) {
      el.setAttribute('aria-describedby', uid + '-' + el.getAttribute('data-describedby'));
    });
    frag.querySelectorAll('input[type="radio"]').forEach(function (el) { el.name = uid + '-investe'; });

    var titulo = frag.querySelector('[data-slot="titulo"]');
    titulo.textContent = ponto.getAttribute('data-titulo') || 'Fale com a Extend';
    titulo.id = uid + '-titulo';

    var form = frag.querySelector('form');
    form.setAttribute('aria-labelledby', titulo.id);
    var status = frag.querySelector('.form-status');
    var botao = form.querySelector('button[type="submit"]');
    var rotuloBotao = botao.querySelector('.btn-label');
    var textoBotao = rotuloBotao.textContent;
    var reserva = frag.querySelector('[data-slot="wa-fallback"]');
    var voltar = frag.querySelector('[data-slot="voltar"]');
    var campoNome = form.querySelector('[name="nome"]');
    var campoEmpresa = form.querySelector('[name="empresa"]');
    var tentouEnviar = false;

    ponto.appendChild(frag);
    var card = ponto.querySelector('.form-card');
    var linkAlternativo = card.querySelector('.form-alt [data-wa]');

    function erro(campo, mensagem) {
      var alvo = doc.getElementById(campo.id + '-erro');
      if (mensagem) {
        campo.setAttribute('aria-invalid', 'true');
        alvo.textContent = mensagem;
      } else {
        campo.removeAttribute('aria-invalid');
        alvo.textContent = '';
      }
    }

    function validar() {
      var ok = true;
      if (campoNome.value.trim().length < 2) { erro(campoNome, 'Digite o seu nome, com pelo menos 2 letras.'); ok = false; }
      else erro(campoNome, '');
      if (!campoEmpresa.value.trim()) { erro(campoEmpresa, 'Digite o nome da sua empresa.'); ok = false; }
      else erro(campoEmpresa, '');
      marcarEstado(campoNome);
      marcarEstado(campoEmpresa);
      return ok;
    }

    /* Estados visuais: preenchido e válido (o erro só aparece depois da primeira tentativa de envio) */
    function campoValido(campo) {
      return campo === campoNome ? campo.value.trim().length >= 2 : campo.value.trim().length > 0;
    }
    function marcarEstado(campo) {
      campo.classList.toggle('is-filled', campo.value.trim().length > 0);
      campo.classList.toggle('is-valid', campoValido(campo) && !campo.getAttribute('aria-invalid'));
    }
    [campoNome, campoEmpresa].forEach(function (campo) {
      campo.addEventListener('input', function () { if (tentouEnviar) validar(); if (campo.classList.contains('is-valid') || tentouEnviar) marcarEstado(campo); });
      campo.addEventListener('blur', function () { if (tentouEnviar) validar(); marcarEstado(campo); });
    });
    var campoSegmento = form.querySelector('[name="segmento"]');
    campoSegmento.addEventListener('change', function () { campoSegmento.classList.toggle('is-filled', !!campoSegmento.value); });

    function restaurar() {
      botao.disabled = false;
      botao.removeAttribute('aria-busy');
      botao.classList.remove('is-loading');
      rotuloBotao.textContent = textoBotao;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      tentouEnviar = true;
      if (!validar()) {
        (campoNome.getAttribute('aria-invalid') ? campoNome : campoEmpresa).focus();
        return;
      }
      var marcado = form.querySelector('input[type="radio"]:checked');
      var dados = {
        nome: campoNome.value,
        empresa: campoEmpresa.value,
        segmento: form.querySelector('[name="segmento"]').value,
        investe: marcado ? marcado.value : '',
        utm_source: origemAtual()
      };

      botao.disabled = true;
      botao.setAttribute('aria-busy', 'true');
      botao.classList.add('is-loading');
      rotuloBotao.textContent = 'Abrindo o WhatsApp...';

      if (!leadRegistrado) {
        leadRegistrado = true;
        track('lead_form', { segmento: limpar(dados.segmento, 40), investe: limpar(dados.investe, 40), formulario: ponto.getAttribute('data-titulo') });
      }

      var url = linkWhatsApp(montarMensagem(dados));
      reserva.href = url;
      form.hidden = true;
      if (linkAlternativo) linkAlternativo.parentNode.hidden = true;
      status.hidden = false;
      setTimeout(function () { window.location.assign(url); }, 300);
    });

    voltar.addEventListener('click', function () {
      status.hidden = true;
      form.hidden = false;
      if (linkAlternativo) linkAlternativo.parentNode.hidden = false;
      restaurar();
      campoNome.focus();
    });

    /* Voltando do WhatsApp pelo botão "voltar" do navegador (bfcache) */
    window.addEventListener('pageshow', function (ev) { if (ev.persisted) restaurar(); });

    return card;
  }

  /* ---------- Sanfona ---------- */
  function iniciarSanfona() {
    doc.querySelectorAll('[data-accordion] .faq-q').forEach(function (botao) {
      botao.addEventListener('click', function () {
        var painel = doc.getElementById(botao.getAttribute('aria-controls'));
        var aberto = botao.getAttribute('aria-expanded') === 'true';
        botao.setAttribute('aria-expanded', String(!aberto));
        painel.hidden = aberto;
      });
    });
  }

  /* ---------- Cabeçalho, barra fixa do celular ---------- */
  function iniciarObservadores() {
    var header = doc.getElementById('cabecalho');
    var hero = doc.getElementById('topo');
    var barra = doc.getElementById('mobile-bar');
    var formularios = doc.querySelectorAll('.form-section');
    /* Ao rolar: cabeçalho mais baixo, translúcido e com desfoque */
    function marcarRolagem() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', marcarRolagem, { passive: true });
    marcarRolagem();
    if (!('IntersectionObserver' in window)) return;

    var heroVisivel = true;
    var formsVisiveis = new Set();
    /* No celular, o aviso de cookies espera o hero sair da tela e some com o formulário à vista (CSS),
       para nunca cobrir o botão principal nem o formulário. Nenhuma tag carrega antes do aceite. */
    doc.body.classList.add('cookie-hold');

    function atualizarBarra() {
      var mostrar = !heroVisivel && formsVisiveis.size === 0;
      doc.body.classList.toggle('cookie-hold', !mostrar);
      barra.classList.toggle('is-visible', mostrar);
      barra.setAttribute('aria-hidden', String(!mostrar));
      barra.querySelectorAll('a').forEach(function (a) { a.tabIndex = mostrar ? 0 : -1; });
    }

    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        heroVisivel = en.isIntersecting;
      });
      atualizarBarra();
    }, { rootMargin: '-72px 0px 0px 0px' }).observe(hero);

    var obsForm = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        var card = en.target;
        if (en.isIntersecting) formsVisiveis.add(card); else formsVisiveis.delete(card);
      });
      atualizarBarra();
    }, { threshold: 0 });
    formularios.forEach(function (f) { obsForm.observe(f.querySelector('.form-card') || f); });
  }

  /* ---------- Reveal ao rolar (poucos blocos) + linha do processo ---------- */
  function iniciarReveal() {
    /* Stagger curto dentro de um grupo: 0, 60, 120ms... */
    doc.querySelectorAll('[data-stagger]').forEach(function (grupo) {
      grupo.querySelectorAll('.reveal').forEach(function (el, i) { el.style.setProperty('--d', (i * 60) + 'ms'); });
    });
    var itens = Array.prototype.slice.call(doc.querySelectorAll('.reveal, .steps'));
    if (reduzMovimento || !('IntersectionObserver' in window)) {
      itens.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    itens.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Rolagem de 50% (opcional) ---------- */
  function iniciarScroll50() {
    var disparado = false;
    function checar() {
      if (disparado) return;
      var el = doc.documentElement;
      if ((window.scrollY + window.innerHeight) / el.scrollHeight >= 0.5) {
        disparado = true;
        track('scroll_50');
        window.removeEventListener('scroll', checar);
      }
    }
    window.addEventListener('scroll', checar, { passive: true });
  }

  /* ---------- Início ---------- */
  track('page_view');
  doc.querySelectorAll('[data-form-mount]').forEach(criarFormulario);
  iniciarBotoesWhatsApp();
  iniciarSanfona();
  iniciarObservadores();
  iniciarReveal();
  iniciarScroll50();
  iniciarCookies();

  /* Exposto para testes no console (não altera nada na página) */
  window.Extend = { limpar: limpar, montarMensagem: montarMensagem, mensagemCurta: mensagemCurta, linkWhatsApp: linkWhatsApp, codigoOrigem: codigoOrigem, track: track };
})();
