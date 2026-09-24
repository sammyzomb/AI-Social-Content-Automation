# Phase 1 POC

## 目的
先驗證「AI 內容 → 品質檢查 → 排程 → 發布」流程，不直接接 13 個正式帳號。

## 已完成
- 內容狀態機
- 綠／黃／紅風險分級
- 基本近似內容查重
- 平台內容變體 POC
- Quality Gate
- Idempotent Mock Publisher
- PostgreSQL 初版 schema
- Postiz Docker POC
- Node.js 自動測試

## 本機先測 Mock Publisher

需要 Node.js 20+。

```bash
npm test
npm run demo
```

`npm run demo` 會建立一個羅浮敦旅遊主題，產生 Facebook / Instagram / Threads / TikTok / YouTube 五個版本，通過品質檢查後以 Mock Publisher 模擬發布。

## 啟動 Postiz 測試環境

先進入 docker 目錄，複製環境檔：

```powershell
Copy-Item .env.postiz.example .env
```

至少先修改：

```text
POSTIZ_JWT_SECRET=一段夠長的隨機字串
```

啟動：

```bash
docker compose --env-file .env -f postiz-compose.yml up -d
```

開啟：
- Postiz: http://localhost:4007
- Temporal UI: http://localhost:8080

## 第一輪驗收
1. `npm test` 全部 PASS。
2. `npm run demo` 產生 5 個平台模擬發布結果。
3. Postiz Docker 所有必要 container 啟動。
4. Postiz 首頁可開啟。
5. 尚未填任何正式公司社群 Token。
6. 尚未自動發布到任何正式帳號。

## 下一步
POC 通過後，才進入 Phase 1.1：
- 建立本專案自己的 PostgreSQL
- 將 Mock Publisher 抽象成 Publisher interface
- 加入 Postiz API adapter
- 只接一個測試 Facebook Page
- 建立發布紀錄與 retry worker
