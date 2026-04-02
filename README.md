# 20260401-magicnetwork 工程交接 README

线上地址（GitHub Pages）：https://leon7786.github.io/20260401-magicnetwork

## 1. 项目目标
本项目是代理客户端导航文档站，按平台（Windows / Android / macOS / iOS）组织客户端介绍与下载入口。

核心约束：
1. 三语显式文案：`zh-Hans` / `zh-Hant-TW` / `en`
2. iOS 下载以 App Store 为准
3. GitHub 下载链接统一走代理前缀：`https://github.xloard.com/https://github.com/...`
4. 不使用 `docs/` 目录；内容源在 `content/`
5. 每个客户端目录内 `README.md` 即详情页

## 2. 仓库与发布
- Repo: `https://github.com/leon7786/20260401-magicnetwork`
- Pages: `https://leon7786.github.io/20260401-magicnetwork/`
- 发布：push 到 `main` 触发 `.github/workflows/deploy-pages.yml`

## 3. 技术栈
- MkDocs + Material for MkDocs
- 前端增强 JS：
  - `content/assets/javascripts/i18n-render.js`
  - `content/assets/javascripts/download-latest.js`
- 主题样式：`content/assets/stylesheets/n8n-like.css`
- 覆写模板：`content/overrides/main.html`

## 4. 当前目录结构（已统一）
```text
20260401-magicnetwork/
├─ mkdocs.yml
├─ content/
│  ├─ index.md
│  ├─ windows/*/README.md
│  ├─ android/*/README.md
│  ├─ macos/*/README.md
│  ├─ ios/*/README.md
│  ├─ assets/
│  │  ├─ javascripts/
│  │  └─ stylesheets/
│  └─ overrides/
├─ .github/workflows/deploy-pages.yml
├─ README.md
└─ SUMMARY.md
```

## 5. mkdocs 关键配置
`mkdocs.yml`：
- `docs_dir: content`
- `theme.custom_dir: content/overrides`
- `nav` 指向平台 `intro.md` 与各客户端 `README.md`

## 6. 本地运行
```bash
cd /root/20260401-magicnetwork

# 有 venv
.venv/bin/mkdocs build -f mkdocs.yml
.venv/bin/mkdocs serve -f mkdocs.yml -a 0.0.0.0:8000

# 无 venv
mkdocs build -f mkdocs.yml
mkdocs serve -f mkdocs.yml -a 0.0.0.0:8000
```

## 7. 内容编辑规范
1. 新增客户端：`content/<platform>/<client>/README.md`
2. 保持三语显式块：`[zh-Hans]` / `[zh-Hant-TW]` / `[en]`
3. GitHub 下载按钮沿用 `download-latest` DOM 模式
4. iOS 下载优先 App Store

## 8. 发布 SOP
```bash
.venv/bin/mkdocs build -f mkdocs.yml
git status
git add <changed-files>
git commit -m "..."
git push
```

## 9. 维护提示
先看这四个文件建立心智模型，再改内容：
- `mkdocs.yml`
- `content/assets/javascripts/i18n-render.js`
- `content/assets/javascripts/download-latest.js`
- `content/assets/stylesheets/n8n-like.css`
