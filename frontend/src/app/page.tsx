"use client";

import { useEffect } from "react";
import { PageHeader } from "../components/PageHeader";
import { SearchFilters } from "../components/SearchFilters";
import { ResultsSummary } from "../components/ResultsSummary";
import { RepositoryList } from "../components/RepositoryList";
import { PaginationControls } from "../components/PaginationControls";
import { useRepositorySearch } from "../hooks/useRepositorySearch";
import { DateFilterOption } from "../types/search";

export default function Home() {
  const {
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
  } = useRepositorySearch();

  useEffect(() => {
    if (
      !state.loading &&
      shouldScrollResultsRef.current &&
      state.totalCount > 0
    ) {
      shouldScrollResultsRef.current = false;
      resultsSummaryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [state.currentPage, state.loading, state.totalCount]);

  const hasSearched =
    !!state.keyword ||
    !!state.userOrg ||
    !!state.repoName ||
    !!state.language ||
    !!state.dateValue;

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader />

        <SearchFilters
          state={state}
          onKeywordChange={(value) => updateState({ keyword: value })}
          onUserOrgChange={(value) => updateState({ userOrg: value })}
          onRepoNameChange={(value) => updateState({ repoName: value })}
          onLanguageChange={(value) => updateState({ language: value })}
          onDateFilterChange={(value) => updateState({ dateFilter: value })}
          onDateValueChange={(value) => updateState({ dateValue: value })}
          onSearch={handleSearch}
          onClearAll={handleClearAll}
          loading={state.loading}
        />

        <section className="mt-8 flex-1 space-y-4">
          {state.error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {state.error}
            </div>
          )}

          {state.totalCount > 0 && (
            <ResultsSummary
              ref={resultsSummaryRef}
              state={state}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              onSortByChange={handleChangeSortBy}
              onSortOrderChange={handleChangeSortOrder}
            />
          )}

          <RepositoryList
            repositories={getSortedRepositories()}
            loading={state.loading}
            hasSearched={hasSearched}
          />

          {state.totalCount > 0 && (
            <PaginationControls
              currentPage={state.currentPage}
              totalPages={totalPages}
              pageInput={state.pageInput}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              loading={state.loading}
              error={state.error}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
              onPageInputChange={(value) => updateState({ pageInput: value })}
              onPageJump={() => handlePageJump(state.pageInput)}
            />
          )}
        </section>
      </div>
    </main>
  );
}
