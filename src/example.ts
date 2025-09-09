import { SeekSphereClient } from './index';

async function example() {
  // Initialize the client
  const client = new SeekSphereClient({
    apiKey: 'your-org-id-here', // Replace with your actual org_id
    timeout: 30000
  });

  try {
    // Example 1: Search with sql_only mode
    console.log('Searching with sql_only mode...');
    const searchResult = await client.search({
      query: 'show me all users from last month'
    }, 'sql_only');
    console.log('Search result:', searchResult);

    // Example 2: Search with full mode (will throw error - coming soon)
    console.log('\nTrying to search with full mode...');
    try {
      const fullSearchResult = await client.search({
        query: 'analyze customer behavior trends'
      }, 'full');
      console.log('Full search result:', fullSearchResult);
    } catch (error) {
      console.log('Expected error for full mode:', error instanceof Error ? error.message : String(error));
    }

    // Example 3: Additional search with different query
    console.log('\nSearching for different data...');
    const anotherSearchResult = await client.search({
      query: 'find all orders from this week'
    });
    console.log('Another search result:', anotherSearchResult);

    // Note: Token and schema management methods are private and should be managed
    // through the SeekSphere dashboard instead of programmatically.

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}

// Run the example
if (require.main === module) {
  example();
}

export { example };