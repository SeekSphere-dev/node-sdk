export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  success: boolean;
  org_id: string;
  mode: string;
  user_id: string;
  [key: string]: any;
}

export interface UpdateTokensRequest {
  tokens: Record<string, string[]>;
}

export interface UpdateSchemaRequest {
  search_schema: any;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  [key: string]: any;
}

export interface SDKConfig {
  baseUrl: string;
  apiKey: string; // This is the org_id
  timeout?: number;
}

export type SearchMode = 'sql_only' | 'full';