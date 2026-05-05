import { type Repository } from "./api";

export enum DateFilterOption {
  Created = "created",
  Pushed = "pushed",
}

export enum SortByOption {
  Stars = "stars",
  Forks = "forks",
  Watchers = "watchers",
}

export enum SortOrderOption {
  Asc = "asc",
  Desc = "desc",
}

export interface SearchState {
  keyword: string;
  userOrg: string;
  repoName: string;
  language: string;
  dateFilter: DateFilterOption | null;
  dateValue: string | null;
  repositories: Repository[];
  loading: boolean;
  error: string;
  totalCount: number;
  sortBy: SortByOption;
  sortOrder: SortOrderOption;
  currentPage: number;
  pageInput: number | null;
}

export interface SearchParams {
  keyword?: string;
  user_org?: string;
  repo_name?: string;
  language?: string;
  created_at?: string;
  pushed_at?: string;
  page: number;
}
