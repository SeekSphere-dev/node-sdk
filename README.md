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
  apiKey: 'your-api-key', // Created via POST /org/api-keys (requires a signed-in session)
  timeout: 30000 // optional, defaults to 30 seconds
});

// Search (main functionality)
const searchResult = await client.search({
  query: 'show me all users from last month'
});

// Search with explicit mode
const searchResult = await client.search({
  query: 'find top 10 products by sales'
}, 'sql_only');
```

## API Methods

### `search(request, mode?)`
- **request**: `{ query: string }`
- **mode**: `'sql_only' | 'full'` (optional, defaults to 'sql_only')
  - `'sql_only'`: default behavior
  - `'full'`: deprecated, behaves identically to `'sql_only'` (the API responds with a `Deprecation` header)
- **returns**: Search results

## Configuration Management

**Important**: Token and schema management requires a signed-in user session (Clerk), not
an API key — calling the internal update methods with an API key returns a 403
(`forbidden`). Manage tokens and schema through the SeekSphere dashboard instead.

## Configuration

### SDK Configuration
- **Base URL**: Defaults to `https://api.seeksphere.ai`; override with `baseUrl`
- **API Key**: A per-org API key created via `POST /org/api-keys`
- **Timeout**: Optional, defaults to 30 seconds

The SDK automatically sets:
- `X-Api-Key` header to your provided `apiKey`
- `Content-Type` header to `'application/json'`

### Environment Variables (Recommended)
```typescript
const client = new SeekSphereClient({
  apiKey: process.env.SEEKSPHERE_API_KEY!,
  timeout: parseInt(process.env.SEEKSPHERE_TIMEOUT || '30000')
});
```

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

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
git clone https://github.com/seeksphere/seeksphere-node-sdk.git
cd seeksphere-node-sdk
npm install
```

### Scripts
```bash
npm run build        # Build the project
npm run test         # Run tests
npm run test:coverage # Run tests with coverage
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.