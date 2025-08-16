# Contributing to SeekSphere SDK

Thank you for your interest in contributing to the SeekSphere SDK! This document provides guidelines and information for contributors.

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests to ensure everything works:
   ```bash
   npm test
   ```

## Development Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure they follow our coding standards:
   ```bash
   npm run lint
   npm run test
   ```

3. Build the project to ensure it compiles:
   ```bash
   npm run build
   ```

4. Commit your changes with a descriptive message
5. Push to your fork and create a pull request

## Code Standards

- Follow TypeScript best practices
- Maintain test coverage above 80%
- Use ESLint and Prettier for code formatting
- Write clear, descriptive commit messages
- Add tests for new functionality
- Update documentation as needed

## Testing

- Write unit tests for all new functionality
- Ensure existing tests continue to pass
- Use descriptive test names
- Mock external dependencies appropriately

## Pull Request Process

1. Ensure your code passes all CI checks
2. Update the CHANGELOG.md with your changes
3. Update documentation if needed
4. Request review from maintainers
5. Address any feedback promptly

## Release Process

Releases are automated through GitHub Actions when tags are pushed:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create and push a git tag:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

## Questions?

Feel free to open an issue for any questions or concerns.