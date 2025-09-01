#!/bin/bash

echo "Test du module devis uniquement..."

# Ignorer les erreurs node_modules et tester juste nos fichiers
files=(
    "types/devis.ts"
    "components/devis/TotauxCalculator.tsx" 
    "components/devis/LigneDevis.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file manquant"
    fi
done

# Tester la syntaxe de base
node -c types/devis.ts 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ types/devis.ts syntaxe correcte"
else
    echo "❌ types/devis.ts erreurs syntaxe"
fi

echo "Test du serveur..."
echo "Ouvrir http://localhost:3001/dashboard/devis pour tester"
