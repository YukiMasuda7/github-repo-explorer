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

---

## Formatting & Linting (変更後に実行)

フロントエンドおよびバックエンドで変更を行ったら、以下のコマンドでフォーマットと静的チェックを実行してください。

- Frontend (`frontend/`)

```bash
npx prettier --write .
npm run lint
```

- Backend (Python, `backend/` - Poetry を使用)

```bash
poetry run black .
poetry run ruff format .
poetry run ruff check --fix .
```

注: プロジェクトでは各種 code formatter と linter を使用しています。CI がある場合は CI のルールに合わせて実行してください。