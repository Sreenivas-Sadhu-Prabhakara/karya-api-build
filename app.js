(() => {
  'use strict';
  const { steps, scenarios } = globalThis.KARYA_GUIDE;
  const storageKey = 'karya-api-build.progress.v1';
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
  let mode = 'existing';
  let current = 0;
  let completed = new Set();
  let toastTimer;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(stored)) completed = new Set(stored.filter(id => steps.some(step => step.id === id)));
  } catch { /* Browser storage is optional. */ }
  const toast = message => {
    const element = document.getElementById('toast');
    element.textContent = message;
    element.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('visible'), 3000);
  };
  const updateProgress = () => {
    document.getElementById('progress').value = completed.size;
    document.getElementById('progress-label').textContent = `${completed.size} / ${steps.length}`;
    document.querySelectorAll('[data-step]').forEach(tab => {
      const done = completed.has(steps[Number(tab.dataset.step)].id);
      tab.classList.toggle('complete', done);
      tab.querySelector('.step-number').textContent = done ? '✓' : String(Number(tab.dataset.step) + 1).padStart(2, '0');
    });
  };
  const saveProgress = () => {
    try { localStorage.setItem(storageKey, JSON.stringify([...completed])); }
    catch { toast('Progress is available for this session; browser storage is unavailable.'); }
    updateProgress();
  };
  const copyText = async (text, button) => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.append(area);
        area.select();
        const success = document.execCommand('copy');
        area.remove();
        if (!success) throw new Error('Clipboard unavailable');
      }
      button.textContent = 'Copied ✓';
      toast('Copied. Paste it into Claude Code.');
      setTimeout(() => { if (button.isConnected) button.textContent = 'Copy prompt'; }, 2000);
    } catch { toast('Clipboard unavailable. Select and copy the prompt text below.'); }
  };
  const renderStep = (index, focus = false) => {
    current = index;
    const step = steps[index];
    const prompt = mode === 'new' && step.newPrompt ? step.newPrompt : step.prompt;
    document.querySelectorAll('[data-step]').forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    const panel = document.getElementById('step-panel');
    panel.setAttribute('aria-labelledby', `step-${step.id}`);
    panel.innerHTML = `<div class="step-content"><div class="step-main"><div class="step-kicker">STEP ${String(index + 1).padStart(2, '0')} <span>/</span> ${escapeHtml(step.phase)}</div><h3>${escapeHtml(step.title)}</h3><p class="step-intro">${escapeHtml(step.intro)}</p><div class="action-block"><h4>What to do</h4><p>${escapeHtml(step.action)}</p>${step.command ? `<pre class="setup-command"><code>${escapeHtml(step.command)}</code></pre>` : ''}</div><div class="review-block"><span class="review-icon" aria-hidden="true">◎</span><div><h4>Your review checkpoint</h4><p>${escapeHtml(step.checkpoint)}</p></div></div><div class="step-output"><span class="micro-label">YOU LEAVE WITH</span><strong>${escapeHtml(step.output)}</strong></div></div><div class="prompt-column"><div class="prompt-box"><div class="prompt-heading"><span><span class="prompt-spark" aria-hidden="true">✳</span> THE CLAUDE PROMPT</span><button type="button" class="copy-button" id="copy-prompt">Copy prompt</button></div><pre tabindex="0" aria-label="Prompt for Claude Code"><code>${escapeHtml(prompt)}</code></pre><div class="prompt-footer"><span aria-hidden="true">↳</span> Paste into your project’s Claude Code session</div></div><p class="step-tip"><strong>Field note</strong>${escapeHtml(step.tip)}</p><a class="step-reference" href="${escapeHtml(step.reference[1])}" target="_blank" rel="noopener noreferrer">${escapeHtml(step.reference[0])} <span aria-hidden="true">↗</span></a></div></div><div class="step-bottom"><label class="completion-check"><input type="checkbox" id="step-complete" ${completed.has(step.id) ? 'checked' : ''}><span>I’ve reviewed this step</span></label><div class="step-navigation"><button class="previous-button" id="previous-step" type="button" ${index === 0 ? 'disabled' : ''}><span aria-hidden="true">←</span> Previous</button><button class="next-button" id="next-step" type="button">${index === steps.length - 1 ? 'Explore the example' : 'Next step'} <span aria-hidden="true">→</span></button></div></div>`;
    document.getElementById('copy-prompt').addEventListener('click', event => copyText(prompt, event.currentTarget));
    document.getElementById('step-complete').addEventListener('change', event => {
      if (event.target.checked) completed.add(step.id); else completed.delete(step.id);
      saveProgress();
      if (completed.size === steps.length) toast('All eight steps reviewed. Ready for your next build session.');
    });
    document.getElementById('previous-step').addEventListener('click', () => selectStep(index - 1, true));
    document.getElementById('next-step').addEventListener('click', () => {
      if (index < steps.length - 1) selectStep(index + 1, true);
      else { location.hash = 'example'; document.getElementById('example-heading').setAttribute('tabindex', '-1'); document.getElementById('example-heading').focus({preventScroll: true}); }
    });
    updateProgress();
    if (focus) panel.focus({ preventScroll: true });
  };
  const selectStep = (index, scroll) => {
    if (index < 0 || index >= steps.length) return;
    renderStep(index, scroll);
    history.replaceState(null, '', `#step-${steps[index].id}`);
    if (scroll) document.getElementById('step-tabs').scrollIntoView({ behavior: 'auto', block: 'start' });
  };
  const tabs = document.getElementById('step-tabs');
  tabs.innerHTML = steps.map((step, i) => `<button type="button" role="tab" aria-controls="step-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" id="step-${step.id}" data-step="${i}"><span class="step-number">${String(i + 1).padStart(2, '0')}</span><span>${escapeHtml(step.short)}</span></button>`).join('');
  tabs.addEventListener('click', event => {
    const tab = event.target.closest('[data-step]');
    if (tab) selectStep(Number(tab.dataset.step), false);
  });
  const tabKeyboard = (container, selector, activate) => container.addEventListener('keydown', event => {
    const list = [...container.querySelectorAll(selector)];
    const index = list.indexOf(document.activeElement);
    if (index < 0) return;
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % list.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + list.length) % list.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = list.length - 1;
    else return;
    event.preventDefault();
    activate(list[next]);
    list[next].focus();
  });
  tabKeyboard(tabs, '[data-step]', tab => selectStep(Number(tab.dataset.step), false));
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    document.querySelectorAll('[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderStep(current);
    toast(`Setup prompt adapted for a ${mode === 'new' ? 'new' : 'current'} project.`);
  }));
  document.getElementById('reset-progress').addEventListener('click', () => {
    completed.clear();
    saveProgress();
    renderStep(current);
    toast('Reading progress reset.');
  });
  const renderScenario = key => {
    const scenario = scenarios[key];
    document.querySelectorAll('[data-scenario]').forEach(tab => {
      const active = tab.dataset.scenario === key;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const panel = document.getElementById('scenario-panel');
    panel.setAttribute('aria-labelledby', `scenario-${key}`);
    panel.innerHTML = `<div class="scenario-behavior"><span class="criterion-id">${escapeHtml(scenario.id)}</span><h3>${escapeHtml(scenario.title)}</h3><dl><div><dt>Given</dt><dd>${escapeHtml(scenario.given)}</dd></div><div><dt>When</dt><dd>${escapeHtml(scenario.when)}</dd></div><div><dt>Then</dt><dd>${escapeHtml(scenario.then)}</dd></div></dl><div class="scenario-test"><span class="mini-check" aria-hidden="true">✓</span><p>${escapeHtml(scenario.test)}</p></div></div><div class="scenario-code"><div><span class="micro-label">ILLUSTRATIVE REQUEST</span><pre><code>${escapeHtml(scenario.request)}</code></pre></div><div><span class="micro-label">EXPECTED OUTCOME</span><pre><code>${escapeHtml(scenario.response)}</code></pre></div></div>`;
  };
  document.querySelectorAll('[data-scenario]').forEach(tab => tab.addEventListener('click', () => renderScenario(tab.dataset.scenario)));
  tabKeyboard(document.querySelector('.scenario-controls'), '[data-scenario]', tab => renderScenario(tab.dataset.scenario));
  const mobileQuery = window.matchMedia('(max-width: 760px)');
  const sidebar = document.getElementById('sidebar');
  const syncSidebar = () => {
    const open = document.body.classList.contains('menu-open');
    sidebar.inert = mobileQuery.matches && !open;
    if (mobileQuery.matches && open) {
      sidebar.setAttribute('role', 'dialog');
      sidebar.setAttribute('aria-modal', 'true');
    } else {
      sidebar.removeAttribute('role');
      sidebar.removeAttribute('aria-modal');
    }
  };
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    document.getElementById('menu-button').setAttribute('aria-expanded', String(open));
    document.getElementById('menu-button').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.getElementById('mobile-scrim').hidden = !open;
    syncSidebar();
    if (open) document.querySelector('.main-nav a').focus();
  };
  document.getElementById('menu-button').addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.getElementById('mobile-scrim').addEventListener('click', () => setMenu(false));
  document.getElementById('sidebar-close').addEventListener('click', () => { setMenu(false); document.getElementById('menu-button').focus(); });
  mobileQuery.addEventListener('change', () => { if (!mobileQuery.matches) setMenu(false); syncSidebar(); });
  syncSidebar();
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); document.getElementById('menu-button').focus(); }
    if (event.key === 'Tab' && mobileQuery.matches && document.body.classList.contains('menu-open')) {
      const focusable = [...sidebar.querySelectorAll('a, button')].filter(item => item.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  document.querySelectorAll('.sidebar a').forEach(link => link.addEventListener('click', () => {
    if (document.body.classList.contains('menu-open')) { setMenu(false); document.getElementById('menu-button').focus(); }
  }));
  const observer = new IntersectionObserver(entries => {
    const entry = entries.filter(item => item.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!entry) return;
    document.querySelectorAll('.nav-link').forEach(link => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-80px 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('.section-anchor').forEach(section => observer.observe(section));
  document.getElementById('download-guide').addEventListener('click', () => {
    const anchor = document.createElement('a');
    anchor.href = './downloads/karya-api-build-guide.md';
    anchor.download = 'karya-api-build-guide.md';
    anchor.click();
  });
  const loadHash = () => {
    const index = steps.findIndex(step => `#step-${step.id}` === location.hash);
    if (index >= 0) { renderStep(index); document.getElementById('step-tabs').scrollIntoView({ block: 'start' }); }
  };
  renderStep(0);
  renderScenario('success');
  loadHash();
  window.addEventListener('hashchange', loadHash);
})();
