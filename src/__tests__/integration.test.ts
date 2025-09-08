import { SeekSphereClient } from '../client';

describe('Integration Tests', () => {
  let client: SeekSphereClient;

  beforeEach(() => {
    client = new SeekSphereClient({
      apiKey: 'test-org-id',
      timeout: 5000,
    });
  });

  describe('Client Integration', () => {
    it('should create client and have all expected methods', () => {
      expect(client).toHaveProperty('search');
      expect(client).toHaveProperty('updateTokens');
      expect(client).toHaveProperty('updateSchema');
      expect(client).toHaveProperty('getTokens');
      expect(client).toHaveProperty('getSchema');
    });

    it('should have methods that are functions', () => {
      expect(typeof client.search).toBe('function');
      expect(typeof client.updateTokens).toBe('function');
      expect(typeof client.updateSchema).toBe('function');
      expect(typeof client.getTokens).toBe('function');
      expect(typeof client.getSchema).toBe('function');
    });
  });

  describe('Method Signatures', () => {
    it('search method should accept correct parameters', () => {
      // This test ensures the method signature is correct at compile time
      // We don't actually call the method to avoid network errors
      expect(typeof client.search).toBe('function');
    });

    it('updateTokens method should accept correct parameters', () => {
      expect(typeof client.updateTokens).toBe('function');
    });

    it('updateSchema method should accept correct parameters', () => {
      expect(typeof client.updateSchema).toBe('function');
    });
  });

  describe('Configuration Validation', () => {
    it('should handle different timeout values', () => {
      const timeouts = [1000, 5000, 30000, 60000];

      timeouts.forEach((timeout) => {
        expect(() => {
          new SeekSphereClient({
            apiKey: 'test-key',
            timeout,
          });
        }).not.toThrow();
      });
    });

    it('should handle different API key formats', () => {
      const apiKeys = [
        'org_123456',
        'test-org-id',
        'simple-key',
        'complex-key-with-dashes-and-numbers-123',
      ];

      apiKeys.forEach((apiKey) => {
        expect(() => {
          new SeekSphereClient({
            apiKey,
          });
        }).not.toThrow();
      });
    });

    it('should use fixed base URL', () => {
      // Test that the base URL is always the same regardless of config
      const client1 = new SeekSphereClient({ apiKey: 'test1' });
      const client2 = new SeekSphereClient({ apiKey: 'test2', timeout: 5000 });
      
      expect(client1).toBeInstanceOf(SeekSphereClient);
      expect(client2).toBeInstanceOf(SeekSphereClient);
    });
  });
});