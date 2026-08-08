const availableModels = () => (window.AppStore?.models || []).filter(model => model.status === 'alive');

export function renderChat() {
  const models = availableModels();
  const options = models.length ? models.map(model => `<option value="${model.id}">${model.name}</option>`).join('') : '<option value="" disabled>暂无可用模型</option>';
  return `<header class="page-header"><div><div class="eyebrow">LIVE TEST</div><h1>实测对话</h1><div class="muted">用相同场景体验模型表现</div></div></header><div class="card chat-card"><label class="field chat-select"><span class="field-label">选择模型</span><select class="select" id="chat-model">${options}</select></label><label class="field"><span class="field-label">Prompt</span><textarea class="textarea" id="chat-prompt">请介绍一下量子计算。</textarea></label><button class="btn btn-primary" style="width:100%" id="send-chat" ${models.length ? '' : 'disabled'}>发送</button><div id="chat-messages"></div></div>`;
}

export function bindChat(root, { onToast }) {
  root.querySelector('#send-chat').addEventListener('click', () => {
    const button = root.querySelector('#send-chat');
    const prompt = root.querySelector('#chat-prompt').value.trim();
    const modelId = root.querySelector('#chat-model').value;
    const model = availableModels().find(item => item.id === modelId);
    if (!prompt) { onToast('请输入 Prompt'); return; }
    if (!model) { onToast('暂无可用模型'); return; }
    const historyItem = { modelId: model.id, prompt, response: '', status: 'pending', time: new Date().toISOString() };
    AppStore.chatHistory.push(historyItem);
    const output = root.querySelector('#chat-messages');
    output.innerHTML = `<div class="message user"><div class="message-label">你的 Prompt</div>${prompt}</div><div class="message assistant"><div class="message-label">${model.name} · <span class="loading-dots">生成中</span></div><div id="chat-answer"></div></div>`;
    button.disabled = true;
    button.textContent = '生成中…';
    setTimeout(() => {
      const response = '量子计算是一种利用量子力学原理进行信息处理的计算范式。它通过量子比特的叠加和纠缠，在特定问题上展现出传统计算机难以达到的效率。';
      const saved = AppStore.chatHistory[AppStore.chatHistory.length - 1];
      saved.response = response;
      saved.status = 'completed';
      saved.time = new Date().toISOString();
      root.querySelector('#chat-answer').textContent = response;
      root.querySelector('.message-label').innerHTML = `${model.name} · 已完成`;
      button.disabled = false;
      button.textContent = '发送';
      onToast('模型回复完成');
    }, 1100);
  });
}
