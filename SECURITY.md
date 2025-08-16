# Security Policy

## Supported Versions

We actively support the following versions of the SeekSphere SDK:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in the SeekSphere SDK, please report it to us privately.

### How to Report

1. **Do not** create a public GitHub issue for security vulnerabilities
2. Email us at: security@seeksphere.com
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Any suggested fixes (if available)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Assessment**: We will assess the vulnerability and determine its severity within 5 business days
- **Fix**: We will work on a fix and aim to release it within 30 days for high-severity issues
- **Credit**: We will credit you in our security advisories (unless you prefer to remain anonymous)

### Security Best Practices

When using the SeekSphere SDK:

1. **API Keys**: Never commit API keys or sensitive credentials to version control
2. **Environment Variables**: Store sensitive configuration in environment variables
3. **HTTPS**: Always use HTTPS endpoints in production
4. **Updates**: Keep the SDK updated to the latest version
5. **Validation**: Validate and sanitize all user inputs before sending to the API

Thank you for helping keep SeekSphere and our users safe!