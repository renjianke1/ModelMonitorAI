# Model Monitor AI — Web UI Prototype v0.1

这是一个手机端优先的纯前端 UI 原型。项目仅使用 HTML5、CSS3 和原生 JavaScript，所有数据均来自 `js/mock-data.js`，不连接真实 API，也不包含后端、数据库或 Android 代码。

## 启动

在 `model-monitor-ui/` 目录运行：

```bash
python -m http.server 8080
```

然后打开 <http://localhost:8080>。由于使用 ES Modules，必须通过 HTTP 静态服务器打开，不能直接双击 `index.html`。

## 目录

- `index.html`：应用入口与页面容器
- `css/style.css`：移动端布局、卡片、导航和控件样式
- `js/mock-data.js`：集中管理所有 Mock 数据
- `js/app.js`：页面路由、底部导航和 Toast
- `js/home.js`：概览、渠道发现、检测交互
- `js/models.js`：模型分组、搜索、排序入口、平铺和模型对比
- `js/chat.js`：实测对话及模拟回复
- `js/speed.js`：测速指标、历史记录和筛选
- `js/token.js`：Token 统计图和清空交互
- `js/dead-models.js`：失败模型列表和重新检测

## 已实现

底部 Tab 切换、渠道发现 Loading、自动检测开关、模型勾选、模型分组展开/收起、搜索、排序提示、平铺视图、实测对话 Loading/回复、模型对比、测速记录筛选、Token 清空、失败模型重新检测，均为前端 Mock 交互。

## 未实现

真实 API 请求、模型检测、真实 Token 统计、账号体系、持久化、服务端、数据库、Python、Android/Kotlin/Chaquopy。

## Git 提交建议

```text
v0.1: create mobile web UI prototype
```
