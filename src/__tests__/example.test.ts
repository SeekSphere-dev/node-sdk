import { example } from '../example';

// Mock the SeekSphereClient
jest.mock('../client');

describe('Example Usage', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it('should export example function', () => {
    expect(typeof example).toBe('function');
  });

  it('should run example without throwing', async () => {
    // Mock the client methods to avoid actual API calls
    const mockClient = {
      search: jest.fn().mockResolvedValue({ success: true }),
    };

    // Mock the constructor
    const { SeekSphereClient } = require('../client');
    SeekSphereClient.mockImplementation(() => mockClient);

    await expect(example()).resolves.not.toThrow();
  });

  it('should handle errors gracefully', async () => {
    // Mock the client to throw an error
    const mockClient = {
      search: jest.fn().mockRejectedValue(new Error('API Error')),
    };

    const { SeekSphereClient } = require('../client');
    SeekSphereClient.mockImplementation(() => mockClient);

    await expect(example()).resolves.not.toThrow();
    expect(console.error).toHaveBeenCalledWith('Error:', 'API Error');
  });
});