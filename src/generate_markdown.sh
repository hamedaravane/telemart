#!/bin/bash

output_file="output.md"

{
    echo "# TypeScript Files Documentation"
    echo ""
} > "$output_file"

find . -type f -name "*.ts" -print0 | while IFS= read -r -d '' file; do
    {
        echo "- File: ${file}"
        echo ""
        echo '```typescript'
        cat "$file"
        echo '```'
        echo ""
    } >> "$output_file"
done

echo "Markdown file generated: $output_file"
