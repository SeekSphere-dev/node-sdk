# SeekSphere SDK

The official TypeScript Node.js SDK for interacting with the SeekSphere API.

## Installation

```bash
npm install seeksphere-sdk
```

## Usage

```typescript
import { SeekSphereClient } from 'seeksphere-sdk';

// Initialize the client
const client = new SeekSphereClient({
  baseUrl: 'https://your-api-domain.com',
  apiKey: 'your-org-id', // org_id is used as the API key
  timeout: 30000 // optional, defaults to 30 seconds
});

// Search
const searchResult = await client.search({
  query: 'your search query'
}, 'sql_only'); // mode can be 'sql_only' or 'full'

// Update tokens
await client.updateTokens({
  tokens: {
    'category1': ['token1', 'token2'],
    'category2': ['token3', 'token4']
  }
});

// Update schema
await client.updateSchema({
  search_schema: {
    // your schema object
  }
});

// Get current tokens
const tokens = await client.getTokens();

// Get current schema
const schema = await client.getSchema();
```

## API Methods

### `search(request, mode?)`
- **request**: `{ query: string }`
- **mode**: `'sql_only' | 'full'` (optional, defaults to 'sql_only')
- **returns**: Search results

### `updateTokens(request)`
- **request**: `{ tokens: Record<string, string[]> }`
- **returns**: Success response

### `updateSchema(request)`
- **request**: `{ search_schema: any }`
- **returns**: Success response

### `getTokens()`
- **returns**: Current tokens mapping

### `getSchema()`
- **returns**: Current search schema

## Configuration

The SDK automatically sets:
- `X-Org-Id` header to your provided `apiKey`
- `X-User-Id` header to `'node_sdk'`
- `Content-Type` header to `'application/json'`

## Error Handling

The SDK throws descriptive errors for:
- Network issues
- HTTP error responses
- Request configuration problems

```typescript
try {
  const result = await client.search({ query: 'test' });
} catch (error) {
  console.error('Search failed:', error.message);
}
```