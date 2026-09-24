# AI 社群內容自動化專案大綱

## 專案目標
建立 AI 社群編輯部，將旅遊內容自動完成選題、生成、查重、風險檢查、圖片匹配、排程、發布與成效回收。

## 目前社群出口
- Facebook：約 7 個
- YouTube：2 個
- Instagram：1 個
- TikTok：2 個
- Threads：1 個

## 500 則策略
採「核心主題 × 多版本 × 多平台」模式。
例如 50 個核心主題 × 平均 10 個變體 ≈ 500 則。

## 技術選型
- 自建：AI Content Engine / Quality Engine
- 發布引擎：Postiz 優先
- 備選：BrightBean Studio
- 儲存：PostgreSQL / Supabase 類型資料庫
- 自動化：Make.com 或自建 worker
- 發布：官方 API 優先

## Facebook 原則
- Page：可走官方 API
- 個人 Profile：不納入全自動發布，改成人工最後一步

## 第一階段成功標準
完成：
AI 產文 → 查重 → 審核 → 排程 → 正式發布 → 失敗重試 → 成效回收
