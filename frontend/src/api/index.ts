// API クライアントのラッパー
import { getFastAPI } from "./generated";

const fastAPIClient = getFastAPI();

export const searchRepositories = fastAPIClient.searchRepositories;

export type {
  SearchResponse,
  SearchRepositoriesParams,
  SearchRepositoriesResult,
  Repository,
} from "./generated";
