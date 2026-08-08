let modelSeries = [];
let activeRoot = null;
let activeContext = null;
let compareMode = false;
const selectedModelIds = new Set();

function groupModels(models) {
  const groups = new Map();
  models.forEach(model => {
    const seriesName = model.series || model.name.split(/[ -]/)[0];
    if (!groups.has(seriesName)) groups.set(seriesName, { name: seriesName, models: [], alive: 0, total: 0 });
    const series = groups.get(seriesName);
    series.models.push(model);
    series.total += 1;
    if (model.status === 'alive') series.alive += 1;
  });
  return [...groups.values()];
}

function loadModels() {
  return Promise.resolve().then(() => window.MockAPI.getModels()).then(models => {
    window.AppStore.models = models;
    modelSeries = groupModels(models);
    refreshModelList();
    return models;
  }).catch(error => {
    console.error('MockAPI.getModels() failed:', error);
    window.AppStore.models = [];
    modelSeries = [];
    refreshModelList();
    return [];
  });
}

const modelsRequest = loadModels();

export function renderModels() {
  compareMode = false;
  selectedModelIds.clear();
  return `<header class="page-header"><div><div class="eyebrow">MODEL CATALOG</div><h1>模型列表</h1><div class="muted">按系列管理和检测模型</div></div></header><div class="search-row"><input class="input" id="model-search" placeholder="搜索模型"/><button class="btn btn-small btn-outline" id="compare-entry">模型对比</button></div><div class="sort-row" id="sort-row"><button class="sort-btn active" data-sort="name">名称</button><button class="sort-btn" data-sort="status">状态</button><button class="sort-btn" data-sort="latency">延迟</button><button class="sort-btn" data-sort="channels">渠道数</button></div><div class="toolbar"><button class="btn btn-small" id="toggle-all">展开全部</button><button class="btn btn-small btn-primary" data-action="chat-entry">实测对话</button></div><div id="compare-controls" class="card toggle-row hidden"><span id="compare-summary">已选择 0/4</span><button class="btn btn-small btn-primary hidden" id="start-inline-compare">开始对比</button></div><div id="series-list">${renderSeries(modelSeries)}</div>`;
}

function renderSeries(series) {
  return series.map(s => `<section class="card series" data-series="${s.name}" data-open="false"><div class="series-head"><span class="chevron">›</span><div class="series-meta"><strong>${s.name}</strong><small>${s.total} 个模型</small></div><div class="series-health"><span class="status ${s.alive === s.total ? 'ok' : 'warn'}">${s.alive} 个存活</span><br><small class="muted">${s.total - s.alive} 个失败</small></div></div><div class="series-body" hidden>${s.models.map(model => `<div class="model-row"><span>${compareMode ? `<input class="checkbox compare-model-check" type="checkbox" value="${model.id}" ${selectedModelIds.has(model.id) ? 'checked' : ''}>` : ''}</span><div><div class="model-name">${model.name}</div><div class="model-id">${model.id}</div></div><button class="btn btn-small btn-outline" data-detect="${model.name}">检测</button></div>`).join('')}</div></section>`).join('');
}

function refreshModelList() {
  if (!activeRoot || !document.body.contains(activeRoot)) return;
  const list = activeRoot.querySelector('#series-list');
  if (!list) return;
  list.innerHTML = renderSeries(modelSeries);
  bindSeriesInteractions(activeRoot, activeContext);
  updateCompareControls(activeRoot);
}

window.addEventListener('models:updated', () => {
  modelSeries = groupModels(window.AppStore.models);
  refreshModelList();
});

function updateCompareControls(root) {
  const controls = root.querySelector('#compare-controls');
  if (!controls) return;
  controls.classList.toggle('hidden', !compareMode);
  root.querySelector('#compare-summary').textContent = `已选择 ${selectedModelIds.size}/4`;
  root.querySelector('#start-inline-compare').classList.toggle('hidden', selectedModelIds.size < 2);
}

function bindSeriesInteractions(root, { onToast }) {
  const list = root.querySelector('#series-list');
  const toggle = card => { card.classList.toggle('open'); card.querySelector('.series-body').hidden = !card.classList.contains('open'); };
  list.querySelectorAll('.series-head').forEach(head => head.addEventListener('click', () => toggle(head.parentElement)));
  list.querySelectorAll('[data-detect]').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    event.currentTarget.textContent = '检测中';
    setTimeout(() => { event.currentTarget.textContent = '检测'; onToast(`${event.currentTarget.dataset.detect} 检测完成`); }, 700);
  }));
  list.querySelectorAll('.compare-model-check').forEach(check => check.addEventListener('change', event => {
    if (event.target.checked && selectedModelIds.size >= 4) { event.target.checked = false; onToast('最多选择 4 个模型'); return; }
    if (event.target.checked) selectedModelIds.add(event.target.value); else selectedModelIds.delete(event.target.value);
    updateCompareControls(root);
  }));
}

function enterCompareMode(root, onToast) {
  compareMode = true;
  root.querySelector('#compare-entry').textContent = '退出对比';
  root.querySelector('#series-list').innerHTML = renderSeries(modelSeries);
  root.querySelectorAll('#series-list .series').forEach(card => { card.classList.add('open'); card.querySelector('.series-body').hidden = false; });
  bindSeriesInteractions(root, { onToast });
  updateCompareControls(root);
  onToast('已进入模型选择模式');
}

