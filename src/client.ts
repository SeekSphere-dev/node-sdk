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
  private static readonly BASE_URL = 'https://api.seeksphere.ai';

  constructor(config: SDKConfig) {

    this.client = axios.create({
      baseURL: config.baseUrl || SeekSphereClient.BASE_URL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': config.apiKey // Per-org API key, created via POST /org/api-keys
      }
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const code = error.response.data?.code;
          const reason = error.response.data?.error || error.response.statusText;
          throw new Error(`API Error: ${error.response.status} - ${reason}${code ? ` (${code})` : ''}`);
        } else if (error.request) {
          throw new Error('Network Error: No response received from server');
        } else {
          throw new Error(`Request Error: ${error.message}`);
        }
      }
    );
  }

  /**
   * Search endpoint. `mode: 'full'` is deprecated and behaves identically to
   * 'sql_only'; the API responds with a `Deprecation` header when it is used.
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
   * @deprecated WARNING: This method is for internal use only and may be removed in future versions.
   * Please use the SeekSphere dashboard to manage tokens instead of this API method.
   * Requires a signed-in user session; API keys get a 403 (`forbidden`) here.
   * @private
   * Update tokens mapping
   */
  private async updateTokens(request: UpdateTokensRequest): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.client.put('/org/tokens', request);
    return response.data;
  }

  /**
   * @deprecated WARNING: This method is for internal use only and may be removed in future versions.
   * Please use the SeekSphere dashboard to manage search schema instead of this API method.
   * Requires a signed-in user session; API keys get a 403 (`forbidden`) here.
   * @private
   * Update search schema
   */
  private async updateSchema(request: UpdateSchemaRequest): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.client.put('/org/search_schema', request);
    return response.data;
  }

  /**
   * @deprecated WARNING: This method is for internal use only and may be removed in future versions.
   * Please use the SeekSphere dashboard to view tokens instead of this API method.
   * @private
   * Get current tokens (helper method)
   */
  private async getTokens(): Promise<{ tokens: Record<string, (string | number)[]>; org_id: string }> {
    const response = await this.client.get('/org/tokens');
    return response.data;
  }

  /**
   * @deprecated WARNING: This method is for internal use only and may be removed in future versions.
   * Please use the SeekSphere dashboard to view search schema instead of this API method.
   * @private
   * Get current search schema (helper method)
   */
  private async getSchema(): Promise<{ search_schema: any; org_id: string }> {
    const response = await this.client.get('/org/search_schema');
    return response.data;
  }
}
