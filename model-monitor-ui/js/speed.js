const models = () => window.AppStore?.models || [];
const providers = () => window.AppStore?.providers || [];
const records = () => window.AppStore?.healthRecords || [];
const providerName = model => providers().find(provider => provider.id === model.providerId)?.name || model.providerId || '未知渠道';
const recordFor = model => [...records()].reverse().find(record => record.modelId === model.id);
const statusLabel = model => model.status === 'alive' ? '成功' : (recordFor(model)?.errorCode === 'Timeout' ? '超时' : '失败');

function renderRows(items) {
  return `<div class="history-row header"><span>模型</span><span>渠道</span><span>状态</span><span>延迟</span><span>时间</span></div>${items.map(model => { const record = recordFor(model); const label = statusLabel(model); return `<div class="history-row"><span>${model.name}</span><span>${providerName(model)}</span><span class="status ${label === '成功' ? 'ok' : label === '超时' ? 'warn' : 'fail'}">${label}</span><span>${typeof model.latency === 'number' ? `${model.latency}ms` : (record?.message || model.latency || '—')}</span><span>${record?.time || '—'}</span></div>`; }).join('')}`;
}

function filteredModels(filter) {
  if (filter === 'all') return models();
  return models().filter(model => filter === 'success' ? model.status === 'alive' : filter === 'timeout' ? recordFor(model)?.errorCode === 'Timeout' : model.status === 'failed' && recordFor(model)?.errorCode !== 'Timeout');
}

export function renderSpeed() {
  const current = models();
  const numeric = current.filter(model => typeof model.latency === 'number');
  const average = numeric.length ? Math.round(numeric.reduce((sum, model) => sum + model.latency, 0) / numeric.length) : 0;
  const fastest = numeric.slice().sort((a, b) => a.latency - b.latency)[0];
  const slowest = numeric.slice().sort((a, b) => b.latency - a.latency)[0];
  return `<header class="page-header"><div><div class="eyebrow">PERFORMANCE</div><h1>测速 / 记录</h1><div class="muted">查看近期模型响应表现</div></div></header><div class="metric-row"><div class="card metric"><strong>${average ? `${average}ms` : '—'}</strong><span>平均响应时间</span></div><div class="card metric"><strong>${fastest?.name || '—'}</strong><span>最快模型</span></div><div class="card metric"><strong>${slowest?.name || '—'}</strong><span>最慢模型</span></div></div><section class="section"><div class="section-heading"><h2>历史记录</h2><span class="muted">来自 AppStore.models</span></div><div class="filter-row" id="speed-filter">${[['all','全部'],['success','成功'],['failed','失败'],['timeout','超时']].map(([value, label], index) => `<button class="filter-btn ${index ? '' : 'active'}" data-filter="${value}">${label}</button>`).join('')}</div><div class="card table-card" id="speed-table">${renderRows(current)}</div></section>`;
}

export function bindSpeed(root) {
  root.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    root.querySelectorAll('[data-filter]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    root.querySelector('#speed-table').innerHTML = renderRows(filteredModels(button.dataset.filter));
  }));
}
