#!/bin/bash

# Check Logs Script
# This script displays recent system and application logs

set -e

# Load common functions
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/../common.sh"

# Default number of lines to show
LINES=${1:-50}

print_header "Log Files Report"

# Docker logs (if Docker is installed)
if command_exists docker; then
    print_subsection "Docker Logs"
    echo ""
    docker ps --format "{{.Names}}" | while read container; do
        echo -e "${GREEN}--- Container: $container ---${NC}"
        docker logs --tail $LINES "$container" 2>/dev/null || echo "Cannot access logs for $container"
        echo ""
    done
fi

# Application logs in current directory
if [ -d "logs" ]; then
    print_subsection "Application Logs"
    echo ""
    find logs -name "*.log" -type f -exec sh -c 'echo -e "${GREEN}--- {} ---${NC}"; tail -n '"$LINES"' {} 2>/dev/null; echo ""' \;
else
    print_subsection "Application Logs"
    echo "No logs directory found"
    echo ""
fi

# Current directory files info
print_subsection "Current Directory Info"
echo "Working Directory: $(pwd)"
echo "Directory Size: $(du -sh . 2>/dev/null | cut -f1)"
echo ""

print_divider

exit 0

