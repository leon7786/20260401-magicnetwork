     1|# 20260401-magicnetwork 工程交接 README
     2|
     3|线上地址（GitHub Pages）：https://leon7786.github.io/20260401-magicnetwork
     4|
     5|## 1. 项目目标
     6|本项目是代理客户端导航文档站，按平台（Windows / Android / macOS / iOS）组织客户端介绍与下载入口。
     7|
     8|核心约束：
     9|1. 三语显式文案：`zh-Hans` / `zh-Hant-TW` / `en`
    10|2. iOS 下载以 App Store 为准
    11|3. GitHub 下载链接统一走代理前缀：`https://p.etime.vip/https://github.com/...`
    12|4. 不使用 `docs/` 目录；内容源在 `content/`
    13|5. 每个客户端目录内 `README.md` 即详情页
    14|
    15|## 2. 仓库与发布
    16|- Repo: `https://github.com/leon7786/20260401-magicnetwork`
    17|- Pages: `https://leon7786.github.io/20260401-magicnetwork/`
    18|- 发布：push 到 `main` 触发 `.github/workflows/deploy-pages.yml`
    19|
    20|## 3. 技术栈
    21|- MkDocs + Material for MkDocs
    22|- 前端增强 JS：
    23|  - `content/assets/javascripts/i18n-render.js`
    24|  - `content/assets/javascripts/download-latest.js`
    25|- 主题样式：`content/assets/stylesheets/n8n-like.css`
    26|- 覆写模板：`content/overrides/main.html`
    27|
    28|## 4. 当前目录结构（已统一）
    29|```text
    30|20260401-magicnetwork/
    31|├─ mkdocs.yml
    32|├─ content/
    33|│  ├─ index.md
    34|│  ├─ windows/*/README.md
    35|│  ├─ android/*/README.md
    36|│  ├─ macos/*/README.md
    37|│  ├─ ios/*/README.md
    38|│  ├─ assets/
    39|│  │  ├─ javascripts/
    40|│  │  └─ stylesheets/
    41|│  └─ overrides/
    42|├─ .github/workflows/deploy-pages.yml
    43|├─ README.md
    44|└─ SUMMARY.md
    45|```
    46|
    47|## 5. mkdocs 关键配置
    48|`mkdocs.yml`：
    49|- `docs_dir: content`
    50|- `theme.custom_dir: content/overrides`
    51|- `nav` 指向平台 `intro.md` 与各客户端 `README.md`
    52|
    53|## 6. 本地运行
    54|```bash
    55|cd /root/20260401-magicnetwork
    56|
    57|# 有 venv
    58|.venv/bin/mkdocs build -f mkdocs.yml
    59|.venv/bin/mkdocs serve -f mkdocs.yml -a 0.0.0.0:8000
    60|
    61|# 无 venv
    62|mkdocs build -f mkdocs.yml
    63|mkdocs serve -f mkdocs.yml -a 0.0.0.0:8000
    64|```
    65|
    66|## 7. 内容编辑规范
    67|1. 新增客户端：`content/<platform>/<client>/README.md`
    68|2. 保持三语显式块：`[zh-Hans]` / `[zh-Hant-TW]` / `[en]`
    69|3. GitHub 下载按钮沿用 `download-latest` DOM 模式
    70|4. iOS 下载优先 App Store
    71|
    72|## 8. 发布 SOP
    73|```bash
    74|.venv/bin/mkdocs build -f mkdocs.yml
    75|git status
    76|git add <changed-files>
    77|git commit -m "..."
    78|git push
    79|```
    80|
    81|## 9. 维护提示
    82|先看这四个文件建立心智模型，再改内容：
    83|- `mkdocs.yml`
    84|- `content/assets/javascripts/i18n-render.js`
    85|- `content/assets/javascripts/download-latest.js`
    86|- `content/assets/stylesheets/n8n-like.css`
    87|