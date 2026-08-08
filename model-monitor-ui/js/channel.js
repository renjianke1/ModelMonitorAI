let activeModal = null;

export function openChannelModal({ onSuccess } = {}) {
  if (activeModal) return;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="channel-modal-title"><div class="modal-head"><h2 id="channel-modal-title">添加渠道</h2><button class="icon-btn" type="button" data-close-channel aria-label="关闭">×</button></div><p class="muted" style="margin-top:-6px;margin-bottom:16px">输入渠道信息，模拟发现可用模型</p><form id="channel-form"><label class="field"><span class="field-label">渠道名称</span><input class="input" name="name" placeholder="例如：我的聚合渠道" required></label><label class="field"><span class="field-label">API Base URL</span><input class="input" name="url" type="url" placeholder="https://api.example.com/v1" required></label><label class="field"><span class="field-label">API Key</span><input class="input" name="key" type="password" placeholder="sk-xxxxxxxx" autocomplete="off" required></label><div id="channel-feedback" class="discover-status hidden"></div><div class="actions" style="justify-content:flex-end;margin-top:16px"><button class="btn" type="button" data-close-channel>取消</button><button class="btn btn-primary" type="submit">发现模型</button></div></form></div>`;
  document.body.appendChild(backdrop);
  activeModal = backdrop;

  const close = () => { backdrop.remove(); activeModal = null; };
  backdrop.querySelectorAll('[data-close-channel]').forEach(button => button.addEventListener('click', close));
  backdrop.addEventListener('click', event => { if (event.target === backdrop) close(); });
  backdrop.querySelector('#channel-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector('[type="submit"]');
    const feedback = form.querySelector('#channel-feedback');
    const values = Object.fromEntries(new FormData(form).entries());
    submit.disabled = true;
    submit.textContent = '发现中…';
    feedback.classList.remove('hidden');
    feedback.textContent = '正在发现模型…';

    // key 只用于本次 Mock 调用，不写入 provider 或 AppStore。
    MockAPI.discoverModels({ name: values.name, url: values.url, key: values.key })
      .then(({ provider, models }) => {
        AppStore.providers = [...AppStore.providers, provider];
        AppStore.models = [...AppStore.models, ...models];
        window.dispatchEvent(new CustomEvent('models:updated'));
        feedback.textContent = `发现完成：找到 ${models.length} 个模型`;
        if (onSuccess) onSuccess({ provider, models });
        setTimeout(close, 500);
      })
      .catch(error => {
        console.error('MockAPI.discoverModels() failed:', error);
        submit.disabled = false;
        submit.textContent = '发现模型';
        feedback.textContent = '发现失败，请稍后重试';
      });
  });
}
