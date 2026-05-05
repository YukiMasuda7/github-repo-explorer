"use client";

import { useEffect, useRef, useState } from "react";
import { searchRepositories, type Repository } from "../api/clients";

enum DateFilterOption {
  Created = "created",
  Pushed = "pushed",
}

enum SortByOption {
  Stars = "stars",
  Forks = "forks",
  Watchers = "watchers",
}

enum SortOrderOption {
  Asc = "asc",
  Desc = "desc",
}

export default function Home() {
  const resultsSummaryRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollResultsRef = useRef(false);
  const [keyword, setKeyword] = useState("");
  const [userOrg, setUserOrg] = useState("");
  const [repoName, setRepoName] = useState("");
  const [language, setLanguage] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterOption | null>(null); // DateFilterOption | null
  const [dateValue, setDateValue] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<SortByOption>(SortByOption.Stars);
  const [sortOrder, setSortOrder] = useState<SortOrderOption>(
    SortOrderOption.Desc,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState<number | null>(null);
  const itemsPerPage = 50;

  const fetchRepositories = async (page: number) => {
    if (
      !keyword.trim() &&
      !userOrg.trim() &&
      !repoName.trim() &&
      !language.trim() &&
      !dateValue
    ) {
      setError("少なくとも1つの検索条件を入力してください");
      return;
    }

    setLoading(true);
    setError("");
    shouldScrollResultsRef.current = true;

    try {
      const res = await searchRepositories({
        keyword: keyword.trim() || undefined,
        user_org: userOrg.trim() || undefined,
        repo_name: repoName.trim() || undefined,
        language: language.trim() || undefined,
        created_at:
          dateFilter === DateFilterOption.Created && dateValue
            ? dateValue
            : undefined,
        pushed_at:
          dateFilter === DateFilterOption.Pushed && dateValue
            ? dateValue
            : undefined,
        page,
      });
      setRepositories(res.data.items || []);
      setTotalCount(res.data.total_count || 0);
      setCurrentPage(page);
      setPageInput(null);
    } catch (err: unknown) {
      shouldScrollResultsRef.current = false;
      let errorMessage = "検索に失敗しました";
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      } else if (typeof err === "string") {
        errorMessage = err || errorMessage;
      }

      if (!errorMessage.includes("Request failed with status code 500")) {
        setError(errorMessage);
      } else {
        setError("検索に失敗しました");
      }
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && shouldScrollResultsRef.current && totalCount > 0) {
      shouldScrollResultsRef.current = false;
      resultsSummaryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage, loading, totalCount]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchRepositories(1);
  };

  const getSortedRepositories = () => {
    const sorted = [...repositories];
    sorted.sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      if (sortBy === SortByOption.Stars) {
        aValue = a.stargazers_count;
        bValue = b.stargazers_count;
      } else if (sortBy === SortByOption.Forks) {
        aValue = a.forks_count;
        bValue = b.forks_count;
      } else if (sortBy === SortByOption.Watchers) {
        aValue = a.watchers_count;
        bValue = b.watchers_count;
      }

      return sortOrder === SortOrderOption.Desc
        ? bValue - aValue
        : aValue - bValue;
    });

    return sorted;
  };

  const handleChangeSortBy = async (value: SortByOption) => {
    setSortBy(value);
    setCurrentPage(1);
    setPageInput(null);
    if (totalCount > 0) {
      await fetchRepositories(1);
    }
  };

  const handleChangeSortOrder = async (value: SortOrderOption) => {
    setSortOrder(value);
    setCurrentPage(1);
    setPageInput(null);
    if (totalCount > 0) {
      await fetchRepositories(1);
    }
  };

  const handleClearAll = () => {
    setKeyword("");
    setUserOrg("");
    setRepoName("");
    setLanguage("");
    setDateFilter(null);
    setDateValue(null);
    setRepositories([]);
    setError("");
    setTotalCount(0);
    setCurrentPage(1);
    setPageInput(null);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePreviousPage = async () => {
    if (canGoPrevious) {
      await fetchRepositories(currentPage - 1);
    }
  };

  const handleNextPage = async () => {
    if (canGoNext) {
      await fetchRepositories(currentPage + 1);
    }
  };

  const handlePageJump = async () => {
    if (pageInput === null) {
      setPageInput(null);
      return;
    }

    const nextPage = pageInput;

    if (nextPage < 1) {
      setPageInput(null);
      return;
    }

    if (nextPage > totalPages) {
      setError(`そのページは範囲外です。最大ページ数は ${totalPages} です。`);
      return;
    }

    await fetchRepositories(nextPage);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            GitHub Repo Explorer
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-300 sm:text-base">
            AND（`&&` または スペース区切り）、OR（`||`）、NOT（`!` または
            `-`）使えます
            <br />
            例: `react && typescript`, `vue || angular`, `!deprecated`
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
          <form onSubmit={handleSearch} className="space-y-5">
            <div className="space-y-5">
              <Field label="キーワード">
                <TextInput
                  value={keyword}
                  onChange={setKeyword}
                  placeholder="例: react, async"
                  onClear={() => setKeyword("")}
                />
              </Field>

              <Field label="ユーザー / 組織">
                <TextInput
                  value={userOrg}
                  onChange={setUserOrg}
                  placeholder="例: user:torvalds または org:facebook"
                  onClear={() => setUserOrg("")}
                />
              </Field>

              <Field label="リポジトリ名">
                <TextInput
                  value={repoName}
                  onChange={setRepoName}
                  placeholder="例: linux, react"
                  onClear={() => setRepoName("")}
                />
              </Field>

              <Field label="言語・技術">
                <TextInput
                  value={language}
                  onChange={setLanguage}
                  placeholder="例: python, javascript, typescript"
                  onClear={() => setLanguage("")}
                />
              </Field>

              <Field label="日付フィルタ">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDateFilter(DateFilterOption.Created)}
                      className={`inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition ${
                        dateFilter === DateFilterOption.Created
                          ? "border-sky-500 bg-sky-600 text-white"
                          : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
                      }`}
                    >
                      📅作成日
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateFilter(DateFilterOption.Pushed)}
                      className={`inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition ${
                        dateFilter === DateFilterOption.Pushed
                          ? "border-sky-500 bg-sky-600 text-white"
                          : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
                      }`}
                    >
                      🔄更新日
                    </button>
                  </div>
                  <div className="flex gap-2 sm:items-center">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={dateFilter ? dateValue || "" : ""}
                        onChange={(e) =>
                          dateFilter && setDateValue(e.target.value || null)
                        }
                        disabled={!dateFilter}
                        className={`rounded-lg border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 ${
                          dateFilter ? "" : "opacity-0 pointer-events-none"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium text-neutral-300 whitespace-nowrap ${
                          dateFilter ? "" : "opacity-0"
                        }`}
                      >
                        以降
                      </span>
                    </div>

                    {dateFilter ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDateFilter(null);
                          setDateValue(null);
                        }}
                        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15"
                      >
                        ✕ クリア
                      </button>
                    ) : (
                      <div
                        aria-hidden
                        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white opacity-0 pointer-events-none"
                      >
                        ✕ クリア
                      </div>
                    )}
                  </div>
                </div>
              </Field>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "検索中..." : "検索"}
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                すべてクリア
              </button>
            </div>
          </form>
        </section>

        <section className="mt-8 flex-1 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {totalCount > 0 && (
            <div
              ref={resultsSummaryRef}
              className="mt-2 scroll-mt-8 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-neutral-300 sm:text-base">
                    見つかった件数:{" "}
                    <span className="font-semibold text-white">
                      {totalCount}
                    </span>{" "}
                    件
                  </p>
                  <p className="text-xs text-neutral-400">
                    ページ {currentPage} / {totalPages}（{itemsPerPage} 件）
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-neutral-200">
                      ソート:
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (
                          v === SortByOption.Stars ||
                          v === SortByOption.Forks ||
                          v === SortByOption.Watchers
                        ) {
                          handleChangeSortBy(v as SortByOption);
                        }
                      }}
                      className="rounded-lg border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-500"
                    >
                      <option value={SortByOption.Stars}>⭐ Star 数</option>
                      <option value={SortByOption.Forks}>🍴 Fork 数</option>
                      <option value={SortByOption.Watchers}>👀 Watch 数</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-neutral-200">
                      順序:
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (
                          v === SortOrderOption.Asc ||
                          v === SortOrderOption.Desc
                        ) {
                          handleChangeSortOrder(v as SortOrderOption);
                        }
                      }}
                      className="rounded-lg border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-500"
                    >
                      <option value={SortOrderOption.Desc}>
                        降順 (多い順)
                      </option>
                      <option value={SortOrderOption.Asc}>
                        昇順 (少ない順)
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {getSortedRepositories().map((repo: Repository) => (
              <article
                key={repo.id}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 transition hover:border-sky-400/40 hover:bg-white/[0.07]"
              >
                <h3 className="wrap-break-word text-lg font-semibold leading-7 text-white">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-sky-300 hover:underline"
                  >
                    {repo.full_name}
                  </a>
                </h3>

                <p className="mt-2 line-clamp-3 wrap-break-word text-sm leading-6 text-neutral-300">
                  {repo.description || "説明なし"}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-300">
                  <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
                  <span>🍴 {repo.forks_count.toLocaleString()}</span>
                  <span>👀 {repo.watchers_count.toLocaleString()}</span>
                  {repo.language && <span>📝 {repo.language}</span>}
                </div>
              </article>
            ))}
          </div>

          {repositories.length === 0 &&
            !loading &&
            (keyword || userOrg || repoName || language) && (
              <p className="text-sm text-neutral-400">結果はありません</p>
            )}

          {totalCount > 0 && (
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={!canGoPrevious || loading}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← 前へ
                  </button>

                  <span className="text-sm font-medium text-neutral-300">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={!canGoNext || loading}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    次へ →
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={pageInput ?? ""}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setPageInput(nextValue === "" ? null : Number(nextValue));
                    }}
                    placeholder="page"
                    className="w-24 rounded-lg border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-sky-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={handlePageJump}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    移動
                  </button>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-neutral-100 sm:text-base">
        {label}
      </label>
      {children}
      {helper && (
        <div className="text-xs leading-5 text-neutral-400">{helper}</div>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  onClear,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  type?: "text" | "date";
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15"
        >
          ✕ クリア
        </button>
      ) : (
        <div
          aria-hidden
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white opacity-0 pointer-events-none"
        >
          ✕ クリア
        </div>
      )}
    </div>
  );
}
