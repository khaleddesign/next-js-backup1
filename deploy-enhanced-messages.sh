#!/bin/bash

echo "🚀 DÉPLOIEMENT MESSAGES CHANTIERPRO - VERSION COMPLÈTE"
echo "======================================================="

# Installer dépendances si besoin
echo "📦 Vérification dépendances..."
npm install zod

# Générer Prisma
echo "🗄️ Génération Prisma..."
npx prisma generate

# Vérifier TypeScript
echo "🔧 Vérification TypeScript..."
npx tsc --noEmit

echo ""
echo "✅ FONCTIONNALITÉS DISPONIBLES:"
echo "   💬 Chat temps réel avec polling"
echo "   🔔 Notifications toast + navigateur"
echo "   📱 Widget chat intégré aux chantiers"
echo "   ⌨️  Raccourcis clavier avancés"
echo "   💾 Auto-save brouillons"
echo "   ✨ Indicateur 'en train d'écrire'"
echo "   🚨 Gestion d'erreurs robuste"
echo "   🎯 Hook useMessages centralisé"
echo "   🔄 API avec validation Zod"
echo "   📊 Badge notifications en temps réel"
echo "   🎨 Design cohérent ChantierPro"
echo ""
echo "🌐 NAVIGATION:"
echo "   📱 http://localhost:3002/dashboard/messages"
echo "   🏗️ http://localhost:3002/dashboard/chantiers/1 (avec widget)"
echo "   📊 http://localhost:3002/dashboard (badge notifications)"
echo ""
echo "🎮 TESTS À EFFECTUER:"
echo "   1. Ouvrir page Messages → Sélectionner conversation"
echo "   2. Envoyer message texte → Vérifier optimistic update"
echo "   3. Ajouter photo → Tester upload simulation"  
echo "   4. Tester raccourcis: Ctrl+Entrée, Échap, Ctrl+/"
echo "   5. Aller sur chantier → Widget chat flottant"
echo "   6. Vérifier notifications toast + badge dashboard"
echo ""
echo "🚀 Lancement du serveur..."
npm run dev
