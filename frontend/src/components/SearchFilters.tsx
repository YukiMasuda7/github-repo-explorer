import { DateFilterOption, type SearchState } from "../types/search";
import { type SearchFiltersProps } from "../types/components";

export const SearchFilters = ({
  state,
  onKeywordChange,
  onUserOrgChange,
  onRepoNameChange,
  onLanguageChange,
  onDateFilterChange,
  onDateValueChange,
  onSearch,
  onClearAll,
  loading,
}: SearchFiltersProps) => {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
      <form onSubmit={onSearch} className="space-y-5">
        <div className="space-y-5">
          <Field label="キーワード">
            <TextInput
              value={state.keyword}
              onChange={onKeywordChange}
              placeholder="例: react, async"
              onClear={() => onKeywordChange("")}
            />
          </Field>

          <Field label="ユーザー / 組織">
            <TextInput
              value={state.userOrg}
              onChange={onUserOrgChange}
              placeholder="例: user:torvalds または org:facebook"
              onClear={() => onUserOrgChange("")}
            />
          </Field>

          <Field label="リポジトリ名">
            <TextInput
              value={state.repoName}
              onChange={onRepoNameChange}
              placeholder="例: linux, react"
              onClear={() => onRepoNameChange("")}
            />
          </Field>

          <Field label="言語・技術">
            <TextInput
              value={state.language}
              onChange={onLanguageChange}
              placeholder="例: python, javascript, typescript"
              onClear={() => onLanguageChange("")}
            />
          </Field>

          <Field label="日付フィルタ">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onDateFilterChange(DateFilterOption.Created)}
                  className={`inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition ${
                    state.dateFilter === DateFilterOption.Created
                      ? "border-sky-500 bg-sky-600 text-white"
                      : "border border-white/15 bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  📅作成日
                </button>
                <button
                  type="button"
                  onClick={() => onDateFilterChange(DateFilterOption.Pushed)}
                  className={`inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition ${
                    state.dateFilter === DateFilterOption.Pushed
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
                    value={state.dateFilter ? state.dateValue || "" : ""}
                    onChange={(e) =>
                      state.dateFilter &&
                      onDateValueChange(e.target.value || null)
                    }
                    disabled={!state.dateFilter}
                    className={`rounded-lg border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 ${
                      state.dateFilter ? "" : "opacity-0 pointer-events-none"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium text-neutral-300 whitespace-nowrap ${
                      state.dateFilter ? "" : "opacity-0"
                    }`}
                  >
                    以降
                  </span>
                </div>

                {state.dateFilter ? (
                  <button
                    type="button"
                    onClick={() => {
                      onDateFilterChange(null);
                      onDateValueChange(null);
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
            onClick={onClearAll}
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            すべてクリア
          </button>
        </div>
      </form>
    </section>
  );
};

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
