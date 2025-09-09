# SeekSphere SDK - AI Assistant Guide

This document provides AI assistants (like Claude, ChatGPT, etc.) with comprehensive information to help developers implement the SeekSphere SDK effectively.

## Quick Implementation Guide

### Installation
```bash
npm install seeksphere-sdk
```

### Basic Setup
```typescript
import { SeekSphereClient } from 'seeksphere-sdk';

const client = new SeekSphereClient({
  apiKey: 'your-org-id-here', // This is your organization ID from SeekSphere dashboard
  timeout: 30000 // Optional, defaults to 30 seconds
});
```

### Core Search Functionality
```typescript
// Basic search (only public method available)
const result = await client.search({
  query: 'show me all users from last month'
});

// Search with explicit mode (only 'sql_only' is currently supported)
const result = await client.search({
  query: 'find top 10 products by sales'
}, 'sql_only');
```

## Key Implementation Details

### 1. Configuration
- **No baseUrl needed**: The SDK uses a fixed base URL (`https://api.seeksphere.com`)
- **Only apiKey required**: This is your organization ID from the SeekSphere dashboard
- **Optional timeout**: Defaults to 30 seconds if not specified

### 2. Search Modes
- **'sql_only'**: Currently supported (default)
- **'full'**: Coming soon - will throw error if used

### 3. Private Methods Warning
The following methods are private and should NOT be used:
- `updateTokens()` - Use SeekSphere dashboard instead
- `updateSchema()` - Use SeekSphere dashboard instead  
- `getTokens()` - Use SeekSphere dashboard instead
- `getSchema()` - Use SeekSphere dashboard instead

These methods are deprecated and may be removed in future versions.

## Common Implementation Patterns

### Error Handling
```typescript
try {
  const result = await client.search({
    query: 'your search query here'
  });
  console.log('Search successful:', result);
} catch (error) {
  if (error instanceof Error) {
    console.error('Search failed:', error.message);
  }
}
```

### TypeScript Types
```typescript
import { 
  SeekSphereClient, 
  SearchRequest, 
  SearchResponse, 
  SearchMode 
} from 'seeksphere-sdk';

// Request type
const request: SearchRequest = {
  query: 'find all active users'
};

// Response type
const response: SearchResponse = await client.search(request);
```

### Environment Variables Pattern
```typescript
// Recommended: Use environment variables
const client = new SeekSphereClient({
  apiKey: process.env.SEEKSPHERE_ORG_ID || 'fallback-org-id',
  timeout: parseInt(process.env.SEEKSPHERE_TIMEOUT || '30000')
});
```

## Response Structure

### Successful Search Response
```typescript
{
  success: boolean;
  org_id: string;
  mode: string;
  user_id: string;
  // Additional response data varies based on query
  [key: string]: any;
}
```

### Error Handling
The SDK automatically handles and formats errors:
- **API Errors**: `API Error: {status} - {message}`
- **Network Errors**: `Network Error: No response received from server`
- **Request Errors**: `Request Error: {message}`

## Best Practices for AI Assistants

### When Helping Developers:

1. **Always use the public search method only**
   - Never suggest using private methods (updateTokens, updateSchema, etc.)
   - Direct users to the SeekSphere dashboard for configuration

2. **Configuration guidance**:
   - Emphasize that no baseUrl is needed
   - apiKey is the organization ID from their dashboard
   - Suggest using environment variables for the API key

3. **Error handling**:
   - Always wrap search calls in try-catch blocks
   - Show proper error message extraction

4. **Search mode guidance**:
   - Default to 'sql_only' mode
   - Warn that 'full' mode will throw an error (coming soon)

### Code Examples to Provide

#### Basic Implementation
```typescript
import { SeekSphereClient } from 'seeksphere-sdk';

const client = new SeekSphereClient({
  apiKey: process.env.SEEKSPHERE_ORG_ID!
});

async function searchData(query: string) {
  try {
    const result = await client.search({ query });
    return result;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}
```

#### With Custom Timeout
```typescript
const client = new SeekSphereClient({
  apiKey: 'your-org-id',
  timeout: 60000 // 60 seconds for complex queries
});
```

#### Multiple Searches
```typescript
async function performMultipleSearches() {
  const queries = [
    'show recent orders',
    'find top customers',
    'get product analytics'
  ];

  const results = await Promise.all(
    queries.map(query => client.search({ query }))
  );

  return results;
}
```

## Common Issues and Solutions

### Issue: "baseUrl does not exist in type SDKConfig"
**Solution**: Remove baseUrl from configuration - it's now fixed internally.

### Issue: "SearchMode 'full' is coming soon"
**Solution**: Use 'sql_only' mode or omit the mode parameter (defaults to 'sql_only').

### Issue: Cannot access updateTokens/updateSchema methods
**Solution**: These are now private. Direct users to the SeekSphere dashboard for token and schema management.

### Issue: Network timeouts
**Solution**: Increase the timeout in the configuration or optimize the search query.

## Integration Examples

### Express.js API
```typescript
import express from 'express';
import { SeekSphereClient } from 'seeksphere-sdk';

const app = express();
const client = new SeekSphereClient({
  apiKey: process.env.SEEKSPHERE_ORG_ID!
});

app.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    const result = await client.search({ query });
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Search failed' 
    });
  }
});
```

### Next.js API Route
```typescript
// pages/api/search.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { SeekSphereClient } from 'seeksphere-sdk';

const client = new SeekSphereClient({
  apiKey: process.env.SEEKSPHERE_ORG_ID!
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;
    const result = await client.search({ query });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Search failed' 
    });
  }
}
```

## Testing Guidance

### Unit Testing
```typescript
import { SeekSphereClient } from 'seeksphere-sdk';

// Mock the client for testing
jest.mock('seeksphere-sdk');

const mockClient = {
  search: jest.fn().mockResolvedValue({ success: true, data: [] })
};

(SeekSphereClient as jest.Mock).mockImplementation(() => mockClient);
```

### Integration Testing
```typescript
// Use a test organization ID for integration tests
const testClient = new SeekSphereClient({
  apiKey: process.env.TEST_SEEKSPHERE_ORG_ID!,
  timeout: 10000
});

describe('SeekSphere Integration', () => {
  it('should perform search successfully', async () => {
    const result = await testClient.search({
      query: 'test query'
    });
    expect(result.success).toBe(true);
  });
});
```

## Version Information

- **Current Version**: 1.0.0
- **Node.js Requirement**: >= 18.0.0
- **TypeScript Support**: Full TypeScript definitions included
- **Dependencies**: axios (HTTP client)

## Support and Resources

- **Dashboard**: Use SeekSphere dashboard for token and schema management
- **Documentation**: This SDK focuses only on search functionality
- **Issues**: Report issues on the GitHub repository
- **Updates**: Follow semantic versioning (patch/minor/major)

Remember: This SDK is designed to be simple and focused on search functionality only. All configuration and management should be done through the SeekSphere dashboard.