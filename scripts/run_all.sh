#!/bin/bash

# Master Script - Run All System Checks
# Chạy tất cả system monitoring scripts trong folder systems/

set -e

# Load common functions
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/common.sh"

SYSTEMS_DIR="$SCRIPT_DIR/systems"
LOG_LINES=${1:-50}

echo -e "${MAGENTA}"
echo "=========================================="
echo "   System Monitoring Suite"
echo "   Starting comprehensive system check..."
echo "=========================================="
echo -e "${NC}"
echo ""

# Function to run script
run_check() {
    local script_name=$1
    local description=$2
    
    print_info "--- $description ---"
    
    if [ -f "$SYSTEMS_DIR/$script_name" ]; then
        bash "$SYSTEMS_DIR/$script_name"
        echo ""
    else
        print_error "Script not found: $script_name"
        echo ""
    fi
}

# Run all checks
echo ""
print_info "Starting system checks..."
echo ""

run_check "check_system_info.sh" "System Information"
run_check "check_ram.sh" "RAM Usage"
run_check "check_logs.sh" "System Logs ($LOG_LINES lines)"

# Additional checks
print_subsection "Additional Info"
echo ""

# Check if Docker is running (if installed)
if command_exists docker; then
    print_info "Docker Status"
    docker ps --no-trunc
    echo ""
fi

# Final summary
echo -e "${MAGENTA}=========================================="
echo "   Monitoring Complete"
echo "=========================================="
echo -e "${NC}"

exit 0

