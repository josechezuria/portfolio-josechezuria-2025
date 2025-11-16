# Deployment Guide

## Production Deployment to Homelab

This guide covers deploying the portfolio application to your Proxmox homelab using Docker.

## Prerequisites

- Docker and Docker Compose installed on your homelab server
- Git installed
- Ports 3001 (or your custom PORT) available
- Optional: Nginx reverse proxy for SSL termination

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd portfolio-josechezuria-2025
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

Required environment variables:
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Set to "production" for production deployment

### 3. Build and Deploy

```bash
# Build the production Docker image
npm run docker:build

# Start the container in production mode
npm run docker:up

# Check logs
npm run docker:logs
```

## Docker Commands Reference

### Development
```bash
# Build development image
npm run docker:build:dev

# Start development container (with hot reload)
npm run docker:up:dev

# Stop development container
npm run docker:down:dev
```

### Production
```bash
# Build production image
npm run docker:build

# Start production container
npm run docker:up

# Stop production container
npm run docker:down

# Restart container
npm run docker:restart

# View logs
npm run docker:logs
```

### Manual Docker Commands
```bash
# Build
docker build -t portfolio-josechezuria:latest .

# Run
docker run -d \
  --name portfolio-josechezuria \
  -p 3001:3001 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  portfolio-josechezuria:latest

# Stop
docker stop portfolio-josechezuria

# Remove
docker rm portfolio-josechezuria
```

## Nginx Reverse Proxy Configuration

Example Nginx configuration for SSL termination:

```nginx
server {
    listen 80;
    server_name josechezuria.com www.josechezuria.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name josechezuria.com www.josechezuria.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Features

The application includes several security features:

1. **Helmet.js** - Sets secure HTTP headers including CSP
2. **Rate Limiting** - Prevents abuse (100 requests per 15 minutes by default)
3. **Compression** - Gzip compression for better performance
4. **Non-root user** - Container runs as unprivileged user (UID 1001)
5. **Read-only filesystem** - Container runs with read-only root filesystem
6. **Resource limits** - CPU and memory limits configured
7. **Health checks** - Automatic health monitoring

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Server port |
| NODE_ENV | development | Environment (development/production) |
| RATE_LIMIT_WINDOW_MS | 900000 | Rate limit window (15 min) |
| RATE_LIMIT_MAX_REQUESTS | 100 | Max requests per window |

## Monitoring

### Health Check
```bash
curl http://localhost:3001/
```

### Container Logs
```bash
docker logs -f portfolio-josechezuria
```

### Container Stats
```bash
docker stats portfolio-josechezuria
```

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
npm run docker:build
npm run docker:down
npm run docker:up
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs portfolio-josechezuria

# Check if port is in use
sudo lsof -i :3001
```

### Permission issues
```bash
# Ensure files are readable
chmod -R 644 public/*
```

### CSS not updating
```bash
# Rebuild CSS manually
npm run build:css

# Then rebuild container
npm run docker:build
```

## Backup

Important files to backup:
- `.env` (contains configuration)
- `public/resume.pdf` (resume file)
- `public/images/` (images directory)

## Security Checklist

- [ ] `.env` file is not committed to git
- [ ] `.env` contains production values
- [ ] Firewall configured (only necessary ports open)
- [ ] Nginx reverse proxy configured with SSL
- [ ] Regular updates scheduled
- [ ] Backups configured
- [ ] Monitoring in place (Uptime Kuma, etc.)

## Support

For issues or questions, check:
- Application logs: `npm run docker:logs`
- Docker status: `docker ps -a`
- Git repository issues

---

**Note**: This application is designed for self-hosting in a homelab environment. Adjust security settings based on your specific requirements and threat model.
