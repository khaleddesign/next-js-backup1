#!/bin/bash

echo "Vérification des corrections appliquées:"
echo "======================================"

# Vérifier que le fichier types existe
if [ -f "types/devis.ts" ]; then
    echo "✅ Fichier types/devis.ts créé"
else
    echo "❌ Fichier types/devis.ts manquant"
fi

# Vérifier les backups
if [ -f "app/dashboard/devis/nouveau/page.tsx.backup" ]; then
    echo "✅ Backup nouveau/page.tsx créé"
else
    echo "⚠️  Pas de backup pour nouveau/page.tsx"
fi

# Vérifier la correction du bug setLoading
if grep -q "setLoading(false); return;" "app/dashboard/devis/nouveau/page.tsx"; then
    echo "✅ Bug setLoading corrigé"
else
    echo "❌ Bug setLoading non corrigé"
fi

# Vérifier les imports
if grep -q "import { LigneDevis }" "app/dashboard/devis/[id]/edit/page.tsx"; then
    echo "✅ Import types ajouté dans edit/page.tsx"
else
    echo "❌ Import types manquant dans edit/page.tsx"
fi

echo "======================================"
echo "Vérification terminée"
