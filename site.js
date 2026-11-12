/* Afyatel — site behaviour. No dependencies. Every page works without this file;
   it adds the sticky header, the menu, reveals, tabs, the phone walkthrough,
   the help search, the contact form and the release switch. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── header: solid on scroll, drawer on small screens ── */
  var nav = $('[data-nav]'), drawer = $('[data-drawer]'), burger = $('[data-burger]');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 12); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    var setMenu = function (open) {
      nav.classList.toggle('open', open); drawer.classList.toggle('open', open);
      document.body.classList.toggle('locked', open); burger.setAttribute('aria-expanded', open);
    };
    burger.addEventListener('click', function () { setMenu(!drawer.classList.contains('open')); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ── reveal on scroll ── */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ── count-up numbers ── */
  $$('[data-count]').forEach(function (el) {
    var to = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '';
    var fmt = function (n) { return Math.round(n).toLocaleString('en-KE') + suf; };
    if (reduce || !('IntersectionObserver' in window)) { el.textContent = fmt(to); return; }
    var seen = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; seen.disconnect();
      var t0 = performance.now(), dur = 1100;
      (function tick(t) {
        var p = Math.min(1, (t - t0) / dur); el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, { threshold: .6 });
    seen.observe(el);
  });

  /* ── tabs ── */
  $$('[data-tabs]').forEach(function (bar) {
    var btns = $$('[data-tab]', bar);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) {
          var on = x === b; x.setAttribute('aria-selected', on);
          var panel = document.getElementById(x.getAttribute('data-tab')); if (panel) panel.hidden = !on;
        });
      });
    });
  });

  /* ── hero phone: rotating screens ── */
  $$('[data-carousel]').forEach(function (dev) {
    var screens = $$('.screen', dev), dots = $$('[data-dots] button', dev.parentNode), i = 0, timer;
    var show = function (n) {
      i = (n + screens.length) % screens.length;
      screens.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    };
    var play = function () { if (!reduce) timer = setInterval(function () { show(i + 1); }, 3800); };
    dots.forEach(function (d, k) { d.addEventListener('click', function () { clearInterval(timer); show(k); play(); }); });
    play();
  });

  /* ── phone scaling: keep the whole device on screen ── */
  var fit = function () {
    $$('[data-fit]').forEach(function (dev) {
      var w = dev.parentNode.clientWidth || window.innerWidth;
      var small = window.innerWidth <= 760;
      var roomH = window.innerHeight - (small ? 150 : 200);
      var k = Math.min(small ? 1 : 1.060, w / 322, roomH / 662);
      dev.style.setProperty('--k', Math.max(.620, k).toFixed(3));
    });
  };
  fit(); window.addEventListener('resize', fit);

  /* ── interactive walkthrough ── */
  $$('[data-demo]').forEach(function (root) {
    var data = JSON.parse($('[data-d="data"]', root).textContent);
    var byId = {}; data.forEach(function (j) { byId[j.id] = j; });
    var screens = $$('.screen', root);
    var el = function (k) { return $('[data-d="' + k + '"]', root); };
    var panel = $('.d-panel', root), cur = null, step = 0, swapTimer;

    var paint = function (animateText) {
      var j = byId[cur];
      screens.forEach(function (s) {
        var mine = s.getAttribute('data-j') === cur, i = +s.getAttribute('data-i');
        s.classList.toggle('on', mine && i === step);
        s.classList.toggle('past', mine && i < step);
        s.setAttribute('aria-hidden', !(mine && i === step));
        if (!mine) s.classList.remove('on', 'past');
      });
      var write = function () {
        el('count').textContent = 'Step ' + (step + 1) + ' of ' + j.steps.length + ' · ' + j.name;
        el('title').innerHTML = j.steps[step].t; el('caption').innerHTML = j.steps[step].c;
        panel.classList.remove('swap');
      };
      el('bar').style.width = ((step + 1) / j.steps.length * 100) + '%';
      el('back').disabled = step === 0;
      var last = step === j.steps.length - 1;
      el('next').firstChild.nodeValue = last ? 'Next journey' : 'Next';
      clearTimeout(swapTimer);
      if (animateText && !reduce) { panel.classList.add('swap'); swapTimer = setTimeout(write, 200); } else write();
    };
    var open = function (id, keepHash) {
      if (!byId[id]) return;
      cur = id; step = 0;
      $$('[data-journey]', root).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-journey') === id); });
      var aud = byId[id].audience;
      $$('[data-aud]', root).forEach(function (g) { g.hidden = g.getAttribute('data-aud') !== aud; });
      $$('[data-aud-btn]', root).forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-aud-btn') === aud); });
      var on = $('.d-j.on', root); if (on && on.scrollIntoView && window.innerWidth <= 760) on.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
      if (!keepHash && root.id === 'demo' && history.replaceState) history.replaceState(null, '', '#' + id);
      paint(true);
    };
    var go = function (d) {
      var j = byId[cur], n = step + d;
      if (n < 0) return;
      if (n >= j.steps.length) {            // roll on to the next journey for this audience
        var same = data.filter(function (x) { return x.audience === j.audience; });
        return open(same[(same.indexOf(j) + 1) % same.length].id);
      }
      step = n; paint(true);
    };

    el('next').addEventListener('click', function () { go(1); });
    el('back').addEventListener('click', function () { go(-1); });
    $$('[data-journey]', root).forEach(function (b) { b.addEventListener('click', function () { open(b.getAttribute('data-journey')); }); });
    $$('[data-aud-btn]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var first = data.filter(function (x) { return x.audience === b.getAttribute('data-aud-btn'); })[0];
        if (first) open(first.id);
      });
    });
    var dev = $('.device', root);
    dev.addEventListener('click', function (e) { if (e.target.closest('.screen.on [data-tap]')) go(1); });
    dev.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-tap]')) { e.preventDefault(); go(1); } });
    var x0 = null, y0 = null;
    dev.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    dev.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.500) go(dx < 0 ? 1 : -1);
    }, { passive: true });
    root.addEventListener('keydown', function (e) {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1);
    });

    // Deep links: #journey-id, or #journey-id/3 to land on a particular step.
    var hash = location.hash.slice(1).split('/'), wanted = hash[0];
    open(byId[wanted] ? wanted : root.getAttribute('data-start'), true);
    var at = parseInt(hash[1], 10);
    if (byId[wanted] && at > 1 && at <= byId[wanted].steps.length) { step = at - 1; paint(false); }
    if (byId[wanted] && root.scrollIntoView) setTimeout(function () { root.scrollIntoView({ block: 'center' }); }, 60);
  });

  /* ── help centre search ── */
  var q = $('[data-faq-search]');
  if (q) {
    var groups = $$('[data-faq-group]'), empty = $('[data-faq-empty]');
    q.addEventListener('input', function () {
      var term = q.value.trim().toLowerCase(), any = false;
      groups.forEach(function (g) {
        var hits = 0;
        $$('details', g).forEach(function (d) {
          var hit = !term || d.textContent.toLowerCase().indexOf(term) > -1;
          d.hidden = !hit; if (hit) hits++; if (term && hit) d.open = true; if (!term) d.open = false;
        });
        g.hidden = !hits; if (hits) any = true;
      });
      empty.hidden = any;
    });
  }
  var target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target && target.tagName === 'DETAILS') target.open = true;

  /* ── contact form: compose an email with everything filled in ── */
  var form = $('[data-contact]');
  if (form) {
    var topic = new URLSearchParams(location.search).get('topic');
    if (topic && form.topic.querySelector('[value="' + topic + '"]')) form.topic.value = topic;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('[data-contact-status]', form), bad = null;
      ['name', 'reply', 'message'].forEach(function (n) { if (!form[n].value.trim() && !bad) bad = form[n]; });
      if (bad) { bad.focus(); status.textContent = 'Please fill in your name, how to reach you, and a message.'; return; }
      var label = form.topic.options[form.topic.selectedIndex].text;
      var body = form.message.value.trim() + '\n\n— ' + form.name.value.trim() + '\nReply to: ' + form.reply.value.trim();
      location.href = 'mailto:' + form.getAttribute('data-to') + '?subject=' + encodeURIComponent('Afyatel: ' + label) + '&body=' + encodeURIComponent(body);
      status.textContent = 'Your email app should now be open with the message ready. If nothing happened, write to ' + form.getAttribute('data-to') + '.';
    });
  }

  /* ── release switch (see release.js) ── */
  var R = window.AFYATEL_RELEASE || {};
  var rel = function (k) { return $$('[data-release="' + k + '"]'); };
  var text = function (k, t) { rel(k).forEach(function (n) { n.textContent = t; }); };
  if (R.version) text('version', R.version + ' (build ' + R.build + ')');
  if (R.updated) text('updated', R.updated);
  if (R.playUrl) {
    ['download', 'nav', 'hero'].forEach(function (k) { rel(k).forEach(function (a) { a.href = R.playUrl; a.target = '_blank'; a.rel = 'noopener'; }); });
    text('download-kicker', 'Get it on'); text('download-label', 'Google Play'); text('eyebrow', 'Get the app');
    rel('title').forEach(function (n) { n.innerHTML = 'Now on <em class="serif">Google Play.</em>'; });
    text('lead', 'Install Afyatel from Google Play and create your account in a couple of minutes.');
    rel('steps').forEach(function (n) { n.hidden = true; var g = n.closest('.get'); if (g) g.classList.add('solo'); });
  } else if (R.apkUrl) {
    rel('download').forEach(function (a) { a.href = R.apkUrl; a.setAttribute('download', ''); });
    text('download-kicker', 'Android · pilot build'); text('download-label', 'Download for Android');
    if (R.size) { rel('size-row').forEach(function (n) { n.hidden = false; }); text('size', R.size); }
    if (R.sha256) { rel('sha-row').forEach(function (n) { n.hidden = false; }); text('sha', R.sha256); }
  }
})();
