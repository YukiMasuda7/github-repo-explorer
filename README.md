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
poetry run uvicorn main:app --reload
```

### frontend

```bash
cd frontend
npm install
npm run dev
```

---

## APIドキュメント

http://localhost:8000/docs