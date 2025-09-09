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
        baseURL: 'https://api.seeksphere.com',
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
        baseURL: 'https://api.seeksphere.com',
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

    it('should test error interceptor directly', () => {
      // Get the error callback from the interceptor
      const interceptorCall = mockAxiosInstance.interceptors.response.use.mock.calls[0];
      const errorCallback = interceptorCall[1];

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
