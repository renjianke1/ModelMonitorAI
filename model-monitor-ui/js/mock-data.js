export const stats = { models: 128, channels: 12, alive: 9, failed: 3 };

export const checkedModels = [
  { name:'GPT-4o', id:'gpt-4o', status:'alive', latency:820 },
  { name:'Claude 3.5 Sonnet', id:'claude-3-5-sonnet', status:'alive', latency:1120 },
  { name:'DeepSeek V3', id:'deepseek-chat', status:'failed', latency:'Timeout' },
  { name:'Gemini 2.5 Pro', id:'gemini-2.5-pro', status:'alive', latency:960 },
  { name:'Qwen Max', id:'qwen-max', status:'alive', latency:740 },
  { name:'GLM-4-Plus', id:'glm-4-plus', status:'failed', latency:'503' },
  { name:'MiniMax-01', id:'MiniMax-01', status:'alive', latency:1380 },
  { name:'混元 Turbo', id:'hunyuan-turbo', status:'alive', latency:890 },
  { name:'GPT-4-turbo', id:'gpt-4-turbo', status:'alive', latency:1050 },
  { name:'DeepSeek V2', id:'deepseek-chat-v2', status:'failed', latency:'Timeout' }
];

export const modelSeries = [
  { name:'GPT', models:['GPT-4o','GPT-4o-mini','GPT-4-turbo','GPT-3.5-turbo'], alive:10, total:12 },
  { name:'Claude', models:['Claude 3.5 Sonnet','Claude 3 Opus','Claude 3 Haiku'], alive:7, total:8 },
  { name:'Gemini', models:['Gemini 2.5 Pro','Gemini 2.5 Flash','Gemini 1.5 Pro'], alive:6, total:6 },
  { name:'DeepSeek', models:['DeepSeek V3','DeepSeek V2','DeepSeek Coder'], alive:4, total:5 },
  { name:'Qwen', models:['Qwen Max','Qwen Plus','Qwen Turbo'], alive:8, total:8 },
  { name:'GLM', models:['GLM-4-Plus','GLM-4-Flash'], alive:5, total:6 },
  { name:'混元', models:['混元 Turbo','混元 Pro'], alive:4, total:4 },
  { name:'MiniMax', models:['MiniMax-01','abab6.5s-chat'], alive:3, total:3 }
];

export const speedHistory = [
  { model:'GPT-4o', channel:'OpenAI', status:'success', latency:'820ms', time:'20:15' },
  { model:'Claude 3.5', channel:'Anthropic', status:'success', latency:'1120ms', time:'20:13' },
  { model:'DeepSeek V3', channel:'聚合渠道', status:'timeout', latency:'Timeout', time:'20:10' },
  { model:'Qwen Max', channel:'阿里云', status:'success', latency:'740ms', time:'20:08' },
  { model:'GLM-4-Plus', channel:'智谱', status:'failed', latency:'503', time:'20:05' },
  { model:'Gemini 2.5', channel:'Google', status:'success', latency:'960ms', time:'20:01' }
];

export const tokenUsage = [
  { model:'GPT-4o', tokens:50200, percent:39 }, { model:'Claude', tokens:32100, percent:25 },
  { model:'DeepSeek', tokens:20500, percent:16 }, { model:'Gemini', tokens:15320, percent:12 }, { model:'Qwen', tokens:10400, percent:8 }
];

export const deadModels = [
  { name:'DeepSeek V2', id:'deepseek-chat-v2', channel:'聚合渠道 A', reason:'Timeout', checked:'2026-08-08 20:10' },
  { name:'DeepSeek V3', id:'deepseek-chat', channel:'聚合渠道 A', reason:'连接超时', checked:'2026-08-08 20:08' },
  { name:'GLM-4-Plus', id:'glm-4-plus', channel:'智谱渠道', reason:'HTTP 503', checked:'2026-08-08 20:05' }
];
