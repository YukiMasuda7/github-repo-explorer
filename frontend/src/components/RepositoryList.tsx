import { type Repository } from "../types/api";
import { type RepositoryListProps } from "../types/components";

export const RepositoryList = ({
  repositories,
  loading,
  hasSearched,
}: RepositoryListProps) => {
  return (
    <>
      <div className="grid gap-4">
        {repositories.map((repo: Repository) => (
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

      {repositories.length === 0 && !loading && hasSearched && (
        <p className="text-sm text-neutral-400">結果はありません</p>
      )}
    </>
  );
};
