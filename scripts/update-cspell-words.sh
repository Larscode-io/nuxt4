#!/bin/bash

set -e

# Define language codes and their corresponding folders
LANGS=("nl" "fr" "de" "en")

echo "🔤 Updating CSpell wordlists based on content folders..."

for lang in "${LANGS[@]}"; do
  folder="content/$lang"
  dict=".cspell-$lang.txt"

  if [ ! -d "$folder" ]; then
    echo "⚠️  Skipping $lang: folder $folder does not exist"
    continue
  fi

  echo "📝 Scanning $folder → $dict"

  # Extract unknown words and sort them
  pnpm exec cspell "$folder/**/*.md" --no-progress --no-summary \
    | grep "Unknown word" \
    | sed -E 's/.*Unknown word \((.*)\).*/\1/' \
    | sort -u > "$dict"

  echo "✅ Updated $dict"
done

echo "✅ All done."
