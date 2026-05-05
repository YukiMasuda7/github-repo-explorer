/**
 * コンポーネント Props の型定義
 */
import { type Repository, type SearchResponse } from "./api";
import {
  DateFilterOption,
  SortByOption,
  SortOrderOption,
  type SearchState,
} from "./search";

export interface PageHeaderProps {}

export interface SearchFiltersProps {
  state: SearchState;
  onKeywordChange: (value: string) => void;
  onUserOrgChange: (value: string) => void;
  onRepoNameChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onDateFilterChange: (value: DateFilterOption | null) => void;
  onDateValueChange: (value: string | null) => void;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  onClearAll: () => void;
  loading: boolean;
}

export interface ResultsSummaryProps {
  ref: React.RefObject<HTMLDivElement | null>;
  state: SearchState;
  totalPages: number;
  itemsPerPage: number;
  onSortByChange: (value: SortByOption) => void;
  onSortOrderChange: (value: SortOrderOption) => void;
}

export interface RepositoryListProps {
  repositories: Repository[];
  loading: boolean;
  hasSearched: boolean;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageInput: number | null;
  canGoPrevious: boolean;
  canGoNext: boolean;
  loading: boolean;
  error: string;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageInputChange: (value: number | null) => void;
  onPageJump: () => void;
}
