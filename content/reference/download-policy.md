     1|<!-- i18n-explicit-blocks -->
     2|
     3|### [zh-Hans]
     4|
     5|# 下载策略 / Download policy
     6|
     7|本页说明站点下载链接的统一规则，帮助你快速判断“应该点哪个入口”。
     8|
     9|## 目标
    10|统一下载来源，减少假链接与版本混乱。
    11|
    12|## 规则
    13|
    14|1. GitHub 项目优先使用官方仓库 latest release。
    15|2. GitHub 链接统一走代理前缀：
    16|   - `https://github.com/...` → `https://p.etime.vip/https://github.com/...`
    17|3. iOS 客户端优先 App Store 官方入口。
    18|4. 当 release 资产匹配失败时，回退到 latest release 页面。
    19|
    20|## 实现位置
    21|
    22|- `content/assets/javascripts/download-latest.js`
    23|
    24|### [zh-Hant-TW]
    25|
    26|# 下載策略 / Download policy
    27|
    28|本頁說明站點下載連結的統一規則，協助你快速判斷應使用的入口。
    29|
    30|## 目標
    31|統一下載來源，降低假連結與版本混亂。
    32|
    33|## 規則
    34|
    35|1. GitHub 專案優先使用官方倉庫 latest release。
    36|2. GitHub 連結統一走代理前綴：
    37|   - `https://github.com/...` → `https://p.etime.vip/https://github.com/...`
    38|3. iOS 客戶端優先 App Store 官方入口。
    39|4. 當 release 資產匹配失敗時，回退到 latest release 頁面。
    40|
    41|## 實作位置
    42|
    43|- `content/assets/javascripts/download-latest.js`
    44|
    45|### [en]
    46|
    47|# Download policy
    48|
    49|This page explains the site-wide download rules so you can quickly choose the right entry.
    50|
    51|## Goal
    52|Use consistent official sources and reduce broken or misleading download routes.
    53|
    54|## Rules
    55|
    56|1. For GitHub projects, prefer official `latest release`.
    57|2. All GitHub URLs are proxied:
    58|   - `https://github.com/...` → `https://p.etime.vip/https://github.com/...`
    59|3. For iOS clients, prioritize official App Store listings.
    60|4. If asset matching fails, fallback to the release page.
    61|
    62|## Implementation
    63|
    64|- `content/assets/javascripts/download-latest.js`
    65|