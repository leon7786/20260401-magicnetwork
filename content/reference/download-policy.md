<!-- i18n-explicit-blocks -->

### [zh-Hans]

# 下载策略 / Download policy

## 目标
统一下载来源，减少假链接与版本混乱。

## 规则

1. GitHub 项目优先使用官方仓库 latest release。
2. GitHub 链接统一走代理前缀：
   - `https://github.com/...` → `https://github.xloard.com/https://github.com/...`
3. iOS 客户端优先 App Store 官方入口。
4. 当 release 资产匹配失败时，回退到 latest release 页面。

## 实现位置

- `content/assets/javascripts/download-latest.js`

### [zh-Hant-TW]

# 下載策略 / Download policy

## 目標
統一下載來源，降低假連結與版本混亂。

## 規則

1. GitHub 專案優先使用官方倉庫 latest release。
2. GitHub 連結統一走代理前綴：
   - `https://github.com/...` → `https://github.xloard.com/https://github.com/...`
3. iOS 客戶端優先 App Store 官方入口。
4. 當 release 資產匹配失敗時，回退到 latest release 頁面。

## 實作位置

- `content/assets/javascripts/download-latest.js`

### [en]

# Download policy

## Goal
Use consistent official sources and reduce broken or misleading download routes.

## Rules

1. For GitHub projects, prefer official `latest release`.
2. All GitHub URLs are proxied:
   - `https://github.com/...` → `https://github.xloard.com/https://github.com/...`
3. For iOS clients, prioritize official App Store listings.
4. If asset matching fails, fallback to the release page.

## Implementation

- `content/assets/javascripts/download-latest.js`
