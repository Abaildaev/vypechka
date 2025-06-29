#!/bin/bash
set -e

echo "Starting development environment..."

# Ensure directories exist
if [ ! -d "/app/frontend" ]; then
    echo "Error: /app/frontend directory not found!"
    echo "Current directory structure:"
    ls -la /app/
    exit 1
fi

if [ ! -d "/app/backend" ]; then
    echo "Error: /app/backend directory not found!"
    echo "Current directory structure:"
    ls -la /app/
    exit 1
fi

# Ensure MongoDB data directory exists and has correct permissions
mkdir -p /data/db
chown -R root:root /data/db

# Start supervisor to manage all services
echo "Starting supervisor..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf