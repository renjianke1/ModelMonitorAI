/*
 * v0.2.1 模拟数据接口。
 * 使用 Promise 模拟异步接口，并返回副本，避免调用方直接修改接口源数据。
 */
(function createMockAPI(global) {
  const modelData = [
    { name: 'GPT-4o', id: 'gpt-4o', series: 'GPT', status: 'alive', latency: 820, channels: 3 },
    { name: 'Claude 3.5 Sonnet', id: 'claude-3-5-sonnet', series: 'Claude', status: 'alive', latency: 1120, channels: 2 },
    { name: 'DeepSeek V3', id: 'deepseek-chat', series: 'DeepSeek', status: 'failed', latency: 'Timeout', channels: 1 },
    { name: 'Gemini 2.5 Pro', id: 'gemini-2.5-pro', series: 'Gemini', status: 'alive', latency: 960, channels: 2 },
    { name: 'Qwen Max', id: 'qwen-max', series: 'Qwen', status: 'alive', latency: 740, channels: 2 },
    { name: 'GLM-4-Plus', id: 'glm-4-plus', series: 'GLM', status: 'failed', latency: '503', channels: 1 },
    { name: 'MiniMax-01', id: 'MiniMax-01', series: 'MiniMax', status: 'alive', latency: 1380, channels: 1 },
    { name: '混元 Turbo', id: 'hunyuan-turbo', series: '混元', status: 'alive', latency: 890, channels: 1 },
    { name: 'GPT-4-turbo', id: 'gpt-4-turbo', series: 'GPT', status: 'alive', latency: 1050, channels: 3 },
    { name: 'DeepSeek V2', id: 'deepseek-chat-v2', series: 'DeepSeek', status: 'failed', latency: 'Timeout', channels: 1 }
  ];

  const providerData = [
    { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', status: 'alive', modelCount: 18 },
    { id: 'anthropic', name: 'Anthropic', baseUrl: 'https://api.anthropic.com', status: 'alive', modelCount: 8 },
    { id: 'aggregator-a', name: '聚合渠道 A', baseUrl: 'https://api.example.com/v1', status: 'failed', modelCount: 42 },
    { id: 'aliyun', name: '阿里云', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', status: 'alive', modelCount: 16 }
  ];

  const tokenData = {
    total: 128520,
    byModel: [
      { model: 'GPT-4o', tokens: 50200, percent: 39 },
      { model: 'Claude', tokens: 32100, percent: 25 },
      { model: 'DeepSeek', tokens: 20500, percent: 16 },
      { model: 'Gemini', tokens: 15320, percent: 12 },
      { model: 'Qwen', tokens: 10400, percent: 8 }
    ]
  };

  const deadModelData = [
    { name: 'DeepSeek V2', id: 'deepseek-chat-v2', channel: '聚合渠道 A', reason: 'Timeout', checked: '2026-08-08 20:10' },
    { name: 'DeepSeek V3', id: 'deepseek-chat', channel: '聚合渠道 A', reason: '连接超时', checked: '2026-08-08 20:08' },
    { name: 'GLM-4-Plus', id: 'glm-4-plus', channel: '智谱渠道', reason: 'HTTP 503', checked: '2026-08-08 20:05' }
  ];

  const copy = value => JSON.parse(JSON.stringify(value));
  const asyncResult = value => Promise.resolve(copy(value));

  global.MockAPI = {
    getModels() { return asyncResult(modelData); },
    getProviders() { return asyncResult(providerData); },
    getTokenStats() { return asyncResult(tokenData); },
    getDeadModels() { return asyncResult(deadModelData); },
    discoverModels(channel) {
      const providerName = channel.name || '新渠道';
      const providerId = `provider-${Date.now()}`;
      const models = [
        { name: `${providerName} Chat`, id: `${providerId}-chat`, series: providerName, status: 'alive', latency: 860, channels: 1 },
        { name: `${providerName} Reasoner`, id: `${providerId}-reasoner`, series: providerName, status: 'alive', latency: 1040, channels: 1 },
        { name: `${providerName} Fast`, id: `${providerId}-fast`, series: providerName, status: 'alive', latency: 620, channels: 1 }
      ];
      const provider = { id: providerId, name: providerName, url: channel.url, status: 'alive', modelCount: models.length };
      return new Promise(resolve => setTimeout(() => resolve({ provider, models }), 700));
    }
  };

  // 先用 MockAPI 填充全局状态；未来替换为真实 API 时只需替换这一层。
  global.MockAPI.getModels().then(data => { global.AppStore.models = data; });
  global.MockAPI.getProviders().then(data => { global.AppStore.providers = data; });
  global.MockAPI.getTokenStats().then(data => { global.AppStore.tokenStats = data; });
  global.MockAPI.getDeadModels().then(data => { global.AppStore.deadModels = data; });
})(window);
