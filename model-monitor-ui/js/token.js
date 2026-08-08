const tokenStats = () => window.AppStore?.tokenStats || { total: 0, byModel: [] };

function renderTokenRows(rows) {
  return rows.length ? rows.map(item => `<div class="token-line"><div><strong>${item.model}</strong><div class="progress"><i style="width:${item.percent || 0}%"></i></div></div><div><strong>${Number(item.tokens || 0).toLocaleString()}</strong><br><small>${item.percent || 0}%</small></div></div>`).join('') : '<div class="muted" style="padding:20px;text-align:center">暂无 Token 数据</div>';
}

function renderTrend(stats) {
  const source = stats.trend?.length ? stats.trend : stats.byModel || [];
  const max = Math.max(...source.map(item => Number(item.tokens || item.value || 0)), 1);
  return source.slice(0, 7).map(item => `<div class="bar" style="height:${Math.max(12, (Number(item.tokens || item.value || 0) / max) * 100)}%"><label>${item.label || item.model}</label></div>`).join('');
}

export function renderToken() {
  const stats = tokenStats();
  return `<header class="page-header"><div><div class="eyebrow">USAGE INSIGHTS</div><h1>Token 用量</h1><div class="muted">今日 API 调用消耗概览</div></div></header><div class="card token-total"><div class="stat-label">今日 Token 总量</div><div class="token-number" id="token-total">${Number(stats.total || 0).toLocaleString()}</div><div class="progress"><i style="width:${stats.total ? 100 : 0}%"></i></div><div class="muted" style="margin-top:7px;font-size:11px">数据来自 AppStore.tokenStats</div></div><section class="section"><div class="section-heading"><h2>模型用量</h2><span class="muted">占比</span></div><div class="card" id="token-list">${renderTokenRows(stats.byModel || [])}</div></section><section class="section"><div class="section-heading"><h2>用量趋势</h2><span class="muted">Token</span></div><div class="card chart">${renderTrend(stats)}</div></section><div class="entry-actions"><button class="btn btn-outline" id="clear-today">清空今日</button><button class="btn btn-danger" id="clear-history">清空全部历史</button></div>`;
}

export function bindToken(root, { onToast }) {
  root.querySelector('#clear-today').addEventListener('click', () => { AppStore.tokenStats = { ...AppStore.tokenStats, total: 0, byModel: [] }; root.querySelector('#token-total').textContent = '0'; root.querySelector('#token-list').innerHTML = renderTokenRows([]); onToast('今日 Token 已清空'); });
  root.querySelector('#clear-history').addEventListener('click', () => { AppStore.tokenStats = { total: 0, byModel: [] }; root.querySelector('#token-total').textContent = '0'; root.querySelector('#token-list').innerHTML = renderTokenRows([]); onToast('全部历史已清空（Mock）'); });
}
