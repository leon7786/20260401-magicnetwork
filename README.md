# 20260401-magicnetwork 工程交接 README

线上地址（GitHub Pages）：https://leon7786.github.io/20260401-magicnetwork

> 面向“新接手工程师”的一页式交接文档。读完即可上手维护、发布和继续迭代。

---

## 1. 项目目标（What & Why）

本项目是一个 **代理客户端导航文档站**，按平台（Windows / Android / macOS / iOS）组织常见客户端的：

- 简介
- 官方下载入口
- 平台内对比导航

核心要求（当前已落地）：

1. **三语显式文案**：`zh-Hans` / `zh-Hant-TW` / `en`，不再使用自动简繁转换。
2. **iOS 下载以 App Store 为准**（通常不走 GitHub Release）。
3. **GitHub 下载链接统一走代理前缀**：
   - `https://github.xloard.com/https://github.com/...`
4. 站点视觉正在向 **docs.n8n.io 风格**靠拢（颜色、布局、组件质感）。

---

## 2. 线上与仓库信息

- Repo: `https://github.com/leon7786/20260401-magicnetwork`
- GitHub Pages: `https://leon7786.github.io/20260401-magicnetwork/`
- 发布方式：GitHub Actions 自动部署（push 到 `main` 触发）

---

## 3. 技术栈

- 文档框架：**MkDocs**
- 主题：**Material for MkDocs**
- 部署：GitHub Pages + Actions
- 前端增强：原生 JS（i18n 显示切换 + latest release 下载按钮解析）

---

## 4. 快速上手（本地运行）

```bash
# 项目目录
cd /root/20260401-magicnetwork

# 若已有虚拟环境（推荐）
.venv/bin/mkdocs build
.venv/bin/mkdocs serve -a 0.0.0.0:8000

# 无 venv 时
mkdocs build
mkdocs serve -a 0.0.0.0:8000
```

---

## 5. 关键目录结构（必须先理解）

```text
20260401-magicnetwork/
├─ mkdocs.yml
├─ docs/
│  ├─ index.md
│  ├─ windows/*/index.md
│  ├─ android/*/index.md
│  ├─ macos/*/index.md
│  ├─ ios/*/index.md
│  └─ assets/
│     ├─ javascripts/
│     │  ├─ i18n-render.js
│     │  └─ download-latest.js
│     └─ stylesheets/
│        └─ n8n-like.css
├─ overrides/
│  └─ main.html
├─ .github/workflows/
│  └─ deploy-pages.yml
├─ windows/ android/ macos/ ios/   # 仓库可见的平台目录（历史镜像用途）
└─ README.md
```

### 注意
- **真正用于站点渲染的是 `docs/**`**。
- 根目录 `windows/android/macos/ios` 主要是满足“仓库 tree 可见每客户端文件夹”的展示诉求，不是主渲染源。

---

## 6. 核心机制说明（高频改动点）

### 6.1 三语显式文案机制

- 每个页面采用显式块：
  - `### [zh-Hans]`
  - `### [zh-Hant-TW]`
  - `### [en]`
- `docs/assets/javascripts/i18n-render.js` 负责：
  1. 依据浏览器语言映射 locale
     - `zh-Hans`：简体
     - `zh-Hant-TW`：繁体（台湾风格）
     - 其他：`en`
  2. 仅显示对应语言块，隐藏其他语言块
  3. 对导航/标题做轻量文案替换

> 改文案时优先改 Markdown 源，不要回退到运行时自动转换。

### 6.2 下载按钮机制（GitHub latest release）

文件：`docs/assets/javascripts/download-latest.js`

- 通过 `data-repo` + `data-match` 从 GitHub API 拉 `releases/latest` 资产。
- 匹配成功：跳具体资产。
- 匹配失败：回退到 latest release 页面。
- **所有 GitHub URL 统一 proxify**：
  - `https://github.com/...` → `https://github.xloard.com/https://github.com/...`
- App Store 链接保持原样。

---

## 7. 视觉主题状态（n8n 风格化）

文件：
- `mkdocs.yml`（已接入 `extra_css`、`custom_dir`）
- `docs/assets/stylesheets/n8n-like.css`
- `overrides/main.html`

当前已完成：
- header / tabs / sidebar / content container / button / code block / quote 的统一风格覆盖
- 视觉方向接近 docs.n8n.io

可继续优化（下一位工程师优先）：
1. 顶栏与 tabs 的像素级间距对齐
2. 侧栏 active/hover 交互细节继续贴近
3. 移动端断点下间距与可读性精修

---

## 8. 内容编辑规范（重要）

1. 客户端页统一放 `docs/<platform>/<client>/index.md`
2. 必须保留三语显式块结构（不能缺块）
3. `zh-Hant-TW` 必须是独立台湾繁体文案，不用自动转换
4. 下载按钮尽量使用现有 `download-latest` DOM 模式，不要另起一套
5. iOS 以 App Store 链接为主

---

## 9. 发布流程（标准 SOP）

```bash
# 1) 本地检查
.venv/bin/mkdocs build

# 2) 提交
git status
git add <changed-files>
git commit -m "..."

# 3) 推送触发 Pages
git push

# 4) 如需手动触发
gh workflow run deploy-pages.yml -R leon7786/20260401-magicnetwork
```

GitHub Actions 文件：`.github/workflows/deploy-pages.yml`

---

## 10. 本地可用技能（已安装）

已在 `/root/.openclaw/skills/` 下安装：

- `build-docs`
- `i18n-check`
- `link-check`
- `preview-theme`
- `release-pages`
- `content-lint`

用途：快速做构建、链接、三语、文案一致性和发布前检查。

---

## 11. 已知事项 / 常见疑问

### Q1: `mkdocs build` 提示“部分页面不在 nav 中”
这是当前配置行为（如 `docs/index.md` 和各平台 `intro.md`），不是构建失败。

### Q2: 为什么既有 `docs/windows/...` 又有根目录 `windows/...`？
- `docs/**`：站点渲染源
- 根目录平台目录：仓库展示结构（历史要求）

### Q3: 新增客户端要改哪些地方？
1. 新建 `docs/<platform>/<client>/index.md`（三语块）
2. 在 `mkdocs.yml` 的 `nav` 加入口
3. 如是 GitHub release 下载，使用 `download-latest` 按钮模式
4. 本地跑 build + i18n/link 检查

---

## 12. 下一位工程师建议优先级（Backlog）

P0（本周）
- 继续高还原 n8n 风格（header/tab/sidebar 细节）
- 移动端样式细调

P1
- 为 `docs/index.md` 与平台 `intro.md` 决定是否纳入 nav（减少 warning）
- 增加自动化检查脚本到 CI（i18n/link/content lint）

P2
- 为新增客户端提供模板脚手架（快速生成三语页 + 下载按钮）

---

## 13. 交接人给接手人的一句话

先从 `mkdocs.yml`、`i18n-render.js`、`download-latest.js`、`n8n-like.css` 四个文件建立心智模型，再动页面内容；每次改动都先本地 `mkdocs build` 回归。