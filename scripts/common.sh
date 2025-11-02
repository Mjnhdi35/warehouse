#!/bin/bash

# Common functions and variables for all monitoring scripts

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly MAGENTA='\033[0;35m'
readonly NC='\033[0m' # No Color

# Print section header
print_header() {
    local title=$1
    echo "=========================================="
    echo "$title"
    echo "Generated: $(date)"
    echo "=========================================="
    echo ""
}

# Print subsection header
print_subsection() {
    local title=$1
    echo -e "${BLUE}--- $title ---${NC}"
}

# Print success message
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Print warning message
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Print error message
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Print info message
print_info() {
    echo -e "${YELLOW}$1${NC}"
}

# Print divider
print_divider() {
    echo "=========================================="
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Get script directory
get_script_dir() {
    dirname "$(readlink -f "${BASH_SOURCE[1]}")"
}

