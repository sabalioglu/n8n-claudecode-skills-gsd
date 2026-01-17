#!/bin/sh
# check-build.sh - Build checker for GSD projects
# POSIX-compliant shell script
# Usage: ./check-build.sh [project-dir]

set -e

# Configuration
PROJECT_DIR="${1:-.}"
STATUS_FILE="${PROJECT_DIR}/context/status.json"
BUILD_CMD="${BUILD_CMD:-npm run build}"

# Colors (if terminal supports them)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    printf "${GREEN}[INFO]${NC} %s\n" "$1"
}

log_warn() {
    printf "${YELLOW}[WARN]${NC} %s\n" "$1"
}

log_error() {
    printf "${RED}[ERROR]${NC} %s\n" "$1"
}

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    log_error "Project directory not found: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# Check for package.json
if [ ! -f "package.json" ]; then
    log_error "package.json not found in $PROJECT_DIR"
    exit 1
fi

log_info "Starting build check..."
log_info "Project: $PROJECT_DIR"
log_info "Build command: $BUILD_CMD"

# Record start time
START_TIME=$(date +%s)
START_ISO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Run build and capture output
BUILD_OUTPUT=$(mktemp)
BUILD_STATUS=0

if $BUILD_CMD > "$BUILD_OUTPUT" 2>&1; then
    BUILD_STATUS=0
    log_info "Build succeeded!"
else
    BUILD_STATUS=$?
    log_error "Build failed with exit code: $BUILD_STATUS"
fi

# Record end time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Extract errors and warnings from output
ERRORS=""
WARNINGS=""

if [ -f "$BUILD_OUTPUT" ]; then
    # Common error patterns
    ERRORS=$(grep -i "error" "$BUILD_OUTPUT" 2>/dev/null | head -20 || true)
    WARNINGS=$(grep -i "warning" "$BUILD_OUTPUT" 2>/dev/null | head -20 || true)
fi

# Determine status
if [ $BUILD_STATUS -eq 0 ]; then
    STATUS="success"
else
    STATUS="failed"
fi

# Output results
echo ""
echo "================================"
echo "BUILD CHECK RESULTS"
echo "================================"
echo "Status: $STATUS"
echo "Duration: ${DURATION}s"
echo "Timestamp: $START_ISO"

if [ -n "$ERRORS" ]; then
    echo ""
    echo "Errors found:"
    echo "$ERRORS"
fi

if [ -n "$WARNINGS" ]; then
    echo ""
    echo "Warnings found:"
    echo "$WARNINGS"
fi

# Clean up
rm -f "$BUILD_OUTPUT"

# Update status.json if update-status.js exists
if [ -f "$(dirname "$0")/update-status.js" ]; then
    log_info "Updating status.json..."
    node "$(dirname "$0")/update-status.js" build "$STATUS" "$DURATION" "$START_ISO"
fi

# Exit with build status
exit $BUILD_STATUS
