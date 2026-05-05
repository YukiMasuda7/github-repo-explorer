from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from typing import List, Optional
from enum import Enum

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Response Model
# -----------------------------


class Owner(BaseModel):
    login: str


class Repository(BaseModel):
    id: int
    name: str
    full_name: str
    html_url: str
    description: Optional[str]
    stargazers_count: int
    forks_count: int
    watchers_count: int
    language: Optional[str]
    owner: Owner


class SearchResponse(BaseModel):
    total_count: int
    items: List[Repository]


# -----------------------------
# Endpoint
# -----------------------------


# --- Enums for clarity and type-safety ---


class DateFilter(str, Enum):
    created = "created"
    pushed = "pushed"


class SortBy(str, Enum):
    stars = "stars"
    forks = "forks"
    watchers = "watchers"


class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


@app.get(
    "/repositories",
    operation_id="searchRepositories",
    summary="GitHubリポジトリ検索",
    description="複数フィルタを使ってGitHubのリポジトリを検索し、50件ずつ返す。",
    response_model=SearchResponse,
)
def search_repositories(
    keyword: Optional[str] = Query(None, description="検索キーワード"),
    user_org: Optional[str] = Query(
        None, description="ユーザー/組織名（user:username または org:orgname）"
    ),
    repo_name: Optional[str] = Query(
        None, description="リポジトリ名に含まれるテキスト"
    ),
    language: Optional[str] = Query(
        None, description="プログラミング言語（例：python, javascript）"
    ),
    created_at: Optional[str] = Query(None, description="作成日（YYYY-MM-DD 以降）"),
    pushed_at: Optional[str] = Query(None, description="更新日（YYYY-MM-DD 以降）"),
    page: int = Query(1, ge=1, description="ページ番号"),
):
    url = "https://api.github.com/search/repositories"

    # クエリを構築
    query_parts = []

    if keyword:
        query_parts.append(keyword)

    if user_org:
        query_parts.append(user_org)

    if repo_name:
        query_parts.append(f"in:name {repo_name}")

    if language:
        query_parts.append(f"language:{language}")

    if created_at:
        query_parts.append(f"created:>={created_at}")

    if pushed_at:
        query_parts.append(f"pushed:>={pushed_at}")

    if not query_parts:
        return {"total_count": 0, "items": []}

    q = " ".join(query_parts)

    params = {
        "q": q,
        "per_page": 50,
        "page": page,
        "sort": SortBy.stars.value,
        "order": SortOrder.desc.value,
    }

    res = requests.get(url, params=params)
    data = res.json()

    return data
