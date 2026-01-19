#!/bin/sh
# check-lint.sh - Lint checker for GSD projects
# POSIX-compliant shell script
# Usage: ./check-lint.sh [project-dir]

set -e

# Configuration
PROJECT_DIR="${1:-.}"
STATUS_FILE="${PROJECT_DIR}/context/status.json"
LINT_CMD="${LINT_CMD:-npm run lint}"

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

# Detect linter
LINTER="unknown"
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f ".eslintrc" ] || [ -f "eslint.config.js" ]; then
    LINTER="eslint"
elif [ -f "biome.json" ]; then
    LINTER="biome"
elif [ -f ".prettierrc" ] || [ -f ".prettierrc.json" ]; then
    LINTER="prettier"
fi

log_info "Starting lint check..."
log_info "Project: $PROJECT_DIR"
log_info "Detected linter: $LINTER"
log_info "Lint command: $LINT_CMD"

# Record start time
START_TIME=$(date +%s)
START_ISO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Run lint and capture output
LINT_OUTPUT=$(mktemp)
LINT_STATUS=0

if $LINT_CMD > "$LINT_OUTPUT" 2>&1; then
    LINT_STATUS=0
    log_info "Lint check passed!"
else
    LINT_STATUS=$?
    log_warn "Lint check found issues (exit code: $LINT_STATUS)"
fi

# Record end time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Count errors and warnings
ERROR_COUNT=0
WARNING_COUNT=0
FIXABLE_COUNT=0

if [ -f "$LINT_OUTPUT" ]; then
    # ESLint patterns
    ERROR_COUNT=$(grep -c "error" "$LINT_OUTPUT" 2>/dev/null || echo "0")
    WARNING_COUNT=$(grep -c "warning" "$LINT_OUTPUT" 2>/dev/null || echo "0")

    # Try to find fixable count
    FIXABLE_LINE=$(grep -i "fixable" "$LINT_OUTPUT" 2>/dev/null | head -1 || true)
    if [ -n "$FIXABLE_LINE" ]; then
        FIXABLE_COUNT=$(echo "$FIXABLE_LINE" | grep -o '[0-9]*' | head -1 || echo "0")
    fi
fi

# Determine status
if [ $LINT_STATUS -eq 0 ]; then
    STATUS="success"
elif [ "$ERROR_COUNT" -gt 0 ]; then
    STATUS="failed"
else
    STATUS="warning"
fi

# Output results
echo ""
echo "================================"
echo "LINT CHECK RESULTS"
echo "================================"
echo "Status: $STATUS"
echo "Linter: $LINTER"
echo "Duration: ${DURATION}s"
echo "Timestamp: $START_ISO"
echo ""
echo "Summary:"
echo "  Errors: $ERROR_COUNT"
echo "  Warnings: $WARNING_COUNT"
echo "  Fixable: $FIXABLE_COUNT"

if [ -s "$LINT_OUTPUT" ]; then
    echo ""
    echo "Issues found (first 30 lines):"
    head -30 "$LINT_OUTPUT"
fi

# Clean up
rm -f "$LINT_OUTPUT"

# Update status.json if update-status.js exists
if [ -f "$(dirname "$0")/update-status.js" ]; then
    log_info "Updating status.json..."
    node "$(dirname "$0")/update-status.js" lint "$STATUS" "$DURATION" "$START_ISO" "$LINTER" "$ERROR_COUNT" "$WARNING_COUNT" "$FIXABLE_COUNT"
fi

# Exit with lint status (0 for success/warnings, non-zero for errors)
if [ "$ERROR_COUNT" -gt 0 ]; then
    exit 1
fi
exit 0
