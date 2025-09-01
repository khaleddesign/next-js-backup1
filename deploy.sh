#!/bin/bash
echo "🚀 Déploiement ChantierPro"

echo "1. Installation des dépendances..."
npm install

echo "2. Génération Prisma..."
npx prisma generate

echo "3. Build Next.js..."
npm run build

echo "4. Test du build..."
npm run start &
SERVER_PID=$!
sleep 5

if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Application opérationnelle"
else
    echo "❌ Erreur de déploiement"
fi

kill $SERVER_PID 2>/dev/null
