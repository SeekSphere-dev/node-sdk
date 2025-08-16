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
    baseUrl: 'https://api.seeksphere.com',
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
        baseURL: mockConfig.baseUrl,
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
        baseUrl: 'https://api.seeksphere.com',
        apiKey: 'test-org-id',
      };
      
      new SeekSphereClient(configWithoutTimeout);
      
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: configWithoutTimeout.baseUrl,
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

    it('should use custom mode when provided', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true, mode: 'full' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const searchRequest = { query: 'test search query' };
      await client.search(searchRequest, 'full');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', searchRequest, {
        headers: {
          'X-Mode': 'full',
        },
      });
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

  describe('updateTokens', () => {
    it('should make PUT request to /org/tokens', async () => {
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

      const result = await client.updateTokens(tokensRequest);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/org/tokens', tokensRequest);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle update tokens errors', async () => {
      const interceptorError = new Error('API Error: 403 - Unauthorized');
      mockAxiosInstance.put.mockRejectedValue(interceptorError);

      await expect(
        client.updateTokens({ tokens: { test: ['token'] } })
      ).rejects.toThrow('API Error: 403 - Unauthorized');
    });
  });

  describe('updateSchema', () => {
    it('should make PUT request to /org/search_schema', async () => {
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

      const result = await client.updateSchema(schemaRequest);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/org/search_schema', schemaRequest);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getTokens', () => {
    it('should make GET request to /org/tokens', async () => {
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

      const result = await client.getTokens();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/org/tokens');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getSchema', () => {
    it('should make GET request to /org/search_schema', async () => {
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

      const result = await client.getSchema();

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
