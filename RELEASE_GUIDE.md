# Release Guide

This guide explains how to properly release the SeekSphere SDK.

## Prerequisites

Before releasing, ensure you have:

1. **GitHub Repository Setup**:
   - Repository created at `https://github.com/seeksphere/seeksphere-node-sdk`
   - Main branch protected with required status checks
   - Secrets configured (see below)

2. **npm Account**:
   - npm account with publish permissions
   - Two-factor authentication enabled

3. **Local Setup**:
   - Node.js 18+ installed
   - Git configured with your GitHub credentials
   - npm logged in (`npm login`)

## GitHub Secrets Configuration

Configure these secrets in your GitHub repository settings:

### Required Secrets

1. **NPM_TOKEN**:
   ```bash
   # Create an npm access token
   npm token create --access=public
   # Add this token to GitHub Secrets as NPM_TOKEN
   ```

2. **GITHUB_TOKEN**:
   - This is automatically provided by GitHub Actions
   - No manual configuration needed

### Setting up Secrets

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add the `NPM_TOKEN` with your npm access token

## Release Process

### Option 1: Automated Release (Recommended)

1. **Prepare for Release**:
   ```bash
   # Ensure you're on main branch
   git checkout main
   git pull origin main
   
   # Run the release script
   ./scripts/release.sh
   ```

2. **Follow the Script**:
   - Choose version bump type (patch/minor/major)
   - Update CHANGELOG.md when prompted
   - The script will handle the rest

3. **Monitor the Release**:
   - Check GitHub Actions for CI/CD pipeline
   - Verify npm package publication
   - Check GitHub release creation

### Option 2: Manual Release

1. **Pre-release Checks**:
   ```bash
   npm run lint
   npm run test:coverage
   npm run build
   ```

2. **Version Bump**:
   ```bash
   # For patch version (1.0.0 → 1.0.1)
   npm version patch
   
   # For minor version (1.0.0 → 1.1.0)
   npm version minor
   
   # For major version (1.0.0 → 2.0.0)
   npm version major
   ```

3. **Update Documentation**:
   - Update CHANGELOG.md with new version and changes
   - Commit the changes

4. **Create and Push Tag**:
   ```bash
   git push origin main
   git push origin --tags
   ```

5. **GitHub Actions will automatically**:
   - Run tests
   - Build the package
   - Publish to npm
   - Create GitHub release

## Release Checklist

Before releasing, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Code is properly linted (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] CHANGELOG.md is updated
- [ ] Version number follows semantic versioning
- [ ] No breaking changes without major version bump
- [ ] Documentation is up to date

## Post-Release

After a successful release:

1. **Verify Publication**:
   - Check npm: `https://www.npmjs.com/package/seeksphere-sdk`
   - Test installation: `npm install seeksphere-sdk@latest`

2. **Update Documentation**:
   - Update any external documentation
   - Notify users of new features/changes

3. **Monitor**:
   - Watch for any issues or bug reports
   - Monitor download statistics

## Troubleshooting

### Common Issues

1. **npm publish fails**:
   - Check NPM_TOKEN is valid
   - Ensure you have publish permissions
   - Verify package name is available

2. **GitHub Actions fails**:
   - Check workflow logs
   - Ensure all secrets are configured
   - Verify branch protection rules

3. **Version conflicts**:
   - Ensure version in package.json is unique
   - Check if tag already exists

### Getting Help

If you encounter issues:
1. Check GitHub Actions logs
2. Review npm publish logs
3. Contact the development team
4. Create an issue in the repository

## Security Considerations

- Never commit sensitive tokens or keys
- Use GitHub Secrets for all credentials
- Enable 2FA on npm account
- Regularly rotate access tokens
- Review dependencies for vulnerabilities