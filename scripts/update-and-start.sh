#!/bin/bash

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to kill process on port 3000
kill_port_3000() {
    echo "Checking for processes on port 3000..."
    pid=$(netstat -tulpn 2>/dev/null | grep ":3000" | awk '{print $7}' | cut -d'/' -f1)
    if [ ! -z "$pid" ]; then
        echo "Killing process $pid on port 3000"
        kill $pid 2>/dev/null || kill -9 $pid 2>/dev/null
        sleep 2
    fi
}

kill_port_8001() {
    echo "Checking for processes on port 8001..."
    pid=$(netstat -tulpn 2>/dev/null | grep ":8001" | awk '{print $7}' | cut -d'/' -f1)
    if [ ! -z "$pid" ]; then
        echo "Killing process $pid on port 8001"
        kill $pid 2>/dev/null || kill -9 $pid 2>/dev/null
        sleep 2
    fi
}

# Function to display logs
show_logs() {
    local service=$1
    echo "=== Last 10 lines of $service logs ($(date '+%Y-%m-%d %H:%M:%S')) ==="
    echo "--- stdout ---"
    if [ -f "/var/log/supervisor/$service.out.log" ]; then
        tail -n 10 "/var/log/supervisor/$service.out.log" | while read line; do
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] $line"
        done
    else
        echo "No stdout log file found for $service"
    fi
    echo "--- stderr ---"
    if [ -f "/var/log/supervisor/$service.err.log" ]; then
        tail -n 10 "/var/log/supervisor/$service.err.log" | while read line; do
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] $line"
        done
    else
        echo "No stderr log file found for $service"
    fi
    echo "=======================================\n"
}

echo "Starting dependency installation and service update..."

# Verify we're in the correct environment
if [ ! -d "/app/frontend" ]; then
    echo "Error: This script must be run in a development environment where /app/frontend exists"
    echo "Current directory structure:"
    ls -la /app/ 2>/dev/null || echo "Cannot list /app directory"
    exit 1
fi

if [ ! -d "/app/backend" ]; then
    echo "Error: This script must be run in a development environment where /app/backend exists"
    echo "Current directory structure:"
    ls -la /app/ 2>/dev/null || echo "Cannot list /app directory"
    exit 1
fi

# Stop only backend and frontend services
echo "Stopping development services..."
if command_exists supervisorctl; then
    supervisorctl stop backend || echo "Backend service was not running"
    supervisorctl stop frontend || echo "Frontend service was not running"
    # Wait a moment for processes to stop
    sleep 2
else
    echo "Warning: Supervisor is not available, manually killing processes"
    kill_port_3000
    kill_port_8001
fi

# Check and install backend dependencies
echo "Installing backend dependencies..."
cd /app/backend
if [ -f "pyproject.toml" ] && command_exists poetry; then
    echo "Using Poetry for backend dependencies..."
    poetry lock
    poetry install --no-root
elif [ -f "requirements.txt" ] && command_exists pip; then
    echo "Using pip for backend dependencies..."
    pip install -r requirements.txt
else
    echo "Warning: Could not install backend dependencies - no suitable package manager or requirements file found"
fi

# Check and install frontend dependencies
echo "Installing frontend dependencies..."
cd /app/frontend
if [ -f "package.json" ]; then
    if command_exists yarn; then
        echo "Using Yarn for frontend dependencies..."
        yarn install
    elif command_exists npm; then
        echo "Using npm for frontend dependencies..."
        npm install
    else
        echo "Error: Neither yarn nor npm is available"
        exit 1
    fi
else
    echo "Error: No package.json found in /app/frontend"
    exit 1
fi

# Start only backend and frontend services
echo "Starting development services..."
if command_exists supervisorctl; then
    supervisorctl start backend
    supervisorctl start frontend
else
    echo "Error: Supervisor is not available"
    exit 1
fi

# Wait for services to start up
echo "Waiting for services to start up..."
sleep 5

# Show logs for both services
show_logs "backend"
show_logs "frontend"

echo "Update and restart completed!"