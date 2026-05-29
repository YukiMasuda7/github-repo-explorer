import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

const orvalConfig = {
  api: {
    input: `${apiBaseUrl}/openapi.json`,
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
