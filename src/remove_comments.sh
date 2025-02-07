#!/bin/bash
# An improved script to remove TypeScript comments in all .ts files
# within the directory where this script resides.

# Get the directory of this script.
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
echo "Processing TypeScript files in directory: $SCRIPT_DIR"

# Find all .ts files recursively in SCRIPT_DIR.
find "$SCRIPT_DIR" -type f -name "*.ts" | while IFS= read -r file; do
    echo "Processing file: $file"

    # Create a backup (in case you need to restore later).
    cp "$file" "$file.bak"

    # 1. Remove full-line comments (lines that contain only a comment).
    sed -i -E '/^[[:space:]]*\/\/.*$/d' "$file"

    # 2. Remove inline comments.
    #    This command finds any occurrence of a space or semicolon immediately
    #    followed by '//' and removes the '//' and everything after it.
    sed -i -E 's/([[:space:];])\/\/.*$/\1/' "$file"

    # (Optional) Remove the backup file once you're sure the changes are OK.
    rm -f "$file.bak"
done

echo "All TypeScript files have been processed."
