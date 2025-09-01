#!/bin/bash

echo "Test des corrections appliquées..."
echo "================================="

# Vérifier la compilation TypeScript
echo "1. Vérification TypeScript..."
npx tsc --noEmit --skipLibCheck
if [ $? -eq 0 ]; then
    echo "   ✅ Pas d'erreurs TypeScript"
else
    echo "   ❌ Erreurs TypeScript détectées"
fi

# Vérifier les imports
echo "2. Vérification des imports..."
files=(
    "app/dashboard/devis/[id]/edit/page.tsx"
    "app/dashboard/devis/nouveau/page.tsx"
    "app/dashboard/devis/[id]/page.tsx"
    "app/api/devis/[id]/route.ts"
)

for file in "${files[@]}"; do
    if grep -q "from '@/types/devis'" "$file" 2>/dev/null; then
        echo "   ✅ Import correct dans $(basename "$file")"
    else
        echo "   ⚠️  Import manquant dans $(basename "$file")"
    fi
done

# Vérifier les références 'tva' supprimées
echo "3. Vérification suppression champ 'tva'..."
if ! grep -q "tva:" "app/dashboard/devis/[id]/edit/page.tsx" 2>/dev/null; then
    echo "   ✅ Champ 'tva' supprimé de edit/page.tsx"
else
    echo "   ⚠️  Références 'tva' encore présentes"
fi

# Vérifier le bug setLoading
echo "4. Vérification bug setLoading..."
if grep -q "setLoading(false); return;" "app/dashboard/devis/nouveau/page.tsx"; then
    echo "   ✅ Bug setLoading corrigé"
else
    echo "   ❌ Bug setLoading non corrigé"
fi

echo "================================="
echo "Test terminé"
