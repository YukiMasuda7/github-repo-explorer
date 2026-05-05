import { useCallback, useRef, useState } from "react";
import { searchRepositories } from "../api/clients";
import {
  DateFilterOption,
  SortByOption,
  SortOrderOption,
  type SearchState,
  type SearchParams,
} from "../types/search";

const ITEMS_PER_PAGE = 50;
const MAX_TOTAL_COUNT = 1000; // GitHub API の検索上限

export const useRepositorySearch = () => {
  const resultsSummaryRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollResultsRef = useRef(false);

  const [state, setState] = useState<SearchState>({
    keyword: "",
    userOrg: "",
    repoName: "",
    language: "",
    dateFilter: null,
    dateValue: null,
    repositories: [],
    loading: false,
    error: "",
    totalCount: 0,
    sortBy: SortByOption.Stars,
    sortOrder: SortOrderOption.Desc,
    currentPage: 1,
    pageInput: null,
  });

  const updateState = useCallback((updates: Partial<SearchState>) => {
    setState((prev: SearchState) => ({ ...prev, ...updates }));
  }, []);

  const fetchRepositories = useCallback(
    async (page: number) => {
      if (
        !state.keyword.trim() &&
        !state.userOrg.trim() &&
        !state.repoName.trim() &&
        !state.language.trim() &&
        !state.dateValue
      ) {
        updateState({ error: "少なくとも1つの検索条件を入力してください" });
        return;
      }

      updateState({ loading: true, error: "" });
      shouldScrollResultsRef.current = true;

      try {
        const params: SearchParams = {
          keyword: state.keyword.trim() || undefined,
          user_org: state.userOrg.trim() || undefined,
          repo_name: state.repoName.trim() || undefined,
          language: state.language.trim() || undefined,
          created_at:
            state.dateFilter === DateFilterOption.Created && state.dateValue
              ? state.dateValue
              : undefined,
          pushed_at:
            state.dateFilter === DateFilterOption.Pushed && state.dateValue
              ? state.dateValue
              : undefined,
          page,
        };

        const res = await searchRepositories(params);
        updateState({
          repositories: res.data.items || [],
          totalCount: res.data.total_count || 0,
          currentPage: page,
          pageInput: null,
        });
      } catch (err: unknown) {
        shouldScrollResultsRef.current = false;
        let errorMessage = "検索に失敗しました";

        if (err instanceof Error) {
          errorMessage = err.message || errorMessage;
        } else if (typeof err === "string") {
          errorMessage = err || errorMessage;
        }

        if (!errorMessage.includes("Request failed with status code 500")) {
          updateState({ error: errorMessage });
        } else {
          updateState({ error: "検索に失敗しました" });
        }
        updateState({ repositories: [] });
      } finally {
        updateState({ loading: false });
      }
    },
    [state, updateState],
  );

  const getSortedRepositories = useCallback(() => {
    const sorted = [...state.repositories];
    sorted.sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      if (state.sortBy === SortByOption.Stars) {
        aValue = a.stargazers_count;
        bValue = b.stargazers_count;
      } else if (state.sortBy === SortByOption.Forks) {
        aValue = a.forks_count;
        bValue = b.forks_count;
      } else if (state.sortBy === SortByOption.Watchers) {
        aValue = a.watchers_count;
        bValue = b.watchers_count;
      }

      return state.sortOrder === SortOrderOption.Desc
        ? bValue - aValue
        : aValue - bValue;
    });

    return sorted;
  }, [state.repositories, state.sortBy, state.sortOrder]);

  const handleSearch = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await fetchRepositories(1);
    },
    [fetchRepositories],
  );

  const handleChangeSortBy = useCallback(
    async (value: SortByOption) => {
      updateState({ sortBy: value, currentPage: 1, pageInput: null });
      if (state.totalCount > 0) {
        await fetchRepositories(1);
      }
    },
    [state.totalCount, fetchRepositories, updateState],
  );

  const handleChangeSortOrder = useCallback(
    async (value: SortOrderOption) => {
      updateState({ sortOrder: value, currentPage: 1, pageInput: null });
      if (state.totalCount > 0) {
        await fetchRepositories(1);
      }
    },
    [state.totalCount, fetchRepositories, updateState],
  );

  const handleClearAll = useCallback(() => {
    updateState({
      keyword: "",
      userOrg: "",
      repoName: "",
      language: "",
      dateFilter: null,
      dateValue: null,
      repositories: [],
      error: "",
      totalCount: 0,
      currentPage: 1,
      pageInput: null,
    });
  }, [updateState]);

  const handlePreviousPage = useCallback(async () => {
    if (state.currentPage > 1) {
      await fetchRepositories(state.currentPage - 1);
    }
  }, [state.currentPage, fetchRepositories]);

  const handleNextPage = useCallback(async () => {
    const totalPages = Math.max(
      1,
      Math.ceil(state.totalCount / ITEMS_PER_PAGE),
    );
    if (state.currentPage < totalPages) {
      await fetchRepositories(state.currentPage + 1);
    }
  }, [state.currentPage, state.totalCount, fetchRepositories]);

  const handlePageJump = useCallback(
    async (pageInput: number | null) => {
      if (pageInput === null) {
        updateState({ pageInput: null });
        return;
      }

      const totalPages = Math.max(
        1,
        Math.ceil(state.totalCount / ITEMS_PER_PAGE),
      );

      if (pageInput < 1) {
        updateState({ pageInput: null });
        return;
      }

      if (pageInput > totalPages) {
        updateState({
          error: `そのページは範囲外です。最大ページ数は ${totalPages} です。`,
        });
        return;
      }

      await fetchRepositories(pageInput);
    },
    [state.totalCount, fetchRepositories, updateState],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(Math.min(state.totalCount, MAX_TOTAL_COUNT) / ITEMS_PER_PAGE),
  );
  const canGoPrevious = state.currentPage > 1;
  const canGoNext = state.currentPage < totalPages;

  return {
    state,
    updateState,
    resultsSummaryRef,
    shouldScrollResultsRef,
    fetchRepositories,
    getSortedRepositories,
    handleSearch,
    handleChangeSortBy,
    handleChangeSortOrder,
    handleClearAll,
    handlePreviousPage,
    handleNextPage,
    handlePageJump,
    totalPages,
    canGoPrevious,
    canGoNext,
    ITEMS_PER_PAGE,
  };
};
