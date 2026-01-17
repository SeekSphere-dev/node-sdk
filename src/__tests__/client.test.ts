import { SeekSphereClient } from '../client';
import axios, { AxiosResponse } from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SeekSphereClient', () => {
  let client: SeekSphereClient;
  let mockAxiosInstance: {
    post: jest.Mock;
    put: jest.Mock;
    get: jest.Mock;
    interceptors: {
      response: {
        use: jest.Mock;
      };
    };

  };

  const mockConfig = {
    apiKey: 'test-org-id',
    timeout: 5000,
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock axios instance methods
    mockAxiosInstance = {
      post: jest.fn(),
      put: jest.fn(),
      get: jest.fn(),
      interceptors: {
        response: {
          use: jest.fn(),
        },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    client = new SeekSphereClient(mockConfig);
  });

  describe('Constructor', () => {
    it('should create client with correct configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.seeksphere.ai',
        timeout: mockConfig.timeout,
        headers: {
          'Content-Type': 'application/json',
          'X-Org-Id': mockConfig.apiKey,
          'X-User-Id': 'node_sdk',
        },
      });
    });

    it('should use default timeout when not provided', () => {
      const configWithoutTimeout = {
        apiKey: 'test-org-id',
      };

      new SeekSphereClient(configWithoutTimeout);

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.seeksphere.ai',
        timeout: 30000, // default timeout
        headers: {
          'Content-Type': 'application/json',
          'X-Org-Id': configWithoutTimeout.apiKey,
          'X-User-Id': 'node_sdk',
        },
      });
    });

    it('should be instantiable', () => {
      expect(client).toBeInstanceOf(SeekSphereClient);
    });

    it('should setup response interceptor', () => {
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should make POST request to /search with correct parameters', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          success: true,
          org_id: 'test-org-id',
          mode: 'sql_only',
          user_id: 'node_sdk',
          results: [],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const searchRequest = { query: 'test search query' };
      const result = await client.search(searchRequest);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', searchRequest, {
        headers: {
          'X-Mode': 'sql_only',
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should use sql_only mode by default', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true, mode: 'sql_only' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const searchRequest = { query: 'test search query' };
      await client.search(searchRequest);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', searchRequest, {
        headers: {
          'X-Mode': 'sql_only',
        },
      });
    });

    it('should handle complex search queries', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          success: true,
          org_id: 'test-org-id',
          mode: 'sql_only',
          user_id: 'node_sdk',
          results: [{ id: 1, name: 'test' }],
          sql: 'SELECT * FROM users WHERE name = "test"',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const searchRequest = { query: 'find users named test with complex conditions' };
      const result = await client.search(searchRequest, 'sql_only');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', searchRequest, {
        headers: {
          'X-Mode': 'sql_only',
        },
      });
      expect(result).toEqual(mockResponse.data);
      expect(result.results).toHaveLength(1);
    });

    it('should throw error when using full mode', async () => {
      const searchRequest = { query: 'test search query' };

      await expect(client.search(searchRequest, 'full')).rejects.toThrow(
        'SearchMode "full" is coming soon and not yet supported'
      );

      // Ensure the API call was never made
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });

    it('should handle search errors', async () => {
      // Mock the error to be thrown by the interceptor
      const interceptorError = new Error('API Error: 400 - Invalid query');
      mockAxiosInstance.post.mockRejectedValue(interceptorError);

      await expect(client.search({ query: 'invalid' })).rejects.toThrow(
        'API Error: 400 - Invalid query'
      );
    });

    it('should handle empty query strings', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          success: false,
          error: 'Query cannot be empty',
        },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const searchRequest = { query: '' };
      const result = await client.search(searchRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Query cannot be empty');
    });
  });

  describe('Private Methods (Internal Use Only)', () => {
    it('should have private methods that exist but are not part of public API', () => {
      // These methods exist internally but are private
      expect((client as any).updateTokens).toBeDefined();
      expect((client as any).updateSchema).toBeDefined();
      expect((client as any).getTokens).toBeDefined();
      expect((client as any).getSchema).toBeDefined();

      // TypeScript should prevent access to these methods at compile time
      // (Runtime access is still possible but not recommended)
    });

    // Note: Testing private methods for coverage purposes only
    // These should not be used in production code
    it('should handle updateTokens internally (coverage test)', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true, message: 'Tokens updated' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const tokensRequest = {
        tokens: {
          category1: ['token1', 'token2'],
          category2: ['token3'],
        },
      };

      const result = await (client as any).updateTokens(tokensRequest);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/org/tokens', tokensRequest);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle updateSchema internally (coverage test)', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true, message: 'Schema updated' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const schemaRequest = {
        search_schema: {
          tables: {
            users: {
              columns: ['id', 'name', 'email'],
              types: ['int', 'varchar', 'varchar'],
            },
          },
        },
      };

      const result = await (client as any).updateSchema(schemaRequest);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/org/search_schema', schemaRequest);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle getTokens internally (coverage test)', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          tokens: { category1: ['token1', 'token2'] },
          org_id: 'test-org-id',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await (client as any).getTokens();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/org/tokens');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle getSchema internally (coverage test)', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          search_schema: { tables: {} },
          org_id: 'test-org-id',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await (client as any).getSchema();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/org/search_schema');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network Error: No response received from server');
      mockAxiosInstance.post.mockRejectedValue(networkError);

      await expect(client.search({ query: 'test' })).rejects.toThrow(
        'Network Error: No response received from server'
      );
    });

    it('should handle request configuration errors', async () => {
      const configError = new Error('Request Error: Request failed');
      mockAxiosInstance.post.mockRejectedValue(configError);

      await expect(client.search({ query: 'test' })).rejects.toThrow(
        'Request Error: Request failed'
      );
    });

    it('should handle API errors without error message', async () => {
      const apiError = new Error('API Error: 500 - Internal Server Error');
      mockAxiosInstance.post.mockRejectedValue(apiError);

      await expect(client.search({ query: 'test' })).rejects.toThrow(
        'API Error: 500 - Internal Server Error'
      );
    });

    it('should test response interceptor directly', () => {
      // Get the success and error callbacks from the interceptor
      const interceptorCall = mockAxiosInstance.interceptors.response.use.mock.calls[0];
      const successCallback = interceptorCall[0];
      const errorCallback = interceptorCall[1];

      // Test success response passthrough
      const mockResponse = { data: { success: true }, status: 200 };
      expect(successCallback(mockResponse)).toBe(mockResponse);

      // Test API error with error message
      const apiError = {
        response: {
          status: 400,
          data: { error: 'Bad request' },
          statusText: 'Bad Request',
        },
      };

      expect(() => errorCallback(apiError)).toThrow('API Error: 400 - Bad request');

      // Test API error without error message
      const apiErrorNoMessage = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
        },
      };

      expect(() => errorCallback(apiErrorNoMessage)).toThrow('API Error: 500 - Internal Server Error');

      // Test network error
      const networkError = {
        request: {},
        message: 'Network timeout',
      };

      expect(() => errorCallback(networkError)).toThrow('Network Error: No response received from server');

      // Test request error
      const requestError = {
        message: 'Request setup failed',
      };

      expect(() => errorCallback(requestError)).toThrow('Request Error: Request setup failed');
    });
  });
});
