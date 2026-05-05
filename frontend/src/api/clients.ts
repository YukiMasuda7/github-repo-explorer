// API クライアントのラッパー
import { getFastAPI } from "./gen/fastAPI";

const fastAPIClient = getFastAPI();

export const searchRepositories = fastAPIClient.searchRepositories;

export type {
  SearchResponse,
  SearchRepositoriesParams,
  Repository,
} from "./gen/models";
