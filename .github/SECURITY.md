# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously at Neuralift. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email security concerns to the repository owner
3. Include as much detail as possible:
   - Type of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Resolution Timeline**: Depends on severity
  - Critical: 24-72 hours
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle

### Security Best Practices

When using Neuralift:

1. **Environment Variables**: Never commit `.env` files with real credentials
2. **API Keys**: Keep Supabase and Anthropic API keys secure
3. **Dependencies**: Regularly update dependencies with `npm audit fix`

## Security Features

Neuralift implements several security measures:

### Client-Side

- No sensitive data stored in localStorage (only IndexedDB with device ID)
- HTTPS enforced in production
- Content Security Policy headers
- XSS protection through React's built-in escaping

### Server-Side (Netlify Functions)

- API keys stored as environment variables
- CORS headers configured
- Input validation on all endpoints

### Database (Supabase)

- Row Level Security (RLS) enabled
- Device-based access control
- Unique schema namespace (`neuralift_`) for isolation

## Acknowledgments

We appreciate security researchers who help keep Neuralift safe. Contributors who report valid security issues will be acknowledged (with permission) in our release notes.
