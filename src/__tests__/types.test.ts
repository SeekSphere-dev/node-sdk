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

    it('should work in function parameters', () => {
      const testFunction = (mode: SearchMode) => mode;
      expect(testFunction('sql_only')).toBe('sql_only');
      expect(testFunction('full')).toBe('full');
    });
  });

  describe('Complex Type Scenarios', () => {
    it('should handle SearchResponse with additional properties', () => {
      const response: SearchResponse = {
        success: true,
        org_id: 'test-org',
        mode: 'sql_only',
        user_id: 'test-user',
        results: [{ id: 1, name: 'test' }],
        sql: 'SELECT * FROM users',
        execution_time: 150,
        total_rows: 1,
      };
      
      expect(response.success).toBe(true);
      expect(response.results).toHaveLength(1);
      expect(response.sql).toBe('SELECT * FROM users');
    });

    it('should handle ApiResponse with generic type', () => {
      const response: ApiResponse<{ data: string[] }> = {
        success: true,
        message: 'Operation successful',
        data: ['item1', 'item2'],
      };
      
      expect(response.success).toBe(true);
      expect(response.data).toEqual(['item1', 'item2']);
    });

    it('should handle UpdateTokensRequest with complex tokens', () => {
      const request: UpdateTokensRequest = {
        tokens: {
          'product_categories': ['electronics', 'clothing', 'books', 'home'],
          'user_roles': ['admin', 'user', 'moderator'],
          'regions': ['us-east', 'us-west', 'eu-central', 'asia-pacific'],
          'status_types': ['active', 'inactive', 'pending', 'suspended'],
        },
      };
      
      expect(Object.keys(request.tokens)).toHaveLength(4);
      expect(request.tokens.product_categories).toContain('electronics');
    });

    it('should handle UpdateSchemaRequest with nested schema', () => {
      const request: UpdateSchemaRequest = {
        search_schema: {
          version: '1.0',
          tables: {
            users: {
              columns: ['id', 'name', 'email', 'created_at', 'updated_at'],
              types: ['int', 'varchar', 'varchar', 'datetime', 'datetime'],
              indexes: ['id', 'email'],
            },
            orders: {
              columns: ['id', 'user_id', 'amount', 'status', 'created_at'],
              types: ['int', 'int', 'decimal', 'varchar', 'datetime'],
              foreign_keys: { user_id: 'users.id' },
            },
          },
          relationships: {
            'users.orders': 'one-to-many',
          },
        },
      };
      
      expect(request.search_schema.tables.users.columns).toHaveLength(5);
      expect(request.search_schema.tables.orders.foreign_keys.user_id).toBe('users.id');
    });
  });
});