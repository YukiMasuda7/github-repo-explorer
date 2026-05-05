import { type PaginationControlsProps } from "../types/components";

export const PaginationControls = ({
  currentPage,
  totalPages,
  pageInput,
  canGoPrevious,
  canGoNext,
  loading,
  error,
  onPreviousPage,
  onNextPage,
  onPageInputChange,
  onPageJump,
}: PaginationControlsProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onPreviousPage}
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
            onClick={onNextPage}
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
              onPageInputChange(nextValue === "" ? null : Number(nextValue));
            }}
            placeholder="page"
            className="w-24 rounded-lg border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-sky-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={onPageJump}
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
  );
};
