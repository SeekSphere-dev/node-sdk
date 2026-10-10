export interface SearchRequest {
  query: string;
}

export type SearchSource = 'cache' | 'pattern' | 'llm';

export interface SearchResponse {
  success: boolean;
  org_id: string;
  mode: SearchMode;
  user_id: string | null;
  query?: string;
  sql?: string;
  source?: SearchSource;
  processing_time_ms?: number;
  pattern_used?: Record<string, any> | null;
  extracted_values?: Record<string, any> | null;
  learned?: boolean | null;
  pattern_learning_enabled?: boolean | null;
  cached?: boolean | null;
  [key: string]: any;
}

export type TokenValue = string | number;

export interface UpdateTokensRequest {
  tokens: Record<string, TokenValue[]>;
}

export interface UpdateSchemaRequest {
  search_schema: any;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  code?: string;
  [key: string]: any;
}

export interface SDKConfig {
  /** Per-org API key, created via `POST /org/api-keys` (requires a signed-in session). Sent as `X-Api-Key`. */
  apiKey: string;
  /** Overrides the default API base URL. */
  baseUrl?: string;
  timeout?: number;
}

export type SearchMode = 'sql_only' | 'full';