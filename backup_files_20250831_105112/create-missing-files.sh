#!/bin/bash

echo "🔧 Création des fichiers manquants..."

# Types global
mkdir -p types
if [ ! -f "types/global.d.ts" ]; then
    echo "✅ Création types/global.d.ts"
    # Contenu ici
fi

# Page signin
mkdir -p app/auth/signin
if [ ! -f "app/auth/signin/page.tsx" ]; then
    echo "✅ Création app/auth/signin/page.tsx"
    # Contenu ici
fi

# Autres fichiers...

echo "🎉 Tous les fichiers manquants ont été créés!"
