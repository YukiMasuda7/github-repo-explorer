export const PageHeader = () => {
  return (
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
  );
};
