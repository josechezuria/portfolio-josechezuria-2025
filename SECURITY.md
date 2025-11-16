# Security Configuration

## Overview

This document outlines the security measures implemented in the portfolio application to ensure safe deployment in your homelab environment.

## Security Features Implemented

### 1. HTTP Security Headers (Helmet.js)

The application uses Helmet.js to set secure HTTP headers:

- **Content Security Policy (CSP)**: Restricts resource loading to trusted sources
  - Allows styles from Google Fonts and Cloudflare CDN
  - Allows scripts only from self and Typed.js CDN
  - Prevents inline script execution (except where necessary)
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **Strict-Transport-Security**: Forces HTTPS connections
- **X-Powered-By**: Disabled to hide Express.js signature

### 2. Rate Limiting

Protection against brute force and DDoS attacks:
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables
- Returns 429 status code when limit exceeded

### 3. Docker Security

#### Container Isolation
- Runs as non-root user (UID 1001)
- Read-only root filesystem
- All Linux capabilities dropped
- No privilege escalation allowed
- Resource limits enforced (CPU: 0.5 cores, RAM: 512MB)

#### Network Security
- Custom bridge network isolation
- Only necessary port exposed (3001)
- No host network mode

#### Build Security
- Multi-stage build process
- Production dependencies only in final image
- Source code and build artifacts excluded via .dockerignore
- dumb-init for proper signal handling

### 4. File Security

#### .gitignore Protection
Protected files/directories:
```
- .env files (all variants)
- SSL certificates (*.pem, *.key, *.cert, *.crt)
- Credentials files
- Database files
- Session data
- Backup files
- Private keys
```

#### .dockerignore Protection
Excluded from Docker builds:
```
- .env files
- Git repository
- Development tools
- Documentation
- Logs
- Sensitive files
```

### 5. Performance & Security

- **Compression**: Gzip compression enabled for all responses
- **Static File Caching**: 1-day cache in production
- **ETag Support**: Efficient cache validation

### 6. Error Handling

- Generic error messages (no stack traces in production)
- 404 fallback to index.html (SPA behavior)
- Proper error logging without exposing internals

## Environment Variables

### Required
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

### Optional Security Settings
- `RATE_LIMIT_WINDOW_MS`: Rate limit time window
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window

## Security Checklist for Production

### Before Deployment
- [ ] Review and update `.env` file (never commit to git)
- [ ] Ensure NODE_ENV=production
- [ ] Build Docker image with production target
- [ ] Verify no sensitive files in git repository
- [ ] Check .gitignore and .dockerignore are up to date

### Network Security
- [ ] Configure firewall rules (only allow necessary ports)
- [ ] Use Nginx reverse proxy with SSL/TLS
- [ ] Enable Cloudflare or similar DDoS protection
- [ ] Set up Tailscale for secure remote access
- [ ] Isolate container network from other services

### Application Security
- [ ] Rate limiting configured appropriately
- [ ] CSP headers reviewed and tested
- [ ] Static file permissions set correctly
- [ ] Health checks enabled and monitored

### Infrastructure Security
- [ ] Regular system updates scheduled
- [ ] Docker and dependencies kept up to date
- [ ] Backups configured (automated)
- [ ] Monitoring and alerting set up (Uptime Kuma, Grafana)
- [ ] Logs rotated and retained appropriately

### Access Control
- [ ] SSH keys only (no password authentication)
- [ ] Fail2ban configured for SSH
- [ ] Sudo access restricted
- [ ] Container runs as non-root user
- [ ] File permissions properly set

## Vulnerability Management

### Dependency Updates
```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Fix vulnerabilities automatically
npm audit fix
```

### Docker Security Scanning
```bash
# Scan Docker image for vulnerabilities
docker scan portfolio-josechezuria:latest
```

### Regular Maintenance
- Monthly dependency updates
- Quarterly security reviews
- Annual penetration testing (optional)

## Incident Response

### If Compromised

1. **Immediate Actions**
   - Stop the container: `docker stop portfolio-josechezuria`
   - Isolate from network
   - Review logs: `docker logs portfolio-josechezuria`

2. **Investigation**
   - Check access logs
   - Review system logs
   - Identify entry point
   - Document findings

3. **Recovery**
   - Restore from clean backup
   - Update credentials
   - Patch vulnerabilities
   - Redeploy with security fixes

4. **Post-Incident**
   - Update security measures
   - Document lessons learned
   - Improve monitoring

## Security Best Practices

### DO
✅ Keep dependencies updated
✅ Use strong, unique passwords
✅ Enable 2FA where possible
✅ Monitor logs regularly
✅ Backup regularly
✅ Use HTTPS everywhere
✅ Limit exposed ports
✅ Run containers as non-root
✅ Use security headers
✅ Implement rate limiting

### DON'T
❌ Commit .env files to git
❌ Run containers as root
❌ Expose unnecessary ports
❌ Use default credentials
❌ Disable security features
❌ Ignore security warnings
❌ Skip updates
❌ Share credentials
❌ Allow weak passwords
❌ Disable firewalls

## Reporting Security Issues

If you discover a security vulnerability:
1. Do NOT create a public GitHub issue
2. Email: devlab@josechezuria.com
3. Include detailed description and reproduction steps
4. Allow time for patching before disclosure

## Compliance

This application is designed for personal use in a homelab environment. If deploying for business use, ensure compliance with:
- GDPR (if applicable)
- CCPA (if applicable)
- SOC 2 (if required)
- Industry-specific regulations

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)

---

**Last Updated**: 2025-01-15
**Security Level**: Homelab Production Ready
