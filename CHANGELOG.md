# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-10

### Changed
- **Breaking**: Authentication now uses a real per-org API key sent as `X-Api-Key`,
  created via `POST /org/api-keys` on a signed-in session. The previous scheme
  (sending the org ID as `X-Org-Id` with a fixed `X-User-Id: node_sdk`) no longer
  works against the current API.
- `baseUrl` can now be overridden in `SDKConfig` (previously fixed to `https://api.seeksphere.ai`).
- `search()` no longer throws for `mode: 'full'`; it is deprecated but functional,
  and the API responds with a `Deprecation` header.
- `SearchResponse` and token value types updated to match the current API contract
  (token values may be numbers, not just strings; richer search response fields).
- Errors now include the API's machine-readable `code` when present.
- Documented that the internal token/schema update methods require a signed-in
  user session and return `403 forbidden` for API-key callers.

## [1.0.0] - 2025-01-16

### Added
- Initial release of SeekSphere SDK
- Search functionality with `sql_only` and `full` modes
- Token management (update and retrieve)
- Schema management (update and retrieve)
- TypeScript support with full type definitions
- Comprehensive error handling
- Configurable timeouts and base URLs
- Automatic header management for org_id and user_id

### Features
- `search()` - Search with different modes
- `updateTokens()` - Update search tokens
- `updateSchema()` - Update search schema
- `getTokens()` - Retrieve current tokens
- `getSchema()` - Retrieve current schema

### Developer Experience
- Full TypeScript support
- Jest testing framework
- ESLint and Prettier configuration
- GitHub Actions CI/CD pipeline
- Comprehensive documentation