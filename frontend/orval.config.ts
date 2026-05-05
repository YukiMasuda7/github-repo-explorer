const orvalConfig = {
  api: {
    input: "http://localhost:8000/openapi.json",
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
