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

    // Example 3: Update tokens
    console.log('\nUpdating tokens...');
    const updateTokensResult = await client.updateTokens({
      tokens: {
        'product_categories': ['electronics', 'clothing', 'books'],
        'user_types': ['premium', 'standard', 'trial'],
        'regions': ['north', 'south', 'east', 'west']
      }
    });
    console.log('Update tokens result:', updateTokensResult);

    // Example 4: Update schema
    console.log('\nUpdating schema...');
    const updateSchemaResult = await client.updateSchema({
      search_schema: {
        tables: {
          users: {
            columns: ['id', 'name', 'email', 'created_at'],
            types: ['int', 'varchar', 'varchar', 'datetime']
          },
          orders: {
            columns: ['id', 'user_id', 'amount', 'status'],
            types: ['int', 'int', 'decimal', 'varchar']
          }
        }
      }
    });
    console.log('Update schema result:', updateSchemaResult);

    // Example 5: Get current tokens
    console.log('\nGetting current tokens...');
    const currentTokens = await client.getTokens();
    console.log('Current tokens:', currentTokens);

    // Example 6: Get current schema
    console.log('\nGetting current schema...');
    const currentSchema = await client.getSchema();
    console.log('Current schema:', currentSchema);

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}

// Run the example
if (require.main === module) {
  example();
}

export { example };