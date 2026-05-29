import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const openApiUrl = process.env.OPENAPI_URL;

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
