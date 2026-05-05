# GitHub Repo Explorer

## 概要

Next.js + FastAPI を使ったGitHubリポジトリ検索アプリ
OpenAPI + Orval によるAPIクライアント自動生成を実装

---

## 技術スタック

* Frontend: Next.js (TypeScript)
* Backend: FastAPI (Python)
* API Client: Orval

---

## 機能

* GitHubリポジトリ検索

---

## セットアップ

### backend

```bash
cd backend
poetry install
poetry run uvicorn src.main:app --reload
```

### frontend

`frontend/.env.local` を作成して、必要ならバックエンドの向きを設定します。

`.env.local` の中身:

```env
BACKEND_ORIGIN=http://127.0.0.1:8000
```

その後にフロントを起動します。

```bash
cd frontend
npm install
npm run dev
```

---

## APIドキュメント

http://localhost:8000/docs