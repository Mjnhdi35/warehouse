#!/bin/bash

# Check Node.js Memory Usage Script
# This script monitors Node.js memory usage specifically for Render deployments

set -e

# Load common functions
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/../common.sh"

print_header "Node.js Memory Usage Report"

# Check if Node.js is running
if ! command_exists node; then
    print_error "Node.js is not installed"
    print_divider
    exit 1
fi

echo "Node.js Version: $(node --version)"
echo ""

# Get total system RAM
TOTAL_RAM_MB=$(free -m | grep Mem | awk '{print $2}')
echo "Total System RAM: ${TOTAL_RAM_MB}MB"

# Get available RAM
AVAILABLE_RAM_MB=$(free -m | grep Mem | awk '{print $7}')
echo "Available RAM: ${AVAILABLE_RAM_MB}MB"
echo ""

# Check if there are any Node.js processes
NODE_PROCESSES=$(ps aux | grep -E "node|npm|yarn|pnpm" | grep -v grep | wc -l)

if [ "$NODE_PROCESSES" -eq 0 ]; then
    print_warning "No Node.js processes currently running"
    print_divider
    exit 0
fi

echo -e "${BLUE}--- Node.js Processes ($NODE_PROCESSES found) ---${NC}"
echo ""
ps aux | grep -E "node|npm|yarn|pnpm" | grep -v grep | head -20 | awk '{printf "%-8s %-8s %-6s %-s\n", $1, $2, $3"%", substr($0, index($0,$11))}'
echo ""

# Get total memory used by all Node.js processes
TOTAL_NODE_MEM=$(ps aux | grep -E "node|npm|yarn|pnpm" | grep -v grep | awk '{sum+=$6} END {print int(sum/1024)}')
echo "Total Memory Used by Node.js: ${TOTAL_NODE_MEM}MB"
echo ""

# Calculate percentage
NODE_MEM_PERCENT=$(awk "BEGIN {printf \"%.1f\", (${TOTAL_NODE_MEM}/${TOTAL_RAM_MB})*100}")
echo "Percentage of Total RAM: ${NODE_MEM_PERCENT}%"
echo ""

# Recommendations for Render
print_subsection "Render Free-Tier Recommendations"
echo "Free-Tier Limit: ~512MB RAM"
echo ""

if (( $(echo "$TOTAL_RAM_MB < 600" | bc -l) )); then
    print_warning "Running on low memory system (likely Render Free-Tier)"
    echo ""
    echo "💡 Tips to reduce memory usage:"
    echo "  1. Use NODE_OPTIONS='--max-old-space-size=256'"
    echo "  2. Enable SWC for faster builds"
    echo "  3. Reduce build concurrency"
    echo "  4. Use incremental builds"
    echo ""
else
    print_success "Sufficient RAM available"
fi

print_divider

exit 0

