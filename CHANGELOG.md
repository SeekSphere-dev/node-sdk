# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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