import { stats, checkedModels } from './mock-data.js';

const statusText = item => item.status === 'alive' ? '存活' : '失败';
export function renderHome({ onToast, navigate }) {
  return `<header class="page-header"><div><div class="eyebrow">AI OBSERVABILITY</div><h1>Model Monitor</h1><div class="muted">实时掌握模型渠道状态</div></div><button class="icon-btn" data-action="refresh" title="刷新">↻</button></header>
    <div class="stats-grid">${[['模型总数',stats.models,'+8 本周'],['渠道总数',stats.channels,'3 个待检测'],['存活渠道',stats.alive,'75% 可用'],['失败渠道',stats.failed,'需要关注']].map(([l,v,n])=>`<div class="card stat-card"><div class="stat-label">${l}</div><div class="stat-value">${v}</div><div class="stat-note">${n}</div></div>`).join('')}</div>
    <section class="section"><div class="actions"><button class="btn btn-primary" data-action="detect-all">全部检测</button><div class="card toggle-row" style="flex:1"><span>自动检测</span><label class="switch"><input type="checkbox" id="auto-check"><span class="slider"></span></label></div></div></section>
    <section class="section"><div class="section-heading"><h2>添加渠道</h2><span class="muted">Mock 模式</span></div><div class="card form-card"><label class="field"><span class="field-label">API Base URL</span><input class="input" id="base-url" placeholder="https://api.example.com/v1"></label><label class="field"><span class="field-label">API Key</span><input class="input" type="password" placeholder="sk-xxxxxxxx"></label><button class="btn btn-primary" style="width:100%" data-action="discover">发现模型</button><div id="discover-status" class="discover-status hidden"></div></div></section>
    <section class="section"><div class="section-heading"><h2>模型检测结果</h2><button class="btn btn-small btn-outline" data-action="models">查看全部</button></div><div class="card">${checkedModels.map((m,i)=>`<label class="model-row"><input class="checkbox" type="checkbox" ${m.status==='alive'?'checked':''}><div><div class="model-name">${m.name}</div><div class="model-id">${m.id}</div></div><div><div class="status ${m.status==='alive'?'ok':'fail'}">${statusText(m)}</div><div class="model-id" style="text-align:right">${typeof m.latency==='number'?m.latency+'ms':m.latency}</div></div></label>`).join('')}</div><div class="summary-line"><span>存活模型：<strong>8</strong></span><span>失败模型：<strong style="color:var(--red)">2</strong></span></div></section>`;
}

export function bindHome(root, { onToast, navigate }) {
  root.querySelector('[data-action="discover"]')?.addEventListener('click', () => { const el=root.querySelector('#discover-status'); el.classList.remove('hidden'); el.innerHTML='<span class="loading-dots">正在发现模型</span>'; setTimeout(()=>{el.textContent='发现完成：找到 6 个可用模型'; onToast('模拟发现完成');},900); });
  root.querySelector('[data-action="detect-all"]')?.addEventListener('click', e=>{e.currentTarget.textContent='检测中…'; setTimeout(()=>{e.currentTarget.textContent='全部检测'; onToast('全部检测完成');},1000);});
  root.querySelector('[data-action="models"]')?.addEventListener('click',()=>navigate('models'));
  root.querySelector('[data-action="refresh"]')?.addEventListener('click',()=>onToast('数据已刷新'));
  root.querySelector('#auto-check')?.addEventListener('change', e=>onToast(e.target.checked?'已开启自动检测':'已关闭自动检测'));
}
