(function () {
  'use strict';

  // =========================================================
  // ГОЛОВНІ НАЛАШТУВАННЯ (редагуйте тут, зміни підтягнуться на всі сайти)
  // =========================================================
  var CONFIG = {
    position: 'top-right', // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    zIndex: 500,           // Нижче за модалку підписки (якщо налазить, зменшіть до 90)
    offsetX: 20,           // Відступ зліва/справа (px)
    offsetY: 20            // Відступ зверху/знизу (px)
  };

  var THEMES = {
    'ejeba.com':        { accent: '#627b37', title: '#39491f', btn: '#627b37', hover: '#4d622a', border: '#cfd8be', bg: '#ffffff' },
    'ejmeb.com':        { accent: '#e08a1e', title: '#2a5885', btn: '#b86812', hover: '#96530c', border: '#e2d6c5', bg: '#ffffff' },
    'scientia-tss.com': { accent: '#e85500', title: '#1a1a1a', btn: '#c94600', hover: '#a33800', border: '#e6d8c5', bg: '#fffdf9' },
    'ejiss.com':        { accent: '#0e794d', title: '#074d30', btn: '#0e794d', hover: '#095c3a', border: '#c5ddd2', bg: '#ffffff' },
    'ejsmt.com':        { accent: '#20469e', title: '#1c2c60', btn: '#20469e', hover: '#163375', border: '#cdd8ea', bg: '#ffffff' },
    'jcpmr.com':        { accent: '#ab4338', title: '#3d5a6c', btn: '#ab4338', hover: '#8f362d', border: '#d9cfc1', bg: '#ffffff' },
    'jaitd.com':        { accent: '#b56eb0', title: '#5e2156', btn: '#8c2a7b', hover: '#6e1f60', border: '#e2cfe0', bg: '#ffffff' },
    'ermcr.com':        { accent: '#b89028', title: '#1f3a52', btn: '#1f3a52', hover: '#15293b', border: '#dfd3bc', bg: '#ffffff' }
  };

  var DEFAULT_THEME = { accent: '#3d5a6c', title: '#1f3a52', btn: '#3d5a6c', hover: '#2c4352', border: '#d0d7de', bg: '#ffffff' };

  var CSS_TEXT = [
    '.jlang-region{--j-y:20px;--j-x:20px;--j-z:500;--j-accent:#3d5a6c;--j-title:#1f3a52;--j-btn:#3d5a6c;--j-btn-hover:#2c4352;--j-border:#d0d7de;--j-bg:#ffffff;position:fixed;z-index:var(--j-z);max-width:min(320px,calc(100vw - 24px));font-family:inherit;pointer-events:none}',
    '.jlang-toast{margin:0;padding:14px 16px 12px;background:var(--j-bg);color:#2c2c2c;border:1px solid var(--j-border);border-top:4px solid var(--j-accent);border-radius:3px;box-shadow:0 8px 24px rgba(30,30,35,.16);position:fixed;z-index:var(--j-z);max-width:min(320px,calc(100vw - 24px));box-sizing:border-box;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(var(--j-shift,-12px));transition:opacity .25s ease,transform .25s ease,visibility .25s ease}',
    '.jlang-pos-top-right{inset:var(--j-y) var(--j-x) auto auto;--j-shift:-12px}',
    '.jlang-pos-top-left{inset:var(--j-y) auto auto var(--j-x);--j-shift:-12px}',
    '.jlang-pos-bottom-right{inset:auto var(--j-x) var(--j-y) auto;--j-shift:12px}',
    '.jlang-pos-bottom-left{inset:auto auto var(--j-y) var(--j-x);--j-shift:12px}',
    '.jlang-toast.is-visible{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0)}',
    '@media (prefers-reduced-motion:reduce){.jlang-toast{transition:none}}',
    '.jlang-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px}',
    '.jlang-title{margin:0;font-size:.95rem;font-weight:700;line-height:1.3;color:var(--j-title)}',
    '.jlang-close{flex:0 0 auto;background:transparent;border:0;padding:0 4px;margin:-2px -4px 0 0;font-size:1.25rem;line-height:1;color:#5c554e;cursor:pointer;border-radius:2px}',
    '.jlang-close:hover,.jlang-close:focus-visible{color:var(--j-accent);outline:2px solid var(--j-accent);outline-offset:2px}',
    '.jlang-desc{margin:0 0 12px;font-size:.85rem;line-height:1.45;color:#444}',
    '.jlang-btn{display:inline-block;width:100%;box-sizing:border-box;text-align:center;padding:8px 14px;background:var(--j-btn);color:#fff!important;text-decoration:none!important;font-size:.85rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;border-radius:2px;transition:background-color .2s ease}',
    '.jlang-btn:hover,.jlang-btn:focus-visible{background:var(--j-btn-hover);color:#fff!important;outline:2px solid var(--j-accent);outline-offset:2px}',
    '.jlang-stay{display:block;width:100%;margin-top:6px;padding:6px 8px;background:transparent;border:0;color:#5c554e;font-family:inherit;font-size:.8rem;line-height:1.3;text-align:center;text-decoration:underline;text-underline-offset:2px;cursor:pointer;border-radius:2px}',
    '.jlang-stay:hover,.jlang-stay:focus-visible{color:var(--j-btn);outline:2px solid var(--j-accent);outline-offset:2px}',
    '.jlang-sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}',
    '@media (max-width:480px){.jlang-pos-top-right,.jlang-pos-top-left{inset:12px 12px auto 12px;max-width:none}.jlang-pos-bottom-right,.jlang-pos-bottom-left{inset:auto 12px 12px 12px;max-width:none}}'
  ].join('');

  function injectStyles() {
    if (document.getElementById('jlang-styles')) return;
    var style = document.createElement('style');
    style.id = 'jlang-styles';
    style.textContent = CSS_TEXT;
    (document.head || document.documentElement).appendChild(style);
  }

  function initJlangNotice() {
    if (document.getElementById('jlang-toast')) return;

    var STORAGE_KEY = 'ojs_en_notice_closed';
    var htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang.indexOf('en') === 0) return;
    try { if (sessionStorage.getItem(STORAGE_KEY) === '1') return; } catch (e) {}

    injectStyles();

    var host = (window.location.hostname || '').replace(/^www\./, '').toLowerCase();
    var theme = THEMES[host] || DEFAULT_THEME;

    var ALLOWED = { 'top-right': 1, 'top-left': 1, 'bottom-right': 1, 'bottom-left': 1 };
    var posClass = 'jlang-pos-' + (ALLOWED[CONFIG.position] ? CONFIG.position : 'top-right');
    var enUrl = '/index.php/journal/user/setLocale/en_US?source=' + encodeURIComponent(window.location.pathname + window.location.search);
    var stayText = htmlLang.indexOf('fr') === 0 ? 'Rester en français' : 'Залишитися на українській';

    var region = document.createElement('div');
    region.className = 'jlang-region ' + posClass;
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', 'Language suggestion');

    region.style.setProperty('--j-y', CONFIG.offsetY + 'px');
    region.style.setProperty('--j-x', CONFIG.offsetX + 'px');
    region.style.setProperty('--j-z', String(CONFIG.zIndex));
    region.style.setProperty('--j-accent', theme.accent);
    region.style.setProperty('--j-title', theme.title);
    region.style.setProperty('--j-btn', theme.btn);
    region.style.setProperty('--j-btn-hover', theme.hover);
    region.style.setProperty('--j-border', theme.border);
    region.style.setProperty('--j-bg', theme.bg);

    var toast = document.createElement('div');
    toast.id = 'jlang-toast';
    toast.className = 'jlang-toast ' + posClass;
    toast.setAttribute('aria-labelledby', 'jlang-title');
    toast.innerHTML =
      '<div class="jlang-head">' +
        '<p id="jlang-title" class="jlang-title">English version available</p>' +
        '<button type="button" class="jlang-close" data-jlang-close aria-label="Close">&times;</button>' +
      '</div>' +
      '<p class="jlang-desc">Доступна англійська версія журналу. This website is also available in English.</p>' +
      '<a class="jlang-btn" href="' + enUrl + '">Switch to English</a>' +
      '<button type="button" class="jlang-stay" data-jlang-close>' + stayText + '</button>';

    var live = document.createElement('div');
    live.className = 'jlang-sr-only';
    live.setAttribute('aria-live', 'polite');
    region.appendChild(toast);
    region.appendChild(live);
    document.body.appendChild(region);

    requestAnimationFrame(function () { toast.classList.add('is-visible'); });

    var btns = toast.querySelectorAll('[data-jlang-close]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        toast.classList.remove('is-visible');
        try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
      });
    }

    var msg = 'English version available. Actions available.';
    if (typeof document.ariaNotify === 'function') document.ariaNotify(msg);
    else live.textContent = msg;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initJlangNotice);
  else initJlangNotice();
})();
