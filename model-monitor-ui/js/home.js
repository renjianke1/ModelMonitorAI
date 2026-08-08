const friendlyMessage = model => model.message || ({ Timeout: '请求超时', '403': 'API Key 无效', '404': '模型不存在', '503': '服务暂时不可用' }[model.errorCode || model.latency] || '模型不可用');
const homeModels = () => window.AppStore?.models || [];

function renderDetectionRows(models) {
  return models.map(model => `<label class="model-row"><input class="checkbox" type="checkbox" ${model.status === 'alive' ? 'checked' : ''}><div><div class="model-name">${model.name}</div><div class="model-id">${model.id}</div></div><div><div class="status ${model.status === 'alive' ? 'ok' : 'fail'}">${model.status === 'alive' ? '存活' : '不可用'}</div><div class="model-id" style="text-align:right">${model.status === 'alive' ? `${model.latency}ms` : `原因：${friendlyMessage(model)}`}</div></div></label>`).join('');
}

function renderDetectionResults(root, models) {
  const list = root.querySelector('#home-detection-list');
  if (!list) return;
  list.innerHTML = renderDetectionRows(models);
  root.querySelector('#home-alive-count').textContent = models.filter(model => model.status === 'alive').length;
  root.querySelector('#home-failed-count').textContent = models.filter(model => model.status === 'failed').length;
}

export function renderHome() {
  const models = homeModels();
  const providers = window.AppStore?.providers || [];
  const aliveModels = models.filter(model => model.status === 'alive').length;
  const failedModels = models.filter(model => model.status === 'failed').length;
  const aliveProviders = providers.filter(provider => provider.status === 'alive').length;
  const failedProviders = providers.filter(provider => provider.status === 'failed').length;
  return `<header class="page-header"><div><div class="eyebrow">AI OBSERVABILITY</div><h1>Model Monitor</h1><div class="muted">实时掌握模型渠道状态</div></div><button class="icon-btn" data-action="refresh" title="刷新">↻</button></header>
    <div class="stats-grid">${[['模型总数',models.length,`${aliveModels} 个存活`],['渠道总数',providers.length,`${aliveProviders} 个存活`],['存活渠道',aliveProviders,'当前可用'],['失败渠道',failedProviders,'需要关注']].map(([label,value,note])=>`<div class="card stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></div>`).join('')}</div>
    <section class="section"><div class="actions"><button class="btn btn-primary" data-action="detect-all">全部检测</button><div class="card toggle-row" style="flex:1"><span>自动检测</span><label class="switch"><input type="checkbox" id="auto-check"><span class="slider"></span></label></div></div></section>
    <section class="section"><div class="section-heading"><h2>添加渠道</h2><span class="muted">Mock 模式</span></div><div class="card form-card"><label class="field"><span class="field-label">API Base URL</span><input class="input" id="base-url" placeholder="https://api.example.com/v1"></label><label class="field"><span class="field-label">API Key</span><input class="input" id="api-key" type="password" placeholder="sk-xxxxxxxx" autocomplete="off"></label><button class="btn btn-primary" style="width:100%" data-action="discover">发现模型</button><div id="discover-status" class="discover-status hidden"></div></div><div class="summary-line"><span>存活模型：<strong id="home-alive-count">${aliveModels}</strong></span><span>失败模型：<strong id="home-failed-count" style="color:var(--red)">${failedModels}</strong></span></div></section>
    <section class="section"><div class="section-heading"><h2>模型检测结果</h2><button class="btn btn-small btn-outline" data-action="models">查看全部</button></div><div class="card" id="home-detection-list">${renderDetectionRows(models)}</div></section>`;
}

export function bindHome(root, { onToast, navigate }) {
  root.querySelector('[data-action="discover"]')?.addEventListener('click', () => {
    const status = root.querySelector('#discover-status');
    const url = root.querySelector('#base-url').value.trim();
    const key = root.querySelector('#api-key').value;
    if (!url || !key) { onToast('请填写 API Base URL 和 API Key'); return; }
    status.classList.remove('hidden');
    status.innerHTML = '<span class="loading-dots">正在发现模型</span>';
    MockAPI.discoverModels({ name: '新增渠道', url, key })
      .then(({ provider, models }) => { status.innerHTML = '<span class="loading-dots">正在进行首次健康检测</span>'; return MockAPI.checkModels(models).then(records => ({ provider, models, records })); })
      .then(({ provider, models, records }) => {
        const checked = models.map(model => ({ ...model, status: records.find(record => record.modelId === model.id)?.status || 'failed', message: records.find(record => record.modelId === model.id)?.message || '模型不可用' }));
        AppStore.providers = [...AppStore.providers, provider];
        AppStore.models = [...AppStore.models, ...checked];
        AppStore.healthRecords = [...AppStore.healthRecords, ...records];
        renderDetectionResults(root, AppStore.models);
        status.textContent = `检测完成：找到 ${checked.length} 个模型`;
        window.dispatchEvent(new CustomEvent('models:updated'));
        onToast('模型发现与健康检测完成');
      })
      .catch(error => { console.error('Mock channel discovery failed:', error); status.textContent = '发现失败，请稍后重试'; });
  });
  root.querySelector('[data-action="detect-all"]')?.addEventListener('click', e => { e.currentTarget.textContent = '检测中…'; setTimeout(() => { e.currentTarget.textContent = '全部检测'; onToast('全部检测完成'); }, 1000); });
  root.querySelector('[data-action="models"]')?.addEventListener('click', () => navigate('models'));
  root.querySelector('[data-action="refresh"]')?.addEventListener('click', () => onToast('数据已刷新'));
  root.querySelector('#auto-check')?.addEventListener('change', e => onToast(e.target.checked ? '已开启自动检测' : '已关闭自动检测'));
}
