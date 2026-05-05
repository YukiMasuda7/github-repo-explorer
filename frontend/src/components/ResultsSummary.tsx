import { SortByOption, SortOrderOption, type SearchState } from "../types/search";
import { type ResultsSummaryProps } from "../types/components";

export const ResultsSummary = ({
  ref,
  state,
  totalPages,
  itemsPerPage,
  onSortByChange,
  onSortOrderChange,
}: ResultsSummaryProps) => {
  return (
    <div
      ref={ref}
      className="mt-2 scroll-mt-8 rounded-2xl border border-white/10 bg-white/5 p-4"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-neutral-300 sm:text-base">
            見つかった件数:{" "}
            <span className="font-semibold text-white">{state.totalCount}</span>{" "}
            件
          </p>
          <p className="text-xs text-neutral-400">
            ページ {state.currentPage} / {totalPages}（{itemsPerPage} 件）
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-neutral-200">
              ソート:
            </label>
            <select
              value={state.sortBy}
              onChange={(e) => {
                const v = e.target.value;
                if (
                  v === SortByOption.Stars ||
                  v === SortByOption.Forks ||
                  v === SortByOption.Watchers
                ) {
                  onSortByChange(v as SortByOption);
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
              value={state.sortOrder}
              onChange={(e) => {
                const v = e.target.value;
                if (
                  v === SortOrderOption.Asc ||
                  v === SortOrderOption.Desc
                ) {
                  onSortOrderChange(v as SortOrderOption);
                }
              }}
              className="rounded-lg border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-500"
            >
              <option value={SortOrderOption.Desc}>降順 (多い順)</option>
              <option value={SortOrderOption.Asc}>昇順 (少ない順)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
