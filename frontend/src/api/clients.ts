// API クライアントのラッパー
import { getFastAPI } from "./gen/fastAPI";

const fastAPIClient = getFastAPI();

export const searchRepositories = fastAPIClient.searchRepositories;

// API型は src/types/api.ts から import する
