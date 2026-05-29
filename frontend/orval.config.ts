const openApiUrl =
  process.env.OPENAPI_URL ??
  `${process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/openapi.json`;

const orvalConfig = {
  api: {
    input: openApiUrl,
    output: {
      target: "./src/api/gen",
      schemas: "./src/api/gen/model",
      client: "axios",
      override: {
        mutator: {
          path: "./src/lib/api.ts",
          name: "api",
        },
      },
      prettier: true,
    },
  },
};

export default orvalConfig;
