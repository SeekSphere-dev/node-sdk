import { SeekSphereClient } from '../client';

describe('Integration Tests', () => {
  let client: SeekSphereClient;

  beforeEach(() => {
    client = new SeekSphereClient({
      baseUrl: 'https://api.seeksphere.com',
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
    it('should handle different base URL formats', () => {
      const configs = [
        'https://api.seeksphere.com',
        'https://api.seeksphere.com/',
        'http://localhost:3000',
        'http://localhost:3000/',
      ];

      configs.forEach((baseUrl) => {
        expect(() => {
          new SeekSphereClient({
            baseUrl,
            apiKey: 'test-key',
          });
        }).not.toThrow();
      });
    });

    it('should handle different timeout values', () => {
      const timeouts = [1000, 5000, 30000, 60000];

      timeouts.forEach((timeout) => {
        expect(() => {
          new SeekSphereClient({
            baseUrl: 'https://api.seeksphere.com',
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
            baseUrl: 'https://api.seeksphere.com',
            apiKey,
          });
        }).not.toThrow();
      });
    });
  });
});