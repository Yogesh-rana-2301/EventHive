# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

We take the security of EventHive seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not:

- Open a public GitHub issue for security vulnerabilities
- Discuss the vulnerability in public forums, social media, or chat rooms before it has been addressed

### Please Do:

**Report security vulnerabilities via email to:** yogeshrana2301@gmail.com

**Include the following information:**

- Type of vulnerability (e.g., XSS, SQL injection, authentication bypass)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability and how an attacker might exploit it

### What to Expect:

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48-72 hours
- **Investigation**: We will investigate and validate the vulnerability
- **Updates**: We will keep you informed about our progress every 5-7 days
- **Resolution**: We aim to resolve critical vulnerabilities within 14-30 days depending on severity
- **Disclosure**: We will coordinate public disclosure after the fix is released

## Severity Levels

We use the following severity classifications:

- **Critical**: Exploitable vulnerabilities that could lead to data breach or system compromise
- **High**: Significant security issues that require immediate attention
- **Medium**: Security issues that should be addressed in the next release
- **Low**: Minor security concerns or improvements

## Security Best Practices for Contributors

### Environment Variables

- Never commit `.env.local` or any file containing secrets
- Use placeholder values in `.env.example`
- Rotate all secrets if accidentally exposed
- Use environment-specific secrets (different for dev/staging/production)

### Authentication & Authorization

- Always validate user input on both client and server
- Use parameterized queries to prevent SQL injection
- Implement proper session management
- Use HTTPS in production
- Implement rate limiting on authentication endpoints
- Use Supabase Row Level Security (RLS) policies

### Data Protection

- Hash passwords using bcrypt or similar (handled by Supabase Auth)
- Use JWT tokens with appropriate expiration
- Sanitize user input to prevent XSS attacks
- Implement CSRF protection
- Use Content Security Policy headers
- Never store sensitive data in localStorage without encryption

### API Security

- Validate and sanitize all API inputs
- Implement proper error handling (don't expose stack traces)
- Use authentication for protected routes
- Implement rate limiting
- Log security-related events
- Use CORS properly (don't use wildcard in production)

### Dependencies

- Keep dependencies up to date
- Run `npm audit` regularly
- Review security advisories for dependencies
- Use tools like Snyk or Dependabot
- Check for known vulnerabilities before adding new dependencies

### Code Review

All code changes must:
- Pass security linting checks
- Be reviewed by at least one other developer
- Include tests for security-critical features
- Follow secure coding guidelines

## Known Security Considerations

### Current Implementation

Our application currently uses:
- **NextAuth.js** for authentication
- **Supabase** for database with Row Level Security (RLS)
- **JWT tokens** for session management
- **HTTPS** in production (via Vercel)
- **bcrypt** for password hashing (via Supabase)

### Areas Under Active Security Review

- [ ] Payment processing integration (Razorpay)
- [ ] File upload functionality
- [ ] Email verification flow
- [ ] Rate limiting implementation
- [ ] API endpoint authentication
- [ ] Two-factor authentication (2FA)
- [ ] Session management improvements

## Security Updates

Security updates will be released as patch versions and announced via:
- GitHub Security Advisories
- Release notes
- Email to maintainers (if critical)
- Project README updates

## Responsible Disclosure Policy

We believe in responsible disclosure and will:
- Work with you to understand and validate the vulnerability
- Keep you informed of our progress
- Credit you in the security advisory (unless you prefer to remain anonymous)
- Not take legal action against researchers who:
  - Follow this security policy
  - Report vulnerabilities in good faith
  - Avoid privacy violations and service disruption
  - Do not exploit vulnerabilities beyond proof-of-concept

### Bug Bounty Program

We currently do not offer a bug bounty program, but we deeply appreciate security researchers who responsibly disclose vulnerabilities. We will publicly acknowledge your contribution (with your permission).

## Security Checklist for Deployment

Before deploying to production:

- [ ] All environment variables are set correctly
- [ ] Secrets are rotated from development values
- [ ] HTTPS is enabled (Vercel does this automatically)
- [ ] Database RLS policies are configured and tested
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Error messages don't expose sensitive information
- [ ] Authentication flows are tested
- [ ] Input validation is implemented on all forms
- [ ] Dependencies are updated and audited (`npm audit`)
- [ ] CSP headers are configured
- [ ] Security headers are enabled (X-Frame-Options, X-Content-Type-Options, etc.)
- [ ] Logging is configured for security events
- [ ] Backup and recovery procedures are in place

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Vercel Security](https://vercel.com/docs/security/security-headers)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

## Contact

For security-related questions or concerns, please contact:
- **Security Email**: yogeshrana2301@gmail.com
- **Response Time**: We aim to respond within 48-72 hours

Thank you for helping keep EventHive and our users safe! 🔒
