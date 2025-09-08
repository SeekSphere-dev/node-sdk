import {
  SearchRequest,
  SearchResponse,
  UpdateTokensRequest,
  UpdateSchemaRequest,
  ApiResponse,
  SDKConfig,
  SearchMode,
} from '../types';

describe('Types', () => {
  describe('SearchRequest', () => {
    it('should accept valid search request', () => {
      const request: SearchRequest = {
        query: 'test query',
      };
      expect(request.query).toBe('test query');
    });
  });

  describe('SearchResponse', () => {
    it('should accept valid search response', () => {
      const response: SearchResponse = {
        success: true,
        org_id: 'test-org',
        mode: 'sql_only',
        user_id: 'test-user',
        results: [],
      };
      expect(response.success).toBe(true);
      expect(response.org_id).toBe('test-org');
    });
  });

  describe('UpdateTokensRequest', () => {
    it('should accept valid tokens request', () => {
      const request: UpdateTokensRequest = {
        tokens: {
          category1: ['token1', 'token2'],
          category2: ['token3'],
        },
      };
      expect(request.tokens.category1).toEqual(['token1', 'token2']);
    });
  });

  describe('UpdateSchemaRequest', () => {
    it('should accept valid schema request', () => {
      const request: UpdateSchemaRequest = {
        search_schema: {
          tables: {
            users: {
              columns: ['id', 'name'],
              types: ['int', 'varchar'],
            },
          },
        },
      };
      expect(request.search_schema.tables.users.columns).toEqual(['id', 'name']);
    });
  });

  describe('ApiResponse', () => {
    it('should accept valid API response', () => {
      const response: ApiResponse = {
        success: true,
        message: 'Operation successful',
      };
      expect(response.success).toBe(true);
      expect(response.message).toBe('Operation successful');
    });

    it('should accept error response', () => {
      const response: ApiResponse = {
        success: false,
        error: 'Something went wrong',
      };
      expect(response.success).toBe(false);
      expect(response.error).toBe('Something went wrong');
    });
  });

  describe('SDKConfig', () => {
    it('should accept valid config with timeout', () => {
      const config: SDKConfig = {
        apiKey: 'test-key',
        timeout: 5000,
      };
      expect(config.timeout).toBe(5000);
    });

    it('should accept valid config without timeout', () => {
      const config: SDKConfig = {
        apiKey: 'test-key',
      };
      expect(config.timeout).toBeUndefined();
    });
  });

  describe('SearchMode', () => {
    it('should accept sql_only mode', () => {
      const mode: SearchMode = 'sql_only';
      expect(mode).toBe('sql_only');
    });

    it('should accept full mode', () => {
      const mode: SearchMode = 'full';
      expect(mode).toBe('full');
    });
  });
});