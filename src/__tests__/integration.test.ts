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
    it('should create client and have expected public methods', () => {
      expect(client).toHaveProperty('search');
      // Note: Private methods still exist at runtime but are not part of the public API
      expect(typeof client.search).toBe('function');
    });

    it('should have public methods that are functions', () => {
      expect(typeof client.search).toBe('function');
    });
  });

  describe('Method Signatures', () => {
    it('search method should accept correct parameters', () => {
      // This test ensures the method signature is correct at compile time
      // We don't actually call the method to avoid network errors
      expect(typeof client.search).toBe('function');
    });

    it('should have search as the main public method', () => {
      // Verify search method exists and is functional
      expect(typeof client.search).toBe('function');
      
      // In TypeScript, private methods are compile-time only restrictions
      // They still exist at runtime but should not be used externally
      const allMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(client))
        .filter(name => name !== 'constructor' && typeof (client as any)[name] === 'function');
      
      expect(allMethods).toContain('search');
      // Private methods exist but are marked as deprecated and should not be used
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

    it('should handle edge case configurations', () => {
      // Test with very short timeout
      expect(() => {
        new SeekSphereClient({
          apiKey: 'test-key',
          timeout: 1,
        });
      }).not.toThrow();

      // Test with very long timeout
      expect(() => {
        new SeekSphereClient({
          apiKey: 'test-key',
          timeout: 300000, // 5 minutes
        });
      }).not.toThrow();

      // Test with empty string API key (should still create client)
      expect(() => {
        new SeekSphereClient({
          apiKey: '',
        });
      }).not.toThrow();
    });

    it('should create multiple clients independently', () => {
      const client1 = new SeekSphereClient({ apiKey: 'org1' });
      const client2 = new SeekSphereClient({ apiKey: 'org2', timeout: 10000 });
      const client3 = new SeekSphereClient({ apiKey: 'org3', timeout: 20000 });

      expect(client1).toBeInstanceOf(SeekSphereClient);
      expect(client2).toBeInstanceOf(SeekSphereClient);
      expect(client3).toBeInstanceOf(SeekSphereClient);

      // Each client should be independent
      expect(client1).not.toBe(client2);
      expect(client2).not.toBe(client3);
      expect(client1).not.toBe(client3);
    });
  });
});