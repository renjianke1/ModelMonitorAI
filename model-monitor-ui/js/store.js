/*
 * v0.2.1 全局状态容器。
 * 当前页面仍使用原有模块内的 Mock 数据；这里先建立未来 API 接入时的统一状态入口。
 */
(function createAppStore(global) {
  global.AppStore = {
    models: [],
    providers: [],
    chatHistory: [],
    tokenStats: { total: 0, byModel: [] },
    deadModels: []
  };
})(window);
