#!/bin/bash

# Kleuren
BOLD='\033[1m'
BLUE='\033[34m'
GREEN='\033[32m'
YELLOW='\033[33m'
NC='\033[0m' # No Color

echo ""
echo -e "${BOLD}${BLUE}🧠  Spelling Scripts – overzicht (npm run)${NC}"
echo -e "${BLUE}---------------------------------------------${NC}"
echo ""

echo -e "${GREEN}🔍 Algemene check:${NC}"
echo -e "  ${YELLOW}npm run spell${NC}               Controleer alle .vue/.ts/.js/.md bestanden"
echo ""

echo -e "${GREEN}📂 Per content-taalmap:${NC}"
echo -e "  ${YELLOW}npm run spell:content:nl${NC}    Alleen content/nl/**/*.md"
echo -e "  ${YELLOW}npm run spell:content:fr${NC}    Alleen content/fr/**/*.md"
echo -e "  ${YELLOW}npm run spell:content:de${NC}    Alleen content/de/**/*.md"
echo -e "  ${YELLOW}npm run spell:content:en${NC}    Alleen content/en/**/*.md"
echo ""

echo -e "${GREEN}🧪 Verifieer actieve config per map:${NC}"
echo -e "  ${YELLOW}npm run spell:verify${NC}         Toont taal en actieve woordenlijsten per contentmap"
echo ""

echo -e "${GREEN}🔄 Bijwerken van custom woordenlijsten (.cspell-*.txt):${NC}"
echo -e "  ${YELLOW}npm run spell:update${NC}         Genereert/actualiseert woordenlijsten via script"
echo ""

echo -e "${GREEN}✅ Alleen gewijzigde staged bestanden (git):${NC}"
echo -e "  ${YELLOW}npm run spell:staged${NC}         Spellcheck vóór commit"
echo ""

echo -e "${GREEN}💡 Tip:${NC}"
echo -e "  Voeg woorden toe aan:"
echo -e "    ${YELLOW}.cspell-dict.txt${NC}        voor projectbrede woorden"
echo -e "    ${YELLOW}.cspell-nl.txt, .cspell-fr.txt, ...${NC}  voor taalgerichte overrides"
echo ""