function exitCompareMode(root) {
  compareMode = false;
  selectedModelIds.clear();
  root.querySelector('#compare-entry').textContent = '模型对比';
  root.querySelector('#series-list').innerHTML = renderSeries(modelSeries);
  bindSeriesInteractions(root, activeContext);
  updateCompareControls(root);
}

export function bindModels(root, { navigate, onToast }) {
  activeRoot = root;
  activeContext = { onToast };
  const list = root.querySelector('#series-list');
  root.querySelector('#toggle-all').addEventListener('click', event => {
    const series = [...list.querySelectorAll('.series')];
    const shouldExpand = series.some(card => !card.classList.contains('open'));
    series.forEach(card => { card.classList.toggle('open', shouldExpand); card.querySelector('.series-body').hidden = !shouldExpand; });
    event.currentTarget.textContent = shouldExpand ? '收起全部' : '展开全部';
  });
  root.querySelector('#model-search').addEventListener('input', event => {
    const query = event.target.value.toLowerCase();
    list.querySelectorAll('.series').forEach(card => { card.hidden = !card.textContent.toLowerCase().includes(query); if (query) { card.classList.add('open'); card.querySelector('.series-body').hidden = false; } });
  });
  root.querySelectorAll('[data-sort]').forEach(button => button.addEventListener('click', () => {
    root.querySelectorAll('[data-sort]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const cards = [...list.querySelectorAll('.series')];
    const key = button.dataset.sort;
    cards.sort((a, b) => {
      if (key === 'name') return a.dataset.series.localeCompare(b.dataset.series, 'zh-CN');
      const first = modelSeries.find(item => item.name === a.dataset.series);
      const second = modelSeries.find(item => item.name === b.dataset.series);
      if (key === 'status') return (second.alive / second.total) - (first.alive / first.total);
      return second.total - first.total;
    }).forEach(card => list.appendChild(card));
    onToast(`已按${button.textContent}排序`);
  }));
  root.querySelector('[data-action="chat-entry"]').addEventListener('click', () => navigate('chat'));
  root.querySelector('#compare-entry').addEventListener('click', () => compareMode ? exitCompareMode(root) : enterCompareMode(root, onToast));
  root.querySelector('#start-inline-compare').addEventListener('click', () => { if (selectedModelIds.size >= 2) navigate('compare'); });
  bindSeriesInteractions(root, activeContext);
  modelsRequest.then(() => refreshModelList());
}

function availableCompareChoices() {
  const models = window.AppStore.models || [];
  const selected = [...selectedModelIds];
  const source = selected.length ? models.filter(model => selected.includes(model.id)) : models.slice(0, 4);
  return source.map(model => ({ id: model.id, name: model.name }));
}

export function renderCompare() {
  const choices = availableCompareChoices();
  return `<header class="page-header"><div><div class="eyebrow">SIDE BY SIDE</div><h1>模型对比</h1><div class="muted">已选择 ${choices.length}/4</div></div></header><div class="card form-card"><div class="section-heading"><h3>选择模型</h3><span id="compare-count" class="muted">已选择 ${choices.length}/4</span></div>${choices.map(choice => `<label class="model-row" style="padding:10px 0"><input class="checkbox compare-check" type="checkbox" value="${choice.id}" checked><span class="model-name">${choice.name}</span><span class="muted"></span></label>`).join('')}<label class="field" style="margin-top:12px"><span class="field-label">Prompt</span><textarea class="textarea" id="compare-prompt" placeholder="输入一段相同的问题进行对比"></textarea></label><button class="btn btn-primary" style="width:100%" id="start-compare">开始对比</button></div><div id="compare-results" class="section"></div>`;
}

export function bindCompare(root, { onToast }) {
  const checks = [...root.querySelectorAll('.compare-check')];
  const count = root.querySelector('#compare-count');
  const updateCount = () => { const amount = checks.filter(check => check.checked).length; count.textContent = `已选择 ${amount}/4`; root.querySelector('#start-compare').classList.toggle('hidden', amount < 2); };
  checks.forEach(check => check.addEventListener('change', event => { if (checks.filter(item => item.checked).length > 4) { event.target.checked = false; onToast('最多选择 4 个模型'); } updateCount(); }));
  updateCount();
  root.querySelector('#start-compare').addEventListener('click', () => {
    const selected = checks.filter(check => check.checked).map(check => check.value);
    if (selected.length < 2) { onToast('请至少选择 2 个模型'); return; }
    const names = selected.map(id => window.AppStore.models.find(model => model.id === id)?.name || id);
    const out = root.querySelector('#compare-results');
    out.innerHTML = '<div class="section-heading"><h2>对比结果</h2><span class="muted loading-dots">正在测试</span></div>';
    setTimeout(() => { out.innerHTML = `<div class="section-heading"><h2>对比结果</h2><span class="muted">已完成</span></div>${names.map((name, index) => `<div class="card message assistant"><div class="dead-head"><strong>${name}</strong><span class="status ok">${720 + index * 180}ms</span></div><p>这是针对相同 Prompt 的模拟回答。模型从不同角度给出了清晰、简洁的结果。</p></div>`).join('')}`; }, 900);
  });
}
