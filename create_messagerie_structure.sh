#!/bin/bash

echo "DÉPLOIEMENT MODULE MESSAGES CHANTIERPRO"
echo "======================================="

echo "Vérification environnement..."
if [ ! -f "package.json" ]; then
  echo "Erreur: package.json non trouvé"
  exit 1
fi

if [ ! -f "prisma/schema.prisma" ]; then
  echo "Erreur: Schema Prisma non trouvé"
  exit 1
fi

echo "Installation dépendances..."
npm install

echo "Génération client Prisma..."
npx prisma generate

echo "Synchronisation base de données..."
npx prisma db push

echo "Création des données test messages..."
npx tsx prisma/seeds/messages-seed.ts

echo "Vérification TypeScript..."
npx tsc --noEmit

echo "Module Messages déployé avec succès !"
echo ""
echo "FONCTIONNALITÉS DISPONIBLES:"
echo "   - Chat temps réel par chantier"
echo "   - Interface Messages dédiée"
echo "   - Notifications non lus"
echo "   - Upload photos simulation"
echo "   - Design cohérent avec l'existant"
echo ""
echo "Ouvrez http://localhost:3000/dashboard/messages"

npm run dev
