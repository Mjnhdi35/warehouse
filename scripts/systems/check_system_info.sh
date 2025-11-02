#!/bin/bash

# Check System Information Script
# This script displays comprehensive system information on Linux systems

set -e

# Load common functions
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/../common.sh"

print_header "System Information Report"

# OS Information
print_subsection "Operating System"
if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo "Distribution: $PRETTY_NAME"
fi
echo "Architecture: $(uname -m)"
echo "Kernel: $(uname -r)"
echo ""

# CPU Information
print_subsection "CPU Information"
echo "CPU Cores: $(nproc)"
echo "CPU Load Average: $(uptime | awk -F'load average:' '{print $2}')"
echo ""

# Memory Information 
print_subsection "Memory Summary"
free -h
echo ""

# Disk Usage
print_subsection "Disk Usage"
df -h / | tail -1
echo ""

# Uptime
print_subsection "System Uptime"
uptime
echo ""

# Process count
print_subsection "Process Summary"
TOTAL_PROC=$(ps aux | wc -l)
echo "Total running processes: $((TOTAL_PROC - 1))"
echo ""

print_divider

exit 0

