#!/bin/bash

# Check RAM Usage Script
# This script monitors RAM usage on Linux systems

set -e

# Load common functions
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/../common.sh"

print_header "RAM Usage Report"

# Get RAM information
TOTAL_RAM=$(free -h | grep Mem | awk '{print $2}')
USED_RAM=$(free -h | grep Mem | awk '{print $3}')
AVAILABLE_RAM=$(free -h | grep Mem | awk '{print $7}')
RAM_USAGE=$(free | grep Mem | awk '{printf("%.2f"), $3/$2 * 100}')

# Display RAM stats
echo -e "${GREEN}Total RAM: ${NC}$TOTAL_RAM"
echo -e "${YELLOW}Used RAM: ${NC}$USED_RAM"
echo -e "${GREEN}Available RAM: ${NC}$AVAILABLE_RAM"
echo -e "${YELLOW}RAM Usage: ${NC}${RAM_USAGE}%"

# Warning if RAM usage is high
if (( $(echo "$RAM_USAGE > 80" | bc -l) )); then
    print_warning "High RAM usage detected (>80%)"
elif (( $(echo "$RAM_USAGE > 60" | bc -l) )); then
    print_warning "RAM usage is moderately high (>60%)"
else
    print_success "RAM usage is within normal range"
fi

# Display top memory-consuming processes
echo ""
echo "-----------------------------------"
echo "Top Memory-Consuming Processes:"
echo "-----------------------------------"
ps aux --sort=-%mem | head -n 11 | awk '{if(NR==1) printf "%-8s %-8s %-6s %-s\n", "USER", "PID", "MEM%", "COMMAND"; if(NR>1) printf "%-8s %-8s %-6s %-s\n", $1, $2, $3"%", substr($0, index($0,$11))}'
echo ""
print_divider

# Exit with appropriate code
if (( $(echo "$RAM_USAGE > 90" | bc -l) )); then
    exit 1
fi

exit 0

