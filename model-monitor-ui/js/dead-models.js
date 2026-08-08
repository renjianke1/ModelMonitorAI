import { deadModels as fallbackDeadModels } from './mock-data.js';

const friendlyReason = model => model.message || ({ Timeout: '请求超时', '403': 'API Key 无效', '404': '模型不存在', '503': '服务暂时不可用' }[model.errorCode || model.reason] || '模型不可用');

export function renderDead() {
  const deadModels = window.AppStore?.deadModels?.length ? window.AppStore.deadModels : fallbackDeadModels;
  return `<header class="page-header"><div><div class="eyebrow">ATTENTION REQUIRED</div><h1>挂掉模型</h1><div class="muted">失败或超时的模型渠道</div></div><span class="status fail">${deadModels.length} 个待处理</span></header><div id="dead-list">${deadModels.map((model, index) => `<div class="card dead-card" data-dead="${index}"><div class="dead-head"><div><h3>${model.name}</h3><div class="model-id">${model.id}</div></div><span class="status fail">不可用</span></div><div class="dead-details"><div>渠道<strong>${model.channel}</strong></div><div>原因<strong>${friendlyReason(model)}</strong></div><div>最后检测<strong>${model.checked}</strong></div></div><details class="raw-error"><summary>查看原始错误</summary><div class="raw-error-status">HTTP 状态码：${model.httpStatus || model.errorCode || '—'}</div><pre class="raw-error-content">${model.rawResponse || '暂无原始返回内容'}</pre></details><button class="btn btn-small btn-outline" data-retry="${index}">重新检测</button></div>`).join('')}</div>`;
}

export function bindDead(root, { onToast }) {
  root.querySelectorAll('[data-retry]').forEach(button => button.addEventListener('click', () => {
    button.textContent = '检测中…';
    button.disabled = true;
    setTimeout(() => { button.textContent = '重新检测'; button.disabled = false; onToast('检测完成：仍需关注'); }, 850);
  }));
}
