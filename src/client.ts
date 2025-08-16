import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  SDKConfig,
  SearchRequest,
  SearchResponse,
  UpdateTokensRequest,
  UpdateSchemaRequest,
  ApiResponse,
  SearchMode
} from './types';

export class SeekSphereClient {
  private client: AxiosInstance;

  constructor(config: SDKConfig) {
    
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Org-Id': config.apiKey, // org_id is used as api_key
        'X-User-Id': 'node_sdk' // Fixed user_id for SDK
      }
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          throw new Error(`API Error: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`);
        } else if (error.request) {
          throw new Error('Network Error: No response received from server');
        } else {
          throw new Error(`Request Error: ${error.message}`);
        }
      }
    );
  }

  /**
   * Search endpoint
   */
  async search(request: SearchRequest, mode: SearchMode = 'sql_only'): Promise<SearchResponse> {
    const response: AxiosResponse<SearchResponse> = await this.client.post('/search', request, {
      headers: {
        'X-Mode': mode
      }
    });
    return response.data;
  }

  /**
   * Update tokens mapping
   */
  async updateTokens(request: UpdateTokensRequest): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.client.put('/org/tokens', request);
    return response.data;
  }

  /**
   * Update search schema
   */
  async updateSchema(request: UpdateSchemaRequest): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.client.put('/org/search_schema', request);
    return response.data;
  }

  /**
   * Get current tokens (helper method)
   */
  async getTokens(): Promise<{ tokens: Record<string, string[]>; org_id: string }> {
    const response = await this.client.get('/org/tokens');
    return response.data;
  }

  /**
   * Get current search schema (helper method)
   */
  async getSchema(): Promise<{ search_schema: any; org_id: string }> {
    const response = await this.client.get('/org/search_schema');
    return response.data;
  }
}