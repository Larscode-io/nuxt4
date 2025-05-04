#!/bin/bash

set -e

LANGS=("nl" "fr" "de" "en")

echo ""
echo "🧪 CSpell config check per taalmap"
echo "-----------------------------------"

for lang in "${LANGS[@]}"; do
  folder="content/$lang"
  echo ""
  echo "🔎 Verifieer config voor $folder"

  if [ ! -d "$folder" ]; then
    echo "❌  Map bestaat niet: $folder (wordt overgeslagen)"
    continue
  fi

  npx cspell "$folder/**/*.md" --show-config \
    | jq '.language, .dictionaries' \
    | sed "s/^/  /"
done

echo ""
echo "✅ Controle voltooid."
