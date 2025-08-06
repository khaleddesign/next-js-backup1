#!/bin/bash

# Script d'extraction ChantierPro - AUDIT COMPLET v4.0
# À exécuter depuis la racine du projet ChantierPro
# Optimisé pour fournir TOUS les fichiers nécessaires à l'AUDIT COMPLET

echo "🔍 EXTRACTION CHANTIERPRO v4.0 - AUDIT COMPLET QUALITÉ"
echo "========================================================"
echo "Date: $(date)"
echo "Objectif: Extraire TOUS les fichiers pour AUDIT COMPLET et CORRECTION"
echo ""

# Créer dossier d'extraction avec timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
EXTRACT_DIR="audit_complet_${TIMESTAMP}"
mkdir -p "$EXTRACT_DIR"
cd "$EXTRACT_DIR"

echo "📁 Dossier d'extraction: $EXTRACT_DIR"
echo ""

# =============================================================================
# 1. CONFIGURATION & BUILD VERIFICATION
# =============================================================================
echo "🔧 1. CONFIGURATION & BUILD VERIFICATION"
echo "========================================"
mkdir -p config_build

echo "--- package.json ---" > config_build/package.json
cat ../package.json > config_build/package.json 2>/dev/null || echo '{"error": "package.json NON TROUVÉ"}' > config_build/package.json

echo "--- tsconfig.json ---" > config_build/tsconfig.json
cat ../tsconfig.json > config_build/tsconfig.json 2>/dev/null || echo '{"error": "tsconfig.json NON TROUVÉ"}' > config_build/tsconfig.json

echo "--- next.config.js ---" > config_build/next.config.js
cat ../next.config.* > config_build/next.config.js 2>/dev/null || echo '// next.config NON TROUVÉ' > config_build/next.config.js

echo "--- tailwind.config ---" > config_build/tailwind.config.js
cat ../tailwind.config.* > config_build/tailwind.config.js 2>/dev/null || echo '// tailwind.config NON TROUVÉ - App utilise CSS vanilla' > config_build/tailwind.config.js

# Scripts NPM analysis
echo "ANALYSE SCRIPTS NPM DISPONIBLES:" > config_build/npm_scripts_analysis.txt
echo "================================" >> config_build/npm_scripts_analysis.txt
if [ -f "../package.json" ]; then
    echo "Scripts trouvés dans package.json:" >> config_build/npm_scripts_analysis.txt
    grep -A 20 '"scripts"' ../package.json >> config_build/npm_scripts_analysis.txt 2>/dev/null || echo "Aucun script trouvé" >> config_build/npm_scripts_analysis.txt
else
    echo "❌ package.json non trouvé - CRITIQUE" >> config_build/npm_scripts_analysis.txt
fi

echo "" >> config_build/npm_scripts_analysis.txt
echo "VÉRIFICATIONS BUILD NÉCESSAIRES:" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run build (compilation production)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run type-check (vérification TypeScript)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run lint (vérification ESLint)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run dev (serveur développement)" >> config_build/npm_scripts_analysis.txt

# Dependencies analysis
echo "ANALYSE DÉPENDANCES:" > config_build/dependencies_analysis.txt
echo "===================" >> config_build/dependencies_analysis.txt
if [ -f "../package.json" ]; then
    echo "=== PRODUCTION DEPENDENCIES ===" >> config_build/dependencies_analysis.txt
    grep -A 50 '"dependencies"' ../package.json >> config_build/dependencies_analysis.txt 2>/dev/null
    echo "" >> config_build/dependencies_analysis.txt
    echo "=== DEV DEPENDENCIES ===" >> config_build/dependencies_analysis.txt
    grep -A 30 '"devDependencies"' ../package.json >> config_build/dependencies_analysis.txt 2>/dev/null
fi

echo "✅ Configuration et build exportés dans: config_build/"

# =============================================================================
# 2. PRISMA & BASE DE DONNÉES COMPLÈTE
# =============================================================================
echo ""
echo "🗄️ 2. ANALYSE PRISMA & BASE DE DONNÉES"
echo "======================================"
mkdir -p database_audit

echo "--- prisma/schema.prisma ---" > database_audit/schema.prisma
cat ../prisma/schema.prisma > database_audit/schema.prisma 2>/dev/null || echo '// ❌ CRITIQUE: prisma/schema.prisma NON TROUVÉ' > database_audit/schema.prisma

echo "--- lib/db.ts ou lib/prisma.ts ---" > database_audit/db_client.ts
cat ../lib/db.ts > database_audit/db_client.ts 2>/dev/null || cat ../lib/prisma.ts > database_audit/db_client.ts 2>/dev/null || echo '// ❌ CRITIQUE: Client Prisma NON TROUVÉ' > database_audit/db_client.ts

# Analyse du schema Prisma
echo "ANALYSE SCHEMA PRISMA:" > database_audit/schema_analysis.txt
echo "=====================" >> database_audit/schema_analysis.txt
if [ -f "../prisma/schema.prisma" ]; then
    echo "=== MODELS TROUVÉS ===" >> database_audit/schema_analysis.txt
    grep "^model " ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
    echo "" >> database_audit/schema_analysis.txt
    
    echo "=== ENUMS TROUVÉS ===" >> database_audit/schema_analysis.txt
    grep "^enum " ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
    echo "" >> database_audit/schema_analysis.txt
    
    echo "=== PROVIDER DATABASE ===" >> database_audit/schema_analysis.txt
    grep -A 5 "provider" ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
else
    echo "❌ CRITIQUE: Schema Prisma non trouvé - Impossible de vérifier la DB" >> database_audit/schema_analysis.txt
fi

# Migrations
echo "--- Migrations Info ---" > database_audit/migrations.txt
if [ -d "../prisma/migrations" ]; then
    echo "MIGRATIONS TROUVÉES:" >> database_audit/migrations.txt
    ls -la ../prisma/migrations/ >> database_audit/migrations.txt
    echo "" >> database_audit/migrations.txt
    echo "DERNIÈRE MIGRATION:" >> database_audit/migrations.txt
    find ../prisma/migrations -name "migration.sql" -type f -exec basename "$(dirname {})" \; | tail -1 >> database_audit/migrations.txt
else
    echo "⚠️ Aucune migration trouvée - DB peut être en mode db push" >> database_audit/migrations.txt
fi

# Seed
echo "--- prisma/seed.ts ---" > database_audit/seed.ts
cat ../prisma/seed.ts > database_audit/seed.ts 2>/dev/null || echo '// Seed non trouvé - Données de test à créer' > database_audit/seed.ts

echo "✅ Database audit exporté dans: database_audit/"

# =============================================================================
# 3. ARCHITECTURE COMPLÈTE APP ROUTER NEXT.JS 14
# =============================================================================
echo ""
echo "🏗️ 3. ARCHITECTURE COMPLÈTE NEXT.JS 14"
echo "======================================"
mkdir -p architecture_app

# Layout principal
echo "--- app/layout.tsx ---" > architecture_app/root_layout.tsx
cat ../app/layout.tsx > architecture_app/root_layout.tsx 2>/dev/null || echo '❌ CRITIQUE: app/layout.tsx NON TROUVÉ' > architecture_app/root_layout.tsx

# Page d'accueil
echo "--- app/page.tsx ---" > architecture_app/root_page.tsx
cat ../app/page.tsx > architecture_app/root_page.tsx 2>/dev/null || echo '❌ app/page.tsx NON TROUVÉ' > architecture_app/root_page.tsx

# Global styles
echo "--- app/globals.css ---" > architecture_app/globals.css
cat ../app/globals.css > architecture_app/globals.css 2>/dev/null || echo '❌ CRITIQUE: app/globals.css NON TROUVÉ' > architecture_app/globals.css

# Loading et Error
echo "--- app/loading.tsx ---" > architecture_app/loading.tsx
cat ../app/loading.tsx > architecture_app/loading.tsx 2>/dev/null || echo '// loading.tsx non trouvé - À créer' > architecture_app/loading.tsx

echo "--- app/error.tsx ---" > architecture_app/error.tsx
cat ../app/error.tsx > architecture_app/error.tsx 2>/dev/null || echo '// error.tsx non trouvé - À créer' > architecture_app/error.tsx

echo "--- app/not-found.tsx ---" > architecture_app/not_found.tsx
cat ../app/not-found.tsx > architecture_app/not_found.tsx 2>/dev/null || echo '// not-found.tsx non trouvé - À créer' > architecture_app/not_found.tsx

# Middleware
echo "--- middleware.ts ---" > architecture_app/middleware.ts
cat ../middleware.ts > architecture_app/middleware.ts 2>/dev/null || echo '// middleware.ts non trouvé - Vérifier protection routes' > architecture_app/middleware.ts

# Analysis structure app
echo "ANALYSE STRUCTURE APP ROUTER:" > architecture_app/app_structure.txt
echo "=============================" >> architecture_app/app_structure.txt
if [ -d "../app" ]; then
    find ../app -type f -name "*.tsx" -o -name "*.ts" | head -50 | while read appfile; do
        rel_path=${appfile#../app/}
        echo "✅ $rel_path" >> architecture_app/app_structure.txt
    done
    
    echo "" >> architecture_app/app_structure.txt
    echo "ROUTES DÉTECTÉES:" >> architecture_app/app_structure.txt
    find ../app -name "page.tsx" | sed 's|../app||g' | sed 's|/page.tsx||g' | sed 's|^$|/|g' >> architecture_app/app_structure.txt
else
    echo "❌ CRITIQUE: Dossier /app non trouvé" >> architecture_app/app_structure.txt
fi

echo "✅ Architecture exportée dans: architecture_app/"

# =============================================================================
# 4. SYSTÈME D'AUTHENTIFICATION COMPLET
# =============================================================================
echo ""
echo "🔐 4. SYSTÈME D'AUTHENTIFICATION COMPLET"
echo "======================================="
mkdir -p auth_system

# NextAuth configuration
echo "--- app/api/auth/[...nextauth]/route.ts ---" > auth_system/nextauth_route.ts
cat ../app/api/auth/\[...nextauth\]/route.ts > auth_system/nextauth_route.ts 2>/dev/null || echo '❌ CRITIQUE: NextAuth route NON TROUVÉE' > auth_system/nextauth_route.ts

# Auth configuration lib
echo "--- lib/auth.ts ou lib/authOptions.ts ---" > auth_system/auth_config.ts
cat ../lib/auth.ts > auth_system/auth_config.ts 2>/dev/null || cat ../lib/authOptions.ts > auth_system/auth_config.ts 2>/dev/null || echo '❌ Configuration auth NON TROUVÉE' > auth_system/auth_config.ts

# Auth pages
echo "--- app/auth/login/page.tsx ---" > auth_system/login_page.tsx
cat ../app/auth/login/page.tsx > auth_system/login_page.tsx 2>/dev/null || echo '❌ Page login NON TROUVÉE' > auth_system/login_page.tsx

echo "--- app/auth/register/page.tsx ---" > auth_system/register_page.tsx
cat ../app/auth/register/page.tsx > auth_system/register_page.tsx 2>/dev/null || echo '// Page register non trouvée' > auth_system/register_page.tsx

# Session provider
echo "--- components/providers.tsx ou app/providers.tsx ---" > auth_system/providers.tsx
cat ../components/providers.tsx > auth_system/providers.tsx 2>/dev/null || cat ../app/providers.tsx > auth_system/providers.tsx 2>/dev/null || echo '❌ Session Provider NON TROUVÉ' > auth_system/providers.tsx

# Auth types
echo "--- types/auth.ts ou types/next-auth.d.ts ---" > auth_system/auth_types.ts
cat ../types/auth.ts > auth_system/auth_types.ts 2>/dev/null || cat ../types/next-auth.d.ts > auth_system/auth_types.ts 2>/dev/null || echo '// Types auth non trouvés' > auth_system/auth_types.ts

# Auth analysis
echo "ANALYSE SYSTÈME AUTHENTIFICATION:" > auth_system/auth_analysis.txt
echo "==================================" >> auth_system/auth_analysis.txt
echo "VÉRIFICATIONS À EFFECTUER:" >> auth_system/auth_analysis.txt
echo "- [ ] NextAuth configuré correctement" >> auth_system/auth_analysis.txt
echo "- [ ] Variables d'env (NEXTAUTH_SECRET, NEXTAUTH_URL)" >> auth_system/auth_analysis.txt
echo "- [ ] Protection routes /dashboard/*" >> auth_system/auth_analysis.txt
echo "- [ ] Redirection après login" >> auth_system/auth_analysis.txt
echo "- [ ] Session handling côté client" >> auth_system/auth_analysis.txt
echo "- [ ] Logout functionality" >> auth_system/auth_analysis.txt
echo "- [ ] Gestion des rôles utilisateurs" >> auth_system/auth_analysis.txt

echo "✅ Système auth exporté dans: auth_system/"

# =============================================================================
# 5. DASHBOARD COMPLET - MODULE PRINCIPAL
# =============================================================================
echo ""
echo "📊 5. DASHBOARD COMPLET - AUDIT MODULE PRINCIPAL"
echo "==============================================="
mkdir -p dashboard_audit

# Dashboard layout
echo "--- app/dashboard/layout.tsx ---" > dashboard_audit/layout.tsx
cat ../app/dashboard/layout.tsx > dashboard_audit/layout.tsx 2>/dev/null || echo '❌ CRITIQUE: Dashboard layout NON TROUVÉ' > dashboard_audit/layout.tsx

# Dashboard main page
echo "--- app/dashboard/page.tsx ---" > dashboard_audit/page.tsx
cat ../app/dashboard/page.tsx > dashboard_audit/page.tsx 2>/dev/null || echo '❌ CRITIQUE: Dashboard page NON TROUVÉE' > dashboard_audit/page.tsx

# Tous les sous-modules dashboard
find ../app/dashboard -name "*.tsx" -o -name "*.ts" 2>/dev/null | while read dashfile; do
    rel_path=${dashfile#../app/dashboard/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g')
    echo "--- app/dashboard/$rel_path ---" > "dashboard_audit/dash_$safe_name"
    cat "$dashfile" >> "dashboard_audit/dash_$safe_name" 2>/dev/null
done

# Dashboard components
if [ -d "../components/dashboard" ]; then
    find ../components/dashboard -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/dashboard/$comp_name.tsx ---" > "dashboard_audit/comp_$comp_name.tsx"
        cat "$comp" >> "dashboard_audit/comp_$comp_name.tsx"
    done
fi

# Dashboard analysis
echo "AUDIT DASHBOARD - TESTS À EFFECTUER:" > dashboard_audit/dashboard_tests.txt
echo "====================================" >> dashboard_audit/dashboard_tests.txt
echo "FONCTIONNALITÉS À TESTER:" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Page dashboard se charge sans erreur" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Stats cards affichent des données réelles" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Graphiques se génèrent correctement" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Navigation vers autres modules fonctionne" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Quick actions sont opérationnelles" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Feed d'activité se met à jour" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Notifications badges sont corrects" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Responsive design mobile/tablet" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Performance de chargement < 3s" >> dashboard_audit/dashboard_tests.txt

echo "✅ Dashboard audit exporté dans: dashboard_audit/"

# =============================================================================
# 6. MODULE CHANTIERS COMPLET - RÉFÉRENCE CRUD
# =============================================================================
echo ""
echo "🏗️ 6. MODULE CHANTIERS - AUDIT CRUD COMPLET"
echo "==========================================="
mkdir -p chantiers_audit

# Pages principales
echo "--- app/dashboard/chantiers/page.tsx ---" > chantiers_audit/main_page.tsx
cat ../app/dashboard/chantiers/page.tsx > chantiers_audit/main_page.tsx 2>/dev/null || echo '❌ Page liste chantiers NON TROUVÉE' > chantiers_audit/main_page.tsx

echo "--- app/dashboard/chantiers/[id]/page.tsx ---" > chantiers_audit/detail_page.tsx
cat ../app/dashboard/chantiers/\[id\]/page.tsx > chantiers_audit/detail_page.tsx 2>/dev/null || echo '❌ Page détail chantier NON TROUVÉE' > chantiers_audit/detail_page.tsx

echo "--- app/dashboard/chantiers/nouveau/page.tsx ---" > chantiers_audit/nouveau_page.tsx
cat ../app/dashboard/chantiers/nouveau/page.tsx > chantiers_audit/nouveau_page.tsx 2>/dev/null || echo '❌ Page nouveau chantier NON TROUVÉE' > chantiers_audit/nouveau_page.tsx

# Layout chantiers
echo "--- app/dashboard/chantiers/layout.tsx ---" > chantiers_audit/layout.tsx
cat ../app/dashboard/chantiers/layout.tsx > chantiers_audit/layout.tsx 2>/dev/null || echo '// Layout chantiers non trouvé' > chantiers_audit/layout.tsx

# APIs Chantiers
echo "--- app/api/chantiers/route.ts ---" > chantiers_audit/api_main.ts
cat ../app/api/chantiers/route.ts > chantiers_audit/api_main.ts 2>/dev/null || echo '❌ CRITIQUE: API chantiers principale NON TROUVÉE' > chantiers_audit/api_main.ts

echo "--- app/api/chantiers/[id]/route.ts ---" > chantiers_audit/api_detail.ts
cat ../app/api/chantiers/\[id\]/route.ts > chantiers_audit/api_detail.ts 2>/dev/null || echo '❌ API chantier détail NON TROUVÉE' > chantiers_audit/api_detail.ts

# Toutes les autres APIs chantiers
find ../app/api -path "*/chantiers/*" -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    echo "--- $api_file ---" > "chantiers_audit/api_$safe_name.ts"
    cat "$api_file" >> "chantiers_audit/api_$safe_name.ts" 2>/dev/null
done

# Composants chantiers
if [ -d "../components/chantiers" ]; then
    find ../components/chantiers -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/chantiers/$comp_name.tsx ---" > "chantiers_audit/comp_$comp_name.tsx"
        cat "$comp" >> "chantiers_audit/comp_$comp_name.tsx"
    done
fi

# Tests chantiers
echo "AUDIT MODULE CHANTIERS - TESTS CRUD:" > chantiers_audit/chantiers_tests.txt
echo "====================================" >> chantiers_audit/chantiers_tests.txt
echo "TESTS FONCTIONNELS À EFFECTUER:" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "📋 LISTE CHANTIERS (/dashboard/chantiers):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Liste se charge avec données réelles" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Filtres par statut fonctionnent" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Recherche temps réel opérationnelle" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Pagination si nombreux résultats" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Actions rapides (voir, modifier, supprimer)" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "🔍 DÉTAIL CHANTIER (/dashboard/chantiers/[id]):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Page détail se charge correctement" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Tabs navigation fonctionne" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Informations complètes affichées" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Timeline événements se charge" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Photos/documents s'affichent" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Modification en place possible" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "➕ NOUVEAU CHANTIER (/dashboard/chantiers/nouveau):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Formulaire multi-étapes fonctionne" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Validation des champs obligatoires" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Upload photos simulé opérationnel" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Soumission et redirection après création" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Gestion d'erreurs si échec" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "🔄 APIs CHANTIERS:" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] GET /api/chantiers (liste)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] POST /api/chantiers (création)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] GET /api/chantiers/[id] (détail)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] PUT /api/chantiers/[id] (modification)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] DELETE /api/chantiers/[id] (suppression)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Codes retour HTTP corrects (200, 400, 404, 500)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Validation données entrantes" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Protection auth sur toutes routes" >> chantiers_audit/chantiers_tests.txt

echo "✅ Chantiers audit exporté dans: chantiers_audit/"

# =============================================================================
# 7. MODULE MESSAGES - ÉTAT ACTUEL ET AUDIT
# =============================================================================
echo ""
echo "💬 7. MODULE MESSAGES - AUDIT COMPLET ÉTAT ACTUEL"
echo "================================================"
mkdir -p messages_audit

# Pages messages existantes
echo "--- app/dashboard/messages/page.tsx ---" > messages_audit/main_page.tsx
cat ../app/dashboard/messages/page.tsx > messages_audit/main_page.tsx 2>/dev/null || echo '❌ CRITIQUE: Page messages principale NON TROUVÉE - À CRÉER' > messages_audit/main_page.tsx

echo "--- app/dashboard/messages/layout.tsx ---" > messages_audit/layout.tsx
cat ../app/dashboard/messages/layout.tsx > messages_audit/layout.tsx 2>/dev/null || echo '// Layout messages non trouvé - À créer' > messages_audit/layout.tsx

echo "--- app/dashboard/messages/nouveau/page.tsx ---" > messages_audit/nouveau_page.tsx
cat ../app/dashboard/messages/nouveau/page.tsx > messages_audit/nouveau_page.tsx 2>/dev/null || echo '❌ Page nouveau message NON TROUVÉE - À CRÉER' > messages_audit/nouveau_page.tsx

echo "--- app/dashboard/messages/recherche/page.tsx ---" > messages_audit/recherche_page.tsx
cat ../app/dashboard/messages/recherche/page.tsx > messages_audit/recherche_page.tsx 2>/dev/null || echo '❌ Page recherche messages NON TROUVÉE - À CRÉER' > messages_audit/recherche_page.tsx

# Toutes les autres pages messages
find ../app/dashboard/messages -name "*.tsx" -o -name "*.ts" 2>/dev/null | while read msgfile; do
    rel_path=${msgfile#../app/dashboard/messages/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g')
    echo "--- app/dashboard/messages/$rel_path ---" > "messages_audit/page_$safe_name"
    cat "$msgfile" >> "messages_audit/page_$safe_name" 2>/dev/null
done

# APIs Messages
echo "--- app/api/messages/route.ts ---" > messages_audit/api_main.ts
cat ../app/api/messages/route.ts > messages_audit/api_main.ts 2>/dev/null || echo '❌ CRITIQUE: API messages principale NON TROUVÉE - À CRÉER' > messages_audit/api_main.ts

echo "--- app/api/messages/contacts/route.ts ---" > messages_audit/api_contacts.ts
cat ../app/api/messages/contacts/route.ts > messages_audit/api_contacts.ts 2>/dev/null || echo '❌ API contacts NON TROUVÉE - À CRÉER' > messages_audit/api_contacts.ts

echo "--- app/api/messages/search/route.ts ---" > messages_audit/api_search.ts
cat ../app/api/messages/search/route.ts > messages_audit/api_search.ts 2>/dev/null || echo '❌ API search NON TROUVÉE - À CRÉER' > messages_audit/api_search.ts

# Toutes les autres APIs messages
find ../app/api/messages -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/messages/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    if [[ "$safe_name" != "" && "$safe_name" != "route" ]]; then
        echo "--- $api_file ---" > "messages_audit/api_$safe_name.ts"
        cat "$api_file" >> "messages_audit/api_$safe_name.ts" 2>/dev/null
    fi
done

# Composants messages
if [ -d "../components/messages" ]; then
    find ../components/messages -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/messages/$comp_name.tsx ---" > "messages_audit/comp_$comp_name.tsx"
        cat "$comp" >> "messages_audit/comp_$comp_name.tsx"
    done
else
    echo '❌ CRITIQUE: Dossier components/messages NON TROUVÉ' > messages_audit/comp_MANQUANT.txt
    echo 'Composants critiques à créer:' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageBubble.tsx (affichage messages)' >> messages_audit/comp_MANQUANT.txt
    echo '- ConversationList.tsx (liste conversations)' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageInput.tsx (saisie nouveau message)' >> messages_audit/comp_MANQUANT.txt
    echo '- NewMessageModal.tsx (modal nouveau message)' >> messages_audit/comp_MANQUANT.txt
    echo '- ContactSelector.tsx (sélection destinataires)' >> messages_audit/comp_MANQUANT.txt
    echo '- MediaViewer.tsx (visualisation médias)' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageActions.tsx (actions sur messages)' >> messages_audit/comp_MANQUANT.txt
    echo '- UserAvatar.tsx (avatar utilisateur)' >> messages_audit/comp_MANQUANT.txt
fi

# Hook useMessages
echo "--- hooks/useMessages.ts ---" > messages_audit/hook_useMessages.ts
cat ../hooks/useMessages.ts > messages_audit/hook_useMessages.ts 2>/dev/null || echo '❌ CRITIQUE: hooks/useMessages.ts NON TROUVÉ - PRIORITÉ ABSOLUE' > messages_audit/hook_useMessages.ts

# Tests messages complets
echo "AUDIT MODULE MESSAGES - TESTS FONCTIONNELS COMPLETS:" > messages_audit/messages_tests.txt
echo "====================================================" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔥 TESTS CRITIQUES (BLOQUANTS SI KO):" >> messages_audit/messages_tests.txt
echo "======================================" >> messages_audit/messages_tests.txt
echo "- [ ] hooks/useMessages.ts existe et fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] API /api/messages répond correctement" >> messages_audit/messages_tests.txt
echo "- [ ] Page /dashboard/messages se charge" >> messages_audit/messages_tests.txt
echo "- [ ] Envoi d'un message de base fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Affichage liste conversations opérationnel" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "💬 INTERFACE MESSAGES (/dashboard/messages):" >> messages_audit/messages_tests.txt
echo "============================================" >> messages_audit/messages_tests.txt
echo "- [ ] Interface principale se charge sans erreur" >> messages_audit/messages_tests.txt
echo "- [ ] Sidebar conversations s'affiche" >> messages_audit/messages_tests.txt
echo "- [ ] Sélection conversation charge messages" >> messages_audit/messages_tests.txt
echo "- [ ] Zone de saisie nouveau message visible" >> messages_audit/messages_tests.txt
echo "- [ ] Envoi message temps réel fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Messages s'affichent dans l'ordre chronologique" >> messages_audit/messages_tests.txt
echo "- [ ] Scroll automatique vers dernier message" >> messages_audit/messages_tests.txt
echo "- [ ] Statuts messages (envoyé/lu) corrects" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "📝 NOUVEAU MESSAGE (/dashboard/messages/nouveau):" >> messages_audit/messages_tests.txt
echo "================================================" >> messages_audit/messages_tests.txt
echo "- [ ] Modal nouveau message s'ouvre/ferme" >> messages_audit/messages_tests.txt
echo "- [ ] 3 onglets (Direct/Chantier/Groupe) fonctionnent" >> messages_audit/messages_tests.txt
echo "- [ ] Sélection destinataires opérationnelle" >> messages_audit/messages_tests.txt
echo "- [ ] Validation avant envoi fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Page nouveau message alternative accessible" >> messages_audit/messages_tests.txt
echo "- [ ] Étapes de création (si multi-step) naviguent" >> messages_audit/messages_tests.txt
echo "- [ ] Upload fichiers/photos fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Redirection après envoi réussi" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔍 RECHERCHE MESSAGES (/dashboard/messages/recherche):" >> messages_audit/messages_tests.txt
echo "=====================================================" >> messages_audit/messages_tests.txt
echo "- [ ] Interface recherche s'affiche" >> messages_audit/messages_tests.txt
echo "- [ ] Champ recherche réagit à la saisie" >> messages_audit/messages_tests.txt
echo "- [ ] Résultats de recherche s'affichent" >> messages_audit/messages_tests.txt
echo "- [ ] Filtres de recherche fonctionnent" >> messages_audit/messages_tests.txt
echo "- [ ] Navigation vers message exact depuis résultat" >> messages_audit/messages_tests.txt
echo "- [ ] Recherche par date, expéditeur, contenu" >> messages_audit/messages_tests.txt
echo "- [ ] Performance recherche acceptable" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔄 APIs MESSAGES - TESTS TECHNIQUES:" >> messages_audit/messages_tests.txt
echo "===================================" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages (liste conversations)" >> messages_audit/messages_tests.txt
echo "- [ ] POST /api/messages (envoi message)" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages/contacts (liste contacts)" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages/search?q=term (recherche)" >> messages_audit/messages_tests.txt
echo "- [ ] PUT /api/messages/[id] (modification message)" >> messages_audit/messages_tests.txt
echo "- [ ] DELETE /api/messages/[id] (suppression message)" >> messages_audit/messages_tests.txt
echo "- [ ] POST /api/messages/mark-read (marquer lu)" >> messages_audit/messages_tests.txt
echo "- [ ] Authentification sur toutes les routes" >> messages_audit/messages_tests.txt
echo "- [ ] Validation données avec Zod/Joi" >> messages_audit/messages_tests.txt
echo "- [ ] Gestion erreurs robuste (400, 404, 500)" >> messages_audit/messages_tests.txt
echo "- [ ] Rate limiting implémenté" >> messages_audit/messages_tests.txt

echo "✅ Messages audit exporté dans: messages_audit/"

# =============================================================================
# 8. COMPOSANTS UI GLOBAUX - DESIGN SYSTEM
# =============================================================================
echo ""
echo "🎨 8. COMPOSANTS UI & DESIGN SYSTEM"
echo "=================================="
mkdir -p ui_components

# Composants UI de base
ui_base_components=("button" "input" "card" "badge" "avatar" "modal" "dropdown" "toast" "loading" "error")

for comp in "${ui_base_components[@]}"; do
    echo "--- components/ui/$comp.tsx ---" > "ui_components/$comp.tsx"
    cat "../components/ui/$comp.tsx" > "ui_components/$comp.tsx" 2>/dev/null || echo "❌ $comp.tsx NON TROUVÉ - À CRÉER" > "ui_components/$comp.tsx"
done

# Navigation components
echo "--- components/Navigation.tsx ---" > ui_components/Navigation.tsx
cat ../components/Navigation.tsx > ui_components/Navigation.tsx 2>/dev/null || echo '❌ Navigation.tsx NON TROUVÉ' > ui_components/Navigation.tsx

echo "--- components/Sidebar.tsx ---" > ui_components/Sidebar.tsx
cat ../components/Sidebar.tsx > ui_components/Sidebar.tsx 2>/dev/null || echo '❌ Sidebar.tsx NON TROUVÉ' > ui_components/Sidebar.tsx

echo "--- components/Header.tsx ---" > ui_components/Header.tsx
cat ../components/Header.tsx > ui_components/Header.tsx 2>/dev/null || echo '// Header.tsx non trouvé' > ui_components/Header.tsx

# Layout components
echo "--- components/Layout.tsx ---" > ui_components/Layout.tsx
cat ../components/Layout.tsx > ui_components/Layout.tsx 2>/dev/null || echo '// Layout.tsx non trouvé' > ui_components/Layout.tsx

# Form components
form_components=("form" "field" "select" "checkbox" "radio" "textarea" "file-upload")
for form_comp in "${form_components[@]}"; do
    echo "--- components/ui/$form_comp.tsx ---" > "ui_components/form_$form_comp.tsx"
    cat "../components/ui/$form_comp.tsx" > "ui_components/form_$form_comp.tsx" 2>/dev/null || echo "// $form_comp.tsx non trouvé" > "ui_components/form_$form_comp.tsx"
done

# Analyse CSS Design System
echo "ANALYSE DESIGN SYSTEM CSS:" > ui_components/design_system_analysis.txt
echo "===========================" >> ui_components/design_system_analysis.txt
if [ -f "../app/globals.css" ]; then
    echo "=== VARIABLES CSS GLOBALES ===" >> ui_components/design_system_analysis.txt
    grep -n ":" ../app/globals.css | head -50 >> ui_components/design_system_analysis.txt
    echo "" >> ui_components/design_system_analysis.txt
    echo "=== CLASSES UTILITAIRES DÉTECTÉES ===" >> ui_components/design_system_analysis.txt
    grep -E "\.(glass|card|btn-|gradient)" ../app/globals.css >> ui_components/design_system_analysis.txt 2>/dev/null
else
    echo "❌ CRITIQUE: globals.css non trouvé - Design system manquant" >> ui_components/design_system_analysis.txt
fi

# Tests UI Components
echo "TESTS COMPOSANTS UI - DESIGN SYSTEM:" > ui_components/ui_tests.txt
echo "====================================" >> ui_components/ui_tests.txt
echo "🎨 COHÉRENCE DESIGN:" >> ui_components/ui_tests.txt
echo "- [ ] CSS vanilla cohérent partout (pas de Tailwind mélangé)" >> ui_components/ui_tests.txt
echo "- [ ] Classes réutilisées (.glass, .card, .btn-primary)" >> ui_components/ui_tests.txt
echo "- [ ] Gradients bleu/orange respectés (#3b82f6 → #f97316)" >> ui_components/ui_tests.txt
echo "- [ ] Typography Inter utilisée partout" >> ui_components/ui_tests.txt
echo "- [ ] Animations fluides (0.3s ease)" >> ui_components/ui_tests.txt
echo "- [ ] Hover effects cohérents" >> ui_components/ui_tests.txt
echo "- [ ] Variables CSS globales utilisées" >> ui_components/ui_tests.txt
echo "" >> ui_components/ui_tests.txt
echo "📱 RESPONSIVE DESIGN:" >> ui_components/ui_tests.txt
echo "- [ ] Desktop (1920x1080, 1366x768)" >> ui_components/ui_tests.txt
echo "- [ ] Tablet (768x1024, iPad)" >> ui_components/ui_tests.txt
echo "- [ ] Mobile (375x667, 414x896)" >> ui_components/ui_tests.txt
echo "- [ ] Navigation mobile (hamburger si existe)" >> ui_components/ui_tests.txt
echo "- [ ] Formulaires utilisables sur mobile" >> ui_components/ui_tests.txt
echo "- [ ] Texte lisible toutes tailles" >> ui_components/ui_tests.txt
echo "- [ ] Touch targets > 44px mobile" >> ui_components/ui_tests.txt
echo "" >> ui_components/ui_tests.txt
echo "♿ ACCESSIBILITÉ:" >> ui_components/ui_tests.txt
echo "- [ ] Navigation clavier (Tab, Enter, Escape)" >> ui_components/ui_tests.txt
echo "- [ ] Focus visible éléments interactifs" >> ui_components/ui_tests.txt
echo "- [ ] Contrast ratio suffisant (4.5:1 min)" >> ui_components/ui_tests.txt
echo "- [ ] Alt texts sur images" >> ui_components/ui_tests.txt
echo "- [ ] Labels sur formulaires" >> ui_components/ui_tests.txt
echo "- [ ] ARIA attributes si nécessaire" >> ui_components/ui_tests.txt
echo "- [ ] Pas de clignotements rapides" >> ui_components/ui_tests.txt

echo "✅ UI Components audit exporté dans: ui_components/"

# =============================================================================
# 9. TYPES & VALIDATIONS - SÉCURITÉ
# =============================================================================
echo ""
echo "📝 9. TYPES & VALIDATIONS - AUDIT SÉCURITÉ"
echo "=========================================="
mkdir -p types_security

# Types principaux
echo "--- types/index.ts ---" > types_security/index.ts
cat ../types/index.ts > types_security/index.ts 2>/dev/null || echo '❌ types/index.ts NON TROUVÉ - À CRÉER' > types_security/index.ts

echo "--- types/messages.ts ---" > types_security/messages.ts
cat ../types/messages.ts > types_security/messages.ts 2>/dev/null || echo '❌ CRITIQUE: types/messages.ts NON TROUVÉ - À CRÉER' > types_security/messages.ts

echo "--- types/chantiers.ts ---" > types_security/chantiers.ts
cat ../types/chantiers.ts > types_security/chantiers.ts 2>/dev/null || echo '// types/chantiers.ts non trouvé' > types_security/chantiers.ts

echo "--- types/auth.ts ---" > types_security/auth.ts
cat ../types/auth.ts > types_security/auth.ts 2>/dev/null || echo '// types/auth.ts non trouvé' > types_security/auth.ts

# Next-auth types
echo "--- types/next-auth.d.ts ---" > types_security/next-auth.d.ts
cat ../types/next-auth.d.ts > types_security/next-auth.d.ts 2>/dev/null || echo '// next-auth.d.ts non trouvé' > types_security/next-auth.d.ts

# Validations Zod/Joi
echo "--- lib/validations.ts ---" > types_security/validations.ts
cat ../lib/validations.ts > types_security/validations.ts 2>/dev/null || echo '❌ CRITIQUE: lib/validations.ts NON TROUVÉ - SÉCURITÉ' > types_security/validations.ts

echo "--- lib/schemas.ts ---" > types_security/schemas.ts
cat ../lib/schemas.ts > types_security/schemas.ts 2>/dev/null || echo '// lib/schemas.ts non trouvé' > types_security/schemas.ts

# Utilitaires
echo "--- lib/utils.ts ---" > types_security/utils.ts
cat ../lib/utils.ts > types_security/utils.ts 2>/dev/null || echo '// lib/utils.ts non trouvé' > types_security/utils.ts

# Constants
echo "--- lib/constants.ts ---" > types_security/constants.ts
cat ../lib/constants.ts > types_security/constants.ts 2>/dev/null || echo '// lib/constants.ts non trouvé' > types_security/constants.ts

# Security analysis
echo "AUDIT SÉCURITÉ - VALIDATIONS & TYPES:" > types_security/security_audit.txt
echo "=====================================" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "🔐 VALIDATION DONNÉES ENTRANTES:" >> types_security/security_audit.txt
echo "================================" >> types_security/security_audit.txt
echo "- [ ] Toutes APIs POST/PUT ont validation Zod/Joi" >> types_security/security_audit.txt
echo "- [ ] Sanitisation XSS sur tous inputs" >> types_security/security_audit.txt
echo "- [ ] Validation taille fichiers upload" >> types_security/security_audit.txt
echo "- [ ] Validation types MIME upload" >> types_security/security_audit.txt
echo "- [ ] Limites longueur champs texte" >> types_security/security_audit.txt
echo "- [ ] Validation formats email, URL, etc." >> types_security/security_audit.txt
echo "- [ ] Échappement SQL injection" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "🛡️ PROTECTION ROUTES:" >> types_security/security_audit.txt
echo "=====================" >> types_security/security_audit.txt
echo "- [ ] Middleware auth sur /dashboard/*" >> types_security/security_audit.txt
echo "- [ ] Vérification rôles utilisateur" >> types_security/security_audit.txt
echo "- [ ] CSRF protection" >> types_security/security_audit.txt
echo "- [ ] Rate limiting APIs" >> types_security/security_audit.txt
echo "- [ ] Headers sécurité (HSTS, X-Frame-Options)" >> types_security/security_audit.txt
echo "- [ ] Validation JWT tokens" >> types_security/security_audit.txt
echo "- [ ] Pas de données sensibles en localStorage" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "📊 TYPES TYPESCRIPT:" >> types_security/security_audit.txt
echo "====================" >> types_security/security_audit.txt
echo "- [ ] Types stricts partout (pas de 'any')" >> types_security/security_audit.txt
echo "- [ ] Interfaces cohérentes frontend/backend" >> types_security/security_audit.txt
echo "- [ ] Types générés depuis Prisma utilisés" >> types_security/security_audit.txt
echo "- [ ] Enums pour valeurs fixes" >> types_security/security_audit.txt
echo "- [ ] Types optionnels/obligatoires corrects" >> types_security/security_audit.txt

echo "✅ Types & Sécurité audit exporté dans: types_security/"

# =============================================================================
# 10. HOOKS PERSONNALISÉS - LOGIQUE MÉTIER
# =============================================================================
echo ""
echo "🎣 10. HOOKS PERSONNALISÉS - AUDIT LOGIQUE MÉTIER"
echo "================================================"
mkdir -p hooks_audit

# Hook useMessages (CRITIQUE)
echo "--- hooks/useMessages.ts ---" > hooks_audit/useMessages.ts
cat ../hooks/useMessages.ts > hooks_audit/useMessages.ts 2>/dev/null || echo '❌ CRITIQUE: hooks/useMessages.ts NON TROUVÉ - PRIORITÉ ABSOLUE' > hooks_audit/useMessages.ts

# Autres hooks existants
if [ -d "../hooks" ]; then
    find ../hooks -name "*.ts" -o -name "*.tsx" | while read hook_file; do
        hook_name=$(basename "$hook_file")
        if [ "$hook_name" != "useMessages.ts" ]; then
            echo "--- hooks/$hook_name ---" > "hooks_audit/$hook_name"
            cat "$hook_file" >> "hooks_audit/$hook_name"
        fi
    done
else
    echo '❌ DOSSIER /hooks NON TROUVÉ - À CRÉER' > hooks_audit/HOOKS_MANQUANTS.txt
    echo 'Hooks critiques à créer:' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useMessages.ts (notifications, polling)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useChantiers.ts (gestion CRUD chantiers)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useAuth.ts (session, rôles)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useApi.ts (requêtes HTTP génériques)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useLocalStorage.ts (persistance locale)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useDebounce.ts (recherche temps réel)' >> hooks_audit/HOOKS_MANQUANTS.txt
fi

# Custom hooks communes qu'on peut chercher
common_hooks=("useAuth" "useApi" "useLocalStorage" "useDebounce" "useChantiers" "useNotifications" "useUpload" "useSearch")

for hook in "${common_hooks[@]}"; do
    echo "--- hooks/$hook.ts ---" > "hooks_audit/$hook.ts"
    cat "../hooks/$hook.ts" > "hooks_audit/$hook.ts" 2>/dev/null || echo "// $hook.ts non trouvé - Peut être utile" > "hooks_audit/$hook.ts"
done

# Tests hooks
echo "AUDIT HOOKS PERSONNALISÉS:" > hooks_audit/hooks_tests.txt
echo "===========================" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "🎣 useMessages (CRITIQUE):" >> hooks_audit/hooks_tests.txt
echo "==========================" >> hooks_audit/hooks_tests.txt
echo "- [ ] Hook existe et est importable" >> hooks_audit/hooks_tests.txt
echo "- [ ] Polling conversations toutes les 30s" >> hooks_audit/hooks_tests.txt
echo "- [ ] État conversations synchronisé" >> hooks_audit/hooks_tests.txt
echo "- [ ] sendMessage fonctionne" >> hooks_audit/hooks_tests.txt
echo "- [ ] Gestion loading/error states" >> hooks_audit/hooks_tests.txt
echo "- [ ] Optimistic updates" >> hooks_audit/hooks_tests.txt
echo "- [ ] Cleanup intervals sur unmount" >> hooks_audit/hooks_tests.txt
echo "- [ ] Types TypeScript corrects" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "🏗️ AUTRES HOOKS MÉTIER:" >> hooks_audit/hooks_tests.txt
echo "========================" >> hooks_audit/hooks_tests.txt
echo "- [ ] useChantiers: CRUD, filtres, recherche" >> hooks_audit/hooks_tests.txt
echo "- [ ] useAuth: session, login/logout, rôles" >> hooks_audit/hooks_tests.txt
echo "- [ ] useApi: requêtes HTTP, cache, error handling" >> hooks_audit/hooks_tests.txt
echo "- [ ] useDebounce: recherche temps réel optimisée" >> hooks_audit/hooks_tests.txt
echo "- [ ] useNotifications: toasts, badges count" >> hooks_audit/hooks_tests.txt
echo "- [ ] useUpload: gestion fichiers, progress" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "⚡ PERFORMANCE HOOKS:" >> hooks_audit/hooks_tests.txt
echo "====================" >> hooks_audit/hooks_tests.txt
echo "- [ ] Pas de re-renders inutiles" >> hooks_audit/hooks_tests.txt
echo "- [ ] useCallback/useMemo utilisés à bon escient" >> hooks_audit/hooks_tests.txt
echo "- [ ] Cleanup effects (intervals, listeners)" >> hooks_audit/hooks_tests.txt
echo "- [ ] Dependencies arrays correctes" >> hooks_audit/hooks_tests.txt
echo "- [ ] Pas de memory leaks" >> hooks_audit/hooks_tests.txt

echo "✅ Hooks audit exporté dans: hooks_audit/"

# =============================================================================
# 11. ANALYSE COMPLÈTE APIs REST
# =============================================================================
echo ""
echo "🔄 11. ANALYSE COMPLÈTE APIs REST"
echo "================================"
mkdir -p apis_audit

# Trouver TOUTES les APIs
echo "INVENTAIRE COMPLET APIs:" > apis_audit/apis_inventory.txt
echo "========================" >> apis_audit/apis_inventory.txt
find ../app/api -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/}
    echo "✅ $rel_path" >> apis_audit/apis_inventory.txt
    
    # Extraire chaque API
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    echo "--- $api_file ---" > "apis_audit/api_$safe_name.ts"
    cat "$api_file" >> "apis_audit/api_$safe_name.ts" 2>/dev/null
done

# Si aucune API trouvée
if [ ! -d "../app/api" ]; then
    echo "❌ CRITIQUE: Dossier /app/api NON TROUVÉ" >> apis_audit/apis_inventory.txt
    echo "APIs critiques manquantes:" >> apis_audit/apis_inventory.txt
    echo "- /api/auth/[...nextauth]/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/chantiers/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/chantiers/[id]/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/contacts/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/search/route.ts" >> apis_audit/apis_inventory.txt
fi

# Tests APIs complets
echo "TESTS APIS REST - AUDIT TECHNIQUE COMPLET:" > apis_audit/apis_tests.txt
echo "===========================================" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🔐 AUTHENTIFICATION API:" >> apis_audit/apis_tests.txt
echo "========================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/auth/[...nextauth] (NextAuth endpoints)" >> apis_audit/apis_tests.txt
echo "- [ ] Session handling correct" >> apis_audit/apis_tests.txt
echo "- [ ] Redirections après login/logout" >> apis_audit/apis_tests.txt
echo "- [ ] CSRF protection active" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🏗️ CHANTIERS API (CRUD COMPLET):" >> apis_audit/apis_tests.txt
echo "==================================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers → 200 (liste avec données)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/chantiers → 201 (création réussie)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers/[id] → 200 (détail)" >> apis_audit/apis_tests.txt
echo "- [ ] PUT /api/chantiers/[id] → 200 (modification)" >> apis_audit/apis_tests.txt
echo "- [ ] DELETE /api/chantiers/[id] → 200 (suppression)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers/inexistant → 404" >> apis_audit/apis_tests.txt
echo "- [ ] POST sans auth → 401" >> apis_audit/apis_tests.txt
echo "- [ ] POST données invalides → 400" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "💬 MESSAGES API (NOUVEAU MODULE):" >> apis_audit/apis_tests.txt
echo "==================================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages → 200 (conversations)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages → 201 (nouveau message)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages/contacts → 200 (liste contacts)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages/search?q=term → 200 (résultats)" >> apis_audit/apis_tests.txt
echo "- [ ] PUT /api/messages/[id] → 200 (modification)" >> apis_audit/apis_tests.txt
echo "- [ ] DELETE /api/messages/[id] → 200 (suppression)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages/mark-read → 200 (marquer lu)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages/files/upload → 201 (upload)" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "⚡ PERFORMANCE & SÉCURITÉ APIs:" >> apis_audit/apis_tests.txt
echo "===============================" >> apis_audit/apis_tests.txt
echo "- [ ] Réponse < 500ms pour requêtes simples" >> apis_audit/apis_tests.txt
echo "- [ ] Pagination sur listes longues" >> apis_audit/apis_tests.txt
echo "- [ ] Rate limiting (100 req/min par user)" >> apis_audit/apis_tests.txt
echo "- [ ] Validation stricte données entrantes" >> apis_audit/apis_tests.txt
echo "- [ ] Logs d'erreurs détaillés" >> apis_audit/apis_tests.txt
echo "- [ ] Headers CORS appropriés" >> apis_audit/apis_tests.txt
echo "- [ ] Gestion erreurs DB (connexion, timeout)" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🧪 TESTS EDGE CASES:" >> apis_audit/apis_tests.txt
echo "====================" >> apis_audit/apis_tests.txt
echo "- [ ] Données null/undefined gérées" >> apis_audit/apis_tests.txt
echo "- [ ] Caractères spéciaux dans requêtes" >> apis_audit/apis_tests.txt
echo "- [ ] Requêtes simultanées multiples" >> apis_audit/apis_tests.txt
echo "- [ ] Timeout réseau simulé" >> apis_audit/apis_tests.txt
echo "- [ ] DB indisponible temporairement" >> apis_audit/apis_tests.txt
echo "- [ ] Payload trop volumineux → 413" >> apis_audit/apis_tests.txt
echo "- [ ] Méthodes HTTP non supportées → 405" >> apis_audit/apis_tests.txt

echo "✅ APIs audit exporté dans: apis_audit/"

# =============================================================================
# 12. TESTS PERFORMANCE COMPLETS
# =============================================================================
echo ""
echo "⚡ 12. AUDIT PERFORMANCE COMPLET"
echo "==============================="
mkdir -p performance_audit

# Analyse bundle et build
echo "PERFORMANCE - CHECKLIST COMPLÈTE:" > performance_audit/performance_tests.txt
echo "=================================" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🚀 CHARGEMENT PAGES (CORE WEB VITALS):" >> performance_audit/performance_tests.txt
echo "======================================" >> performance_audit/performance_tests.txt
echo "- [ ] Page d'accueil < 2s (LCP)" >> performance_audit/performance_tests.txt
echo "- [ ] Dashboard < 3s (avec données)" >> performance_audit/performance_tests.txt
echo "- [ ] Liste chantiers < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] Détail chantier < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] Interface messages < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] First Contentful Paint < 1.5s" >> performance_audit/performance_tests.txt
echo "- [ ] Largest Contentful Paint < 2.5s" >> performance_audit/performance_tests.txt
echoecho "- [ ] Largest Contentful Paint < 2.5s" >> performance_audit/performance_tests.txt
echo "- [ ] Cumulative Layout Shift < 0.1" >> performance_audit/performance_tests.txt
echo "- [ ] First Input Delay < 100ms" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "⚡ INTERACTIONS TEMPS RÉEL:" >> performance_audit/performance_tests.txt
echo "===========================" >> performance_audit/performance_tests.txt
echo "- [ ] Recherche temps réel < 300ms" >> performance_audit/performance_tests.txt
echo "- [ ] Navigation entre pages fluide" >> performance_audit/performance_tests.txt
echo "- [ ] Formulaires répondent instantanément" >> performance_audit/performance_tests.txt
echo "- [ ] Animations fluides 60fps" >> performance_audit/performance_tests.txt
echo "- [ ] Scroll smooth sur longues listes" >> performance_audit/performance_tests.txt
echo "- [ ] Upload fichiers avec progress" >> performance_audit/performance_tests.txt
echo "- [ ] Pas de freeze UI pendant requêtes" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🌐 OPTIMISATIONS RÉSEAU:" >> performance_audit/performance_tests.txt
echo "========================" >> performance_audit/performance_tests.txt
echo "- [ ] Requêtes API optimisées (pas de doublons)" >> performance_audit/performance_tests.txt
echo "- [ ] Images optimisées Next.js" >> performance_audit/performance_tests.txt
echo "- [ ] Compression gzip activée" >> performance_audit/performance_tests.txt
echo "- [ ] Cache approprié (headers, SWR)" >> performance_audit/performance_tests.txt
echo "- [ ] Lazy loading images/composants" >> performance_audit/performance_tests.txt
echo "- [ ] Bundle splitting efficace" >> performance_audit/performance_tests.txt
echo "- [ ] Prefetch routes importantes" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🧠 MÉMOIRE & CPU:" >> performance_audit/performance_tests.txt
echo "=================" >> performance_audit/performance_tests.txt
echo "- [ ] Pas de memory leaks" >> performance_audit/performance_tests.txt
echo "- [ ] Event listeners nettoyés" >> performance_audit/performance_tests.txt
echo "- [ ] Intervals/timeouts clearés" >> performance_audit/performance_tests.txt
echo "- [ ] Re-renders React minimisés" >> performance_audit/performance_tests.txt
echo "- [ ] Virtualisation si listes longues (>1000 items)" >> performance_audit/performance_tests.txt
echo "- [ ] Debounce sur recherches" >> performance_audit/performance_tests.txt

# Build analysis
echo "" >> performance_audit/performance_tests.txt
echo "📦 BUILD & BUNDLE ANALYSIS:" >> performance_audit/performance_tests.txt
echo "============================" >> performance_audit/performance_tests.txt
echo "Commandes à exécuter pour audit:" >> performance_audit/performance_tests.txt
echo "npm run build" >> performance_audit/performance_tests.txt
echo "npm run analyze (si script existe)" >> performance_audit/performance_tests.txt
echo "npx @next/bundle-analyzer" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "- [ ] Build sans erreurs TypeScript" >> performance_audit/performance_tests.txt
echo "- [ ] Bundle size total < 500KB" >> performance_audit/performance_tests.txt
echo "- [ ] Chunks optimisés" >> performance_audit/performance_tests.txt
echo "- [ ] Tree shaking efficace" >> performance_audit/performance_tests.txt
echo "- [ ] Code splitting par routes" >> performance_audit/performance_tests.txt
echo "- [ ] Dependencies inutiles supprimées" >> performance_audit/performance_tests.txt

echo "✅ Performance audit exporté dans: performance_audit/"

# =============================================================================
# 13. TESTS MULTI-NAVIGATEURS & DEVICES
# =============================================================================
echo ""
echo "🌐 13. TESTS MULTI-NAVIGATEURS & DEVICES"
echo "========================================"
mkdir -p cross_platform_tests

echo "TESTS CROSS-PLATFORM COMPLETS:" > cross_platform_tests/browser_device_tests.txt
echo "===============================" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "💻 DESKTOP BROWSERS:" >> cross_platform_tests/browser_device_tests.txt
echo "====================" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Chrome (dernière version)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Firefox (dernière version)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Safari (si macOS disponible)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Edge (Windows)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Opera (test optionnel)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "📱 MOBILE BROWSERS:" >> cross_platform_tests/browser_device_tests.txt
echo "===================" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Chrome mobile (Android)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Safari mobile (iOS)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Samsung Internet" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Firefox mobile" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "📐 RÉSOLUTIONS TESTÉES:" >> cross_platform_tests/browser_device_tests.txt
echo "=======================" >> cross_platform_tests/browser_device_tests.txt
echo "Desktop:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1920x1080 (Full HD)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1366x768 (laptop commun)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1440x900 (MacBook)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 2560x1440 (2K)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Tablet:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 768x1024 (iPad portrait)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1024x768 (iPad landscape)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 601x962 (Surface)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Mobile:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 375x667 (iPhone 8)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 414x896 (iPhone 11)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 360x640 (Android commun)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 375x812 (iPhone X)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "🧪 TESTS PAR FONCTIONNALITÉ:" >> cross_platform_tests/browser_device_tests.txt
echo "=============================" >> cross_platform_tests/browser_device_tests.txt
echo "Navigation:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Menu hamburger mobile" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Sidebar responsive" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Tabs navigation touch-friendly" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Formulaires:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Inputs utilisables mobile" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Keyboards virtuels supportés" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Validation temps réel" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Upload fichiers mobile" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Interactions:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Touch gestures (swipe, pinch)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Hover states desktop" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Click/tap targets > 44px" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Scroll momentum mobile" >> cross_platform_tests/browser_device_tests.txt

echo "✅ Cross-platform tests exportés dans: cross_platform_tests/"

# =============================================================================
# 14. VARIABLES D'ENVIRONNEMENT & CONFIGURATION
# =============================================================================
echo ""
echo "⚙️ 14. VARIABLES D'ENVIRONNEMENT & CONFIG"
echo "========================================="
mkdir -p env_config

# Variables d'environnement
echo "ANALYSE VARIABLES ENVIRONNEMENT:" > env_config/env_analysis.txt
echo "================================" >> env_config/env_analysis.txt
echo "" >> env_config/env_analysis.txt

if [ -f "../.env.example" ]; then
    echo "=== .env.example TROUVÉ ===" >> env_config/env_analysis.txt
    cat ../.env.example >> env_config/env_analysis.txt
    echo "" >> env_config/env_analysis.txt
    cp ../.env.example env_config/env.example
elif [ -f "../.env.local" ]; then
    echo "=== .env.local STRUCTURE (masqué) ===" >> env_config/env_analysis.txt
    grep -E "^[A-Z_]+=" ../.env.local | sed 's/=.*/=***MASKED***/' >> env_config/env_analysis.txt 2>/dev/null
else
    echo "⚠️ Aucun fichier .env exemple trouvé" >> env_config/env_analysis.txt
fi

echo "" >> env_config/env_analysis.txt
echo "VARIABLES CRITIQUES À VÉRIFIER:" >> env_config/env_analysis.txt
echo "===============================" >> env_config/env_analysis.txt
echo "- [ ] DATABASE_URL (PostgreSQL)" >> env_config/env_analysis.txt
echo "- [ ] NEXTAUTH_SECRET (sécurité JWT)" >> env_config/env_analysis.txt
echo "- [ ] NEXTAUTH_URL (callbacks auth)" >> env_config/env_analysis.txt
echo "- [ ] NODE_ENV (production/development)" >> env_config/env_analysis.txt
echo "- [ ] UPLOAD_DIR ou CLOUDINARY_URL (fichiers)" >> env_config/env_analysis.txt
echo "- [ ] EMAIL_* (notifications email si implémenté)" >> env_config/env_analysis.txt
echo "- [ ] REDIS_URL (cache si implémenté)" >> env_config/env_analysis.txt

# Configuration files
echo "--- .eslintrc.json ---" > env_config/eslintrc.json
cat ../.eslintrc.json > env_config/eslintrc.json 2>/dev/null || echo '// .eslintrc.json non trouvé' > env_config/eslintrc.json

echo "--- .prettierrc ---" > env_config/prettierrc.json
cat ../.prettierrc* > env_config/prettierrc.json 2>/dev/null || echo '// .prettierrc non trouvé' > env_config/prettierrc.json

echo "--- .gitignore ---" > env_config/gitignore.txt
cat ../.gitignore > env_config/gitignore.txt 2>/dev/null || echo '// .gitignore non trouvé' > env_config/gitignore.txt

# Vercel/deployment config
echo "--- vercel.json ---" > env_config/vercel.json
cat ../vercel.json > env_config/vercel.json 2>/dev/null || echo '// vercel.json non trouvé' > env_config/vercel.json

echo "✅ Env & Config exportés dans: env_config/"

# =============================================================================
# 15. PLAN D'AUDIT MÉTHODIQUE COMPLET
# =============================================================================
echo ""
echo "📋 15. PLAN D'AUDIT MÉTHODIQUE COMPLET"
echo "====================================="

echo "PLAN D'AUDIT CHANTIERPRO - MÉTHODOLOGIE COMPLÈTE" > plan_audit_complet.txt
echo "=================================================" >> plan_audit_complet.txt
echo "Date: $(date)" >> plan_audit_complet.txt
echo "Objectif: AUDIT COMPLET → CORRECTIONS → PRODUCTION READY" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt

echo "🔍 PHASE 1 - AUDIT TECHNIQUE INFRASTRUCTURE (2-3h)" >> plan_audit_complet.txt
echo "===================================================" >> plan_audit_complet.txt
echo "1.1 BUILD & COMPILATION:" >> plan_audit_complet.txt
echo "- [ ] npm install (vérifier dépendances)" >> plan_audit_complet.txt
echo "- [ ] npm run build (compilation production)" >> plan_audit_complet.txt
echo "- [ ] npm run type-check (TypeScript strict)" >> plan_audit_complet.txt
echo "- [ ] npm run lint (ESLint + fix auto)" >> plan_audit_complet.txt
echo "- [ ] Analyser bundle size et optimisations" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "1.2 BASE DE DONNÉES:" >> plan_audit_complet.txt
echo "- [ ] npx prisma validate (schema valide)" >> plan_audit_complet.txt
echo "- [ ] npx prisma generate (client à jour)" >> plan_audit_complet.txt
echo "- [ ] npx prisma db push (sync structure)" >> plan_audit_complet.txt
echo "- [ ] npx prisma studio (explorer données)" >> plan_audit_complet.txt
echo "- [ ] Tester connexions DB + seed data" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "1.3 ENVIRONMENT & CONFIG:" >> plan_audit_complet.txt
echo "- [ ] Variables .env toutes présentes" >> plan_audit_complet.txt
echo "- [ ] NEXTAUTH_SECRET sécurisé" >> plan_audit_complet.txt
echo "- [ ] DATABASE_URL fonctionnelle" >> plan_audit_complet.txt
echo "- [ ] Middleware protection routes" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🧪 PHASE 2 - TESTS APIS REST (3-4h)" >> plan_audit_complet.txt
echo "====================================" >> plan_audit_complet.txt
echo "2.1 AUTHENTIFICATION:" >> plan_audit_complet.txt
echo "- [ ] Login/logout fonctionnels" >> plan_audit_complet.txt
echo "- [ ] Sessions persistantes" >> plan_audit_complet.txt
echo "- [ ] Protection /dashboard/*" >> plan_audit_complet.txt
echo "- [ ] Rôles utilisateurs" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "2.2 CHANTIERS CRUD (référence):" >> plan_audit_complet.txt
echo "- [ ] GET /api/chantiers → 200" >> plan_audit_complet.txt
echo "- [ ] POST /api/chantiers → 201" >> plan_audit_complet.txt
echo "- [ ] GET/PUT/DELETE /api/chantiers/[id]" >> plan_audit_complet.txt
echo "- [ ] Validation données + erreurs HTTP" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "2.3 MESSAGES (nouveau module):" >> plan_audit_complet.txt
echo "- [ ] Toutes routes /api/messages/*" >> plan_audit_complet.txt
echo "- [ ] CRUD complet messages" >> plan_audit_complet.txt
echo "- [ ] Recherche + contacts" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers" >> plan_audit_complet.txt
echo "- [ ] Rate limiting + sécurité" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🎨 PHASE 3 - TESTS UI/UX COMPLETS (4-5h)" >> plan_audit_complet.txt
echo "=========================================" >> plan_audit_complet.txt
echo "3.1 DASHBOARD PRINCIPAL:" >> plan_audit_complet.txt
echo "- [ ] Chargement < 3s avec données réelles" >> plan_audit_complet.txt
echo "- [ ] Stats cards fonctionnelles" >> plan_audit_complet.txt
echo "- [ ] Navigation vers modules" >> plan_audit_complet.txt
echo "- [ ] Quick actions opérationnelles" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "3.2 MODULE CHANTIERS (référence CRUD):" >> plan_audit_complet.txt
echo "- [ ] Liste + filtres + recherche" >> plan_audit_complet.txt
echo "- [ ] Détail chantier complet" >> plan_audit_complet.txt
echo "- [ ] Formulaire création multi-étapes" >> plan_audit_complet.txt
echo "- [ ] Upload photos + timeline" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "3.3 MODULE MESSAGES (focus audit):" >> plan_audit_complet.txt
echo "- [ ] Interface principale chat" >> plan_audit_complet.txt
echo "- [ ] Nouveau message modal + page" >> plan_audit_complet.txt
echo "- [ ] Recherche messages globale" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers + médias viewer" >> plan_audit_complet.txt
echo "- [ ] Notifications temps réel" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "📱 PHASE 4 - RESPONSIVE & CROSS-PLATFORM (2-3h)" >> plan_audit_complet.txt
echo "================================================" >> plan_audit_complet.txt
echo "4.1 DEVICES:" >> plan_audit_complet.txt
echo "- [ ] Desktop (1920x1080, 1366x768)" >> plan_audit_complet.txt
echo "- [ ] Tablet (iPad portrait/landscape)" >> plan_audit_complet.txt
echo "- [ ] Mobile (iPhone, Android diverses tailles)" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "4.2 BROWSERS:" >> plan_audit_complet.txt
echo "- [ ] Chrome, Firefox, Safari, Edge" >> plan_audit_complet.txt
echo "- [ ] Chrome/Safari mobile" >> plan_audit_complet.txt
echo "- [ ] Fonctionnalités touch mobile" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "4.3 DESIGN CONSISTENCY:" >> plan_audit_complet.txt
echo "- [ ] CSS vanilla cohérent (pas Tailwind mélangé)" >> plan_audit_complet.txt
echo "- [ ] Classes .glass, .card, .btn-primary réutilisées" >> plan_audit_complet.txt
echo "- [ ] Gradients bleu/orange respectés" >> plan_audit_complet.txt
echo "- [ ] Typography Inter partout" >> plan_audit_complet.txt
echo "- [ ] Animations 0.3s ease cohérentes" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "⚡ PHASE 5 - PERFORMANCE & SÉCURITÉ (2-3h)" >> plan_audit_complet.txt
echo "===========================================" >> plan_audit_complet.txt
echo "5.1 PERFORMANCE:" >> plan_audit_complet.txt
echo "- [ ] Core Web Vitals (LCP < 2.5s, CLS < 0.1)" >> plan_audit_complet.txt
echo "- [ ] Recherche temps réel < 300ms" >> plan_audit_complet.txt
echo "- [ ] Navigation fluide entre pages" >> plan_audit_complet.txt
echo "- [ ] Memory leaks + cleanup effects" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "5.2 SÉCURITÉ:" >> plan_audit_complet.txt
echo "- [ ] Validation Zod toutes APIs POST/PUT" >> plan_audit_complet.txt
echo "- [ ] XSS prevention sur inputs" >> plan_audit_complet.txt
echo "- [ ] CSRF protection active" >> plan_audit_complet.txt
echo "- [ ] Rate limiting APIs" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers sécurisé" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🧪 PHASE 6 - EDGE CASES & ROBUSTESSE (2h)" >> plan_audit_complet.txt
echo "==========================================" >> plan_audit_complet.txt
echo "6.1 DONNÉES EDGE CASES:" >> plan_audit_complet.txt
echo "- [ ] Données vides/null gérées gracieusement" >> plan_audit_complet.txt
echo "- [ ] Listes vides → empty state approprié" >> plan_audit_complet.txt
echo "- [ ] Caractères spéciaux dans formulaires" >> plan_audit_complet.txt
echo "- [ ] Limites longueur champs respectées" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "6.2 RÉSEAU:" >> plan_audit_complet.txt
echo "- [ ] Connexion lente simulée" >> plan_audit_complet.txt
echo "- [ ] Connexion coupée/restaurée" >> plan_audit_complet.txt
echo "- [ ] Timeout API avec retry" >> plan_audit_complet.txt
echo "- [ ] Mode dégradé fonctionnel" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "📊 PHASE 7 - RAPPORT & CORRECTIONS (1-2h par bug)" >> plan_audit_complet.txt
echo "==================================================" >> plan_audit_complet.txt
echo "7.1 CATÉGORISATION BUGS:" >> plan_audit_complet.txt
echo "🔴 CRITIQUE: App crash, fonctionnalité core cassée" >> plan_audit_complet.txt
echo "🟠 MAJEUR: Fonctionnalité importante ne marche pas" >> plan_audit_complet.txt
echo "🟡 MINEUR: Bug UX, performance, edge case" >> plan_audit_complet.txt
echo "🔵 COSMÉTIQUE: Design inconsistency, typos" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "7.2 PRIORITÉS CORRECTION:" >> plan_audit_complet.txt
echo "- Corriger TOUS les bugs CRITIQUES avant suite" >> plan_audit_complet.txt
echo "- Corriger bugs MAJEURS avant production" >> plan_audit_complet.txt
echo "- Planifier MINEURS + COSMÉTIQUES version suivante" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "7.3 FORMAT RAPPORT BUG:" >> plan_audit_complet.txt
echo "🔴 BUG #XX - [NIVEAU]" >> plan_audit_complet.txt
echo "LOCALISATION: fichier:ligne + URL" >> plan_audit_complet.txt
echo "DESCRIPTION: problème observé" >> plan_audit_complet.txt
echo "REPRODUCTION: étapes 1, 2, 3" >> plan_audit_complet.txt
echo "ERREUR CONSOLE: logs détaillés" >> plan_audit_complet.txt
echo "IMPACT: conséquences utilisateur" >> plan_audit_complet.txt
echo "SOLUTION: correction proposée" >> plan_audit_complet.txt
echo "STATUS: [TROUVÉ/EN COURS/CORRIGÉ]" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🎯 LIVRABLES FINAUX:" >> plan_audit_complet.txt
echo "====================" >> plan_audit_complet.txt
echo "✅ Rapport d'audit complet avec bugs catégorisés" >> plan_audit_complet.txt
echo "🔧 Corrections appliquées (bugs critiques + majeurs)" >> plan_audit_complet.txt
echo "📊 Évaluation globale état application" >> plan_audit_complet.txt
echo "🚀 Roadmap corrections restantes" >> plan_audit_complet.txt
echo "📚 Documentation modifications effectuées" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "TEMPS TOTAL ESTIMÉ: 15-20 heures sur 3-4 jours" >> plan_audit_complet.txt
echo "OBJECTIF: Application 100% fonctionnelle, production-ready" >> plan_audit_complet.txt

echo "✅ Plan d'audit complet exporté dans: plan_audit_complet.txt"

# =============================================================================
# 16. OUTILS D'AUDIT & COMMANDES
# =============================================================================
echo ""
echo "🛠️ 16. OUTILS & COMMANDES D'AUDIT"
echo "================================="
mkdir -p audit_tools

echo "OUTILS & COMMANDES AUDIT CHANTIERPRO" > audit_tools/commands_tools.txt
echo "====================================" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🔧 COMMANDES DE BASE:" >> audit_tools/commands_tools.txt
echo "=====================" >> audit_tools/commands_tools.txt
echo "# Installation et setup" >> audit_tools/commands_tools.txt
echo "npm install" >> audit_tools/commands_tools.txt
echo "npm run dev                    # Serveur développement" >> audit_tools/commands_tools.txt
echo "npm run build                  # Build production" >> audit_tools/commands_tools.txt
echo "npm run start                  # Serveur production" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Base de données Prisma" >> audit_tools/commands_tools.txt
echo "npx prisma generate           # Générer client Prisma" >> audit_tools/commands_tools.txt
echo "npx prisma db push           # Sync schema avec DB" >> audit_tools/commands_tools.txt
echo "npx prisma studio            # Interface graphique DB" >> audit_tools/commands_tools.txt
echo "npx prisma migrate reset     # Reset complet DB" >> audit_tools/commands_tools.txt
echo "npx prisma db seed           # Charger données test" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Qualité code" >> audit_tools/commands_tools.txt
echo "npm run lint                  # ESLint vérification" >> audit_tools/commands_tools.txt
echo "npm run lint:fix             # ESLint auto-fix" >> audit_tools/commands_tools.txt
echo "npm run type-check           # TypeScript vérification" >> audit_tools/commands_tools.txt
echo "npx prettier --write .       # Formatage code" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🌐 TESTS NAVIGATEUR (DevTools F12):" >> audit_tools/commands_tools.txt
echo "====================================" >> audit_tools/commands_tools.txt
echo "Console: Erreurs JavaScript" >> audit_tools/commands_tools.txt
echo "Network: Requêtes API + performance" >> audit_tools/commands_tools.txt
echo "Performance: Core Web Vitals" >> audit_tools/commands_tools.txt
echo "Application: LocalStorage, Session, Cookies" >> audit_tools/commands_tools.txt
echo "Lighthouse: Audit complet performance/SEO/accessibilité" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "📱 MODE RESPONSIVE (DevTools):" >> audit_tools/commands_tools.txt
echo "===============================" >> audit_tools/commands_tools.txt
echo "Ctrl+Shift+M (toggle device mode)" >> audit_tools/commands_tools.txt
echo "Presets: iPhone 12, iPad, Pixel 5" >> audit_tools/commands_tools.txt
echo "Custom: 375x667, 768x1024, 1366x768" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🧪 CURL TESTS APIs:" >> audit_tools/commands_tools.txt
echo "===================" >> audit_tools/commands_tools.txt
echo "# Test authentification" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/auth/session" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Test CRUD chantiers" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/chantiers" >> audit_tools/commands_tools.txt
echo "curl -X POST http://localhost:3000/api/chantiers \\" >> audit_tools/commands_tools.txt
echo "  -H 'Content-Type: application/json' \\" >> audit_tools/commands_tools.txt
echo "  -d '{\"nom\":\"Test Chantier\",\"statut\":\"ACTIF\"}'" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Test messages (nouveau module)" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/messages" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/messages/contacts" >> audit_tools/commands_tools.txt
echo "curl -X GET 'http://localhost:3000/api/messages/search?q=test'" >> audit_tools/commands_tools.txt

# Debug checklist
echo "" >> audit_tools/commands_tools.txt
echo "🐛 DEBUG CHECKLIST:" >> audit_tools/commands_tools.txt
echo "===================" >> audit_tools/commands_tools.txt
echo "- [ ] Console.log outputs pour tracer flux" >> audit_tools/commands_tools.txt
echo "- [ ]#!/bin/bash

# Script d'extraction ChantierPro - AUDIT COMPLET v4.0
# À exécuter depuis la racine du projet ChantierPro
# Optimisé pour fournir TOUS les fichiers nécessaires à l'AUDIT COMPLET

echo "🔍 EXTRACTION CHANTIERPRO v4.0 - AUDIT COMPLET QUALITÉ"
echo "========================================================"
echo "Date: $(date)"
echo "Objectif: Extraire TOUS les fichiers pour AUDIT COMPLET et CORRECTION"
echo ""

# Créer dossier d'extraction avec timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
EXTRACT_DIR="audit_complet_${TIMESTAMP}"
mkdir -p "$EXTRACT_DIR"
cd "$EXTRACT_DIR"

echo "📁 Dossier d'extraction: $EXTRACT_DIR"
echo ""

# =============================================================================
# 1. CONFIGURATION & BUILD VERIFICATION
# =============================================================================
echo "🔧 1. CONFIGURATION & BUILD VERIFICATION"
echo "========================================"
mkdir -p config_build

echo "--- package.json ---" > config_build/package.json
cat ../package.json > config_build/package.json 2>/dev/null || echo '{"error": "package.json NON TROUVÉ"}' > config_build/package.json

echo "--- tsconfig.json ---" > config_build/tsconfig.json
cat ../tsconfig.json > config_build/tsconfig.json 2>/dev/null || echo '{"error": "tsconfig.json NON TROUVÉ"}' > config_build/tsconfig.json

echo "--- next.config.js ---" > config_build/next.config.js
cat ../next.config.* > config_build/next.config.js 2>/dev/null || echo '// next.config NON TROUVÉ' > config_build/next.config.js

echo "--- tailwind.config ---" > config_build/tailwind.config.js
cat ../tailwind.config.* > config_build/tailwind.config.js 2>/dev/null || echo '// tailwind.config NON TROUVÉ - App utilise CSS vanilla' > config_build/tailwind.config.js

# Scripts NPM analysis
echo "ANALYSE SCRIPTS NPM DISPONIBLES:" > config_build/npm_scripts_analysis.txt
echo "================================" >> config_build/npm_scripts_analysis.txt
if [ -f "../package.json" ]; then
    echo "Scripts trouvés dans package.json:" >> config_build/npm_scripts_analysis.txt
    grep -A 20 '"scripts"' ../package.json >> config_build/npm_scripts_analysis.txt 2>/dev/null || echo "Aucun script trouvé" >> config_build/npm_scripts_analysis.txt
else
    echo "❌ package.json non trouvé - CRITIQUE" >> config_build/npm_scripts_analysis.txt
fi

echo "" >> config_build/npm_scripts_analysis.txt
echo "VÉRIFICATIONS BUILD NÉCESSAIRES:" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run build (compilation production)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run type-check (vérification TypeScript)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run lint (vérification ESLint)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run dev (serveur développement)" >> config_build/npm_scripts_analysis.txt

# Dependencies analysis
echo "ANALYSE DÉPENDANCES:" > config_build/dependencies_analysis.txt
echo "===================" >> config_build/dependencies_analysis.txt
if [ -f "../package.json" ]; then
    echo "=== PRODUCTION DEPENDENCIES ===" >> config_build/dependencies_analysis.txt
    grep -A 50 '"dependencies"' ../package.json >> config_build/dependencies_analysis.txt 2>/dev/null
    echo "" >> config_build/dependencies_analysis.txt
    echo "=== DEV DEPENDENCIES ===" >> config_build/dependencies_analysis.txt
    grep -A 30 '"devDependencies"' ../package.json >> config_build/dependencies_analysis.txt 2>/dev/null
fi

echo "✅ Configuration et build exportés dans: config_build/"

# =============================================================================
# 2. PRISMA & BASE DE DONNÉES COMPLÈTE
# =============================================================================
echo ""
echo "🗄️ 2. ANALYSE PRISMA & BASE DE DONNÉES"
echo "======================================"
mkdir -p database_audit

echo "--- prisma/schema.prisma ---" > database_audit/schema.prisma
cat ../prisma/schema.prisma > database_audit/schema.prisma 2>/dev/null || echo '// ❌ CRITIQUE: prisma/schema.prisma NON TROUVÉ' > database_audit/schema.prisma

echo "--- lib/db.ts ou lib/prisma.ts ---" > database_audit/db_client.ts
cat ../lib/db.ts > database_audit/db_client.ts 2>/dev/null || cat ../lib/prisma.ts > database_audit/db_client.ts 2>/dev/null || echo '// ❌ CRITIQUE: Client Prisma NON TROUVÉ' > database_audit/db_client.ts

# Analyse du schema Prisma
echo "ANALYSE SCHEMA PRISMA:" > database_audit/schema_analysis.txt
echo "=====================" >> database_audit/schema_analysis.txt
if [ -f "../prisma/schema.prisma" ]; then
    echo "=== MODELS TROUVÉS ===" >> database_audit/schema_analysis.txt
    grep "^model " ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
    echo "" >> database_audit/schema_analysis.txt
    
    echo "=== ENUMS TROUVÉS ===" >> database_audit/schema_analysis.txt
    grep "^enum " ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
    echo "" >> database_audit/schema_analysis.txt
    
    echo "=== PROVIDER DATABASE ===" >> database_audit/schema_analysis.txt
    grep -A 5 "provider" ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
else
    echo "❌ CRITIQUE: Schema Prisma non trouvé - Impossible de vérifier la DB" >> database_audit/schema_analysis.txt
fi

# Migrations
echo "--- Migrations Info ---" > database_audit/migrations.txt
if [ -d "../prisma/migrations" ]; then
    echo "MIGRATIONS TROUVÉES:" >> database_audit/migrations.txt
    ls -la ../prisma/migrations/ >> database_audit/migrations.txt
    echo "" >> database_audit/migrations.txt
    echo "DERNIÈRE MIGRATION:" >> database_audit/migrations.txt
    find ../prisma/migrations -name "migration.sql" -type f -exec basename "$(dirname {})" \; | tail -1 >> database_audit/migrations.txt
else
    echo "⚠️ Aucune migration trouvée - DB peut être en mode db push" >> database_audit/migrations.txt
fi

# Seed
echo "--- prisma/seed.ts ---" > database_audit/seed.ts
cat ../prisma/seed.ts > database_audit/seed.ts 2>/dev/null || echo '// Seed non trouvé - Données de test à créer' > database_audit/seed.ts

echo "✅ Database audit exporté dans: database_audit/"

# =============================================================================
# 3. ARCHITECTURE COMPLÈTE APP ROUTER NEXT.JS 14
# =============================================================================
echo ""
echo "🏗️ 3. ARCHITECTURE COMPLÈTE NEXT.JS 14"
echo "======================================"
mkdir -p architecture_app

# Layout principal
echo "--- app/layout.tsx ---" > architecture_app/root_layout.tsx
cat ../app/layout.tsx > architecture_app/root_layout.tsx 2>/dev/null || echo '❌ CRITIQUE: app/layout.tsx NON TROUVÉ' > architecture_app/root_layout.tsx

# Page d'accueil
echo "--- app/page.tsx ---" > architecture_app/root_page.tsx
cat ../app/page.tsx > architecture_app/root_page.tsx 2>/dev/null || echo '❌ app/page.tsx NON TROUVÉ' > architecture_app/root_page.tsx

# Global styles
echo "--- app/globals.css ---" > architecture_app/globals.css
cat ../app/globals.css > architecture_app/globals.css 2>/dev/null || echo '❌ CRITIQUE: app/globals.css NON TROUVÉ' > architecture_app/globals.css

# Loading et Error
echo "--- app/loading.tsx ---" > architecture_app/loading.tsx
cat ../app/loading.tsx > architecture_app/loading.tsx 2>/dev/null || echo '// loading.tsx non trouvé - À créer' > architecture_app/loading.tsx

echo "--- app/error.tsx ---" > architecture_app/error.tsx
cat ../app/error.tsx > architecture_app/error.tsx 2>/dev/null || echo '// error.tsx non trouvé - À créer' > architecture_app/error.tsx

echo "--- app/not-found.tsx ---" > architecture_app/not_found.tsx
cat ../app/not-found.tsx > architecture_app/not_found.tsx 2>/dev/null || echo '// not-found.tsx non trouvé - À créer' > architecture_app/not_found.tsx

# Middleware
echo "--- middleware.ts ---" > architecture_app/middleware.ts
cat ../middleware.ts > architecture_app/middleware.ts 2>/dev/null || echo '// middleware.ts non trouvé - Vérifier protection routes' > architecture_app/middleware.ts

# Analysis structure app
echo "ANALYSE STRUCTURE APP ROUTER:" > architecture_app/app_structure.txt
echo "=============================" >> architecture_app/app_structure.txt
if [ -d "../app" ]; then
    find ../app -type f -name "*.tsx" -o -name "*.ts" | head -50 | while read appfile; do
        rel_path=${appfile#../app/}
        echo "✅ $rel_path" >> architecture_app/app_structure.txt
    done
    
    echo "" >> architecture_app/app_structure.txt
    echo "ROUTES DÉTECTÉES:" >> architecture_app/app_structure.txt
    find ../app -name "page.tsx" | sed 's|../app||g' | sed 's|/page.tsx||g' | sed 's|^$|/|g' >> architecture_app/app_structure.txt
else
    echo "❌ CRITIQUE: Dossier /app non trouvé" >> architecture_app/app_structure.txt
fi

echo "✅ Architecture exportée dans: architecture_app/"

# =============================================================================
# 4. SYSTÈME D'AUTHENTIFICATION COMPLET
# =============================================================================
echo ""
echo "🔐 4. SYSTÈME D'AUTHENTIFICATION COMPLET"
echo "======================================="
mkdir -p auth_system

# NextAuth configuration
echo "--- app/api/auth/[...nextauth]/route.ts ---" > auth_system/nextauth_route.ts
cat ../app/api/auth/\[...nextauth\]/route.ts > auth_system/nextauth_route.ts 2>/dev/null || echo '❌ CRITIQUE: NextAuth route NON TROUVÉE' > auth_system/nextauth_route.ts

# Auth configuration lib
echo "--- lib/auth.ts ou lib/authOptions.ts ---" > auth_system/auth_config.ts
cat ../lib/auth.ts > auth_system/auth_config.ts 2>/dev/null || cat ../lib/authOptions.ts > auth_system/auth_config.ts 2>/dev/null || echo '❌ Configuration auth NON TROUVÉE' > auth_system/auth_config.ts

# Auth pages
echo "--- app/auth/login/page.tsx ---" > auth_system/login_page.tsx
cat ../app/auth/login/page.tsx > auth_system/login_page.tsx 2>/dev/null || echo '❌ Page login NON TROUVÉE' > auth_system/login_page.tsx

echo "--- app/auth/register/page.tsx ---" > auth_system/register_page.tsx
cat ../app/auth/register/page.tsx > auth_system/register_page.tsx 2>/dev/null || echo '// Page register non trouvée' > auth_system/register_page.tsx

# Session provider
echo "--- components/providers.tsx ou app/providers.tsx ---" > auth_system/providers.tsx
cat ../components/providers.tsx > auth_system/providers.tsx 2>/dev/null || cat ../app/providers.tsx > auth_system/providers.tsx 2>/dev/null || echo '❌ Session Provider NON TROUVÉ' > auth_system/providers.tsx

# Auth types
echo "--- types/auth.ts ou types/next-auth.d.ts ---" > auth_system/auth_types.ts
cat ../types/auth.ts > auth_system/auth_types.ts 2>/dev/null || cat ../types/next-auth.d.ts > auth_system/auth_types.ts 2>/dev/null || echo '// Types auth non trouvés' > auth_system/auth_types.ts

# Auth analysis
echo "ANALYSE SYSTÈME AUTHENTIFICATION:" > auth_system/auth_analysis.txt
echo "==================================" >> auth_system/auth_analysis.txt
echo "VÉRIFICATIONS À EFFECTUER:" >> auth_system/auth_analysis.txt
echo "- [ ] NextAuth configuré correctement" >> auth_system/auth_analysis.txt
echo "- [ ] Variables d'env (NEXTAUTH_SECRET, NEXTAUTH_URL)" >> auth_system/auth_analysis.txt
echo "- [ ] Protection routes /dashboard/*" >> auth_system/auth_analysis.txt
echo "- [ ] Redirection après login" >> auth_system/auth_analysis.txt
echo "- [ ] Session handling côté client" >> auth_system/auth_analysis.txt
echo "- [ ] Logout functionality" >> auth_system/auth_analysis.txt
echo "- [ ] Gestion des rôles utilisateurs" >> auth_system/auth_analysis.txt

echo "✅ Système auth exporté dans: auth_system/"

# =============================================================================
# 5. DASHBOARD COMPLET - MODULE PRINCIPAL
# =============================================================================
echo ""
echo "📊 5. DASHBOARD COMPLET - AUDIT MODULE PRINCIPAL"
echo "==============================================="
mkdir -p dashboard_audit

# Dashboard layout
echo "--- app/dashboard/layout.tsx ---" > dashboard_audit/layout.tsx
cat ../app/dashboard/layout.tsx > dashboard_audit/layout.tsx 2>/dev/null || echo '❌ CRITIQUE: Dashboard layout NON TROUVÉ' > dashboard_audit/layout.tsx

# Dashboard main page
echo "--- app/dashboard/page.tsx ---" > dashboard_audit/page.tsx
cat ../app/dashboard/page.tsx > dashboard_audit/page.tsx 2>/dev/null || echo '❌ CRITIQUE: Dashboard page NON TROUVÉE' > dashboard_audit/page.tsx

# Tous les sous-modules dashboard
find ../app/dashboard -name "*.tsx" -o -name "*.ts" 2>/dev/null | while read dashfile; do
    rel_path=${dashfile#../app/dashboard/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g')
    echo "--- app/dashboard/$rel_path ---" > "dashboard_audit/dash_$safe_name"
    cat "$dashfile" >> "dashboard_audit/dash_$safe_name" 2>/dev/null
done

# Dashboard components
if [ -d "../components/dashboard" ]; then
    find ../components/dashboard -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/dashboard/$comp_name.tsx ---" > "dashboard_audit/comp_$comp_name.tsx"
        cat "$comp" >> "dashboard_audit/comp_$comp_name.tsx"
    done
fi

# Dashboard analysis
echo "AUDIT DASHBOARD - TESTS À EFFECTUER:" > dashboard_audit/dashboard_tests.txt
echo "====================================" >> dashboard_audit/dashboard_tests.txt
echo "FONCTIONNALITÉS À TESTER:" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Page dashboard se charge sans erreur" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Stats cards affichent des données réelles" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Graphiques se génèrent correctement" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Navigation vers autres modules fonctionne" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Quick actions sont opérationnelles" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Feed d'activité se met à jour" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Notifications badges sont corrects" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Responsive design mobile/tablet" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Performance de chargement < 3s" >> dashboard_audit/dashboard_tests.txt

echo "✅ Dashboard audit exporté dans: dashboard_audit/"

# =============================================================================
# 6. MODULE CHANTIERS COMPLET - RÉFÉRENCE CRUD
# =============================================================================
echo ""
echo "🏗️ 6. MODULE CHANTIERS - AUDIT CRUD COMPLET"
echo "==========================================="
mkdir -p chantiers_audit

# Pages principales
echo "--- app/dashboard/chantiers/page.tsx ---" > chantiers_audit/main_page.tsx
cat ../app/dashboard/chantiers/page.tsx > chantiers_audit/main_page.tsx 2>/dev/null || echo '❌ Page liste chantiers NON TROUVÉE' > chantiers_audit/main_page.tsx

echo "--- app/dashboard/chantiers/[id]/page.tsx ---" > chantiers_audit/detail_page.tsx
cat ../app/dashboard/chantiers/\[id\]/page.tsx > chantiers_audit/detail_page.tsx 2>/dev/null || echo '❌ Page détail chantier NON TROUVÉE' > chantiers_audit/detail_page.tsx

echo "--- app/dashboard/chantiers/nouveau/page.tsx ---" > chantiers_audit/nouveau_page.tsx
cat ../app/dashboard/chantiers/nouveau/page.tsx > chantiers_audit/nouveau_page.tsx 2>/dev/null || echo '❌ Page nouveau chantier NON TROUVÉE' > chantiers_audit/nouveau_page.tsx

# Layout chantiers
echo "--- app/dashboard/chantiers/layout.tsx ---" > chantiers_audit/layout.tsx
cat ../app/dashboard/chantiers/layout.tsx > chantiers_audit/layout.tsx 2>/dev/null || echo '// Layout chantiers non trouvé' > chantiers_audit/layout.tsx

# APIs Chantiers
echo "--- app/api/chantiers/route.ts ---" > chantiers_audit/api_main.ts
cat ../app/api/chantiers/route.ts > chantiers_audit/api_main.ts 2>/dev/null || echo '❌ CRITIQUE: API chantiers principale NON TROUVÉE' > chantiers_audit/api_main.ts

echo "--- app/api/chantiers/[id]/route.ts ---" > chantiers_audit/api_detail.ts
cat ../app/api/chantiers/\[id\]/route.ts > chantiers_audit/api_detail.ts 2>/dev/null || echo '❌ API chantier détail NON TROUVÉE' > chantiers_audit/api_detail.ts

# Toutes les autres APIs chantiers
find ../app/api -path "*/chantiers/*" -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    echo "--- $api_file ---" > "chantiers_audit/api_$safe_name.ts"
    cat "$api_file" >> "chantiers_audit/api_$safe_name.ts" 2>/dev/null
done

# Composants chantiers
if [ -d "../components/chantiers" ]; then
    find ../components/chantiers -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/chantiers/$comp_name.tsx ---" > "chantiers_audit/comp_$comp_name.tsx"
        cat "$comp" >> "chantiers_audit/comp_$comp_name.tsx"
    done
fi

# Tests chantiers
echo "AUDIT MODULE CHANTIERS - TESTS CRUD:" > chantiers_audit/chantiers_tests.txt
echo "====================================" >> chantiers_audit/chantiers_tests.txt
echo "TESTS FONCTIONNELS À EFFECTUER:" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "📋 LISTE CHANTIERS (/dashboard/chantiers):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Liste se charge avec données réelles" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Filtres par statut fonctionnent" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Recherche temps réel opérationnelle" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Pagination si nombreux résultats" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Actions rapides (voir, modifier, supprimer)" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "🔍 DÉTAIL CHANTIER (/dashboard/chantiers/[id]):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Page détail se charge correctement" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Tabs navigation fonctionne" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Informations complètes affichées" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Timeline événements se charge" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Photos/documents s'affichent" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Modification en place possible" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "➕ NOUVEAU CHANTIER (/dashboard/chantiers/nouveau):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Formulaire multi-étapes fonctionne" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Validation des champs obligatoires" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Upload photos simulé opérationnel" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Soumission et redirection après création" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Gestion d'erreurs si échec" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "🔄 APIs CHANTIERS:" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] GET /api/chantiers (liste)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] POST /api/chantiers (création)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] GET /api/chantiers/[id] (détail)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] PUT /api/chantiers/[id] (modification)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] DELETE /api/chantiers/[id] (suppression)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Codes retour HTTP corrects (200, 400, 404, 500)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Validation données entrantes" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Protection auth sur toutes routes" >> chantiers_audit/chantiers_tests.txt

echo "✅ Chantiers audit exporté dans: chantiers_audit/"

# =============================================================================
# 7. MODULE MESSAGES - ÉTAT ACTUEL ET AUDIT
# =============================================================================
echo ""
echo "💬 7. MODULE MESSAGES - AUDIT COMPLET ÉTAT ACTUEL"
echo "================================================"
mkdir -p messages_audit

# Pages messages existantes
echo "--- app/dashboard/messages/page.tsx ---" > messages_audit/main_page.tsx
cat ../app/dashboard/messages/page.tsx > messages_audit/main_page.tsx 2>/dev/null || echo '❌ CRITIQUE: Page messages principale NON TROUVÉE - À CRÉER' > messages_audit/main_page.tsx

echo "--- app/dashboard/messages/layout.tsx ---" > messages_audit/layout.tsx
cat ../app/dashboard/messages/layout.tsx > messages_audit/layout.tsx 2>/dev/null || echo '// Layout messages non trouvé - À créer' > messages_audit/layout.tsx

echo "--- app/dashboard/messages/nouveau/page.tsx ---" > messages_audit/nouveau_page.tsx
cat ../app/dashboard/messages/nouveau/page.tsx > messages_audit/nouveau_page.tsx 2>/dev/null || echo '❌ Page nouveau message NON TROUVÉE - À CRÉER' > messages_audit/nouveau_page.tsx

echo "--- app/dashboard/messages/recherche/page.tsx ---" > messages_audit/recherche_page.tsx
cat ../app/dashboard/messages/recherche/page.tsx > messages_audit/recherche_page.tsx 2>/dev/null || echo '❌ Page recherche messages NON TROUVÉE - À CRÉER' > messages_audit/recherche_page.tsx

# Toutes les autres pages messages
find ../app/dashboard/messages -name "*.tsx" -o -name "*.ts" 2>/dev/null | while read msgfile; do
    rel_path=${msgfile#../app/dashboard/messages/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g')
    echo "--- app/dashboard/messages/$rel_path ---" > "messages_audit/page_$safe_name"
    cat "$msgfile" >> "messages_audit/page_$safe_name" 2>/dev/null
done

# APIs Messages
echo "--- app/api/messages/route.ts ---" > messages_audit/api_main.ts
cat ../app/api/messages/route.ts > messages_audit/api_main.ts 2>/dev/null || echo '❌ CRITIQUE: API messages principale NON TROUVÉE - À CRÉER' > messages_audit/api_main.ts

echo "--- app/api/messages/contacts/route.ts ---" > messages_audit/api_contacts.ts
cat ../app/api/messages/contacts/route.ts > messages_audit/api_contacts.ts 2>/dev/null || echo '❌ API contacts NON TROUVÉE - À CRÉER' > messages_audit/api_contacts.ts

echo "--- app/api/messages/search/route.ts ---" > messages_audit/api_search.ts
cat ../app/api/messages/search/route.ts > messages_audit/api_search.ts 2>/dev/null || echo '❌ API search NON TROUVÉE - À CRÉER' > messages_audit/api_search.ts

# Toutes les autres APIs messages
find ../app/api/messages -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/messages/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    if [[ "$safe_name" != "" && "$safe_name" != "route" ]]; then
        echo "--- $api_file ---" > "messages_audit/api_$safe_name.ts"
        cat "$api_file" >> "messages_audit/api_$safe_name.ts" 2>/dev/null
    fi
done

# Composants messages
if [ -d "../components/messages" ]; then
    find ../components/messages -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/messages/$comp_name.tsx ---" > "messages_audit/comp_$comp_name.tsx"
        cat "$comp" >> "messages_audit/comp_$comp_name.tsx"
    done
else
    echo '❌ CRITIQUE: Dossier components/messages NON TROUVÉ' > messages_audit/comp_MANQUANT.txt
    echo 'Composants critiques à créer:' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageBubble.tsx (affichage messages)' >> messages_audit/comp_MANQUANT.txt
    echo '- ConversationList.tsx (liste conversations)' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageInput.tsx (saisie nouveau message)' >> messages_audit/comp_MANQUANT.txt
    echo '- NewMessageModal.tsx (modal nouveau message)' >> messages_audit/comp_MANQUANT.txt
    echo '- ContactSelector.tsx (sélection destinataires)' >> messages_audit/comp_MANQUANT.txt
    echo '- MediaViewer.tsx (visualisation médias)' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageActions.tsx (actions sur messages)' >> messages_audit/comp_MANQUANT.txt
    echo '- UserAvatar.tsx (avatar utilisateur)' >> messages_audit/comp_MANQUANT.txt
fi

# Hook useMessages
echo "--- hooks/useMessages.ts ---" > messages_audit/hook_useMessages.ts
cat ../hooks/useMessages.ts > messages_audit/hook_useMessages.ts 2>/dev/null || echo '❌ CRITIQUE: hooks/useMessages.ts NON TROUVÉ - PRIORITÉ ABSOLUE' > messages_audit/hook_useMessages.ts

# Tests messages complets
echo "AUDIT MODULE MESSAGES - TESTS FONCTIONNELS COMPLETS:" > messages_audit/messages_tests.txt
echo "====================================================" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔥 TESTS CRITIQUES (BLOQUANTS SI KO):" >> messages_audit/messages_tests.txt
echo "======================================" >> messages_audit/messages_tests.txt
echo "- [ ] hooks/useMessages.ts existe et fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] API /api/messages répond correctement" >> messages_audit/messages_tests.txt
echo "- [ ] Page /dashboard/messages se charge" >> messages_audit/messages_tests.txt
echo "- [ ] Envoi d'un message de base fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Affichage liste conversations opérationnel" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "💬 INTERFACE MESSAGES (/dashboard/messages):" >> messages_audit/messages_tests.txt
echo "============================================" >> messages_audit/messages_tests.txt
echo "- [ ] Interface principale se charge sans erreur" >> messages_audit/messages_tests.txt
echo "- [ ] Sidebar conversations s'affiche" >> messages_audit/messages_tests.txt
echo "- [ ] Sélection conversation charge messages" >> messages_audit/messages_tests.txt
echo "- [ ] Zone de saisie nouveau message visible" >> messages_audit/messages_tests.txt
echo "- [ ] Envoi message temps réel fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Messages s'affichent dans l'ordre chronologique" >> messages_audit/messages_tests.txt
echo "- [ ] Scroll automatique vers dernier message" >> messages_audit/messages_tests.txt
echo "- [ ] Statuts messages (envoyé/lu) corrects" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "📝 NOUVEAU MESSAGE (/dashboard/messages/nouveau):" >> messages_audit/messages_tests.txt
echo "================================================" >> messages_audit/messages_tests.txt
echo "- [ ] Modal nouveau message s'ouvre/ferme" >> messages_audit/messages_tests.txt
echo "- [ ] 3 onglets (Direct/Chantier/Groupe) fonctionnent" >> messages_audit/messages_tests.txt
echo "- [ ] Sélection destinataires opérationnelle" >> messages_audit/messages_tests.txt
echo "- [ ] Validation avant envoi fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Page nouveau message alternative accessible" >> messages_audit/messages_tests.txt
echo "- [ ] Étapes de création (si multi-step) naviguent" >> messages_audit/messages_tests.txt
echo "- [ ] Upload fichiers/photos fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Redirection après envoi réussi" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔍 RECHERCHE MESSAGES (/dashboard/messages/recherche):" >> messages_audit/messages_tests.txt
echo "=====================================================" >> messages_audit/messages_tests.txt
echo "- [ ] Interface recherche s'affiche" >> messages_audit/messages_tests.txt
echo "- [ ] Champ recherche réagit à la saisie" >> messages_audit/messages_tests.txt
echo "- [ ] Résultats de recherche s'affichent" >> messages_audit/messages_tests.txt
echo "- [ ] Filtres de recherche fonctionnent" >> messages_audit/messages_tests.txt
echo "- [ ] Navigation vers message exact depuis résultat" >> messages_audit/messages_tests.txt
echo "- [ ] Recherche par date, expéditeur, contenu" >> messages_audit/messages_tests.txt
echo "- [ ] Performance recherche acceptable" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔄 APIs MESSAGES - TESTS TECHNIQUES:" >> messages_audit/messages_tests.txt
echo "===================================" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages (liste conversations)" >> messages_audit/messages_tests.txt
echo "- [ ] POST /api/messages (envoi message)" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages/contacts (liste contacts)" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages/search?q=term (recherche)" >> messages_audit/messages_tests.txt
echo "- [ ] PUT /api/messages/[id] (modification message)" >> messages_audit/messages_tests.txt
echo "- [ ] DELETE /api/messages/[id] (suppression message)" >> messages_audit/messages_tests.txt
echo "- [ ] POST /api/messages/mark-read (marquer lu)" >> messages_audit/messages_tests.txt
echo "- [ ] Authentification sur toutes les routes" >> messages_audit/messages_tests.txt
echo "- [ ] Validation données avec Zod/Joi" >> messages_audit/messages_tests.txt
echo "- [ ] Gestion erreurs robuste (400, 404, 500)" >> messages_audit/messages_tests.txt
echo "- [ ] Rate limiting implémenté" >> messages_audit/messages_tests.txt

echo "✅ Messages audit exporté dans: messages_audit/"

# =============================================================================
# 8. COMPOSANTS UI GLOBAUX - DESIGN SYSTEM
# =============================================================================
echo ""
echo "🎨 8. COMPOSANTS UI & DESIGN SYSTEM"
echo "=================================="
mkdir -p ui_components

# Composants UI de base
ui_base_components=("button" "input" "card" "badge" "avatar" "modal" "dropdown" "toast" "loading" "error")

for comp in "${ui_base_components[@]}"; do
    echo "--- components/ui/$comp.tsx ---" > "ui_components/$comp.tsx"
    cat "../components/ui/$comp.tsx" > "ui_components/$comp.tsx" 2>/dev/null || echo "❌ $comp.tsx NON TROUVÉ - À CRÉER" > "ui_components/$comp.tsx"
done

# Navigation components
echo "--- components/Navigation.tsx ---" > ui_components/Navigation.tsx
cat ../components/Navigation.tsx > ui_components/Navigation.tsx 2>/dev/null || echo '❌ Navigation.tsx NON TROUVÉ' > ui_components/Navigation.tsx

echo "--- components/Sidebar.tsx ---" > ui_components/Sidebar.tsx
cat ../components/Sidebar.tsx > ui_components/Sidebar.tsx 2>/dev/null || echo '❌ Sidebar.tsx NON TROUVÉ' > ui_components/Sidebar.tsx

echo "--- components/Header.tsx ---" > ui_components/Header.tsx
cat ../components/Header.tsx > ui_components/Header.tsx 2>/dev/null || echo '// Header.tsx non trouvé' > ui_components/Header.tsx

# Layout components
echo "--- components/Layout.tsx ---" > ui_components/Layout.tsx
cat ../components/Layout.tsx > ui_components/Layout.tsx 2>/dev/null || echo '// Layout.tsx non trouvé' > ui_components/Layout.tsx

# Form components
form_components=("form" "field" "select" "checkbox" "radio" "textarea" "file-upload")
for form_comp in "${form_components[@]}"; do
    echo "--- components/ui/$form_comp.tsx ---" > "ui_components/form_$form_comp.tsx"
    cat "../components/ui/$form_comp.tsx" > "ui_components/form_$form_comp.tsx" 2>/dev/null || echo "// $form_comp.tsx non trouvé" > "ui_components/form_$form_comp.tsx"
done

# Analyse CSS Design System
echo "ANALYSE DESIGN SYSTEM CSS:" > ui_components/design_system_analysis.txt
echo "===========================" >> ui_components/design_system_analysis.txt
if [ -f "../app/globals.css" ]; then
    echo "=== VARIABLES CSS GLOBALES ===" >> ui_components/design_system_analysis.txt
    grep -n ":" ../app/globals.css | head -50 >> ui_components/design_system_analysis.txt
    echo "" >> ui_components/design_system_analysis.txt
    echo "=== CLASSES UTILITAIRES DÉTECTÉES ===" >> ui_components/design_system_analysis.txt
    grep -E "\.(glass|card|btn-|gradient)" ../app/globals.css >> ui_components/design_system_analysis.txt 2>/dev/null
else
    echo "❌ CRITIQUE: globals.css non trouvé - Design system manquant" >> ui_components/design_system_analysis.txt
fi

# Tests UI Components
echo "TESTS COMPOSANTS UI - DESIGN SYSTEM:" > ui_components/ui_tests.txt
echo "====================================" >> ui_components/ui_tests.txt
echo "🎨 COHÉRENCE DESIGN:" >> ui_components/ui_tests.txt
echo "- [ ] CSS vanilla cohérent partout (pas de Tailwind mélangé)" >> ui_components/ui_tests.txt
echo "- [ ] Classes réutilisées (.glass, .card, .btn-primary)" >> ui_components/ui_tests.txt
echo "- [ ] Gradients bleu/orange respectés (#3b82f6 → #f97316)" >> ui_components/ui_tests.txt
echo "- [ ] Typography Inter utilisée partout" >> ui_components/ui_tests.txt
echo "- [ ] Animations fluides (0.3s ease)" >> ui_components/ui_tests.txt
echo "- [ ] Hover effects cohérents" >> ui_components/ui_tests.txt
echo "- [ ] Variables CSS globales utilisées" >> ui_components/ui_tests.txt
echo "" >> ui_components/ui_tests.txt
echo "📱 RESPONSIVE DESIGN:" >> ui_components/ui_tests.txt
echo "- [ ] Desktop (1920x1080, 1366x768)" >> ui_components/ui_tests.txt
echo "- [ ] Tablet (768x1024, iPad)" >> ui_components/ui_tests.txt
echo "- [ ] Mobile (375x667, 414x896)" >> ui_components/ui_tests.txt
echo "- [ ] Navigation mobile (hamburger si existe)" >> ui_components/ui_tests.txt
echo "- [ ] Formulaires utilisables sur mobile" >> ui_components/ui_tests.txt
echo "- [ ] Texte lisible toutes tailles" >> ui_components/ui_tests.txt
echo "- [ ] Touch targets > 44px mobile" >> ui_components/ui_tests.txt
echo "" >> ui_components/ui_tests.txt
echo "♿ ACCESSIBILITÉ:" >> ui_components/ui_tests.txt
echo "- [ ] Navigation clavier (Tab, Enter, Escape)" >> ui_components/ui_tests.txt
echo "- [ ] Focus visible éléments interactifs" >> ui_components/ui_tests.txt
echo "- [ ] Contrast ratio suffisant (4.5:1 min)" >> ui_components/ui_tests.txt
echo "- [ ] Alt texts sur images" >> ui_components/ui_tests.txt
echo "- [ ] Labels sur formulaires" >> ui_components/ui_tests.txt
echo "- [ ] ARIA attributes si nécessaire" >> ui_components/ui_tests.txt
echo "- [ ] Pas de clignotements rapides" >> ui_components/ui_tests.txt

echo "✅ UI Components audit exporté dans: ui_components/"

# =============================================================================
# 9. TYPES & VALIDATIONS - SÉCURITÉ
# =============================================================================
echo ""
echo "📝 9. TYPES & VALIDATIONS - AUDIT SÉCURITÉ"
echo "=========================================="
mkdir -p types_security

# Types principaux
echo "--- types/index.ts ---" > types_security/index.ts
cat ../types/index.ts > types_security/index.ts 2>/dev/null || echo '❌ types/index.ts NON TROUVÉ - À CRÉER' > types_security/index.ts

echo "--- types/messages.ts ---" > types_security/messages.ts
cat ../types/messages.ts > types_security/messages.ts 2>/dev/null || echo '❌ CRITIQUE: types/messages.ts NON TROUVÉ - À CRÉER' > types_security/messages.ts

echo "--- types/chantiers.ts ---" > types_security/chantiers.ts
cat ../types/chantiers.ts > types_security/chantiers.ts 2>/dev/null || echo '// types/chantiers.ts non trouvé' > types_security/chantiers.ts

echo "--- types/auth.ts ---" > types_security/auth.ts
cat ../types/auth.ts > types_security/auth.ts 2>/dev/null || echo '// types/auth.ts non trouvé' > types_security/auth.ts

# Next-auth types
echo "--- types/next-auth.d.ts ---" > types_security/next-auth.d.ts
cat ../types/next-auth.d.ts > types_security/next-auth.d.ts 2>/dev/null || echo '// next-auth.d.ts non trouvé' > types_security/next-auth.d.ts

# Validations Zod/Joi
echo "--- lib/validations.ts ---" > types_security/validations.ts
cat ../lib/validations.ts > types_security/validations.ts 2>/dev/null || echo '❌ CRITIQUE: lib/validations.ts NON TROUVÉ - SÉCURITÉ' > types_security/validations.ts

echo "--- lib/schemas.ts ---" > types_security/schemas.ts
cat ../lib/schemas.ts > types_security/schemas.ts 2>/dev/null || echo '// lib/schemas.ts non trouvé' > types_security/schemas.ts

# Utilitaires
echo "--- lib/utils.ts ---" > types_security/utils.ts
cat ../lib/utils.ts > types_security/utils.ts 2>/dev/null || echo '// lib/utils.ts non trouvé' > types_security/utils.ts

# Constants
echo "--- lib/constants.ts ---" > types_security/constants.ts
cat ../lib/constants.ts > types_security/constants.ts 2>/dev/null || echo '// lib/constants.ts non trouvé' > types_security/constants.ts

# Security analysis
echo "AUDIT SÉCURITÉ - VALIDATIONS & TYPES:" > types_security/security_audit.txt
echo "=====================================" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "🔐 VALIDATION DONNÉES ENTRANTES:" >> types_security/security_audit.txt
echo "================================" >> types_security/security_audit.txt
echo "- [ ] Toutes APIs POST/PUT ont validation Zod/Joi" >> types_security/security_audit.txt
echo "- [ ] Sanitisation XSS sur tous inputs" >> types_security/security_audit.txt
echo "- [ ] Validation taille fichiers upload" >> types_security/security_audit.txt
echo "- [ ] Validation types MIME upload" >> types_security/security_audit.txt
echo "- [ ] Limites longueur champs texte" >> types_security/security_audit.txt
echo "- [ ] Validation formats email, URL, etc." >> types_security/security_audit.txt
echo "- [ ] Échappement SQL injection" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "🛡️ PROTECTION ROUTES:" >> types_security/security_audit.txt
echo "=====================" >> types_security/security_audit.txt
echo "- [ ] Middleware auth sur /dashboard/*" >> types_security/security_audit.txt
echo "- [ ] Vérification rôles utilisateur" >> types_security/security_audit.txt
echo "- [ ] CSRF protection" >> types_security/security_audit.txt
echo "- [ ] Rate limiting APIs" >> types_security/security_audit.txt
echo "- [ ] Headers sécurité (HSTS, X-Frame-Options)" >> types_security/security_audit.txt
echo "- [ ] Validation JWT tokens" >> types_security/security_audit.txt
echo "- [ ] Pas de données sensibles en localStorage" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "📊 TYPES TYPESCRIPT:" >> types_security/security_audit.txt
echo "====================" >> types_security/security_audit.txt
echo "- [ ] Types stricts partout (pas de 'any')" >> types_security/security_audit.txt
echo "- [ ] Interfaces cohérentes frontend/backend" >> types_security/security_audit.txt
echo "- [ ] Types générés depuis Prisma utilisés" >> types_security/security_audit.txt
echo "- [ ] Enums pour valeurs fixes" >> types_security/security_audit.txt
echo "- [ ] Types optionnels/obligatoires corrects" >> types_security/security_audit.txt

echo "✅ Types & Sécurité audit exporté dans: types_security/"

# =============================================================================
# 10. HOOKS PERSONNALISÉS - LOGIQUE MÉTIER
# =============================================================================
echo ""
echo "🎣 10. HOOKS PERSONNALISÉS - AUDIT LOGIQUE MÉTIER"
echo "================================================"
mkdir -p hooks_audit

# Hook useMessages (CRITIQUE)
echo "--- hooks/useMessages.ts ---" > hooks_audit/useMessages.ts
cat ../hooks/useMessages.ts > hooks_audit/useMessages.ts 2>/dev/null || echo '❌ CRITIQUE: hooks/useMessages.ts NON TROUVÉ - PRIORITÉ ABSOLUE' > hooks_audit/useMessages.ts

# Autres hooks existants
if [ -d "../hooks" ]; then
    find ../hooks -name "*.ts" -o -name "*.tsx" | while read hook_file; do
        hook_name=$(basename "$hook_file")
        if [ "$hook_name" != "useMessages.ts" ]; then
            echo "--- hooks/$hook_name ---" > "hooks_audit/$hook_name"
            cat "$hook_file" >> "hooks_audit/$hook_name"
        fi
    done
else
    echo '❌ DOSSIER /hooks NON TROUVÉ - À CRÉER' > hooks_audit/HOOKS_MANQUANTS.txt
    echo 'Hooks critiques à créer:' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useMessages.ts (notifications, polling)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useChantiers.ts (gestion CRUD chantiers)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useAuth.ts (session, rôles)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useApi.ts (requêtes HTTP génériques)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useLocalStorage.ts (persistance locale)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useDebounce.ts (recherche temps réel)' >> hooks_audit/HOOKS_MANQUANTS.txt
fi

# Custom hooks communes qu'on peut chercher
common_hooks=("useAuth" "useApi" "useLocalStorage" "useDebounce" "useChantiers" "useNotifications" "useUpload" "useSearch")

for hook in "${common_hooks[@]}"; do
    echo "--- hooks/$hook.ts ---" > "hooks_audit/$hook.ts"
    cat "../hooks/$hook.ts" > "hooks_audit/$hook.ts" 2>/dev/null || echo "// $hook.ts non trouvé - Peut être utile" > "hooks_audit/$hook.ts"
done

# Tests hooks
echo "AUDIT HOOKS PERSONNALISÉS:" > hooks_audit/hooks_tests.txt
echo "===========================" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "🎣 useMessages (CRITIQUE):" >> hooks_audit/hooks_tests.txt
echo "==========================" >> hooks_audit/hooks_tests.txt
echo "- [ ] Hook existe et est importable" >> hooks_audit/hooks_tests.txt
echo "- [ ] Polling conversations toutes les 30s" >> hooks_audit/hooks_tests.txt
echo "- [ ] État conversations synchronisé" >> hooks_audit/hooks_tests.txt
echo "- [ ] sendMessage fonctionne" >> hooks_audit/hooks_tests.txt
echo "- [ ] Gestion loading/error states" >> hooks_audit/hooks_tests.txt
echo "- [ ] Optimistic updates" >> hooks_audit/hooks_tests.txt
echo "- [ ] Cleanup intervals sur unmount" >> hooks_audit/hooks_tests.txt
echo "- [ ] Types TypeScript corrects" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "🏗️ AUTRES HOOKS MÉTIER:" >> hooks_audit/hooks_tests.txt
echo "========================" >> hooks_audit/hooks_tests.txt
echo "- [ ] useChantiers: CRUD, filtres, recherche" >> hooks_audit/hooks_tests.txt
echo "- [ ] useAuth: session, login/logout, rôles" >> hooks_audit/hooks_tests.txt
echo "- [ ] useApi: requêtes HTTP, cache, error handling" >> hooks_audit/hooks_tests.txt
echo "- [ ] useDebounce: recherche temps réel optimisée" >> hooks_audit/hooks_tests.txt
echo "- [ ] useNotifications: toasts, badges count" >> hooks_audit/hooks_tests.txt
echo "- [ ] useUpload: gestion fichiers, progress" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "⚡ PERFORMANCE HOOKS:" >> hooks_audit/hooks_tests.txt
echo "====================" >> hooks_audit/hooks_tests.txt
echo "- [ ] Pas de re-renders inutiles" >> hooks_audit/hooks_tests.txt
echo "- [ ] useCallback/useMemo utilisés à bon escient" >> hooks_audit/hooks_tests.txt
echo "- [ ] Cleanup effects (intervals, listeners)" >> hooks_audit/hooks_tests.txt
echo "- [ ] Dependencies arrays correctes" >> hooks_audit/hooks_tests.txt
echo "- [ ] Pas de memory leaks" >> hooks_audit/hooks_tests.txt

echo "✅ Hooks audit exporté dans: hooks_audit/"

# =============================================================================
# 11. ANALYSE COMPLÈTE APIs REST
# =============================================================================
echo ""
echo "🔄 11. ANALYSE COMPLÈTE APIs REST"
echo "================================"
mkdir -p apis_audit

# Trouver TOUTES les APIs
echo "INVENTAIRE COMPLET APIs:" > apis_audit/apis_inventory.txt
echo "========================" >> apis_audit/apis_inventory.txt
find ../app/api -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/}
    echo "✅ $rel_path" >> apis_audit/apis_inventory.txt
    
    # Extraire chaque API
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    echo "--- $api_file ---" > "apis_audit/api_$safe_name.ts"
    cat "$api_file" >> "apis_audit/api_$safe_name.ts" 2>/dev/null
done

# Si aucune API trouvée
if [ ! -d "../app/api" ]; then
    echo "❌ CRITIQUE: Dossier /app/api NON TROUVÉ" >> apis_audit/apis_inventory.txt
    echo "APIs critiques manquantes:" >> apis_audit/apis_inventory.txt
    echo "- /api/auth/[...nextauth]/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/chantiers/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/chantiers/[id]/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/contacts/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/search/route.ts" >> apis_audit/apis_inventory.txt
fi

# Tests APIs complets
echo "TESTS APIS REST - AUDIT TECHNIQUE COMPLET:" > apis_audit/apis_tests.txt
echo "===========================================" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🔐 AUTHENTIFICATION API:" >> apis_audit/apis_tests.txt
echo "========================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/auth/[...nextauth] (NextAuth endpoints)" >> apis_audit/apis_tests.txt
echo "- [ ] Session handling correct" >> apis_audit/apis_tests.txt
echo "- [ ] Redirections après login/logout" >> apis_audit/apis_tests.txt
echo "- [ ] CSRF protection active" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🏗️ CHANTIERS API (CRUD COMPLET):" >> apis_audit/apis_tests.txt
echo "==================================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers → 200 (liste avec données)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/chantiers → 201 (création réussie)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers/[id] → 200 (détail)" >> apis_audit/apis_tests.txt
echo "- [ ] PUT /api/chantiers/[id] → 200 (modification)" >> apis_audit/apis_tests.txt
echo "- [ ] DELETE /api/chantiers/[id] → 200 (suppression)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers/inexistant → 404" >> apis_audit/apis_tests.txt
echo "- [ ] POST sans auth → 401" >> apis_audit/apis_tests.txt
echo "- [ ] POST données invalides → 400" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "💬 MESSAGES API (NOUVEAU MODULE):" >> apis_audit/apis_tests.txt
echo "==================================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages → 200 (conversations)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages → 201 (nouveau message)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages/contacts → 200 (liste contacts)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages/search?q=term → 200 (résultats)" >> apis_audit/apis_tests.txt
echo "- [ ] PUT /api/messages/[id] → 200 (modification)" >> apis_audit/apis_tests.txt
echo "- [ ] DELETE /api/messages/[id] → 200 (suppression)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages/mark-read → 200 (marquer lu)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages/files/upload → 201 (upload)" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "⚡ PERFORMANCE & SÉCURITÉ APIs:" >> apis_audit/apis_tests.txt
echo "===============================" >> apis_audit/apis_tests.txt
echo "- [ ] Réponse < 500ms pour requêtes simples" >> apis_audit/apis_tests.txt
echo "- [ ] Pagination sur listes longues" >> apis_audit/apis_tests.txt
echo "- [ ] Rate limiting (100 req/min par user)" >> apis_audit/apis_tests.txt
echo "- [ ] Validation stricte données entrantes" >> apis_audit/apis_tests.txt
echo "- [ ] Logs d'erreurs détaillés" >> apis_audit/apis_tests.txt
echo "- [ ] Headers CORS appropriés" >> apis_audit/apis_tests.txt
echo "- [ ] Gestion erreurs DB (connexion, timeout)" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🧪 TESTS EDGE CASES:" >> apis_audit/apis_tests.txt
echo "====================" >> apis_audit/apis_tests.txt
echo "- [ ] Données null/undefined gérées" >> apis_audit/apis_tests.txt
echo "- [ ] Caractères spéciaux dans requêtes" >> apis_audit/apis_tests.txt
echo "- [ ] Requêtes simultanées multiples" >> apis_audit/apis_tests.txt
echo "- [ ] Timeout réseau simulé" >> apis_audit/apis_tests.txt
echo "- [ ] DB indisponible temporairement" >> apis_audit/apis_tests.txt
echo "- [ ] Payload trop volumineux → 413" >> apis_audit/apis_tests.txt
echo "- [ ] Méthodes HTTP non supportées → 405" >> apis_audit/apis_tests.txt

echo "✅ APIs audit exporté dans: apis_audit/"

# =============================================================================
# 12. TESTS PERFORMANCE COMPLETS
# =============================================================================
echo ""
echo "⚡ 12. AUDIT PERFORMANCE COMPLET"
echo "==============================="
mkdir -p performance_audit

# Analyse bundle et build
echo "PERFORMANCE - CHECKLIST COMPLÈTE:" > performance_audit/performance_tests.txt
echo "=================================" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🚀 CHARGEMENT PAGES (CORE WEB VITALS):" >> performance_audit/performance_tests.txt
echo "======================================" >> performance_audit/performance_tests.txt
echo "- [ ] Page d'accueil < 2s (LCP)" >> performance_audit/performance_tests.txt
echo "- [ ] Dashboard < 3s (avec données)" >> performance_audit/performance_tests.txt
echo "- [ ] Liste chantiers < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] Détail chantier < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] Interface messages < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] First Contentful Paint < 1.5s" >> performance_audit/performance_tests.txt
echo "- [ ] Largest Contentful Paint < 2.5s" >> performance_audit/performance_tests.txt
echoecho "- [ ] Largest Contentful Paint < 2.5s" >> performance_audit/performance_tests.txt
echo "- [ ] Cumulative Layout Shift < 0.1" >> performance_audit/performance_tests.txt
echo "- [ ] First Input Delay < 100ms" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "⚡ INTERACTIONS TEMPS RÉEL:" >> performance_audit/performance_tests.txt
echo "===========================" >> performance_audit/performance_tests.txt
echo "- [ ] Recherche temps réel < 300ms" >> performance_audit/performance_tests.txt
echo "- [ ] Navigation entre pages fluide" >> performance_audit/performance_tests.txt
echo "- [ ] Formulaires répondent instantanément" >> performance_audit/performance_tests.txt
echo "- [ ] Animations fluides 60fps" >> performance_audit/performance_tests.txt
echo "- [ ] Scroll smooth sur longues listes" >> performance_audit/performance_tests.txt
echo "- [ ] Upload fichiers avec progress" >> performance_audit/performance_tests.txt
echo "- [ ] Pas de freeze UI pendant requêtes" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🌐 OPTIMISATIONS RÉSEAU:" >> performance_audit/performance_tests.txt
echo "========================" >> performance_audit/performance_tests.txt
echo "- [ ] Requêtes API optimisées (pas de doublons)" >> performance_audit/performance_tests.txt
echo "- [ ] Images optimisées Next.js" >> performance_audit/performance_tests.txt
echo "- [ ] Compression gzip activée" >> performance_audit/performance_tests.txt
echo "- [ ] Cache approprié (headers, SWR)" >> performance_audit/performance_tests.txt
echo "- [ ] Lazy loading images/composants" >> performance_audit/performance_tests.txt
echo "- [ ] Bundle splitting efficace" >> performance_audit/performance_tests.txt
echo "- [ ] Prefetch routes importantes" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🧠 MÉMOIRE & CPU:" >> performance_audit/performance_tests.txt
echo "=================" >> performance_audit/performance_tests.txt
echo "- [ ] Pas de memory leaks" >> performance_audit/performance_tests.txt
echo "- [ ] Event listeners nettoyés" >> performance_audit/performance_tests.txt
echo "- [ ] Intervals/timeouts clearés" >> performance_audit/performance_tests.txt
echo "- [ ] Re-renders React minimisés" >> performance_audit/performance_tests.txt
echo "- [ ] Virtualisation si listes longues (>1000 items)" >> performance_audit/performance_tests.txt
echo "- [ ] Debounce sur recherches" >> performance_audit/performance_tests.txt

# Build analysis
echo "" >> performance_audit/performance_tests.txt
echo "📦 BUILD & BUNDLE ANALYSIS:" >> performance_audit/performance_tests.txt
echo "============================" >> performance_audit/performance_tests.txt
echo "Commandes à exécuter pour audit:" >> performance_audit/performance_tests.txt
echo "npm run build" >> performance_audit/performance_tests.txt
echo "npm run analyze (si script existe)" >> performance_audit/performance_tests.txt
echo "npx @next/bundle-analyzer" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "- [ ] Build sans erreurs TypeScript" >> performance_audit/performance_tests.txt
echo "- [ ] Bundle size total < 500KB" >> performance_audit/performance_tests.txt
echo "- [ ] Chunks optimisés" >> performance_audit/performance_tests.txt
echo "- [ ] Tree shaking efficace" >> performance_audit/performance_tests.txt
echo "- [ ] Code splitting par routes" >> performance_audit/performance_tests.txt
echo "- [ ] Dependencies inutiles supprimées" >> performance_audit/performance_tests.txt

echo "✅ Performance audit exporté dans: performance_audit/"

# =============================================================================
# 13. TESTS MULTI-NAVIGATEURS & DEVICES
# =============================================================================
echo ""
echo "🌐 13. TESTS MULTI-NAVIGATEURS & DEVICES"
echo "========================================"
mkdir -p cross_platform_tests

echo "TESTS CROSS-PLATFORM COMPLETS:" > cross_platform_tests/browser_device_tests.txt
echo "===============================" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "💻 DESKTOP BROWSERS:" >> cross_platform_tests/browser_device_tests.txt
echo "====================" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Chrome (dernière version)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Firefox (dernière version)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Safari (si macOS disponible)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Edge (Windows)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Opera (test optionnel)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "📱 MOBILE BROWSERS:" >> cross_platform_tests/browser_device_tests.txt
echo "===================" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Chrome mobile (Android)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Safari mobile (iOS)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Samsung Internet" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Firefox mobile" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "📐 RÉSOLUTIONS TESTÉES:" >> cross_platform_tests/browser_device_tests.txt
echo "=======================" >> cross_platform_tests/browser_device_tests.txt
echo "Desktop:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1920x1080 (Full HD)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1366x768 (laptop commun)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1440x900 (MacBook)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 2560x1440 (2K)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Tablet:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 768x1024 (iPad portrait)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1024x768 (iPad landscape)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 601x962 (Surface)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Mobile:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 375x667 (iPhone 8)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 414x896 (iPhone 11)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 360x640 (Android commun)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 375x812 (iPhone X)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "🧪 TESTS PAR FONCTIONNALITÉ:" >> cross_platform_tests/browser_device_tests.txt
echo "=============================" >> cross_platform_tests/browser_device_tests.txt
echo "Navigation:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Menu hamburger mobile" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Sidebar responsive" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Tabs navigation touch-friendly" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Formulaires:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Inputs utilisables mobile" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Keyboards virtuels supportés" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Validation temps réel" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Upload fichiers mobile" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Interactions:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Touch gestures (swipe, pinch)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Hover states desktop" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Click/tap targets > 44px" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Scroll momentum mobile" >> cross_platform_tests/browser_device_tests.txt

echo "✅ Cross-platform tests exportés dans: cross_platform_tests/"

# =============================================================================
# 14. VARIABLES D'ENVIRONNEMENT & CONFIGURATION
# =============================================================================
echo ""
echo "⚙️ 14. VARIABLES D'ENVIRONNEMENT & CONFIG"
echo "========================================="
mkdir -p env_config

# Variables d'environnement
echo "ANALYSE VARIABLES ENVIRONNEMENT:" > env_config/env_analysis.txt
echo "================================" >> env_config/env_analysis.txt
echo "" >> env_config/env_analysis.txt

if [ -f "../.env.example" ]; then
    echo "=== .env.example TROUVÉ ===" >> env_config/env_analysis.txt
    cat ../.env.example >> env_config/env_analysis.txt
    echo "" >> env_config/env_analysis.txt
    cp ../.env.example env_config/env.example
elif [ -f "../.env.local" ]; then
    echo "=== .env.local STRUCTURE (masqué) ===" >> env_config/env_analysis.txt
    grep -E "^[A-Z_]+=" ../.env.local | sed 's/=.*/=***MASKED***/' >> env_config/env_analysis.txt 2>/dev/null
else
    echo "⚠️ Aucun fichier .env exemple trouvé" >> env_config/env_analysis.txt
fi

echo "" >> env_config/env_analysis.txt
echo "VARIABLES CRITIQUES À VÉRIFIER:" >> env_config/env_analysis.txt
echo "===============================" >> env_config/env_analysis.txt
echo "- [ ] DATABASE_URL (PostgreSQL)" >> env_config/env_analysis.txt
echo "- [ ] NEXTAUTH_SECRET (sécurité JWT)" >> env_config/env_analysis.txt
echo "- [ ] NEXTAUTH_URL (callbacks auth)" >> env_config/env_analysis.txt
echo "- [ ] NODE_ENV (production/development)" >> env_config/env_analysis.txt
echo "- [ ] UPLOAD_DIR ou CLOUDINARY_URL (fichiers)" >> env_config/env_analysis.txt
echo "- [ ] EMAIL_* (notifications email si implémenté)" >> env_config/env_analysis.txt
echo "- [ ] REDIS_URL (cache si implémenté)" >> env_config/env_analysis.txt

# Configuration files
echo "--- .eslintrc.json ---" > env_config/eslintrc.json
cat ../.eslintrc.json > env_config/eslintrc.json 2>/dev/null || echo '// .eslintrc.json non trouvé' > env_config/eslintrc.json

echo "--- .prettierrc ---" > env_config/prettierrc.json
cat ../.prettierrc* > env_config/prettierrc.json 2>/dev/null || echo '// .prettierrc non trouvé' > env_config/prettierrc.json

echo "--- .gitignore ---" > env_config/gitignore.txt
cat ../.gitignore > env_config/gitignore.txt 2>/dev/null || echo '// .gitignore non trouvé' > env_config/gitignore.txt

# Vercel/deployment config
echo "--- vercel.json ---" > env_config/vercel.json
cat ../vercel.json > env_config/vercel.json 2>/dev/null || echo '// vercel.json non trouvé' > env_config/vercel.json

echo "✅ Env & Config exportés dans: env_config/"

# =============================================================================
# 15. PLAN D'AUDIT MÉTHODIQUE COMPLET
# =============================================================================
echo ""
echo "📋 15. PLAN D'AUDIT MÉTHODIQUE COMPLET"
echo "====================================="

echo "PLAN D'AUDIT CHANTIERPRO - MÉTHODOLOGIE COMPLÈTE" > plan_audit_complet.txt
echo "=================================================" >> plan_audit_complet.txt
echo "Date: $(date)" >> plan_audit_complet.txt
echo "Objectif: AUDIT COMPLET → CORRECTIONS → PRODUCTION READY" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt

echo "🔍 PHASE 1 - AUDIT TECHNIQUE INFRASTRUCTURE (2-3h)" >> plan_audit_complet.txt
echo "===================================================" >> plan_audit_complet.txt
echo "1.1 BUILD & COMPILATION:" >> plan_audit_complet.txt
echo "- [ ] npm install (vérifier dépendances)" >> plan_audit_complet.txt
echo "- [ ] npm run build (compilation production)" >> plan_audit_complet.txt
echo "- [ ] npm run type-check (TypeScript strict)" >> plan_audit_complet.txt
echo "- [ ] npm run lint (ESLint + fix auto)" >> plan_audit_complet.txt
echo "- [ ] Analyser bundle size et optimisations" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "1.2 BASE DE DONNÉES:" >> plan_audit_complet.txt
echo "- [ ] npx prisma validate (schema valide)" >> plan_audit_complet.txt
echo "- [ ] npx prisma generate (client à jour)" >> plan_audit_complet.txt
echo "- [ ] npx prisma db push (sync structure)" >> plan_audit_complet.txt
echo "- [ ] npx prisma studio (explorer données)" >> plan_audit_complet.txt
echo "- [ ] Tester connexions DB + seed data" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "1.3 ENVIRONMENT & CONFIG:" >> plan_audit_complet.txt
echo "- [ ] Variables .env toutes présentes" >> plan_audit_complet.txt
echo "- [ ] NEXTAUTH_SECRET sécurisé" >> plan_audit_complet.txt
echo "- [ ] DATABASE_URL fonctionnelle" >> plan_audit_complet.txt
echo "- [ ] Middleware protection routes" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🧪 PHASE 2 - TESTS APIS REST (3-4h)" >> plan_audit_complet.txt
echo "====================================" >> plan_audit_complet.txt
echo "2.1 AUTHENTIFICATION:" >> plan_audit_complet.txt
echo "- [ ] Login/logout fonctionnels" >> plan_audit_complet.txt
echo "- [ ] Sessions persistantes" >> plan_audit_complet.txt
echo "- [ ] Protection /dashboard/*" >> plan_audit_complet.txt
echo "- [ ] Rôles utilisateurs" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "2.2 CHANTIERS CRUD (référence):" >> plan_audit_complet.txt
echo "- [ ] GET /api/chantiers → 200" >> plan_audit_complet.txt
echo "- [ ] POST /api/chantiers → 201" >> plan_audit_complet.txt
echo "- [ ] GET/PUT/DELETE /api/chantiers/[id]" >> plan_audit_complet.txt
echo "- [ ] Validation données + erreurs HTTP" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "2.3 MESSAGES (nouveau module):" >> plan_audit_complet.txt
echo "- [ ] Toutes routes /api/messages/*" >> plan_audit_complet.txt
echo "- [ ] CRUD complet messages" >> plan_audit_complet.txt
echo "- [ ] Recherche + contacts" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers" >> plan_audit_complet.txt
echo "- [ ] Rate limiting + sécurité" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🎨 PHASE 3 - TESTS UI/UX COMPLETS (4-5h)" >> plan_audit_complet.txt
echo "=========================================" >> plan_audit_complet.txt
echo "3.1 DASHBOARD PRINCIPAL:" >> plan_audit_complet.txt
echo "- [ ] Chargement < 3s avec données réelles" >> plan_audit_complet.txt
echo "- [ ] Stats cards fonctionnelles" >> plan_audit_complet.txt
echo "- [ ] Navigation vers modules" >> plan_audit_complet.txt
echo "- [ ] Quick actions opérationnelles" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "3.2 MODULE CHANTIERS (référence CRUD):" >> plan_audit_complet.txt
echo "- [ ] Liste + filtres + recherche" >> plan_audit_complet.txt
echo "- [ ] Détail chantier complet" >> plan_audit_complet.txt
echo "- [ ] Formulaire création multi-étapes" >> plan_audit_complet.txt
echo "- [ ] Upload photos + timeline" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "3.3 MODULE MESSAGES (focus audit):" >> plan_audit_complet.txt
echo "- [ ] Interface principale chat" >> plan_audit_complet.txt
echo "- [ ] Nouveau message modal + page" >> plan_audit_complet.txt
echo "- [ ] Recherche messages globale" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers + médias viewer" >> plan_audit_complet.txt
echo "- [ ] Notifications temps réel" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "📱 PHASE 4 - RESPONSIVE & CROSS-PLATFORM (2-3h)" >> plan_audit_complet.txt
echo "================================================" >> plan_audit_complet.txt
echo "4.1 DEVICES:" >> plan_audit_complet.txt
echo "- [ ] Desktop (1920x1080, 1366x768)" >> plan_audit_complet.txt
echo "- [ ] Tablet (iPad portrait/landscape)" >> plan_audit_complet.txt
echo "- [ ] Mobile (iPhone, Android diverses tailles)" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "4.2 BROWSERS:" >> plan_audit_complet.txt
echo "- [ ] Chrome, Firefox, Safari, Edge" >> plan_audit_complet.txt
echo "- [ ] Chrome/Safari mobile" >> plan_audit_complet.txt
echo "- [ ] Fonctionnalités touch mobile" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "4.3 DESIGN CONSISTENCY:" >> plan_audit_complet.txt
echo "- [ ] CSS vanilla cohérent (pas Tailwind mélangé)" >> plan_audit_complet.txt
echo "- [ ] Classes .glass, .card, .btn-primary réutilisées" >> plan_audit_complet.txt
echo "- [ ] Gradients bleu/orange respectés" >> plan_audit_complet.txt
echo "- [ ] Typography Inter partout" >> plan_audit_complet.txt
echo "- [ ] Animations 0.3s ease cohérentes" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "⚡ PHASE 5 - PERFORMANCE & SÉCURITÉ (2-3h)" >> plan_audit_complet.txt
echo "===========================================" >> plan_audit_complet.txt
echo "5.1 PERFORMANCE:" >> plan_audit_complet.txt
echo "- [ ] Core Web Vitals (LCP < 2.5s, CLS < 0.1)" >> plan_audit_complet.txt
echo "- [ ] Recherche temps réel < 300ms" >> plan_audit_complet.txt
echo "- [ ] Navigation fluide entre pages" >> plan_audit_complet.txt
echo "- [ ] Memory leaks + cleanup effects" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "5.2 SÉCURITÉ:" >> plan_audit_complet.txt
echo "- [ ] Validation Zod toutes APIs POST/PUT" >> plan_audit_complet.txt
echo "- [ ] XSS prevention sur inputs" >> plan_audit_complet.txt
echo "- [ ] CSRF protection active" >> plan_audit_complet.txt
echo "- [ ] Rate limiting APIs" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers sécurisé" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🧪 PHASE 6 - EDGE CASES & ROBUSTESSE (2h)" >> plan_audit_complet.txt
echo "==========================================" >> plan_audit_complet.txt
echo "6.1 DONNÉES EDGE CASES:" >> plan_audit_complet.txt
echo "- [ ] Données vides/null gérées gracieusement" >> plan_audit_complet.txt
echo "- [ ] Listes vides → empty state approprié" >> plan_audit_complet.txt
echo "- [ ] Caractères spéciaux dans formulaires" >> plan_audit_complet.txt
echo "- [ ] Limites longueur champs respectées" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "6.2 RÉSEAU:" >> plan_audit_complet.txt
echo "- [ ] Connexion lente simulée" >> plan_audit_complet.txt
echo "- [ ] Connexion coupée/restaurée" >> plan_audit_complet.txt
echo "- [ ] Timeout API avec retry" >> plan_audit_complet.txt
echo "- [ ] Mode dégradé fonctionnel" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "📊 PHASE 7 - RAPPORT & CORRECTIONS (1-2h par bug)" >> plan_audit_complet.txt
echo "==================================================" >> plan_audit_complet.txt
echo "7.1 CATÉGORISATION BUGS:" >> plan_audit_complet.txt
echo "🔴 CRITIQUE: App crash, fonctionnalité core cassée" >> plan_audit_complet.txt
echo "🟠 MAJEUR: Fonctionnalité importante ne marche pas" >> plan_audit_complet.txt
echo "🟡 MINEUR: Bug UX, performance, edge case" >> plan_audit_complet.txt
echo "🔵 COSMÉTIQUE: Design inconsistency, typos" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "7.2 PRIORITÉS CORRECTION:" >> plan_audit_complet.txt
echo "- Corriger TOUS les bugs CRITIQUES avant suite" >> plan_audit_complet.txt
echo "- Corriger bugs MAJEURS avant production" >> plan_audit_complet.txt
echo "- Planifier MINEURS + COSMÉTIQUES version suivante" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "7.3 FORMAT RAPPORT BUG:" >> plan_audit_complet.txt
echo "🔴 BUG #XX - [NIVEAU]" >> plan_audit_complet.txt
echo "LOCALISATION: fichier:ligne + URL" >> plan_audit_complet.txt
echo "DESCRIPTION: problème observé" >> plan_audit_complet.txt
echo "REPRODUCTION: étapes 1, 2, 3" >> plan_audit_complet.txt
echo "ERREUR CONSOLE: logs détaillés" >> plan_audit_complet.txt
echo "IMPACT: conséquences utilisateur" >> plan_audit_complet.txt
echo "SOLUTION: correction proposée" >> plan_audit_complet.txt
echo "STATUS: [TROUVÉ/EN COURS/CORRIGÉ]" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🎯 LIVRABLES FINAUX:" >> plan_audit_complet.txt
echo "====================" >> plan_audit_complet.txt
echo "✅ Rapport d'audit complet avec bugs catégorisés" >> plan_audit_complet.txt
echo "🔧 Corrections appliquées (bugs critiques + majeurs)" >> plan_audit_complet.txt
echo "📊 Évaluation globale état application" >> plan_audit_complet.txt
echo "🚀 Roadmap corrections restantes" >> plan_audit_complet.txt
echo "📚 Documentation modifications effectuées" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "TEMPS TOTAL ESTIMÉ: 15-20 heures sur 3-4 jours" >> plan_audit_complet.txt
echo "OBJECTIF: Application 100% fonctionnelle, production-ready" >> plan_audit_complet.txt

echo "✅ Plan d'audit complet exporté dans: plan_audit_complet.txt"

# =============================================================================
# 16. OUTILS D'AUDIT & COMMANDES
# =============================================================================
echo ""
echo "🛠️ 16. OUTILS & COMMANDES D'AUDIT"
echo "================================="
mkdir -p audit_tools

echo "OUTILS & COMMANDES AUDIT CHANTIERPRO" > audit_tools/commands_tools.txt
echo "====================================" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🔧 COMMANDES DE BASE:" >> audit_tools/commands_tools.txt
echo "=====================" >> audit_tools/commands_tools.txt
echo "# Installation et setup" >> audit_tools/commands_tools.txt
echo "npm install" >> audit_tools/commands_tools.txt
echo "npm run dev                    # Serveur développement" >> audit_tools/commands_tools.txt
echo "npm run build                  # Build production" >> audit_tools/commands_tools.txt
echo "npm run start                  # Serveur production" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Base de données Prisma" >> audit_tools/commands_tools.txt
echo "npx prisma generate           # Générer client Prisma" >> audit_tools/commands_tools.txt
echo "npx prisma db push           # Sync schema avec DB" >> audit_tools/commands_tools.txt
echo "npx prisma studio            # Interface graphique DB" >> audit_tools/commands_tools.txt
echo "npx prisma migrate reset     # Reset complet DB" >> audit_tools/commands_tools.txt
echo "npx prisma db seed           # Charger données test" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Qualité code" >> audit_tools/commands_tools.txt
echo "npm run lint                  # ESLint vérification" >> audit_tools/commands_tools.txt
echo "npm run lint:fix             # ESLint auto-fix" >> audit_tools/commands_tools.txt
echo "npm run type-check           # TypeScript vérification" >> audit_tools/commands_tools.txt
echo "npx prettier --write .       # Formatage code" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🌐 TESTS NAVIGATEUR (DevTools F12):" >> audit_tools/commands_tools.txt
echo "====================================" >> audit_tools/commands_tools.txt
echo "Console: Erreurs JavaScript" >> audit_tools/commands_tools.txt
echo "Network: Requêtes API + performance" >> audit_tools/commands_tools.txt
echo "Performance: Core Web Vitals" >> audit_tools/commands_tools.txt
echo "Application: LocalStorage, Session, Cookies" >> audit_tools/commands_tools.txt
echo "Lighthouse: Audit complet performance/SEO/accessibilité" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "📱 MODE RESPONSIVE (DevTools):" >> audit_tools/commands_tools.txt
echo "===============================" >> audit_tools/commands_tools.txt
echo "Ctrl+Shift+M (toggle device mode)" >> audit_tools/commands_tools.txt
echo "Presets: iPhone 12, iPad, Pixel 5" >> audit_tools/commands_tools.txt
echo "Custom: 375x667, 768x1024, 1366x768" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🧪 CURL TESTS APIs:" >> audit_tools/commands_tools.txt
echo "===================" >> audit_tools/commands_tools.txt
echo "# Test authentification" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/auth/session" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Test CRUD chantiers" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/chantiers" >> audit_tools/commands_tools.txt
echo "curl -X POST http://localhost:3000/api/chantiers \\" >> audit_tools/commands_tools.txt
echo "  -H 'Content-Type: application/json' \\" >> audit_tools/commands_tools.txt
echo "  -d '{\"nom\":\"Test Chantier\",\"statut\":\"ACTIF\"}'" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Test messages (nouveau module)" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/messages" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/messages/contacts" >> audit_tools/commands_tools.txt
echo "curl -X GET 'http://localhost:3000/api/messages/search?q=test'" >> audit_tools/commands_tools.txt

# Debug checklist
echo "" >> audit_tools/commands_tools.txt
echo "🐛 DEBUG CHECKLIST:" >> audit_tools/commands_tools.txt
echo "===================" >> audit_tools/commands_tools.txt
echo "- [ ] Console.log outputs pour tracer flux" >> audit_tools/commands_tools.txt
echo "- [ ]#!/bin/bash

# Script d'extraction ChantierPro - AUDIT COMPLET v4.0
# À exécuter depuis la racine du projet ChantierPro
# Optimisé pour fournir TOUS les fichiers nécessaires à l'AUDIT COMPLET

echo "🔍 EXTRACTION CHANTIERPRO v4.0 - AUDIT COMPLET QUALITÉ"
echo "========================================================"
echo "Date: $(date)"
echo "Objectif: Extraire TOUS les fichiers pour AUDIT COMPLET et CORRECTION"
echo ""

# Créer dossier d'extraction avec timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
EXTRACT_DIR="audit_complet_${TIMESTAMP}"
mkdir -p "$EXTRACT_DIR"
cd "$EXTRACT_DIR"

echo "📁 Dossier d'extraction: $EXTRACT_DIR"
echo ""

# =============================================================================
# 1. CONFIGURATION & BUILD VERIFICATION
# =============================================================================
echo "🔧 1. CONFIGURATION & BUILD VERIFICATION"
echo "========================================"
mkdir -p config_build

echo "--- package.json ---" > config_build/package.json
cat ../package.json > config_build/package.json 2>/dev/null || echo '{"error": "package.json NON TROUVÉ"}' > config_build/package.json

echo "--- tsconfig.json ---" > config_build/tsconfig.json
cat ../tsconfig.json > config_build/tsconfig.json 2>/dev/null || echo '{"error": "tsconfig.json NON TROUVÉ"}' > config_build/tsconfig.json

echo "--- next.config.js ---" > config_build/next.config.js
cat ../next.config.* > config_build/next.config.js 2>/dev/null || echo '// next.config NON TROUVÉ' > config_build/next.config.js

echo "--- tailwind.config ---" > config_build/tailwind.config.js
cat ../tailwind.config.* > config_build/tailwind.config.js 2>/dev/null || echo '// tailwind.config NON TROUVÉ - App utilise CSS vanilla' > config_build/tailwind.config.js

# Scripts NPM analysis
echo "ANALYSE SCRIPTS NPM DISPONIBLES:" > config_build/npm_scripts_analysis.txt
echo "================================" >> config_build/npm_scripts_analysis.txt
if [ -f "../package.json" ]; then
    echo "Scripts trouvés dans package.json:" >> config_build/npm_scripts_analysis.txt
    grep -A 20 '"scripts"' ../package.json >> config_build/npm_scripts_analysis.txt 2>/dev/null || echo "Aucun script trouvé" >> config_build/npm_scripts_analysis.txt
else
    echo "❌ package.json non trouvé - CRITIQUE" >> config_build/npm_scripts_analysis.txt
fi

echo "" >> config_build/npm_scripts_analysis.txt
echo "VÉRIFICATIONS BUILD NÉCESSAIRES:" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run build (compilation production)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run type-check (vérification TypeScript)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run lint (vérification ESLint)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run dev (serveur développement)" >> config_build/npm_scripts_analysis.txt

# Dependencies analysis
echo "ANALYSE DÉPENDANCES:" > config_build/dependencies_analysis.txt
echo "===================" >> config_build/dependencies_analysis.txt
if [ -f "../package.json" ]; then
    echo "=== PRODUCTION DEPENDENCIES ===" >> config_build/dependencies_analysis.txt
    grep -A 50 '"dependencies"' ../package.json >> config_build/dependencies_analysis.txt 2>/dev/null
    echo "" >> config_build/dependencies_analysis.txt
    echo "=== DEV DEPENDENCIES ===" >> config_build/dependencies_analysis.txt
    grep -A 30 '"devDependencies"' ../package.json >> config_build/dependencies_analysis.txt 2>/dev/null
fi

echo "✅ Configuration et build exportés dans: config_build/"

# =============================================================================
# 2. PRISMA & BASE DE DONNÉES COMPLÈTE
# =============================================================================
echo ""
echo "🗄️ 2. ANALYSE PRISMA & BASE DE DONNÉES"
echo "======================================"
mkdir -p database_audit

echo "--- prisma/schema.prisma ---" > database_audit/schema.prisma
cat ../prisma/schema.prisma > database_audit/schema.prisma 2>/dev/null || echo '// ❌ CRITIQUE: prisma/schema.prisma NON TROUVÉ' > database_audit/schema.prisma

echo "--- lib/db.ts ou lib/prisma.ts ---" > database_audit/db_client.ts
cat ../lib/db.ts > database_audit/db_client.ts 2>/dev/null || cat ../lib/prisma.ts > database_audit/db_client.ts 2>/dev/null || echo '// ❌ CRITIQUE: Client Prisma NON TROUVÉ' > database_audit/db_client.ts

# Analyse du schema Prisma
echo "ANALYSE SCHEMA PRISMA:" > database_audit/schema_analysis.txt
echo "=====================" >> database_audit/schema_analysis.txt
if [ -f "../prisma/schema.prisma" ]; then
    echo "=== MODELS TROUVÉS ===" >> database_audit/schema_analysis.txt
    grep "^model " ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
    echo "" >> database_audit/schema_analysis.txt
    
    echo "=== ENUMS TROUVÉS ===" >> database_audit/schema_analysis.txt
    grep "^enum " ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
    echo "" >> database_audit/schema_analysis.txt
    
    echo "=== PROVIDER DATABASE ===" >> database_audit/schema_analysis.txt
    grep -A 5 "provider" ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
else
    echo "❌ CRITIQUE: Schema Prisma non trouvé - Impossible de vérifier la DB" >> database_audit/schema_analysis.txt
fi

# Migrations
echo "--- Migrations Info ---" > database_audit/migrations.txt
if [ -d "../prisma/migrations" ]; then
    echo "MIGRATIONS TROUVÉES:" >> database_audit/migrations.txt
    ls -la ../prisma/migrations/ >> database_audit/migrations.txt
    echo "" >> database_audit/migrations.txt
    echo "DERNIÈRE MIGRATION:" >> database_audit/migrations.txt
    find ../prisma/migrations -name "migration.sql" -type f -exec basename "$(dirname {})" \; | tail -1 >> database_audit/migrations.txt
else
    echo "⚠️ Aucune migration trouvée - DB peut être en mode db push" >> database_audit/migrations.txt
fi

# Seed
echo "--- prisma/seed.ts ---" > database_audit/seed.ts
cat ../prisma/seed.ts > database_audit/seed.ts 2>/dev/null || echo '// Seed non trouvé - Données de test à créer' > database_audit/seed.ts

echo "✅ Database audit exporté dans: database_audit/"

# =============================================================================
# 3. ARCHITECTURE COMPLÈTE APP ROUTER NEXT.JS 14
# =============================================================================
echo ""
echo "🏗️ 3. ARCHITECTURE COMPLÈTE NEXT.JS 14"
echo "======================================"
mkdir -p architecture_app

# Layout principal
echo "--- app/layout.tsx ---" > architecture_app/root_layout.tsx
cat ../app/layout.tsx > architecture_app/root_layout.tsx 2>/dev/null || echo '❌ CRITIQUE: app/layout.tsx NON TROUVÉ' > architecture_app/root_layout.tsx

# Page d'accueil
echo "--- app/page.tsx ---" > architecture_app/root_page.tsx
cat ../app/page.tsx > architecture_app/root_page.tsx 2>/dev/null || echo '❌ app/page.tsx NON TROUVÉ' > architecture_app/root_page.tsx

# Global styles
echo "--- app/globals.css ---" > architecture_app/globals.css
cat ../app/globals.css > architecture_app/globals.css 2>/dev/null || echo '❌ CRITIQUE: app/globals.css NON TROUVÉ' > architecture_app/globals.css

# Loading et Error
echo "--- app/loading.tsx ---" > architecture_app/loading.tsx
cat ../app/loading.tsx > architecture_app/loading.tsx 2>/dev/null || echo '// loading.tsx non trouvé - À créer' > architecture_app/loading.tsx

echo "--- app/error.tsx ---" > architecture_app/error.tsx
cat ../app/error.tsx > architecture_app/error.tsx 2>/dev/null || echo '// error.tsx non trouvé - À créer' > architecture_app/error.tsx

echo "--- app/not-found.tsx ---" > architecture_app/not_found.tsx
cat ../app/not-found.tsx > architecture_app/not_found.tsx 2>/dev/null || echo '// not-found.tsx non trouvé - À créer' > architecture_app/not_found.tsx

# Middleware
echo "--- middleware.ts ---" > architecture_app/middleware.ts
cat ../middleware.ts > architecture_app/middleware.ts 2>/dev/null || echo '// middleware.ts non trouvé - Vérifier protection routes' > architecture_app/middleware.ts

# Analysis structure app
echo "ANALYSE STRUCTURE APP ROUTER:" > architecture_app/app_structure.txt
echo "=============================" >> architecture_app/app_structure.txt
if [ -d "../app" ]; then
    find ../app -type f -name "*.tsx" -o -name "*.ts" | head -50 | while read appfile; do
        rel_path=${appfile#../app/}
        echo "✅ $rel_path" >> architecture_app/app_structure.txt
    done
    
    echo "" >> architecture_app/app_structure.txt
    echo "ROUTES DÉTECTÉES:" >> architecture_app/app_structure.txt
    find ../app -name "page.tsx" | sed 's|../app||g' | sed 's|/page.tsx||g' | sed 's|^$|/|g' >> architecture_app/app_structure.txt
else
    echo "❌ CRITIQUE: Dossier /app non trouvé" >> architecture_app/app_structure.txt
fi

echo "✅ Architecture exportée dans: architecture_app/"

# =============================================================================
# 4. SYSTÈME D'AUTHENTIFICATION COMPLET
# =============================================================================
echo ""
echo "🔐 4. SYSTÈME D'AUTHENTIFICATION COMPLET"
echo "======================================="
mkdir -p auth_system

# NextAuth configuration
echo "--- app/api/auth/[...nextauth]/route.ts ---" > auth_system/nextauth_route.ts
cat ../app/api/auth/\[...nextauth\]/route.ts > auth_system/nextauth_route.ts 2>/dev/null || echo '❌ CRITIQUE: NextAuth route NON TROUVÉE' > auth_system/nextauth_route.ts

# Auth configuration lib
echo "--- lib/auth.ts ou lib/authOptions.ts ---" > auth_system/auth_config.ts
cat ../lib/auth.ts > auth_system/auth_config.ts 2>/dev/null || cat ../lib/authOptions.ts > auth_system/auth_config.ts 2>/dev/null || echo '❌ Configuration auth NON TROUVÉE' > auth_system/auth_config.ts

# Auth pages
echo "--- app/auth/login/page.tsx ---" > auth_system/login_page.tsx
cat ../app/auth/login/page.tsx > auth_system/login_page.tsx 2>/dev/null || echo '❌ Page login NON TROUVÉE' > auth_system/login_page.tsx

echo "--- app/auth/register/page.tsx ---" > auth_system/register_page.tsx
cat ../app/auth/register/page.tsx > auth_system/register_page.tsx 2>/dev/null || echo '// Page register non trouvée' > auth_system/register_page.tsx

# Session provider
echo "--- components/providers.tsx ou app/providers.tsx ---" > auth_system/providers.tsx
cat ../components/providers.tsx > auth_system/providers.tsx 2>/dev/null || cat ../app/providers.tsx > auth_system/providers.tsx 2>/dev/null || echo '❌ Session Provider NON TROUVÉ' > auth_system/providers.tsx

# Auth types
echo "--- types/auth.ts ou types/next-auth.d.ts ---" > auth_system/auth_types.ts
cat ../types/auth.ts > auth_system/auth_types.ts 2>/dev/null || cat ../types/next-auth.d.ts > auth_system/auth_types.ts 2>/dev/null || echo '// Types auth non trouvés' > auth_system/auth_types.ts

# Auth analysis
echo "ANALYSE SYSTÈME AUTHENTIFICATION:" > auth_system/auth_analysis.txt
echo "==================================" >> auth_system/auth_analysis.txt
echo "VÉRIFICATIONS À EFFECTUER:" >> auth_system/auth_analysis.txt
echo "- [ ] NextAuth configuré correctement" >> auth_system/auth_analysis.txt
echo "- [ ] Variables d'env (NEXTAUTH_SECRET, NEXTAUTH_URL)" >> auth_system/auth_analysis.txt
echo "- [ ] Protection routes /dashboard/*" >> auth_system/auth_analysis.txt
echo "- [ ] Redirection après login" >> auth_system/auth_analysis.txt
echo "- [ ] Session handling côté client" >> auth_system/auth_analysis.txt
echo "- [ ] Logout functionality" >> auth_system/auth_analysis.txt
echo "- [ ] Gestion des rôles utilisateurs" >> auth_system/auth_analysis.txt

echo "✅ Système auth exporté dans: auth_system/"

# =============================================================================
# 5. DASHBOARD COMPLET - MODULE PRINCIPAL
# =============================================================================
echo ""
echo "📊 5. DASHBOARD COMPLET - AUDIT MODULE PRINCIPAL"
echo "==============================================="
mkdir -p dashboard_audit

# Dashboard layout
echo "--- app/dashboard/layout.tsx ---" > dashboard_audit/layout.tsx
cat ../app/dashboard/layout.tsx > dashboard_audit/layout.tsx 2>/dev/null || echo '❌ CRITIQUE: Dashboard layout NON TROUVÉ' > dashboard_audit/layout.tsx

# Dashboard main page
echo "--- app/dashboard/page.tsx ---" > dashboard_audit/page.tsx
cat ../app/dashboard/page.tsx > dashboard_audit/page.tsx 2>/dev/null || echo '❌ CRITIQUE: Dashboard page NON TROUVÉE' > dashboard_audit/page.tsx

# Tous les sous-modules dashboard
find ../app/dashboard -name "*.tsx" -o -name "*.ts" 2>/dev/null | while read dashfile; do
    rel_path=${dashfile#../app/dashboard/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g')
    echo "--- app/dashboard/$rel_path ---" > "dashboard_audit/dash_$safe_name"
    cat "$dashfile" >> "dashboard_audit/dash_$safe_name" 2>/dev/null
done

# Dashboard components
if [ -d "../components/dashboard" ]; then
    find ../components/dashboard -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/dashboard/$comp_name.tsx ---" > "dashboard_audit/comp_$comp_name.tsx"
        cat "$comp" >> "dashboard_audit/comp_$comp_name.tsx"
    done
fi

# Dashboard analysis
echo "AUDIT DASHBOARD - TESTS À EFFECTUER:" > dashboard_audit/dashboard_tests.txt
echo "====================================" >> dashboard_audit/dashboard_tests.txt
echo "FONCTIONNALITÉS À TESTER:" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Page dashboard se charge sans erreur" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Stats cards affichent des données réelles" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Graphiques se génèrent correctement" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Navigation vers autres modules fonctionne" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Quick actions sont opérationnelles" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Feed d'activité se met à jour" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Notifications badges sont corrects" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Responsive design mobile/tablet" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Performance de chargement < 3s" >> dashboard_audit/dashboard_tests.txt

echo "✅ Dashboard audit exporté dans: dashboard_audit/"

# =============================================================================
# 6. MODULE CHANTIERS COMPLET - RÉFÉRENCE CRUD
# =============================================================================
echo ""
echo "🏗️ 6. MODULE CHANTIERS - AUDIT CRUD COMPLET"
echo "==========================================="
mkdir -p chantiers_audit

# Pages principales
echo "--- app/dashboard/chantiers/page.tsx ---" > chantiers_audit/main_page.tsx
cat ../app/dashboard/chantiers/page.tsx > chantiers_audit/main_page.tsx 2>/dev/null || echo '❌ Page liste chantiers NON TROUVÉE' > chantiers_audit/main_page.tsx

echo "--- app/dashboard/chantiers/[id]/page.tsx ---" > chantiers_audit/detail_page.tsx
cat ../app/dashboard/chantiers/\[id\]/page.tsx > chantiers_audit/detail_page.tsx 2>/dev/null || echo '❌ Page détail chantier NON TROUVÉE' > chantiers_audit/detail_page.tsx

echo "--- app/dashboard/chantiers/nouveau/page.tsx ---" > chantiers_audit/nouveau_page.tsx
cat ../app/dashboard/chantiers/nouveau/page.tsx > chantiers_audit/nouveau_page.tsx 2>/dev/null || echo '❌ Page nouveau chantier NON TROUVÉE' > chantiers_audit/nouveau_page.tsx

# Layout chantiers
echo "--- app/dashboard/chantiers/layout.tsx ---" > chantiers_audit/layout.tsx
cat ../app/dashboard/chantiers/layout.tsx > chantiers_audit/layout.tsx 2>/dev/null || echo '// Layout chantiers non trouvé' > chantiers_audit/layout.tsx

# APIs Chantiers
echo "--- app/api/chantiers/route.ts ---" > chantiers_audit/api_main.ts
cat ../app/api/chantiers/route.ts > chantiers_audit/api_main.ts 2>/dev/null || echo '❌ CRITIQUE: API chantiers principale NON TROUVÉE' > chantiers_audit/api_main.ts

echo "--- app/api/chantiers/[id]/route.ts ---" > chantiers_audit/api_detail.ts
cat ../app/api/chantiers/\[id\]/route.ts > chantiers_audit/api_detail.ts 2>/dev/null || echo '❌ API chantier détail NON TROUVÉE' > chantiers_audit/api_detail.ts

# Toutes les autres APIs chantiers
find ../app/api -path "*/chantiers/*" -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    echo "--- $api_file ---" > "chantiers_audit/api_$safe_name.ts"
    cat "$api_file" >> "chantiers_audit/api_$safe_name.ts" 2>/dev/null
done

# Composants chantiers
if [ -d "../components/chantiers" ]; then
    find ../components/chantiers -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/chantiers/$comp_name.tsx ---" > "chantiers_audit/comp_$comp_name.tsx"
        cat "$comp" >> "chantiers_audit/comp_$comp_name.tsx"
    done
fi

# Tests chantiers
echo "AUDIT MODULE CHANTIERS - TESTS CRUD:" > chantiers_audit/chantiers_tests.txt
echo "====================================" >> chantiers_audit/chantiers_tests.txt
echo "TESTS FONCTIONNELS À EFFECTUER:" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "📋 LISTE CHANTIERS (/dashboard/chantiers):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Liste se charge avec données réelles" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Filtres par statut fonctionnent" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Recherche temps réel opérationnelle" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Pagination si nombreux résultats" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Actions rapides (voir, modifier, supprimer)" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "🔍 DÉTAIL CHANTIER (/dashboard/chantiers/[id]):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Page détail se charge correctement" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Tabs navigation fonctionne" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Informations complètes affichées" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Timeline événements se charge" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Photos/documents s'affichent" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Modification en place possible" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "➕ NOUVEAU CHANTIER (/dashboard/chantiers/nouveau):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Formulaire multi-étapes fonctionne" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Validation des champs obligatoires" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Upload photos simulé opérationnel" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Soumission et redirection après création" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Gestion d'erreurs si échec" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "🔄 APIs CHANTIERS:" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] GET /api/chantiers (liste)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] POST /api/chantiers (création)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] GET /api/chantiers/[id] (détail)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] PUT /api/chantiers/[id] (modification)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] DELETE /api/chantiers/[id] (suppression)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Codes retour HTTP corrects (200, 400, 404, 500)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Validation données entrantes" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Protection auth sur toutes routes" >> chantiers_audit/chantiers_tests.txt

echo "✅ Chantiers audit exporté dans: chantiers_audit/"

# =============================================================================
# 7. MODULE MESSAGES - ÉTAT ACTUEL ET AUDIT
# =============================================================================
echo ""
echo "💬 7. MODULE MESSAGES - AUDIT COMPLET ÉTAT ACTUEL"
echo "================================================"
mkdir -p messages_audit

# Pages messages existantes
echo "--- app/dashboard/messages/page.tsx ---" > messages_audit/main_page.tsx
cat ../app/dashboard/messages/page.tsx > messages_audit/main_page.tsx 2>/dev/null || echo '❌ CRITIQUE: Page messages principale NON TROUVÉE - À CRÉER' > messages_audit/main_page.tsx

echo "--- app/dashboard/messages/layout.tsx ---" > messages_audit/layout.tsx
cat ../app/dashboard/messages/layout.tsx > messages_audit/layout.tsx 2>/dev/null || echo '// Layout messages non trouvé - À créer' > messages_audit/layout.tsx

echo "--- app/dashboard/messages/nouveau/page.tsx ---" > messages_audit/nouveau_page.tsx
cat ../app/dashboard/messages/nouveau/page.tsx > messages_audit/nouveau_page.tsx 2>/dev/null || echo '❌ Page nouveau message NON TROUVÉE - À CRÉER' > messages_audit/nouveau_page.tsx

echo "--- app/dashboard/messages/recherche/page.tsx ---" > messages_audit/recherche_page.tsx
cat ../app/dashboard/messages/recherche/page.tsx > messages_audit/recherche_page.tsx 2>/dev/null || echo '❌ Page recherche messages NON TROUVÉE - À CRÉER' > messages_audit/recherche_page.tsx

# Toutes les autres pages messages
find ../app/dashboard/messages -name "*.tsx" -o -name "*.ts" 2>/dev/null | while read msgfile; do
    rel_path=${msgfile#../app/dashboard/messages/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g')
    echo "--- app/dashboard/messages/$rel_path ---" > "messages_audit/page_$safe_name"
    cat "$msgfile" >> "messages_audit/page_$safe_name" 2>/dev/null
done

# APIs Messages
echo "--- app/api/messages/route.ts ---" > messages_audit/api_main.ts
cat ../app/api/messages/route.ts > messages_audit/api_main.ts 2>/dev/null || echo '❌ CRITIQUE: API messages principale NON TROUVÉE - À CRÉER' > messages_audit/api_main.ts

echo "--- app/api/messages/contacts/route.ts ---" > messages_audit/api_contacts.ts
cat ../app/api/messages/contacts/route.ts > messages_audit/api_contacts.ts 2>/dev/null || echo '❌ API contacts NON TROUVÉE - À CRÉER' > messages_audit/api_contacts.ts

echo "--- app/api/messages/search/route.ts ---" > messages_audit/api_search.ts
cat ../app/api/messages/search/route.ts > messages_audit/api_search.ts 2>/dev/null || echo '❌ API search NON TROUVÉE - À CRÉER' > messages_audit/api_search.ts

# Toutes les autres APIs messages
find ../app/api/messages -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/messages/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    if [[ "$safe_name" != "" && "$safe_name" != "route" ]]; then
        echo "--- $api_file ---" > "messages_audit/api_$safe_name.ts"
        cat "$api_file" >> "messages_audit/api_$safe_name.ts" 2>/dev/null
    fi
done

# Composants messages
if [ -d "../components/messages" ]; then
    find ../components/messages -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/messages/$comp_name.tsx ---" > "messages_audit/comp_$comp_name.tsx"
        cat "$comp" >> "messages_audit/comp_$comp_name.tsx"
    done
else
    echo '❌ CRITIQUE: Dossier components/messages NON TROUVÉ' > messages_audit/comp_MANQUANT.txt
    echo 'Composants critiques à créer:' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageBubble.tsx (affichage messages)' >> messages_audit/comp_MANQUANT.txt
    echo '- ConversationList.tsx (liste conversations)' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageInput.tsx (saisie nouveau message)' >> messages_audit/comp_MANQUANT.txt
    echo '- NewMessageModal.tsx (modal nouveau message)' >> messages_audit/comp_MANQUANT.txt
    echo '- ContactSelector.tsx (sélection destinataires)' >> messages_audit/comp_MANQUANT.txt
    echo '- MediaViewer.tsx (visualisation médias)' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageActions.tsx (actions sur messages)' >> messages_audit/comp_MANQUANT.txt
    echo '- UserAvatar.tsx (avatar utilisateur)' >> messages_audit/comp_MANQUANT.txt
fi

# Hook useMessages
echo "--- hooks/useMessages.ts ---" > messages_audit/hook_useMessages.ts
cat ../hooks/useMessages.ts > messages_audit/hook_useMessages.ts 2>/dev/null || echo '❌ CRITIQUE: hooks/useMessages.ts NON TROUVÉ - PRIORITÉ ABSOLUE' > messages_audit/hook_useMessages.ts

# Tests messages complets
echo "AUDIT MODULE MESSAGES - TESTS FONCTIONNELS COMPLETS:" > messages_audit/messages_tests.txt
echo "====================================================" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔥 TESTS CRITIQUES (BLOQUANTS SI KO):" >> messages_audit/messages_tests.txt
echo "======================================" >> messages_audit/messages_tests.txt
echo "- [ ] hooks/useMessages.ts existe et fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] API /api/messages répond correctement" >> messages_audit/messages_tests.txt
echo "- [ ] Page /dashboard/messages se charge" >> messages_audit/messages_tests.txt
echo "- [ ] Envoi d'un message de base fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Affichage liste conversations opérationnel" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "💬 INTERFACE MESSAGES (/dashboard/messages):" >> messages_audit/messages_tests.txt
echo "============================================" >> messages_audit/messages_tests.txt
echo "- [ ] Interface principale se charge sans erreur" >> messages_audit/messages_tests.txt
echo "- [ ] Sidebar conversations s'affiche" >> messages_audit/messages_tests.txt
echo "- [ ] Sélection conversation charge messages" >> messages_audit/messages_tests.txt
echo "- [ ] Zone de saisie nouveau message visible" >> messages_audit/messages_tests.txt
echo "- [ ] Envoi message temps réel fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Messages s'affichent dans l'ordre chronologique" >> messages_audit/messages_tests.txt
echo "- [ ] Scroll automatique vers dernier message" >> messages_audit/messages_tests.txt
echo "- [ ] Statuts messages (envoyé/lu) corrects" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "📝 NOUVEAU MESSAGE (/dashboard/messages/nouveau):" >> messages_audit/messages_tests.txt
echo "================================================" >> messages_audit/messages_tests.txt
echo "- [ ] Modal nouveau message s'ouvre/ferme" >> messages_audit/messages_tests.txt
echo "- [ ] 3 onglets (Direct/Chantier/Groupe) fonctionnent" >> messages_audit/messages_tests.txt
echo "- [ ] Sélection destinataires opérationnelle" >> messages_audit/messages_tests.txt
echo "- [ ] Validation avant envoi fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Page nouveau message alternative accessible" >> messages_audit/messages_tests.txt
echo "- [ ] Étapes de création (si multi-step) naviguent" >> messages_audit/messages_tests.txt
echo "- [ ] Upload fichiers/photos fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Redirection après envoi réussi" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔍 RECHERCHE MESSAGES (/dashboard/messages/recherche):" >> messages_audit/messages_tests.txt
echo "=====================================================" >> messages_audit/messages_tests.txt
echo "- [ ] Interface recherche s'affiche" >> messages_audit/messages_tests.txt
echo "- [ ] Champ recherche réagit à la saisie" >> messages_audit/messages_tests.txt
echo "- [ ] Résultats de recherche s'affichent" >> messages_audit/messages_tests.txt
echo "- [ ] Filtres de recherche fonctionnent" >> messages_audit/messages_tests.txt
echo "- [ ] Navigation vers message exact depuis résultat" >> messages_audit/messages_tests.txt
echo "- [ ] Recherche par date, expéditeur, contenu" >> messages_audit/messages_tests.txt
echo "- [ ] Performance recherche acceptable" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔄 APIs MESSAGES - TESTS TECHNIQUES:" >> messages_audit/messages_tests.txt
echo "===================================" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages (liste conversations)" >> messages_audit/messages_tests.txt
echo "- [ ] POST /api/messages (envoi message)" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages/contacts (liste contacts)" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages/search?q=term (recherche)" >> messages_audit/messages_tests.txt
echo "- [ ] PUT /api/messages/[id] (modification message)" >> messages_audit/messages_tests.txt
echo "- [ ] DELETE /api/messages/[id] (suppression message)" >> messages_audit/messages_tests.txt
echo "- [ ] POST /api/messages/mark-read (marquer lu)" >> messages_audit/messages_tests.txt
echo "- [ ] Authentification sur toutes les routes" >> messages_audit/messages_tests.txt
echo "- [ ] Validation données avec Zod/Joi" >> messages_audit/messages_tests.txt
echo "- [ ] Gestion erreurs robuste (400, 404, 500)" >> messages_audit/messages_tests.txt
echo "- [ ] Rate limiting implémenté" >> messages_audit/messages_tests.txt

echo "✅ Messages audit exporté dans: messages_audit/"

# =============================================================================
# 8. COMPOSANTS UI GLOBAUX - DESIGN SYSTEM
# =============================================================================
echo ""
echo "🎨 8. COMPOSANTS UI & DESIGN SYSTEM"
echo "=================================="
mkdir -p ui_components

# Composants UI de base
ui_base_components=("button" "input" "card" "badge" "avatar" "modal" "dropdown" "toast" "loading" "error")

for comp in "${ui_base_components[@]}"; do
    echo "--- components/ui/$comp.tsx ---" > "ui_components/$comp.tsx"
    cat "../components/ui/$comp.tsx" > "ui_components/$comp.tsx" 2>/dev/null || echo "❌ $comp.tsx NON TROUVÉ - À CRÉER" > "ui_components/$comp.tsx"
done

# Navigation components
echo "--- components/Navigation.tsx ---" > ui_components/Navigation.tsx
cat ../components/Navigation.tsx > ui_components/Navigation.tsx 2>/dev/null || echo '❌ Navigation.tsx NON TROUVÉ' > ui_components/Navigation.tsx

echo "--- components/Sidebar.tsx ---" > ui_components/Sidebar.tsx
cat ../components/Sidebar.tsx > ui_components/Sidebar.tsx 2>/dev/null || echo '❌ Sidebar.tsx NON TROUVÉ' > ui_components/Sidebar.tsx

echo "--- components/Header.tsx ---" > ui_components/Header.tsx
cat ../components/Header.tsx > ui_components/Header.tsx 2>/dev/null || echo '// Header.tsx non trouvé' > ui_components/Header.tsx

# Layout components
echo "--- components/Layout.tsx ---" > ui_components/Layout.tsx
cat ../components/Layout.tsx > ui_components/Layout.tsx 2>/dev/null || echo '// Layout.tsx non trouvé' > ui_components/Layout.tsx

# Form components
form_components=("form" "field" "select" "checkbox" "radio" "textarea" "file-upload")
for form_comp in "${form_components[@]}"; do
    echo "--- components/ui/$form_comp.tsx ---" > "ui_components/form_$form_comp.tsx"
    cat "../components/ui/$form_comp.tsx" > "ui_components/form_$form_comp.tsx" 2>/dev/null || echo "// $form_comp.tsx non trouvé" > "ui_components/form_$form_comp.tsx"
done

# Analyse CSS Design System
echo "ANALYSE DESIGN SYSTEM CSS:" > ui_components/design_system_analysis.txt
echo "===========================" >> ui_components/design_system_analysis.txt
if [ -f "../app/globals.css" ]; then
    echo "=== VARIABLES CSS GLOBALES ===" >> ui_components/design_system_analysis.txt
    grep -n ":" ../app/globals.css | head -50 >> ui_components/design_system_analysis.txt
    echo "" >> ui_components/design_system_analysis.txt
    echo "=== CLASSES UTILITAIRES DÉTECTÉES ===" >> ui_components/design_system_analysis.txt
    grep -E "\.(glass|card|btn-|gradient)" ../app/globals.css >> ui_components/design_system_analysis.txt 2>/dev/null
else
    echo "❌ CRITIQUE: globals.css non trouvé - Design system manquant" >> ui_components/design_system_analysis.txt
fi

# Tests UI Components
echo "TESTS COMPOSANTS UI - DESIGN SYSTEM:" > ui_components/ui_tests.txt
echo "====================================" >> ui_components/ui_tests.txt
echo "🎨 COHÉRENCE DESIGN:" >> ui_components/ui_tests.txt
echo "- [ ] CSS vanilla cohérent partout (pas de Tailwind mélangé)" >> ui_components/ui_tests.txt
echo "- [ ] Classes réutilisées (.glass, .card, .btn-primary)" >> ui_components/ui_tests.txt
echo "- [ ] Gradients bleu/orange respectés (#3b82f6 → #f97316)" >> ui_components/ui_tests.txt
echo "- [ ] Typography Inter utilisée partout" >> ui_components/ui_tests.txt
echo "- [ ] Animations fluides (0.3s ease)" >> ui_components/ui_tests.txt
echo "- [ ] Hover effects cohérents" >> ui_components/ui_tests.txt
echo "- [ ] Variables CSS globales utilisées" >> ui_components/ui_tests.txt
echo "" >> ui_components/ui_tests.txt
echo "📱 RESPONSIVE DESIGN:" >> ui_components/ui_tests.txt
echo "- [ ] Desktop (1920x1080, 1366x768)" >> ui_components/ui_tests.txt
echo "- [ ] Tablet (768x1024, iPad)" >> ui_components/ui_tests.txt
echo "- [ ] Mobile (375x667, 414x896)" >> ui_components/ui_tests.txt
echo "- [ ] Navigation mobile (hamburger si existe)" >> ui_components/ui_tests.txt
echo "- [ ] Formulaires utilisables sur mobile" >> ui_components/ui_tests.txt
echo "- [ ] Texte lisible toutes tailles" >> ui_components/ui_tests.txt
echo "- [ ] Touch targets > 44px mobile" >> ui_components/ui_tests.txt
echo "" >> ui_components/ui_tests.txt
echo "♿ ACCESSIBILITÉ:" >> ui_components/ui_tests.txt
echo "- [ ] Navigation clavier (Tab, Enter, Escape)" >> ui_components/ui_tests.txt
echo "- [ ] Focus visible éléments interactifs" >> ui_components/ui_tests.txt
echo "- [ ] Contrast ratio suffisant (4.5:1 min)" >> ui_components/ui_tests.txt
echo "- [ ] Alt texts sur images" >> ui_components/ui_tests.txt
echo "- [ ] Labels sur formulaires" >> ui_components/ui_tests.txt
echo "- [ ] ARIA attributes si nécessaire" >> ui_components/ui_tests.txt
echo "- [ ] Pas de clignotements rapides" >> ui_components/ui_tests.txt

echo "✅ UI Components audit exporté dans: ui_components/"

# =============================================================================
# 9. TYPES & VALIDATIONS - SÉCURITÉ
# =============================================================================
echo ""
echo "📝 9. TYPES & VALIDATIONS - AUDIT SÉCURITÉ"
echo "=========================================="
mkdir -p types_security

# Types principaux
echo "--- types/index.ts ---" > types_security/index.ts
cat ../types/index.ts > types_security/index.ts 2>/dev/null || echo '❌ types/index.ts NON TROUVÉ - À CRÉER' > types_security/index.ts

echo "--- types/messages.ts ---" > types_security/messages.ts
cat ../types/messages.ts > types_security/messages.ts 2>/dev/null || echo '❌ CRITIQUE: types/messages.ts NON TROUVÉ - À CRÉER' > types_security/messages.ts

echo "--- types/chantiers.ts ---" > types_security/chantiers.ts
cat ../types/chantiers.ts > types_security/chantiers.ts 2>/dev/null || echo '// types/chantiers.ts non trouvé' > types_security/chantiers.ts

echo "--- types/auth.ts ---" > types_security/auth.ts
cat ../types/auth.ts > types_security/auth.ts 2>/dev/null || echo '// types/auth.ts non trouvé' > types_security/auth.ts

# Next-auth types
echo "--- types/next-auth.d.ts ---" > types_security/next-auth.d.ts
cat ../types/next-auth.d.ts > types_security/next-auth.d.ts 2>/dev/null || echo '// next-auth.d.ts non trouvé' > types_security/next-auth.d.ts

# Validations Zod/Joi
echo "--- lib/validations.ts ---" > types_security/validations.ts
cat ../lib/validations.ts > types_security/validations.ts 2>/dev/null || echo '❌ CRITIQUE: lib/validations.ts NON TROUVÉ - SÉCURITÉ' > types_security/validations.ts

echo "--- lib/schemas.ts ---" > types_security/schemas.ts
cat ../lib/schemas.ts > types_security/schemas.ts 2>/dev/null || echo '// lib/schemas.ts non trouvé' > types_security/schemas.ts

# Utilitaires
echo "--- lib/utils.ts ---" > types_security/utils.ts
cat ../lib/utils.ts > types_security/utils.ts 2>/dev/null || echo '// lib/utils.ts non trouvé' > types_security/utils.ts

# Constants
echo "--- lib/constants.ts ---" > types_security/constants.ts
cat ../lib/constants.ts > types_security/constants.ts 2>/dev/null || echo '// lib/constants.ts non trouvé' > types_security/constants.ts

# Security analysis
echo "AUDIT SÉCURITÉ - VALIDATIONS & TYPES:" > types_security/security_audit.txt
echo "=====================================" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "🔐 VALIDATION DONNÉES ENTRANTES:" >> types_security/security_audit.txt
echo "================================" >> types_security/security_audit.txt
echo "- [ ] Toutes APIs POST/PUT ont validation Zod/Joi" >> types_security/security_audit.txt
echo "- [ ] Sanitisation XSS sur tous inputs" >> types_security/security_audit.txt
echo "- [ ] Validation taille fichiers upload" >> types_security/security_audit.txt
echo "- [ ] Validation types MIME upload" >> types_security/security_audit.txt
echo "- [ ] Limites longueur champs texte" >> types_security/security_audit.txt
echo "- [ ] Validation formats email, URL, etc." >> types_security/security_audit.txt
echo "- [ ] Échappement SQL injection" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "🛡️ PROTECTION ROUTES:" >> types_security/security_audit.txt
echo "=====================" >> types_security/security_audit.txt
echo "- [ ] Middleware auth sur /dashboard/*" >> types_security/security_audit.txt
echo "- [ ] Vérification rôles utilisateur" >> types_security/security_audit.txt
echo "- [ ] CSRF protection" >> types_security/security_audit.txt
echo "- [ ] Rate limiting APIs" >> types_security/security_audit.txt
echo "- [ ] Headers sécurité (HSTS, X-Frame-Options)" >> types_security/security_audit.txt
echo "- [ ] Validation JWT tokens" >> types_security/security_audit.txt
echo "- [ ] Pas de données sensibles en localStorage" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "📊 TYPES TYPESCRIPT:" >> types_security/security_audit.txt
echo "====================" >> types_security/security_audit.txt
echo "- [ ] Types stricts partout (pas de 'any')" >> types_security/security_audit.txt
echo "- [ ] Interfaces cohérentes frontend/backend" >> types_security/security_audit.txt
echo "- [ ] Types générés depuis Prisma utilisés" >> types_security/security_audit.txt
echo "- [ ] Enums pour valeurs fixes" >> types_security/security_audit.txt
echo "- [ ] Types optionnels/obligatoires corrects" >> types_security/security_audit.txt

echo "✅ Types & Sécurité audit exporté dans: types_security/"

# =============================================================================
# 10. HOOKS PERSONNALISÉS - LOGIQUE MÉTIER
# =============================================================================
echo ""
echo "🎣 10. HOOKS PERSONNALISÉS - AUDIT LOGIQUE MÉTIER"
echo "================================================"
mkdir -p hooks_audit

# Hook useMessages (CRITIQUE)
echo "--- hooks/useMessages.ts ---" > hooks_audit/useMessages.ts
cat ../hooks/useMessages.ts > hooks_audit/useMessages.ts 2>/dev/null || echo '❌ CRITIQUE: hooks/useMessages.ts NON TROUVÉ - PRIORITÉ ABSOLUE' > hooks_audit/useMessages.ts

# Autres hooks existants
if [ -d "../hooks" ]; then
    find ../hooks -name "*.ts" -o -name "*.tsx" | while read hook_file; do
        hook_name=$(basename "$hook_file")
        if [ "$hook_name" != "useMessages.ts" ]; then
            echo "--- hooks/$hook_name ---" > "hooks_audit/$hook_name"
            cat "$hook_file" >> "hooks_audit/$hook_name"
        fi
    done
else
    echo '❌ DOSSIER /hooks NON TROUVÉ - À CRÉER' > hooks_audit/HOOKS_MANQUANTS.txt
    echo 'Hooks critiques à créer:' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useMessages.ts (notifications, polling)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useChantiers.ts (gestion CRUD chantiers)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useAuth.ts (session, rôles)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useApi.ts (requêtes HTTP génériques)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useLocalStorage.ts (persistance locale)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useDebounce.ts (recherche temps réel)' >> hooks_audit/HOOKS_MANQUANTS.txt
fi

# Custom hooks communes qu'on peut chercher
common_hooks=("useAuth" "useApi" "useLocalStorage" "useDebounce" "useChantiers" "useNotifications" "useUpload" "useSearch")

for hook in "${common_hooks[@]}"; do
    echo "--- hooks/$hook.ts ---" > "hooks_audit/$hook.ts"
    cat "../hooks/$hook.ts" > "hooks_audit/$hook.ts" 2>/dev/null || echo "// $hook.ts non trouvé - Peut être utile" > "hooks_audit/$hook.ts"
done

# Tests hooks
echo "AUDIT HOOKS PERSONNALISÉS:" > hooks_audit/hooks_tests.txt
echo "===========================" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "🎣 useMessages (CRITIQUE):" >> hooks_audit/hooks_tests.txt
echo "==========================" >> hooks_audit/hooks_tests.txt
echo "- [ ] Hook existe et est importable" >> hooks_audit/hooks_tests.txt
echo "- [ ] Polling conversations toutes les 30s" >> hooks_audit/hooks_tests.txt
echo "- [ ] État conversations synchronisé" >> hooks_audit/hooks_tests.txt
echo "- [ ] sendMessage fonctionne" >> hooks_audit/hooks_tests.txt
echo "- [ ] Gestion loading/error states" >> hooks_audit/hooks_tests.txt
echo "- [ ] Optimistic updates" >> hooks_audit/hooks_tests.txt
echo "- [ ] Cleanup intervals sur unmount" >> hooks_audit/hooks_tests.txt
echo "- [ ] Types TypeScript corrects" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "🏗️ AUTRES HOOKS MÉTIER:" >> hooks_audit/hooks_tests.txt
echo "========================" >> hooks_audit/hooks_tests.txt
echo "- [ ] useChantiers: CRUD, filtres, recherche" >> hooks_audit/hooks_tests.txt
echo "- [ ] useAuth: session, login/logout, rôles" >> hooks_audit/hooks_tests.txt
echo "- [ ] useApi: requêtes HTTP, cache, error handling" >> hooks_audit/hooks_tests.txt
echo "- [ ] useDebounce: recherche temps réel optimisée" >> hooks_audit/hooks_tests.txt
echo "- [ ] useNotifications: toasts, badges count" >> hooks_audit/hooks_tests.txt
echo "- [ ] useUpload: gestion fichiers, progress" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "⚡ PERFORMANCE HOOKS:" >> hooks_audit/hooks_tests.txt
echo "====================" >> hooks_audit/hooks_tests.txt
echo "- [ ] Pas de re-renders inutiles" >> hooks_audit/hooks_tests.txt
echo "- [ ] useCallback/useMemo utilisés à bon escient" >> hooks_audit/hooks_tests.txt
echo "- [ ] Cleanup effects (intervals, listeners)" >> hooks_audit/hooks_tests.txt
echo "- [ ] Dependencies arrays correctes" >> hooks_audit/hooks_tests.txt
echo "- [ ] Pas de memory leaks" >> hooks_audit/hooks_tests.txt

echo "✅ Hooks audit exporté dans: hooks_audit/"

# =============================================================================
# 11. ANALYSE COMPLÈTE APIs REST
# =============================================================================
echo ""
echo "🔄 11. ANALYSE COMPLÈTE APIs REST"
echo "================================"
mkdir -p apis_audit

# Trouver TOUTES les APIs
echo "INVENTAIRE COMPLET APIs:" > apis_audit/apis_inventory.txt
echo "========================" >> apis_audit/apis_inventory.txt
find ../app/api -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/}
    echo "✅ $rel_path" >> apis_audit/apis_inventory.txt
    
    # Extraire chaque API
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    echo "--- $api_file ---" > "apis_audit/api_$safe_name.ts"
    cat "$api_file" >> "apis_audit/api_$safe_name.ts" 2>/dev/null
done

# Si aucune API trouvée
if [ ! -d "../app/api" ]; then
    echo "❌ CRITIQUE: Dossier /app/api NON TROUVÉ" >> apis_audit/apis_inventory.txt
    echo "APIs critiques manquantes:" >> apis_audit/apis_inventory.txt
    echo "- /api/auth/[...nextauth]/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/chantiers/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/chantiers/[id]/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/contacts/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/search/route.ts" >> apis_audit/apis_inventory.txt
fi

# Tests APIs complets
echo "TESTS APIS REST - AUDIT TECHNIQUE COMPLET:" > apis_audit/apis_tests.txt
echo "===========================================" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🔐 AUTHENTIFICATION API:" >> apis_audit/apis_tests.txt
echo "========================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/auth/[...nextauth] (NextAuth endpoints)" >> apis_audit/apis_tests.txt
echo "- [ ] Session handling correct" >> apis_audit/apis_tests.txt
echo "- [ ] Redirections après login/logout" >> apis_audit/apis_tests.txt
echo "- [ ] CSRF protection active" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🏗️ CHANTIERS API (CRUD COMPLET):" >> apis_audit/apis_tests.txt
echo "==================================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers → 200 (liste avec données)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/chantiers → 201 (création réussie)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers/[id] → 200 (détail)" >> apis_audit/apis_tests.txt
echo "- [ ] PUT /api/chantiers/[id] → 200 (modification)" >> apis_audit/apis_tests.txt
echo "- [ ] DELETE /api/chantiers/[id] → 200 (suppression)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers/inexistant → 404" >> apis_audit/apis_tests.txt
echo "- [ ] POST sans auth → 401" >> apis_audit/apis_tests.txt
echo "- [ ] POST données invalides → 400" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "💬 MESSAGES API (NOUVEAU MODULE):" >> apis_audit/apis_tests.txt
echo "==================================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages → 200 (conversations)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages → 201 (nouveau message)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages/contacts → 200 (liste contacts)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages/search?q=term → 200 (résultats)" >> apis_audit/apis_tests.txt
echo "- [ ] PUT /api/messages/[id] → 200 (modification)" >> apis_audit/apis_tests.txt
echo "- [ ] DELETE /api/messages/[id] → 200 (suppression)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages/mark-read → 200 (marquer lu)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages/files/upload → 201 (upload)" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "⚡ PERFORMANCE & SÉCURITÉ APIs:" >> apis_audit/apis_tests.txt
echo "===============================" >> apis_audit/apis_tests.txt
echo "- [ ] Réponse < 500ms pour requêtes simples" >> apis_audit/apis_tests.txt
echo "- [ ] Pagination sur listes longues" >> apis_audit/apis_tests.txt
echo "- [ ] Rate limiting (100 req/min par user)" >> apis_audit/apis_tests.txt
echo "- [ ] Validation stricte données entrantes" >> apis_audit/apis_tests.txt
echo "- [ ] Logs d'erreurs détaillés" >> apis_audit/apis_tests.txt
echo "- [ ] Headers CORS appropriés" >> apis_audit/apis_tests.txt
echo "- [ ] Gestion erreurs DB (connexion, timeout)" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🧪 TESTS EDGE CASES:" >> apis_audit/apis_tests.txt
echo "====================" >> apis_audit/apis_tests.txt
echo "- [ ] Données null/undefined gérées" >> apis_audit/apis_tests.txt
echo "- [ ] Caractères spéciaux dans requêtes" >> apis_audit/apis_tests.txt
echo "- [ ] Requêtes simultanées multiples" >> apis_audit/apis_tests.txt
echo "- [ ] Timeout réseau simulé" >> apis_audit/apis_tests.txt
echo "- [ ] DB indisponible temporairement" >> apis_audit/apis_tests.txt
echo "- [ ] Payload trop volumineux → 413" >> apis_audit/apis_tests.txt
echo "- [ ] Méthodes HTTP non supportées → 405" >> apis_audit/apis_tests.txt

echo "✅ APIs audit exporté dans: apis_audit/"

# =============================================================================
# 12. TESTS PERFORMANCE COMPLETS
# =============================================================================
echo ""
echo "⚡ 12. AUDIT PERFORMANCE COMPLET"
echo "==============================="
mkdir -p performance_audit

# Analyse bundle et build
echo "PERFORMANCE - CHECKLIST COMPLÈTE:" > performance_audit/performance_tests.txt
echo "=================================" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🚀 CHARGEMENT PAGES (CORE WEB VITALS):" >> performance_audit/performance_tests.txt
echo "======================================" >> performance_audit/performance_tests.txt
echo "- [ ] Page d'accueil < 2s (LCP)" >> performance_audit/performance_tests.txt
echo "- [ ] Dashboard < 3s (avec données)" >> performance_audit/performance_tests.txt
echo "- [ ] Liste chantiers < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] Détail chantier < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] Interface messages < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] First Contentful Paint < 1.5s" >> performance_audit/performance_tests.txt
echo "- [ ] Largest Contentful Paint < 2.5s" >> performance_audit/performance_tests.txt

echo "- [ ] Largest Contentful Paint < 2.5s" >> performance_audit/performance_tests.txt
echo "- [ ] Cumulative Layout Shift < 0.1" >> performance_audit/performance_tests.txt
echo "- [ ] First Input Delay < 100ms" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "⚡ INTERACTIONS TEMPS RÉEL:" >> performance_audit/performance_tests.txt
echo "===========================" >> performance_audit/performance_tests.txt
echo "- [ ] Recherche temps réel < 300ms" >> performance_audit/performance_tests.txt
echo "- [ ] Navigation entre pages fluide" >> performance_audit/performance_tests.txt
echo "- [ ] Formulaires répondent instantanément" >> performance_audit/performance_tests.txt
echo "- [ ] Animations fluides 60fps" >> performance_audit/performance_tests.txt
echo "- [ ] Scroll smooth sur longues listes" >> performance_audit/performance_tests.txt
echo "- [ ] Upload fichiers avec progress" >> performance_audit/performance_tests.txt
echo "- [ ] Pas de freeze UI pendant requêtes" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🌐 OPTIMISATIONS RÉSEAU:" >> performance_audit/performance_tests.txt
echo "========================" >> performance_audit/performance_tests.txt
echo "- [ ] Requêtes API optimisées (pas de doublons)" >> performance_audit/performance_tests.txt
echo "- [ ] Images optimisées Next.js" >> performance_audit/performance_tests.txt
echo "- [ ] Compression gzip activée" >> performance_audit/performance_tests.txt
echo "- [ ] Cache approprié (headers, SWR)" >> performance_audit/performance_tests.txt
echo "- [ ] Lazy loading images/composants" >> performance_audit/performance_tests.txt
echo "- [ ] Bundle splitting efficace" >> performance_audit/performance_tests.txt
echo "- [ ] Prefetch routes importantes" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🧠 MÉMOIRE & CPU:" >> performance_audit/performance_tests.txt
echo "=================" >> performance_audit/performance_tests.txt
echo "- [ ] Pas de memory leaks" >> performance_audit/performance_tests.txt
echo "- [ ] Event listeners nettoyés" >> performance_audit/performance_tests.txt
echo "- [ ] Intervals/timeouts clearés" >> performance_audit/performance_tests.txt
echo "- [ ] Re-renders React minimisés" >> performance_audit/performance_tests.txt
echo "- [ ] Virtualisation si listes longues (>1000 items)" >> performance_audit/performance_tests.txt
echo "- [ ] Debounce sur recherches" >> performance_audit/performance_tests.txt

# Build analysis
echo "" >> performance_audit/performance_tests.txt
echo "📦 BUILD & BUNDLE ANALYSIS:" >> performance_audit/performance_tests.txt
echo "============================" >> performance_audit/performance_tests.txt
echo "Commandes à exécuter pour audit:" >> performance_audit/performance_tests.txt
echo "npm run build" >> performance_audit/performance_tests.txt
echo "npm run analyze (si script existe)" >> performance_audit/performance_tests.txt
echo "npx @next/bundle-analyzer" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "- [ ] Build sans erreurs TypeScript" >> performance_audit/performance_tests.txt
echo "- [ ] Bundle size total < 500KB" >> performance_audit/performance_tests.txt
echo "- [ ] Chunks optimisés" >> performance_audit/performance_tests.txt
echo "- [ ] Tree shaking efficace" >> performance_audit/performance_tests.txt
echo "- [ ] Code splitting par routes" >> performance_audit/performance_tests.txt
echo "- [ ] Dependencies inutiles supprimées" >> performance_audit/performance_tests.txt

echo "✅ Performance audit exporté dans: performance_audit/"

# =============================================================================
# 13. TESTS MULTI-NAVIGATEURS & DEVICES
# =============================================================================
echo ""
echo "🌐 13. TESTS MULTI-NAVIGATEURS & DEVICES"
echo "========================================"
mkdir -p cross_platform_tests

echo "TESTS CROSS-PLATFORM COMPLETS:" > cross_platform_tests/browser_device_tests.txt
echo "===============================" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "💻 DESKTOP BROWSERS:" >> cross_platform_tests/browser_device_tests.txt
echo "====================" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Chrome (dernière version)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Firefox (dernière version)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Safari (si macOS disponible)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Edge (Windows)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Opera (test optionnel)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "📱 MOBILE BROWSERS:" >> cross_platform_tests/browser_device_tests.txt
echo "===================" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Chrome mobile (Android)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Safari mobile (iOS)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Samsung Internet" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Firefox mobile" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "📐 RÉSOLUTIONS TESTÉES:" >> cross_platform_tests/browser_device_tests.txt
echo "=======================" >> cross_platform_tests/browser_device_tests.txt
echo "Desktop:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1920x1080 (Full HD)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1366x768 (laptop commun)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1440x900 (MacBook)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 2560x1440 (2K)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Tablet:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 768x1024 (iPad portrait)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1024x768 (iPad landscape)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 601x962 (Surface)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Mobile:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 375x667 (iPhone 8)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 414x896 (iPhone 11)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 360x640 (Android commun)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 375x812 (iPhone X)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "🧪 TESTS PAR FONCTIONNALITÉ:" >> cross_platform_tests/browser_device_tests.txt
echo "=============================" >> cross_platform_tests/browser_device_tests.txt
echo "Navigation:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Menu hamburger mobile" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Sidebar responsive" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Tabs navigation touch-friendly" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Formulaires:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Inputs utilisables mobile" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Keyboards virtuels supportés" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Validation temps réel" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Upload fichiers mobile" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Interactions:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Touch gestures (swipe, pinch)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Hover states desktop" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Click/tap targets > 44px" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Scroll momentum mobile" >> cross_platform_tests/browser_device_tests.txt

echo "✅ Cross-platform tests exportés dans: cross_platform_tests/"

# =============================================================================
# 14. VARIABLES D'ENVIRONNEMENT & CONFIGURATION
# =============================================================================
echo ""
echo "⚙️ 14. VARIABLES D'ENVIRONNEMENT & CONFIG"
echo "========================================="
mkdir -p env_config

# Variables d'environnement
echo "ANALYSE VARIABLES ENVIRONNEMENT:" > env_config/env_analysis.txt
echo "================================" >> env_config/env_analysis.txt
echo "" >> env_config/env_analysis.txt

if [ -f "../.env.example" ]; then
    echo "=== .env.example TROUVÉ ===" >> env_config/env_analysis.txt
    cat ../.env.example >> env_config/env_analysis.txt
    echo "" >> env_config/env_analysis.txt
    cp ../.env.example env_config/env.example
elif [ -f "../.env.local" ]; then
    echo "=== .env.local STRUCTURE (masqué) ===" >> env_config/env_analysis.txt
    grep -E "^[A-Z_]+=" ../.env.local | sed 's/=.*/=***MASKED***/' >> env_config/env_analysis.txt 2>/dev/null
else
    echo "⚠️ Aucun fichier .env exemple trouvé" >> env_config/env_analysis.txt
fi

echo "" >> env_config/env_analysis.txt
echo "VARIABLES CRITIQUES À VÉRIFIER:" >> env_config/env_analysis.txt
echo "===============================" >> env_config/env_analysis.txt
echo "- [ ] DATABASE_URL (PostgreSQL)" >> env_config/env_analysis.txt
echo "- [ ] NEXTAUTH_SECRET (sécurité JWT)" >> env_config/env_analysis.txt
echo "- [ ] NEXTAUTH_URL (callbacks auth)" >> env_config/env_analysis.txt
echo "- [ ] NODE_ENV (production/development)" >> env_config/env_analysis.txt
echo "- [ ] UPLOAD_DIR ou CLOUDINARY_URL (fichiers)" >> env_config/env_analysis.txt
echo "- [ ] EMAIL_* (notifications email si implémenté)" >> env_config/env_analysis.txt
echo "- [ ] REDIS_URL (cache si implémenté)" >> env_config/env_analysis.txt

# Configuration files
echo "--- .eslintrc.json ---" > env_config/eslintrc.json
cat ../.eslintrc.json > env_config/eslintrc.json 2>/dev/null || echo '// .eslintrc.json non trouvé' > env_config/eslintrc.json

echo "--- .prettierrc ---" > env_config/prettierrc.json
cat ../.prettierrc* > env_config/prettierrc.json 2>/dev/null || echo '// .prettierrc non trouvé' > env_config/prettierrc.json

echo "--- .gitignore ---" > env_config/gitignore.txt
cat ../.gitignore > env_config/gitignore.txt 2>/dev/null || echo '// .gitignore non trouvé' > env_config/gitignore.txt

# Vercel/deployment config
echo "--- vercel.json ---" > env_config/vercel.json
cat ../vercel.json > env_config/vercel.json 2>/dev/null || echo '// vercel.json non trouvé' > env_config/vercel.json

echo "✅ Env & Config exportés dans: env_config/"

# =============================================================================
# 15. PLAN D'AUDIT MÉTHODIQUE COMPLET
# =============================================================================
echo ""
echo "📋 15. PLAN D'AUDIT MÉTHODIQUE COMPLET"
echo "====================================="

echo "PLAN D'AUDIT CHANTIERPRO - MÉTHODOLOGIE COMPLÈTE" > plan_audit_complet.txt
echo "=================================================" >> plan_audit_complet.txt
echo "Date: $(date)" >> plan_audit_complet.txt
echo "Objectif: AUDIT COMPLET → CORRECTIONS → PRODUCTION READY" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt

echo "🔍 PHASE 1 - AUDIT TECHNIQUE INFRASTRUCTURE (2-3h)" >> plan_audit_complet.txt
echo "===================================================" >> plan_audit_complet.txt
echo "1.1 BUILD & COMPILATION:" >> plan_audit_complet.txt
echo "- [ ] npm install (vérifier dépendances)" >> plan_audit_complet.txt
echo "- [ ] npm run build (compilation production)" >> plan_audit_complet.txt
echo "- [ ] npm run type-check (TypeScript strict)" >> plan_audit_complet.txt
echo "- [ ] npm run lint (ESLint + fix auto)" >> plan_audit_complet.txt
echo "- [ ] Analyser bundle size et optimisations" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "1.2 BASE DE DONNÉES:" >> plan_audit_complet.txt
echo "- [ ] npx prisma validate (schema valide)" >> plan_audit_complet.txt
echo "- [ ] npx prisma generate (client à jour)" >> plan_audit_complet.txt
echo "- [ ] npx prisma db push (sync structure)" >> plan_audit_complet.txt
echo "- [ ] npx prisma studio (explorer données)" >> plan_audit_complet.txt
echo "- [ ] Tester connexions DB + seed data" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "1.3 ENVIRONMENT & CONFIG:" >> plan_audit_complet.txt
echo "- [ ] Variables .env toutes présentes" >> plan_audit_complet.txt
echo "- [ ] NEXTAUTH_SECRET sécurisé" >> plan_audit_complet.txt
echo "- [ ] DATABASE_URL fonctionnelle" >> plan_audit_complet.txt
echo "- [ ] Middleware protection routes" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🧪 PHASE 2 - TESTS APIS REST (3-4h)" >> plan_audit_complet.txt
echo "====================================" >> plan_audit_complet.txt
echo "2.1 AUTHENTIFICATION:" >> plan_audit_complet.txt
echo "- [ ] Login/logout fonctionnels" >> plan_audit_complet.txt
echo "- [ ] Sessions persistantes" >> plan_audit_complet.txt
echo "- [ ] Protection /dashboard/*" >> plan_audit_complet.txt
echo "- [ ] Rôles utilisateurs" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "2.2 CHANTIERS CRUD (référence):" >> plan_audit_complet.txt
echo "- [ ] GET /api/chantiers → 200" >> plan_audit_complet.txt
echo "- [ ] POST /api/chantiers → 201" >> plan_audit_complet.txt
echo "- [ ] GET/PUT/DELETE /api/chantiers/[id]" >> plan_audit_complet.txt
echo "- [ ] Validation données + erreurs HTTP" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "2.3 MESSAGES (nouveau module):" >> plan_audit_complet.txt
echo "- [ ] Toutes routes /api/messages/*" >> plan_audit_complet.txt
echo "- [ ] CRUD complet messages" >> plan_audit_complet.txt
echo "- [ ] Recherche + contacts" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers" >> plan_audit_complet.txt
echo "- [ ] Rate limiting + sécurité" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🎨 PHASE 3 - TESTS UI/UX COMPLETS (4-5h)" >> plan_audit_complet.txt
echo "=========================================" >> plan_audit_complet.txt
echo "3.1 DASHBOARD PRINCIPAL:" >> plan_audit_complet.txt
echo "- [ ] Chargement < 3s avec données réelles" >> plan_audit_complet.txt
echo "- [ ] Stats cards fonctionnelles" >> plan_audit_complet.txt
echo "- [ ] Navigation vers modules" >> plan_audit_complet.txt
echo "- [ ] Quick actions opérationnelles" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "3.2 MODULE CHANTIERS (référence CRUD):" >> plan_audit_complet.txt
echo "- [ ] Liste + filtres + recherche" >> plan_audit_complet.txt
echo "- [ ] Détail chantier complet" >> plan_audit_complet.txt
echo "- [ ] Formulaire création multi-étapes" >> plan_audit_complet.txt
echo "- [ ] Upload photos + timeline" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "3.3 MODULE MESSAGES (focus audit):" >> plan_audit_complet.txt
echo "- [ ] Interface principale chat" >> plan_audit_complet.txt
echo "- [ ] Nouveau message modal + page" >> plan_audit_complet.txt
echo "- [ ] Recherche messages globale" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers + médias viewer" >> plan_audit_complet.txt
echo "- [ ] Notifications temps réel" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "📱 PHASE 4 - RESPONSIVE & CROSS-PLATFORM (2-3h)" >> plan_audit_complet.txt
echo "================================================" >> plan_audit_complet.txt
echo "4.1 DEVICES:" >> plan_audit_complet.txt
echo "- [ ] Desktop (1920x1080, 1366x768)" >> plan_audit_complet.txt
echo "- [ ] Tablet (iPad portrait/landscape)" >> plan_audit_complet.txt
echo "- [ ] Mobile (iPhone, Android diverses tailles)" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "4.2 BROWSERS:" >> plan_audit_complet.txt
echo "- [ ] Chrome, Firefox, Safari, Edge" >> plan_audit_complet.txt
echo "- [ ] Chrome/Safari mobile" >> plan_audit_complet.txt
echo "- [ ] Fonctionnalités touch mobile" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "4.3 DESIGN CONSISTENCY:" >> plan_audit_complet.txt
echo "- [ ] CSS vanilla cohérent (pas Tailwind mélangé)" >> plan_audit_complet.txt
echo "- [ ] Classes .glass, .card, .btn-primary réutilisées" >> plan_audit_complet.txt
echo "- [ ] Gradients bleu/orange respectés" >> plan_audit_complet.txt
echo "- [ ] Typography Inter partout" >> plan_audit_complet.txt
echo "- [ ] Animations 0.3s ease cohérentes" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "⚡ PHASE 5 - PERFORMANCE & SÉCURITÉ (2-3h)" >> plan_audit_complet.txt
echo "===========================================" >> plan_audit_complet.txt
echo "5.1 PERFORMANCE:" >> plan_audit_complet.txt
echo "- [ ] Core Web Vitals (LCP < 2.5s, CLS < 0.1)" >> plan_audit_complet.txt
echo "- [ ] Recherche temps réel < 300ms" >> plan_audit_complet.txt
echo "- [ ] Navigation fluide entre pages" >> plan_audit_complet.txt
echo "- [ ] Memory leaks + cleanup effects" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "5.2 SÉCURITÉ:" >> plan_audit_complet.txt
echo "- [ ] Validation Zod toutes APIs POST/PUT" >> plan_audit_complet.txt
echo "- [ ] XSS prevention sur inputs" >> plan_audit_complet.txt
echo "- [ ] CSRF protection active" >> plan_audit_complet.txt
echo "- [ ] Rate limiting APIs" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers sécurisé" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🧪 PHASE 6 - EDGE CASES & ROBUSTESSE (2h)" >> plan_audit_complet.txt
echo "==========================================" >> plan_audit_complet.txt
echo "6.1 DONNÉES EDGE CASES:" >> plan_audit_complet.txt
echo "- [ ] Données vides/null gérées gracieusement" >> plan_audit_complet.txt
echo "- [ ] Listes vides → empty state approprié" >> plan_audit_complet.txt
echo "- [ ] Caractères spéciaux dans formulaires" >> plan_audit_complet.txt
echo "- [ ] Limites longueur champs respectées" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "6.2 RÉSEAU:" >> plan_audit_complet.txt
echo "- [ ] Connexion lente simulée" >> plan_audit_complet.txt
echo "- [ ] Connexion coupée/restaurée" >> plan_audit_complet.txt
echo "- [ ] Timeout API avec retry" >> plan_audit_complet.txt
echo "- [ ] Mode dégradé fonctionnel" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "📊 PHASE 7 - RAPPORT & CORRECTIONS (1-2h par bug)" >> plan_audit_complet.txt
echo "==================================================" >> plan_audit_complet.txt
echo "7.1 CATÉGORISATION BUGS:" >> plan_audit_complet.txt
echo "🔴 CRITIQUE: App crash, fonctionnalité core cassée" >> plan_audit_complet.txt
echo "🟠 MAJEUR: Fonctionnalité importante ne marche pas" >> plan_audit_complet.txt
echo "🟡 MINEUR: Bug UX, performance, edge case" >> plan_audit_complet.txt
echo "🔵 COSMÉTIQUE: Design inconsistency, typos" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "7.2 PRIORITÉS CORRECTION:" >> plan_audit_complet.txt
echo "- Corriger TOUS les bugs CRITIQUES avant suite" >> plan_audit_complet.txt
echo "- Corriger bugs MAJEURS avant production" >> plan_audit_complet.txt
echo "- Planifier MINEURS + COSMÉTIQUES version suivante" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "7.3 FORMAT RAPPORT BUG:" >> plan_audit_complet.txt
echo "🔴 BUG #XX - [NIVEAU]" >> plan_audit_complet.txt
echo "LOCALISATION: fichier:ligne + URL" >> plan_audit_complet.txt
echo "DESCRIPTION: problème observé" >> plan_audit_complet.txt
echo "REPRODUCTION: étapes 1, 2, 3" >> plan_audit_complet.txt
echo "ERREUR CONSOLE: logs détaillés" >> plan_audit_complet.txt
echo "IMPACT: conséquences utilisateur" >> plan_audit_complet.txt
echo "SOLUTION: correction proposée" >> plan_audit_complet.txt
echo "STATUS: [TROUVÉ/EN COURS/CORRIGÉ]" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🎯 LIVRABLES FINAUX:" >> plan_audit_complet.txt
echo "====================" >> plan_audit_complet.txt
echo "✅ Rapport d'audit complet avec bugs catégorisés" >> plan_audit_complet.txt
echo "🔧 Corrections appliquées (bugs critiques + majeurs)" >> plan_audit_complet.txt
echo "📊 Évaluation globale état application" >> plan_audit_complet.txt
echo "🚀 Roadmap corrections restantes" >> plan_audit_complet.txt
echo "📚 Documentation modifications effectuées" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "TEMPS TOTAL ESTIMÉ: 15-20 heures sur 3-4 jours" >> plan_audit_complet.txt
echo "OBJECTIF: Application 100% fonctionnelle, production-ready" >> plan_audit_complet.txt

echo "✅ Plan d'audit complet exporté dans: plan_audit_complet.txt"

# =============================================================================
# 16. OUTILS D'AUDIT & COMMANDES
# =============================================================================
echo ""
echo "🛠️ 16. OUTILS & COMMANDES D'AUDIT"
echo "================================="
mkdir -p audit_tools

echo "OUTILS & COMMANDES AUDIT CHANTIERPRO" > audit_tools/commands_tools.txt
echo "====================================" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🔧 COMMANDES DE BASE:" >> audit_tools/commands_tools.txt
echo "=====================" >> audit_tools/commands_tools.txt
echo "# Installation et setup" >> audit_tools/commands_tools.txt
echo "npm install" >> audit_tools/commands_tools.txt
echo "npm run dev                    # Serveur développement" >> audit_tools/commands_tools.txt
echo "npm run build                  # Build production" >> audit_tools/commands_tools.txt
echo "npm run start                  # Serveur production" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Base de données Prisma" >> audit_tools/commands_tools.txt
echo "npx prisma generate           # Générer client Prisma" >> audit_tools/commands_tools.txt
echo "npx prisma db push           # Sync schema avec DB" >> audit_tools/commands_tools.txt
echo "npx prisma studio            # Interface graphique DB" >> audit_tools/commands_tools.txt
echo "npx prisma migrate reset     # Reset complet DB" >> audit_tools/commands_tools.txt
echo "npx prisma db seed           # Charger données test" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Qualité code" >> audit_tools/commands_tools.txt
echo "npm run lint                  # ESLint vérification" >> audit_tools/commands_tools.txt
echo "npm run lint:fix             # ESLint auto-fix" >> audit_tools/commands_tools.txt
echo "npm run type-check           # TypeScript vérification" >> audit_tools/commands_tools.txt
echo "npx prettier --write .       # Formatage code" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🌐 TESTS NAVIGATEUR (DevTools F12):" >> audit_tools/commands_tools.txt
echo "====================================" >> audit_tools/commands_tools.txt
echo "Console: Erreurs JavaScript" >> audit_tools/commands_tools.txt
echo "Network: Requêtes API + performance" >> audit_tools/commands_tools.txt
echo "Performance: Core Web Vitals" >> audit_tools/commands_tools.txt
echo "Application: LocalStorage, Session, Cookies" >> audit_tools/commands_tools.txt
echo "Lighthouse: Audit complet performance/SEO/accessibilité" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "📱 MODE RESPONSIVE (DevTools):" >> audit_tools/commands_tools.txt
echo "===============================" >> audit_tools/commands_tools.txt
echo "Ctrl+Shift+M (toggle device mode)" >> audit_tools/commands_tools.txt
echo "Presets: iPhone 12, iPad, Pixel 5" >> audit_tools/commands_tools.txt
echo "Custom: 375x667, 768x1024, 1366x768" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🧪 CURL TESTS APIs:" >> audit_tools/commands_tools.txt
echo "===================" >> audit_tools/commands_tools.txt
echo "# Test authentification" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/auth/session" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Test CRUD chantiers" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/chantiers" >> audit_tools/commands_tools.txt
echo "curl -X POST http://localhost:3000/api/chantiers \\" >> audit_tools/commands_tools.txt
echo "  -H 'Content-Type: application/json' \\" >> audit_tools/commands_tools.txt
echo "  -d '{\"nom\":\"Test Chantier\",\"statut\":\"ACTIF\"}'" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Test messages (nouveau module)" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/messages" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/messages/contacts" >> audit_tools/commands_tools.txt
echo "curl -X GET 'http://localhost:3000/api/messages/search?q=test'" >> audit_tools/commands_tools.txt

# Debug checklist
echo "" >> audit_tools/commands_tools.txt
echo "🐛 DEBUG CHECKLIST:" >> audit_tools/commands_tools.txt
echo "===================" >> audit_tools/commands_tools.txt
echo "- [ ] Console.log outputs pour tracer flux" >> audit_tools/commands_tools.txt
echo "- [ ]#!/bin/bash

# Script d'extraction ChantierPro - AUDIT COMPLET v4.0
# À exécuter depuis la racine du projet ChantierPro
# Optimisé pour fournir TOUS les fichiers nécessaires à l'AUDIT COMPLET

echo "🔍 EXTRACTION CHANTIERPRO v4.0 - AUDIT COMPLET QUALITÉ"
echo "========================================================"
echo "Date: $(date)"
echo "Objectif: Extraire TOUS les fichiers pour AUDIT COMPLET et CORRECTION"
echo ""

# Créer dossier d'extraction avec timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
EXTRACT_DIR="audit_complet_${TIMESTAMP}"
mkdir -p "$EXTRACT_DIR"
cd "$EXTRACT_DIR"

echo "📁 Dossier d'extraction: $EXTRACT_DIR"
echo ""

# =============================================================================
# 1. CONFIGURATION & BUILD VERIFICATION
# =============================================================================
echo "🔧 1. CONFIGURATION & BUILD VERIFICATION"
echo "========================================"
mkdir -p config_build

echo "--- package.json ---" > config_build/package.json
cat ../package.json > config_build/package.json 2>/dev/null || echo '{"error": "package.json NON TROUVÉ"}' > config_build/package.json

echo "--- tsconfig.json ---" > config_build/tsconfig.json
cat ../tsconfig.json > config_build/tsconfig.json 2>/dev/null || echo '{"error": "tsconfig.json NON TROUVÉ"}' > config_build/tsconfig.json

echo "--- next.config.js ---" > config_build/next.config.js
cat ../next.config.* > config_build/next.config.js 2>/dev/null || echo '// next.config NON TROUVÉ' > config_build/next.config.js

echo "--- tailwind.config ---" > config_build/tailwind.config.js
cat ../tailwind.config.* > config_build/tailwind.config.js 2>/dev/null || echo '// tailwind.config NON TROUVÉ - App utilise CSS vanilla' > config_build/tailwind.config.js

# Scripts NPM analysis
echo "ANALYSE SCRIPTS NPM DISPONIBLES:" > config_build/npm_scripts_analysis.txt
echo "================================" >> config_build/npm_scripts_analysis.txt
if [ -f "../package.json" ]; then
    echo "Scripts trouvés dans package.json:" >> config_build/npm_scripts_analysis.txt
    grep -A 20 '"scripts"' ../package.json >> config_build/npm_scripts_analysis.txt 2>/dev/null || echo "Aucun script trouvé" >> config_build/npm_scripts_analysis.txt
else
    echo "❌ package.json non trouvé - CRITIQUE" >> config_build/npm_scripts_analysis.txt
fi

echo "" >> config_build/npm_scripts_analysis.txt
echo "VÉRIFICATIONS BUILD NÉCESSAIRES:" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run build (compilation production)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run type-check (vérification TypeScript)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run lint (vérification ESLint)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run dev (serveur développement)" >> config_build/npm_scripts_analysis.txt

# Dependencies analysis
echo "ANALYSE DÉPENDANCES:" > config_build/dependencies_analysis.txt
echo "===================" >> config_build/dependencies_analysis.txt
if [ -f "../package.json" ]; then
    echo "=== PRODUCTION DEPENDENCIES ===" >> config_build/dependencies_analysis.txt
    grep -A 50 '"dependencies"' ../package.json >> config_build/dependencies_analysis.txt 2>/dev/null
    echo "" >> config_build/dependencies_analysis.txt
    echo "=== DEV DEPENDENCIES ===" >> config_build/dependencies_analysis.txt
    grep -A 30 '"devDependencies"' ../package.json >> config_build/dependencies_analysis.txt 2>/dev/null
fi

echo "✅ Configuration et build exportés dans: config_build/"

# =============================================================================
# 2. PRISMA & BASE DE DONNÉES COMPLÈTE
# =============================================================================
echo ""
echo "🗄️ 2. ANALYSE PRISMA & BASE DE DONNÉES"
echo "======================================"
mkdir -p database_audit

echo "--- prisma/schema.prisma ---" > database_audit/schema.prisma
cat ../prisma/schema.prisma > database_audit/schema.prisma 2>/dev/null || echo '// ❌ CRITIQUE: prisma/schema.prisma NON TROUVÉ' > database_audit/schema.prisma

echo "--- lib/db.ts ou lib/prisma.ts ---" > database_audit/db_client.ts
cat ../lib/db.ts > database_audit/db_client.ts 2>/dev/null || cat ../lib/prisma.ts > database_audit/db_client.ts 2>/dev/null || echo '// ❌ CRITIQUE: Client Prisma NON TROUVÉ' > database_audit/db_client.ts

# Analyse du schema Prisma
echo "ANALYSE SCHEMA PRISMA:" > database_audit/schema_analysis.txt
echo "=====================" >> database_audit/schema_analysis.txt
if [ -f "../prisma/schema.prisma" ]; then
    echo "=== MODELS TROUVÉS ===" >> database_audit/schema_analysis.txt
    grep "^model " ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
    echo "" >> database_audit/schema_analysis.txt
    
    echo "=== ENUMS TROUVÉS ===" >> database_audit/schema_analysis.txt
    grep "^enum " ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
    echo "" >> database_audit/schema_analysis.txt
    
    echo "=== PROVIDER DATABASE ===" >> database_audit/schema_analysis.txt
    grep -A 5 "provider" ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
else
    echo "❌ CRITIQUE: Schema Prisma non trouvé - Impossible de vérifier la DB" >> database_audit/schema_analysis.txt
fi

# Migrations
echo "--- Migrations Info ---" > database_audit/migrations.txt
if [ -d "../prisma/migrations" ]; then
    echo "MIGRATIONS TROUVÉES:" >> database_audit/migrations.txt
    ls -la ../prisma/migrations/ >> database_audit/migrations.txt
    echo "" >> database_audit/migrations.txt
    echo "DERNIÈRE MIGRATION:" >> database_audit/migrations.txt
    find ../prisma/migrations -name "migration.sql" -type f -exec basename "$(dirname {})" \; | tail -1 >> database_audit/migrations.txt
else
    echo "⚠️ Aucune migration trouvée - DB peut être en mode db push" >> database_audit/migrations.txt
fi

# Seed
echo "--- prisma/seed.ts ---" > database_audit/seed.ts
cat ../prisma/seed.ts > database_audit/seed.ts 2>/dev/null || echo '// Seed non trouvé - Données de test à créer' > database_audit/seed.ts

echo "✅ Database audit exporté dans: database_audit/"

# =============================================================================
# 3. ARCHITECTURE COMPLÈTE APP ROUTER NEXT.JS 14
# =============================================================================
echo ""
echo "🏗️ 3. ARCHITECTURE COMPLÈTE NEXT.JS 14"
echo "======================================"
mkdir -p architecture_app

# Layout principal
echo "--- app/layout.tsx ---" > architecture_app/root_layout.tsx
cat ../app/layout.tsx > architecture_app/root_layout.tsx 2>/dev/null || echo '❌ CRITIQUE: app/layout.tsx NON TROUVÉ' > architecture_app/root_layout.tsx

# Page d'accueil
echo "--- app/page.tsx ---" > architecture_app/root_page.tsx
cat ../app/page.tsx > architecture_app/root_page.tsx 2>/dev/null || echo '❌ app/page.tsx NON TROUVÉ' > architecture_app/root_page.tsx

# Global styles
echo "--- app/globals.css ---" > architecture_app/globals.css
cat ../app/globals.css > architecture_app/globals.css 2>/dev/null || echo '❌ CRITIQUE: app/globals.css NON TROUVÉ' > architecture_app/globals.css

# Loading et Error
echo "--- app/loading.tsx ---" > architecture_app/loading.tsx
cat ../app/loading.tsx > architecture_app/loading.tsx 2>/dev/null || echo '// loading.tsx non trouvé - À créer' > architecture_app/loading.tsx

echo "--- app/error.tsx ---" > architecture_app/error.tsx
cat ../app/error.tsx > architecture_app/error.tsx 2>/dev/null || echo '// error.tsx non trouvé - À créer' > architecture_app/error.tsx

echo "--- app/not-found.tsx ---" > architecture_app/not_found.tsx
cat ../app/not-found.tsx > architecture_app/not_found.tsx 2>/dev/null || echo '// not-found.tsx non trouvé - À créer' > architecture_app/not_found.tsx

# Middleware
echo "--- middleware.ts ---" > architecture_app/middleware.ts
cat ../middleware.ts > architecture_app/middleware.ts 2>/dev/null || echo '// middleware.ts non trouvé - Vérifier protection routes' > architecture_app/middleware.ts

# Analysis structure app
echo "ANALYSE STRUCTURE APP ROUTER:" > architecture_app/app_structure.txt
echo "=============================" >> architecture_app/app_structure.txt
if [ -d "../app" ]; then
    find ../app -type f -name "*.tsx" -o -name "*.ts" | head -50 | while read appfile; do
        rel_path=${appfile#../app/}
        echo "✅ $rel_path" >> architecture_app/app_structure.txt
    done
    
    echo "" >> architecture_app/app_structure.txt
    echo "ROUTES DÉTECTÉES:" >> architecture_app/app_structure.txt
    find ../app -name "page.tsx" | sed 's|../app||g' | sed 's|/page.tsx||g' | sed 's|^$|/|g' >> architecture_app/app_structure.txt
else
    echo "❌ CRITIQUE: Dossier /app non trouvé" >> architecture_app/app_structure.txt
fi

echo "✅ Architecture exportée dans: architecture_app/"

# =============================================================================
# 4. SYSTÈME D'AUTHENTIFICATION COMPLET
# =============================================================================
echo ""
echo "🔐 4. SYSTÈME D'AUTHENTIFICATION COMPLET"
echo "======================================="
mkdir -p auth_system

# NextAuth configuration
echo "--- app/api/auth/[...nextauth]/route.ts ---" > auth_system/nextauth_route.ts
cat ../app/api/auth/\[...nextauth\]/route.ts > auth_system/nextauth_route.ts 2>/dev/null || echo '❌ CRITIQUE: NextAuth route NON TROUVÉE' > auth_system/nextauth_route.ts

# Auth configuration lib
echo "--- lib/auth.ts ou lib/authOptions.ts ---" > auth_system/auth_config.ts
cat ../lib/auth.ts > auth_system/auth_config.ts 2>/dev/null || cat ../lib/authOptions.ts > auth_system/auth_config.ts 2>/dev/null || echo '❌ Configuration auth NON TROUVÉE' > auth_system/auth_config.ts

# Auth pages
echo "--- app/auth/login/page.tsx ---" > auth_system/login_page.tsx
cat ../app/auth/login/page.tsx > auth_system/login_page.tsx 2>/dev/null || echo '❌ Page login NON TROUVÉE' > auth_system/login_page.tsx

echo "--- app/auth/register/page.tsx ---" > auth_system/register_page.tsx
cat ../app/auth/register/page.tsx > auth_system/register_page.tsx 2>/dev/null || echo '// Page register non trouvée' > auth_system/register_page.tsx

# Session provider
echo "--- components/providers.tsx ou app/providers.tsx ---" > auth_system/providers.tsx
cat ../components/providers.tsx > auth_system/providers.tsx 2>/dev/null || cat ../app/providers.tsx > auth_system/providers.tsx 2>/dev/null || echo '❌ Session Provider NON TROUVÉ' > auth_system/providers.tsx

# Auth types
echo "--- types/auth.ts ou types/next-auth.d.ts ---" > auth_system/auth_types.ts
cat ../types/auth.ts > auth_system/auth_types.ts 2>/dev/null || cat ../types/next-auth.d.ts > auth_system/auth_types.ts 2>/dev/null || echo '// Types auth non trouvés' > auth_system/auth_types.ts

# Auth analysis
echo "ANALYSE SYSTÈME AUTHENTIFICATION:" > auth_system/auth_analysis.txt
echo "==================================" >> auth_system/auth_analysis.txt
echo "VÉRIFICATIONS À EFFECTUER:" >> auth_system/auth_analysis.txt
echo "- [ ] NextAuth configuré correctement" >> auth_system/auth_analysis.txt
echo "- [ ] Variables d'env (NEXTAUTH_SECRET, NEXTAUTH_URL)" >> auth_system/auth_analysis.txt
echo "- [ ] Protection routes /dashboard/*" >> auth_system/auth_analysis.txt
echo "- [ ] Redirection après login" >> auth_system/auth_analysis.txt
echo "- [ ] Session handling côté client" >> auth_system/auth_analysis.txt
echo "- [ ] Logout functionality" >> auth_system/auth_analysis.txt
echo "- [ ] Gestion des rôles utilisateurs" >> auth_system/auth_analysis.txt

echo "✅ Système auth exporté dans: auth_system/"

# =============================================================================
# 5. DASHBOARD COMPLET - MODULE PRINCIPAL
# =============================================================================
echo ""
echo "📊 5. DASHBOARD COMPLET - AUDIT MODULE PRINCIPAL"
echo "==============================================="
mkdir -p dashboard_audit

# Dashboard layout
echo "--- app/dashboard/layout.tsx ---" > dashboard_audit/layout.tsx
cat ../app/dashboard/layout.tsx > dashboard_audit/layout.tsx 2>/dev/null || echo '❌ CRITIQUE: Dashboard layout NON TROUVÉ' > dashboard_audit/layout.tsx

# Dashboard main page
echo "--- app/dashboard/page.tsx ---" > dashboard_audit/page.tsx
cat ../app/dashboard/page.tsx > dashboard_audit/page.tsx 2>/dev/null || echo '❌ CRITIQUE: Dashboard page NON TROUVÉE' > dashboard_audit/page.tsx

# Tous les sous-modules dashboard
find ../app/dashboard -name "*.tsx" -o -name "*.ts" 2>/dev/null | while read dashfile; do
    rel_path=${dashfile#../app/dashboard/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g')
    echo "--- app/dashboard/$rel_path ---" > "dashboard_audit/dash_$safe_name"
    cat "$dashfile" >> "dashboard_audit/dash_$safe_name" 2>/dev/null
done

# Dashboard components
if [ -d "../components/dashboard" ]; then
    find ../components/dashboard -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/dashboard/$comp_name.tsx ---" > "dashboard_audit/comp_$comp_name.tsx"
        cat "$comp" >> "dashboard_audit/comp_$comp_name.tsx"
    done
fi

# Dashboard analysis
echo "AUDIT DASHBOARD - TESTS À EFFECTUER:" > dashboard_audit/dashboard_tests.txt
echo "====================================" >> dashboard_audit/dashboard_tests.txt
echo "FONCTIONNALITÉS À TESTER:" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Page dashboard se charge sans erreur" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Stats cards affichent des données réelles" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Graphiques se génèrent correctement" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Navigation vers autres modules fonctionne" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Quick actions sont opérationnelles" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Feed d'activité se met à jour" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Notifications badges sont corrects" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Responsive design mobile/tablet" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Performance de chargement < 3s" >> dashboard_audit/dashboard_tests.txt

echo "✅ Dashboard audit exporté dans: dashboard_audit/"

# =============================================================================
# 6. MODULE CHANTIERS COMPLET - RÉFÉRENCE CRUD
# =============================================================================
echo ""
echo "🏗️ 6. MODULE CHANTIERS - AUDIT CRUD COMPLET"
echo "==========================================="
mkdir -p chantiers_audit

# Pages principales
echo "--- app/dashboard/chantiers/page.tsx ---" > chantiers_audit/main_page.tsx
cat ../app/dashboard/chantiers/page.tsx > chantiers_audit/main_page.tsx 2>/dev/null || echo '❌ Page liste chantiers NON TROUVÉE' > chantiers_audit/main_page.tsx

echo "--- app/dashboard/chantiers/[id]/page.tsx ---" > chantiers_audit/detail_page.tsx
cat ../app/dashboard/chantiers/\[id\]/page.tsx > chantiers_audit/detail_page.tsx 2>/dev/null || echo '❌ Page détail chantier NON TROUVÉE' > chantiers_audit/detail_page.tsx

echo "--- app/dashboard/chantiers/nouveau/page.tsx ---" > chantiers_audit/nouveau_page.tsx
cat ../app/dashboard/chantiers/nouveau/page.tsx > chantiers_audit/nouveau_page.tsx 2>/dev/null || echo '❌ Page nouveau chantier NON TROUVÉE' > chantiers_audit/nouveau_page.tsx

# Layout chantiers
echo "--- app/dashboard/chantiers/layout.tsx ---" > chantiers_audit/layout.tsx
cat ../app/dashboard/chantiers/layout.tsx > chantiers_audit/layout.tsx 2>/dev/null || echo '// Layout chantiers non trouvé' > chantiers_audit/layout.tsx

# APIs Chantiers
echo "--- app/api/chantiers/route.ts ---" > chantiers_audit/api_main.ts
cat ../app/api/chantiers/route.ts > chantiers_audit/api_main.ts 2>/dev/null || echo '❌ CRITIQUE: API chantiers principale NON TROUVÉE' > chantiers_audit/api_main.ts

echo "--- app/api/chantiers/[id]/route.ts ---" > chantiers_audit/api_detail.ts
cat ../app/api/chantiers/\[id\]/route.ts > chantiers_audit/api_detail.ts 2>/dev/null || echo '❌ API chantier détail NON TROUVÉE' > chantiers_audit/api_detail.ts

# Toutes les autres APIs chantiers
find ../app/api -path "*/chantiers/*" -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    echo "--- $api_file ---" > "chantiers_audit/api_$safe_name.ts"
    cat "$api_file" >> "chantiers_audit/api_$safe_name.ts" 2>/dev/null
done

# Composants chantiers
if [ -d "../components/chantiers" ]; then
    find ../components/chantiers -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/chantiers/$comp_name.tsx ---" > "chantiers_audit/comp_$comp_name.tsx"
        cat "$comp" >> "chantiers_audit/comp_$comp_name.tsx"
    done
fi

# Tests chantiers
echo "AUDIT MODULE CHANTIERS - TESTS CRUD:" > chantiers_audit/chantiers_tests.txt
echo "====================================" >> chantiers_audit/chantiers_tests.txt
echo "TESTS FONCTIONNELS À EFFECTUER:" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "📋 LISTE CHANTIERS (/dashboard/chantiers):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Liste se charge avec données réelles" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Filtres par statut fonctionnent" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Recherche temps réel opérationnelle" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Pagination si nombreux résultats" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Actions rapides (voir, modifier, supprimer)" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "🔍 DÉTAIL CHANTIER (/dashboard/chantiers/[id]):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Page détail se charge correctement" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Tabs navigation fonctionne" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Informations complètes affichées" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Timeline événements se charge" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Photos/documents s'affichent" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Modification en place possible" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "➕ NOUVEAU CHANTIER (/dashboard/chantiers/nouveau):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Formulaire multi-étapes fonctionne" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Validation des champs obligatoires" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Upload photos simulé opérationnel" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Soumission et redirection après création" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Gestion d'erreurs si échec" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "🔄 APIs CHANTIERS:" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] GET /api/chantiers (liste)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] POST /api/chantiers (création)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] GET /api/chantiers/[id] (détail)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] PUT /api/chantiers/[id] (modification)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] DELETE /api/chantiers/[id] (suppression)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Codes retour HTTP corrects (200, 400, 404, 500)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Validation données entrantes" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Protection auth sur toutes routes" >> chantiers_audit/chantiers_tests.txt

echo "✅ Chantiers audit exporté dans: chantiers_audit/"

# =============================================================================
# 7. MODULE MESSAGES - ÉTAT ACTUEL ET AUDIT
# =============================================================================
echo ""
echo "💬 7. MODULE MESSAGES - AUDIT COMPLET ÉTAT ACTUEL"
echo "================================================"
mkdir -p messages_audit

# Pages messages existantes
echo "--- app/dashboard/messages/page.tsx ---" > messages_audit/main_page.tsx
cat ../app/dashboard/messages/page.tsx > messages_audit/main_page.tsx 2>/dev/null || echo '❌ CRITIQUE: Page messages principale NON TROUVÉE - À CRÉER' > messages_audit/main_page.tsx

echo "--- app/dashboard/messages/layout.tsx ---" > messages_audit/layout.tsx
cat ../app/dashboard/messages/layout.tsx > messages_audit/layout.tsx 2>/dev/null || echo '// Layout messages non trouvé - À créer' > messages_audit/layout.tsx

echo "--- app/dashboard/messages/nouveau/page.tsx ---" > messages_audit/nouveau_page.tsx
cat ../app/dashboard/messages/nouveau/page.tsx > messages_audit/nouveau_page.tsx 2>/dev/null || echo '❌ Page nouveau message NON TROUVÉE - À CRÉER' > messages_audit/nouveau_page.tsx

echo "--- app/dashboard/messages/recherche/page.tsx ---" > messages_audit/recherche_page.tsx
cat ../app/dashboard/messages/recherche/page.tsx > messages_audit/recherche_page.tsx 2>/dev/null || echo '❌ Page recherche messages NON TROUVÉE - À CRÉER' > messages_audit/recherche_page.tsx

# Toutes les autres pages messages
find ../app/dashboard/messages -name "*.tsx" -o -name "*.ts" 2>/dev/null | while read msgfile; do
    rel_path=${msgfile#../app/dashboard/messages/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g')
    echo "--- app/dashboard/messages/$rel_path ---" > "messages_audit/page_$safe_name"
    cat "$msgfile" >> "messages_audit/page_$safe_name" 2>/dev/null
done

# APIs Messages
echo "--- app/api/messages/route.ts ---" > messages_audit/api_main.ts
cat ../app/api/messages/route.ts > messages_audit/api_main.ts 2>/dev/null || echo '❌ CRITIQUE: API messages principale NON TROUVÉE - À CRÉER' > messages_audit/api_main.ts

echo "--- app/api/messages/contacts/route.ts ---" > messages_audit/api_contacts.ts
cat ../app/api/messages/contacts/route.ts > messages_audit/api_contacts.ts 2>/dev/null || echo '❌ API contacts NON TROUVÉE - À CRÉER' > messages_audit/api_contacts.ts

echo "--- app/api/messages/search/route.ts ---" > messages_audit/api_search.ts
cat ../app/api/messages/search/route.ts > messages_audit/api_search.ts 2>/dev/null || echo '❌ API search NON TROUVÉE - À CRÉER' > messages_audit/api_search.ts

# Toutes les autres APIs messages
find ../app/api/messages -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/messages/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    if [[ "$safe_name" != "" && "$safe_name" != "route" ]]; then
        echo "--- $api_file ---" > "messages_audit/api_$safe_name.ts"
        cat "$api_file" >> "messages_audit/api_$safe_name.ts" 2>/dev/null
    fi
done

# Composants messages
if [ -d "../components/messages" ]; then
    find ../components/messages -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/messages/$comp_name.tsx ---" > "messages_audit/comp_$comp_name.tsx"
        cat "$comp" >> "messages_audit/comp_$comp_name.tsx"
    done
else
    echo '❌ CRITIQUE: Dossier components/messages NON TROUVÉ' > messages_audit/comp_MANQUANT.txt
    echo 'Composants critiques à créer:' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageBubble.tsx (affichage messages)' >> messages_audit/comp_MANQUANT.txt
    echo '- ConversationList.tsx (liste conversations)' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageInput.tsx (saisie nouveau message)' >> messages_audit/comp_MANQUANT.txt
    echo '- NewMessageModal.tsx (modal nouveau message)' >> messages_audit/comp_MANQUANT.txt
    echo '- ContactSelector.tsx (sélection destinataires)' >> messages_audit/comp_MANQUANT.txt
    echo '- MediaViewer.tsx (visualisation médias)' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageActions.tsx (actions sur messages)' >> messages_audit/comp_MANQUANT.txt
    echo '- UserAvatar.tsx (avatar utilisateur)' >> messages_audit/comp_MANQUANT.txt
fi

# Hook useMessages
echo "--- hooks/useMessages.ts ---" > messages_audit/hook_useMessages.ts
cat ../hooks/useMessages.ts > messages_audit/hook_useMessages.ts 2>/dev/null || echo '❌ CRITIQUE: hooks/useMessages.ts NON TROUVÉ - PRIORITÉ ABSOLUE' > messages_audit/hook_useMessages.ts

# Tests messages complets
echo "AUDIT MODULE MESSAGES - TESTS FONCTIONNELS COMPLETS:" > messages_audit/messages_tests.txt
echo "====================================================" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔥 TESTS CRITIQUES (BLOQUANTS SI KO):" >> messages_audit/messages_tests.txt
echo "======================================" >> messages_audit/messages_tests.txt
echo "- [ ] hooks/useMessages.ts existe et fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] API /api/messages répond correctement" >> messages_audit/messages_tests.txt
echo "- [ ] Page /dashboard/messages se charge" >> messages_audit/messages_tests.txt
echo "- [ ] Envoi d'un message de base fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Affichage liste conversations opérationnel" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "💬 INTERFACE MESSAGES (/dashboard/messages):" >> messages_audit/messages_tests.txt
echo "============================================" >> messages_audit/messages_tests.txt
echo "- [ ] Interface principale se charge sans erreur" >> messages_audit/messages_tests.txt
echo "- [ ] Sidebar conversations s'affiche" >> messages_audit/messages_tests.txt
echo "- [ ] Sélection conversation charge messages" >> messages_audit/messages_tests.txt
echo "- [ ] Zone de saisie nouveau message visible" >> messages_audit/messages_tests.txt
echo "- [ ] Envoi message temps réel fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Messages s'affichent dans l'ordre chronologique" >> messages_audit/messages_tests.txt
echo "- [ ] Scroll automatique vers dernier message" >> messages_audit/messages_tests.txt
echo "- [ ] Statuts messages (envoyé/lu) corrects" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "📝 NOUVEAU MESSAGE (/dashboard/messages/nouveau):" >> messages_audit/messages_tests.txt
echo "================================================" >> messages_audit/messages_tests.txt
echo "- [ ] Modal nouveau message s'ouvre/ferme" >> messages_audit/messages_tests.txt
echo "- [ ] 3 onglets (Direct/Chantier/Groupe) fonctionnent" >> messages_audit/messages_tests.txt
echo "- [ ] Sélection destinataires opérationnelle" >> messages_audit/messages_tests.txt
echo "- [ ] Validation avant envoi fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Page nouveau message alternative accessible" >> messages_audit/messages_tests.txt
echo "- [ ] Étapes de création (si multi-step) naviguent" >> messages_audit/messages_tests.txt
echo "- [ ] Upload fichiers/photos fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Redirection après envoi réussi" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔍 RECHERCHE MESSAGES (/dashboard/messages/recherche):" >> messages_audit/messages_tests.txt
echo "=====================================================" >> messages_audit/messages_tests.txt
echo "- [ ] Interface recherche s'affiche" >> messages_audit/messages_tests.txt
echo "- [ ] Champ recherche réagit à la saisie" >> messages_audit/messages_tests.txt
echo "- [ ] Résultats de recherche s'affichent" >> messages_audit/messages_tests.txt
echo "- [ ] Filtres de recherche fonctionnent" >> messages_audit/messages_tests.txt
echo "- [ ] Navigation vers message exact depuis résultat" >> messages_audit/messages_tests.txt
echo "- [ ] Recherche par date, expéditeur, contenu" >> messages_audit/messages_tests.txt
echo "- [ ] Performance recherche acceptable" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔄 APIs MESSAGES - TESTS TECHNIQUES:" >> messages_audit/messages_tests.txt
echo "===================================" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages (liste conversations)" >> messages_audit/messages_tests.txt
echo "- [ ] POST /api/messages (envoi message)" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages/contacts (liste contacts)" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages/search?q=term (recherche)" >> messages_audit/messages_tests.txt
echo "- [ ] PUT /api/messages/[id] (modification message)" >> messages_audit/messages_tests.txt
echo "- [ ] DELETE /api/messages/[id] (suppression message)" >> messages_audit/messages_tests.txt
echo "- [ ] POST /api/messages/mark-read (marquer lu)" >> messages_audit/messages_tests.txt
echo "- [ ] Authentification sur toutes les routes" >> messages_audit/messages_tests.txt
echo "- [ ] Validation données avec Zod/Joi" >> messages_audit/messages_tests.txt
echo "- [ ] Gestion erreurs robuste (400, 404, 500)" >> messages_audit/messages_tests.txt
echo "- [ ] Rate limiting implémenté" >> messages_audit/messages_tests.txt

echo "✅ Messages audit exporté dans: messages_audit/"

# =============================================================================
# 8. COMPOSANTS UI GLOBAUX - DESIGN SYSTEM
# =============================================================================
echo ""
echo "🎨 8. COMPOSANTS UI & DESIGN SYSTEM"
echo "=================================="
mkdir -p ui_components

# Composants UI de base
ui_base_components=("button" "input" "card" "badge" "avatar" "modal" "dropdown" "toast" "loading" "error")

for comp in "${ui_base_components[@]}"; do
    echo "--- components/ui/$comp.tsx ---" > "ui_components/$comp.tsx"
    cat "../components/ui/$comp.tsx" > "ui_components/$comp.tsx" 2>/dev/null || echo "❌ $comp.tsx NON TROUVÉ - À CRÉER" > "ui_components/$comp.tsx"
done

# Navigation components
echo "--- components/Navigation.tsx ---" > ui_components/Navigation.tsx
cat ../components/Navigation.tsx > ui_components/Navigation.tsx 2>/dev/null || echo '❌ Navigation.tsx NON TROUVÉ' > ui_components/Navigation.tsx

echo "--- components/Sidebar.tsx ---" > ui_components/Sidebar.tsx
cat ../components/Sidebar.tsx > ui_components/Sidebar.tsx 2>/dev/null || echo '❌ Sidebar.tsx NON TROUVÉ' > ui_components/Sidebar.tsx

echo "--- components/Header.tsx ---" > ui_components/Header.tsx
cat ../components/Header.tsx > ui_components/Header.tsx 2>/dev/null || echo '// Header.tsx non trouvé' > ui_components/Header.tsx

# Layout components
echo "--- components/Layout.tsx ---" > ui_components/Layout.tsx
cat ../components/Layout.tsx > ui_components/Layout.tsx 2>/dev/null || echo '// Layout.tsx non trouvé' > ui_components/Layout.tsx

# Form components
form_components=("form" "field" "select" "checkbox" "radio" "textarea" "file-upload")
for form_comp in "${form_components[@]}"; do
    echo "--- components/ui/$form_comp.tsx ---" > "ui_components/form_$form_comp.tsx"
    cat "../components/ui/$form_comp.tsx" > "ui_components/form_$form_comp.tsx" 2>/dev/null || echo "// $form_comp.tsx non trouvé" > "ui_components/form_$form_comp.tsx"
done

# Analyse CSS Design System
echo "ANALYSE DESIGN SYSTEM CSS:" > ui_components/design_system_analysis.txt
echo "===========================" >> ui_components/design_system_analysis.txt
if [ -f "../app/globals.css" ]; then
    echo "=== VARIABLES CSS GLOBALES ===" >> ui_components/design_system_analysis.txt
    grep -n ":" ../app/globals.css | head -50 >> ui_components/design_system_analysis.txt
    echo "" >> ui_components/design_system_analysis.txt
    echo "=== CLASSES UTILITAIRES DÉTECTÉES ===" >> ui_components/design_system_analysis.txt
    grep -E "\.(glass|card|btn-|gradient)" ../app/globals.css >> ui_components/design_system_analysis.txt 2>/dev/null
else
    echo "❌ CRITIQUE: globals.css non trouvé - Design system manquant" >> ui_components/design_system_analysis.txt
fi

# Tests UI Components
echo "TESTS COMPOSANTS UI - DESIGN SYSTEM:" > ui_components/ui_tests.txt
echo "====================================" >> ui_components/ui_tests.txt
echo "🎨 COHÉRENCE DESIGN:" >> ui_components/ui_tests.txt
echo "- [ ] CSS vanilla cohérent partout (pas de Tailwind mélangé)" >> ui_components/ui_tests.txt
echo "- [ ] Classes réutilisées (.glass, .card, .btn-primary)" >> ui_components/ui_tests.txt
echo "- [ ] Gradients bleu/orange respectés (#3b82f6 → #f97316)" >> ui_components/ui_tests.txt
echo "- [ ] Typography Inter utilisée partout" >> ui_components/ui_tests.txt
echo "- [ ] Animations fluides (0.3s ease)" >> ui_components/ui_tests.txt
echo "- [ ] Hover effects cohérents" >> ui_components/ui_tests.txt
echo "- [ ] Variables CSS globales utilisées" >> ui_components/ui_tests.txt
echo "" >> ui_components/ui_tests.txt
echo "📱 RESPONSIVE DESIGN:" >> ui_components/ui_tests.txt
echo "- [ ] Desktop (1920x1080, 1366x768)" >> ui_components/ui_tests.txt
echo "- [ ] Tablet (768x1024, iPad)" >> ui_components/ui_tests.txt
echo "- [ ] Mobile (375x667, 414x896)" >> ui_components/ui_tests.txt
echo "- [ ] Navigation mobile (hamburger si existe)" >> ui_components/ui_tests.txt
echo "- [ ] Formulaires utilisables sur mobile" >> ui_components/ui_tests.txt
echo "- [ ] Texte lisible toutes tailles" >> ui_components/ui_tests.txt
echo "- [ ] Touch targets > 44px mobile" >> ui_components/ui_tests.txt
echo "" >> ui_components/ui_tests.txt
echo "♿ ACCESSIBILITÉ:" >> ui_components/ui_tests.txt
echo "- [ ] Navigation clavier (Tab, Enter, Escape)" >> ui_components/ui_tests.txt
echo "- [ ] Focus visible éléments interactifs" >> ui_components/ui_tests.txt
echo "- [ ] Contrast ratio suffisant (4.5:1 min)" >> ui_components/ui_tests.txt
echo "- [ ] Alt texts sur images" >> ui_components/ui_tests.txt
echo "- [ ] Labels sur formulaires" >> ui_components/ui_tests.txt
echo "- [ ] ARIA attributes si nécessaire" >> ui_components/ui_tests.txt
echo "- [ ] Pas de clignotements rapides" >> ui_components/ui_tests.txt

echo "✅ UI Components audit exporté dans: ui_components/"

# =============================================================================
# 9. TYPES & VALIDATIONS - SÉCURITÉ
# =============================================================================
echo ""
echo "📝 9. TYPES & VALIDATIONS - AUDIT SÉCURITÉ"
echo "=========================================="
mkdir -p types_security

# Types principaux
echo "--- types/index.ts ---" > types_security/index.ts
cat ../types/index.ts > types_security/index.ts 2>/dev/null || echo '❌ types/index.ts NON TROUVÉ - À CRÉER' > types_security/index.ts

echo "--- types/messages.ts ---" > types_security/messages.ts
cat ../types/messages.ts > types_security/messages.ts 2>/dev/null || echo '❌ CRITIQUE: types/messages.ts NON TROUVÉ - À CRÉER' > types_security/messages.ts

echo "--- types/chantiers.ts ---" > types_security/chantiers.ts
cat ../types/chantiers.ts > types_security/chantiers.ts 2>/dev/null || echo '// types/chantiers.ts non trouvé' > types_security/chantiers.ts

echo "--- types/auth.ts ---" > types_security/auth.ts
cat ../types/auth.ts > types_security/auth.ts 2>/dev/null || echo '// types/auth.ts non trouvé' > types_security/auth.ts

# Next-auth types
echo "--- types/next-auth.d.ts ---" > types_security/next-auth.d.ts
cat ../types/next-auth.d.ts > types_security/next-auth.d.ts 2>/dev/null || echo '// next-auth.d.ts non trouvé' > types_security/next-auth.d.ts

# Validations Zod/Joi
echo "--- lib/validations.ts ---" > types_security/validations.ts
cat ../lib/validations.ts > types_security/validations.ts 2>/dev/null || echo '❌ CRITIQUE: lib/validations.ts NON TROUVÉ - SÉCURITÉ' > types_security/validations.ts

echo "--- lib/schemas.ts ---" > types_security/schemas.ts
cat ../lib/schemas.ts > types_security/schemas.ts 2>/dev/null || echo '// lib/schemas.ts non trouvé' > types_security/schemas.ts

# Utilitaires
echo "--- lib/utils.ts ---" > types_security/utils.ts
cat ../lib/utils.ts > types_security/utils.ts 2>/dev/null || echo '// lib/utils.ts non trouvé' > types_security/utils.ts

# Constants
echo "--- lib/constants.ts ---" > types_security/constants.ts
cat ../lib/constants.ts > types_security/constants.ts 2>/dev/null || echo '// lib/constants.ts non trouvé' > types_security/constants.ts

# Security analysis
echo "AUDIT SÉCURITÉ - VALIDATIONS & TYPES:" > types_security/security_audit.txt
echo "=====================================" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "🔐 VALIDATION DONNÉES ENTRANTES:" >> types_security/security_audit.txt
echo "================================" >> types_security/security_audit.txt
echo "- [ ] Toutes APIs POST/PUT ont validation Zod/Joi" >> types_security/security_audit.txt
echo "- [ ] Sanitisation XSS sur tous inputs" >> types_security/security_audit.txt
echo "- [ ] Validation taille fichiers upload" >> types_security/security_audit.txt
echo "- [ ] Validation types MIME upload" >> types_security/security_audit.txt
echo "- [ ] Limites longueur champs texte" >> types_security/security_audit.txt
echo "- [ ] Validation formats email, URL, etc." >> types_security/security_audit.txt
echo "- [ ] Échappement SQL injection" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "🛡️ PROTECTION ROUTES:" >> types_security/security_audit.txt
echo "=====================" >> types_security/security_audit.txt
echo "- [ ] Middleware auth sur /dashboard/*" >> types_security/security_audit.txt
echo "- [ ] Vérification rôles utilisateur" >> types_security/security_audit.txt
echo "- [ ] CSRF protection" >> types_security/security_audit.txt
echo "- [ ] Rate limiting APIs" >> types_security/security_audit.txt
echo "- [ ] Headers sécurité (HSTS, X-Frame-Options)" >> types_security/security_audit.txt
echo "- [ ] Validation JWT tokens" >> types_security/security_audit.txt
echo "- [ ] Pas de données sensibles en localStorage" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "📊 TYPES TYPESCRIPT:" >> types_security/security_audit.txt
echo "====================" >> types_security/security_audit.txt
echo "- [ ] Types stricts partout (pas de 'any')" >> types_security/security_audit.txt
echo "- [ ] Interfaces cohérentes frontend/backend" >> types_security/security_audit.txt
echo "- [ ] Types générés depuis Prisma utilisés" >> types_security/security_audit.txt
echo "- [ ] Enums pour valeurs fixes" >> types_security/security_audit.txt
echo "- [ ] Types optionnels/obligatoires corrects" >> types_security/security_audit.txt

echo "✅ Types & Sécurité audit exporté dans: types_security/"

# =============================================================================
# 10. HOOKS PERSONNALISÉS - LOGIQUE MÉTIER
# =============================================================================
echo ""
echo "🎣 10. HOOKS PERSONNALISÉS - AUDIT LOGIQUE MÉTIER"
echo "================================================"
mkdir -p hooks_audit

# Hook useMessages (CRITIQUE)
echo "--- hooks/useMessages.ts ---" > hooks_audit/useMessages.ts
cat ../hooks/useMessages.ts > hooks_audit/useMessages.ts 2>/dev/null || echo '❌ CRITIQUE: hooks/useMessages.ts NON TROUVÉ - PRIORITÉ ABSOLUE' > hooks_audit/useMessages.ts

# Autres hooks existants
if [ -d "../hooks" ]; then
    find ../hooks -name "*.ts" -o -name "*.tsx" | while read hook_file; do
        hook_name=$(basename "$hook_file")
        if [ "$hook_name" != "useMessages.ts" ]; then
            echo "--- hooks/$hook_name ---" > "hooks_audit/$hook_name"
            cat "$hook_file" >> "hooks_audit/$hook_name"
        fi
    done
else
    echo '❌ DOSSIER /hooks NON TROUVÉ - À CRÉER' > hooks_audit/HOOKS_MANQUANTS.txt
    echo 'Hooks critiques à créer:' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useMessages.ts (notifications, polling)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useChantiers.ts (gestion CRUD chantiers)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useAuth.ts (session, rôles)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useApi.ts (requêtes HTTP génériques)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useLocalStorage.ts (persistance locale)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useDebounce.ts (recherche temps réel)' >> hooks_audit/HOOKS_MANQUANTS.txt
fi

# Custom hooks communes qu'on peut chercher
common_hooks=("useAuth" "useApi" "useLocalStorage" "useDebounce" "useChantiers" "useNotifications" "useUpload" "useSearch")

for hook in "${common_hooks[@]}"; do
    echo "--- hooks/$hook.ts ---" > "hooks_audit/$hook.ts"
    cat "../hooks/$hook.ts" > "hooks_audit/$hook.ts" 2>/dev/null || echo "// $hook.ts non trouvé - Peut être utile" > "hooks_audit/$hook.ts"
done

# Tests hooks
echo "AUDIT HOOKS PERSONNALISÉS:" > hooks_audit/hooks_tests.txt
echo "===========================" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "🎣 useMessages (CRITIQUE):" >> hooks_audit/hooks_tests.txt
echo "==========================" >> hooks_audit/hooks_tests.txt
echo "- [ ] Hook existe et est importable" >> hooks_audit/hooks_tests.txt
echo "- [ ] Polling conversations toutes les 30s" >> hooks_audit/hooks_tests.txt
echo "- [ ] État conversations synchronisé" >> hooks_audit/hooks_tests.txt
echo "- [ ] sendMessage fonctionne" >> hooks_audit/hooks_tests.txt
echo "- [ ] Gestion loading/error states" >> hooks_audit/hooks_tests.txt
echo "- [ ] Optimistic updates" >> hooks_audit/hooks_tests.txt
echo "- [ ] Cleanup intervals sur unmount" >> hooks_audit/hooks_tests.txt
echo "- [ ] Types TypeScript corrects" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "🏗️ AUTRES HOOKS MÉTIER:" >> hooks_audit/hooks_tests.txt
echo "========================" >> hooks_audit/hooks_tests.txt
echo "- [ ] useChantiers: CRUD, filtres, recherche" >> hooks_audit/hooks_tests.txt
echo "- [ ] useAuth: session, login/logout, rôles" >> hooks_audit/hooks_tests.txt
echo "- [ ] useApi: requêtes HTTP, cache, error handling" >> hooks_audit/hooks_tests.txt
echo "- [ ] useDebounce: recherche temps réel optimisée" >> hooks_audit/hooks_tests.txt
echo "- [ ] useNotifications: toasts, badges count" >> hooks_audit/hooks_tests.txt
echo "- [ ] useUpload: gestion fichiers, progress" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "⚡ PERFORMANCE HOOKS:" >> hooks_audit/hooks_tests.txt
echo "====================" >> hooks_audit/hooks_tests.txt
echo "- [ ] Pas de re-renders inutiles" >> hooks_audit/hooks_tests.txt
echo "- [ ] useCallback/useMemo utilisés à bon escient" >> hooks_audit/hooks_tests.txt
echo "- [ ] Cleanup effects (intervals, listeners)" >> hooks_audit/hooks_tests.txt
echo "- [ ] Dependencies arrays correctes" >> hooks_audit/hooks_tests.txt
echo "- [ ] Pas de memory leaks" >> hooks_audit/hooks_tests.txt

echo "✅ Hooks audit exporté dans: hooks_audit/"

# =============================================================================
# 11. ANALYSE COMPLÈTE APIs REST
# =============================================================================
echo ""
echo "🔄 11. ANALYSE COMPLÈTE APIs REST"
echo "================================"
mkdir -p apis_audit

# Trouver TOUTES les APIs
echo "INVENTAIRE COMPLET APIs:" > apis_audit/apis_inventory.txt
echo "========================" >> apis_audit/apis_inventory.txt
find ../app/api -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/}
    echo "✅ $rel_path" >> apis_audit/apis_inventory.txt
    
    # Extraire chaque API
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    echo "--- $api_file ---" > "apis_audit/api_$safe_name.ts"
    cat "$api_file" >> "apis_audit/api_$safe_name.ts" 2>/dev/null
done

# Si aucune API trouvée
if [ ! -d "../app/api" ]; then
    echo "❌ CRITIQUE: Dossier /app/api NON TROUVÉ" >> apis_audit/apis_inventory.txt
    echo "APIs critiques manquantes:" >> apis_audit/apis_inventory.txt
    echo "- /api/auth/[...nextauth]/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/chantiers/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/chantiers/[id]/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/contacts/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/search/route.ts" >> apis_audit/apis_inventory.txt
fi

# Tests APIs complets
echo "TESTS APIS REST - AUDIT TECHNIQUE COMPLET:" > apis_audit/apis_tests.txt
echo "===========================================" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🔐 AUTHENTIFICATION API:" >> apis_audit/apis_tests.txt
echo "========================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/auth/[...nextauth] (NextAuth endpoints)" >> apis_audit/apis_tests.txt
echo "- [ ] Session handling correct" >> apis_audit/apis_tests.txt
echo "- [ ] Redirections après login/logout" >> apis_audit/apis_tests.txt
echo "- [ ] CSRF protection active" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🏗️ CHANTIERS API (CRUD COMPLET):" >> apis_audit/apis_tests.txt
echo "==================================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers → 200 (liste avec données)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/chantiers → 201 (création réussie)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers/[id] → 200 (détail)" >> apis_audit/apis_tests.txt
echo "- [ ] PUT /api/chantiers/[id] → 200 (modification)" >> apis_audit/apis_tests.txt
echo "- [ ] DELETE /api/chantiers/[id] → 200 (suppression)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers/inexistant → 404" >> apis_audit/apis_tests.txt
echo "- [ ] POST sans auth → 401" >> apis_audit/apis_tests.txt
echo "- [ ] POST données invalides → 400" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "💬 MESSAGES API (NOUVEAU MODULE):" >> apis_audit/apis_tests.txt
echo "==================================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages → 200 (conversations)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages → 201 (nouveau message)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages/contacts → 200 (liste contacts)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages/search?q=term → 200 (résultats)" >> apis_audit/apis_tests.txt
echo "- [ ] PUT /api/messages/[id] → 200 (modification)" >> apis_audit/apis_tests.txt
echo "- [ ] DELETE /api/messages/[id] → 200 (suppression)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages/mark-read → 200 (marquer lu)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages/files/upload → 201 (upload)" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "⚡ PERFORMANCE & SÉCURITÉ APIs:" >> apis_audit/apis_tests.txt
echo "===============================" >> apis_audit/apis_tests.txt
echo "- [ ] Réponse < 500ms pour requêtes simples" >> apis_audit/apis_tests.txt
echo "- [ ] Pagination sur listes longues" >> apis_audit/apis_tests.txt
echo "- [ ] Rate limiting (100 req/min par user)" >> apis_audit/apis_tests.txt
echo "- [ ] Validation stricte données entrantes" >> apis_audit/apis_tests.txt
echo "- [ ] Logs d'erreurs détaillés" >> apis_audit/apis_tests.txt
echo "- [ ] Headers CORS appropriés" >> apis_audit/apis_tests.txt
echo "- [ ] Gestion erreurs DB (connexion, timeout)" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🧪 TESTS EDGE CASES:" >> apis_audit/apis_tests.txt
echo "====================" >> apis_audit/apis_tests.txt
echo "- [ ] Données null/undefined gérées" >> apis_audit/apis_tests.txt
echo "- [ ] Caractères spéciaux dans requêtes" >> apis_audit/apis_tests.txt
echo "- [ ] Requêtes simultanées multiples" >> apis_audit/apis_tests.txt
echo "- [ ] Timeout réseau simulé" >> apis_audit/apis_tests.txt
echo "- [ ] DB indisponible temporairement" >> apis_audit/apis_tests.txt
echo "- [ ] Payload trop volumineux → 413" >> apis_audit/apis_tests.txt
echo "- [ ] Méthodes HTTP non supportées → 405" >> apis_audit/apis_tests.txt

echo "✅ APIs audit exporté dans: apis_audit/"

# =============================================================================
# 12. TESTS PERFORMANCE COMPLETS
# =============================================================================
echo ""
echo "⚡ 12. AUDIT PERFORMANCE COMPLET"
echo "==============================="
mkdir -p performance_audit

# Analyse bundle et build
echo "PERFORMANCE - CHECKLIST COMPLÈTE:" > performance_audit/performance_tests.txt
echo "=================================" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🚀 CHARGEMENT PAGES (CORE WEB VITALS):" >> performance_audit/performance_tests.txt
echo "======================================" >> performance_audit/performance_tests.txt
echo "- [ ] Page d'accueil < 2s (LCP)" >> performance_audit/performance_tests.txt
echo "- [ ] Dashboard < 3s (avec données)" >> performance_audit/performance_tests.txt
echo "- [ ] Liste chantiers < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] Détail chantier < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] Interface messages < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] First Contentful Paint < 1.5s" >> performance_audit/performance_tests.txt
echo "- [ ] Largest Contentful Paint < 2.5s" >> performance_audit/performance_tests.txt
echo "- [ ] Largest Contentful Paint < 2.5s" >> performance_audit/performance_tests.txt
echo "- [ ] Cumulative Layout Shift < 0.1" >> performance_audit/performance_tests.txt
echo "- [ ] First Input Delay < 100ms" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "⚡ INTERACTIONS TEMPS RÉEL:" >> performance_audit/performance_tests.txt
echo "===========================" >> performance_audit/performance_tests.txt
echo "- [ ] Recherche temps réel < 300ms" >> performance_audit/performance_tests.txt
echo "- [ ] Navigation entre pages fluide" >> performance_audit/performance_tests.txt
echo "- [ ] Formulaires répondent instantanément" >> performance_audit/performance_tests.txt
echo "- [ ] Animations fluides 60fps" >> performance_audit/performance_tests.txt
echo "- [ ] Scroll smooth sur longues listes" >> performance_audit/performance_tests.txt
echo "- [ ] Upload fichiers avec progress" >> performance_audit/performance_tests.txt
echo "- [ ] Pas de freeze UI pendant requêtes" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🌐 OPTIMISATIONS RÉSEAU:" >> performance_audit/performance_tests.txt
echo "========================" >> performance_audit/performance_tests.txt
echo "- [ ] Requêtes API optimisées (pas de doublons)" >> performance_audit/performance_tests.txt
echo "- [ ] Images optimisées Next.js" >> performance_audit/performance_tests.txt
echo "- [ ] Compression gzip activée" >> performance_audit/performance_tests.txt
echo "- [ ] Cache approprié (headers, SWR)" >> performance_audit/performance_tests.txt
echo "- [ ] Lazy loading images/composants" >> performance_audit/performance_tests.txt
echo "- [ ] Bundle splitting efficace" >> performance_audit/performance_tests.txt
echo "- [ ] Prefetch routes importantes" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🧠 MÉMOIRE & CPU:" >> performance_audit/performance_tests.txt
echo "=================" >> performance_audit/performance_tests.txt
echo "- [ ] Pas de memory leaks" >> performance_audit/performance_tests.txt
echo "- [ ] Event listeners nettoyés" >> performance_audit/performance_tests.txt
echo "- [ ] Intervals/timeouts clearés" >> performance_audit/performance_tests.txt
echo "- [ ] Re-renders React minimisés" >> performance_audit/performance_tests.txt
echo "- [ ] Virtualisation si listes longues (>1000 items)" >> performance_audit/performance_tests.txt
echo "- [ ] Debounce sur recherches" >> performance_audit/performance_tests.txt

# Build analysis
echo "" >> performance_audit/performance_tests.txt
echo "📦 BUILD & BUNDLE ANALYSIS:" >> performance_audit/performance_tests.txt
echo "============================" >> performance_audit/performance_tests.txt
echo "Commandes à exécuter pour audit:" >> performance_audit/performance_tests.txt
echo "npm run build" >> performance_audit/performance_tests.txt
echo "npm run analyze (si script existe)" >> performance_audit/performance_tests.txt
echo "npx @next/bundle-analyzer" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "- [ ] Build sans erreurs TypeScript" >> performance_audit/performance_tests.txt
echo "- [ ] Bundle size total < 500KB" >> performance_audit/performance_tests.txt
echo "- [ ] Chunks optimisés" >> performance_audit/performance_tests.txt
echo "- [ ] Tree shaking efficace" >> performance_audit/performance_tests.txt
echo "- [ ] Code splitting par routes" >> performance_audit/performance_tests.txt
echo "- [ ] Dependencies inutiles supprimées" >> performance_audit/performance_tests.txt

echo "✅ Performance audit exporté dans: performance_audit/"

# =============================================================================
# 13. TESTS MULTI-NAVIGATEURS & DEVICES
# =============================================================================
echo ""
echo "🌐 13. TESTS MULTI-NAVIGATEURS & DEVICES"
echo "========================================"
mkdir -p cross_platform_tests

echo "TESTS CROSS-PLATFORM COMPLETS:" > cross_platform_tests/browser_device_tests.txt
echo "===============================" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "💻 DESKTOP BROWSERS:" >> cross_platform_tests/browser_device_tests.txt
echo "====================" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Chrome (dernière version)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Firefox (dernière version)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Safari (si macOS disponible)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Edge (Windows)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Opera (test optionnel)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "📱 MOBILE BROWSERS:" >> cross_platform_tests/browser_device_tests.txt
echo "===================" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Chrome mobile (Android)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Safari mobile (iOS)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Samsung Internet" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Firefox mobile" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "📐 RÉSOLUTIONS TESTÉES:" >> cross_platform_tests/browser_device_tests.txt
echo "=======================" >> cross_platform_tests/browser_device_tests.txt
echo "Desktop:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1920x1080 (Full HD)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1366x768 (laptop commun)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1440x900 (MacBook)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 2560x1440 (2K)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Tablet:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 768x1024 (iPad portrait)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 1024x768 (iPad landscape)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 601x962 (Surface)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Mobile:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 375x667 (iPhone 8)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 414x896 (iPhone 11)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 360x640 (Android commun)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] 375x812 (iPhone X)" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "🧪 TESTS PAR FONCTIONNALITÉ:" >> cross_platform_tests/browser_device_tests.txt
echo "=============================" >> cross_platform_tests/browser_device_tests.txt
echo "Navigation:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Menu hamburger mobile" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Sidebar responsive" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Tabs navigation touch-friendly" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Formulaires:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Inputs utilisables mobile" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Keyboards virtuels supportés" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Validation temps réel" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Upload fichiers mobile" >> cross_platform_tests/browser_device_tests.txt
echo "" >> cross_platform_tests/browser_device_tests.txt
echo "Interactions:" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Touch gestures (swipe, pinch)" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Hover states desktop" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Click/tap targets > 44px" >> cross_platform_tests/browser_device_tests.txt
echo "- [ ] Scroll momentum mobile" >> cross_platform_tests/browser_device_tests.txt

echo "✅ Cross-platform tests exportés dans: cross_platform_tests/"

# =============================================================================
# 14. VARIABLES D'ENVIRONNEMENT & CONFIGURATION
# =============================================================================
echo ""
echo "⚙️ 14. VARIABLES D'ENVIRONNEMENT & CONFIG"
echo "========================================="
mkdir -p env_config

# Variables d'environnement
echo "ANALYSE VARIABLES ENVIRONNEMENT:" > env_config/env_analysis.txt
echo "================================" >> env_config/env_analysis.txt
echo "" >> env_config/env_analysis.txt

if [ -f "../.env.example" ]; then
    echo "=== .env.example TROUVÉ ===" >> env_config/env_analysis.txt
    cat ../.env.example >> env_config/env_analysis.txt
    echo "" >> env_config/env_analysis.txt
    cp ../.env.example env_config/env.example
elif [ -f "../.env.local" ]; then
    echo "=== .env.local STRUCTURE (masqué) ===" >> env_config/env_analysis.txt
    grep -E "^[A-Z_]+=" ../.env.local | sed 's/=.*/=***MASKED***/' >> env_config/env_analysis.txt 2>/dev/null
else
    echo "⚠️ Aucun fichier .env exemple trouvé" >> env_config/env_analysis.txt
fi

echo "" >> env_config/env_analysis.txt
echo "VARIABLES CRITIQUES À VÉRIFIER:" >> env_config/env_analysis.txt
echo "===============================" >> env_config/env_analysis.txt
echo "- [ ] DATABASE_URL (PostgreSQL)" >> env_config/env_analysis.txt
echo "- [ ] NEXTAUTH_SECRET (sécurité JWT)" >> env_config/env_analysis.txt
echo "- [ ] NEXTAUTH_URL (callbacks auth)" >> env_config/env_analysis.txt
echo "- [ ] NODE_ENV (production/development)" >> env_config/env_analysis.txt
echo "- [ ] UPLOAD_DIR ou CLOUDINARY_URL (fichiers)" >> env_config/env_analysis.txt
echo "- [ ] EMAIL_* (notifications email si implémenté)" >> env_config/env_analysis.txt
echo "- [ ] REDIS_URL (cache si implémenté)" >> env_config/env_analysis.txt

# Configuration files
echo "--- .eslintrc.json ---" > env_config/eslintrc.json
cat ../.eslintrc.json > env_config/eslintrc.json 2>/dev/null || echo '// .eslintrc.json non trouvé' > env_config/eslintrc.json

echo "--- .prettierrc ---" > env_config/prettierrc.json
cat ../.prettierrc* > env_config/prettierrc.json 2>/dev/null || echo '// .prettierrc non trouvé' > env_config/prettierrc.json

echo "--- .gitignore ---" > env_config/gitignore.txt
cat ../.gitignore > env_config/gitignore.txt 2>/dev/null || echo '// .gitignore non trouvé' > env_config/gitignore.txt

# Vercel/deployment config
echo "--- vercel.json ---" > env_config/vercel.json
cat ../vercel.json > env_config/vercel.json 2>/dev/null || echo '// vercel.json non trouvé' > env_config/vercel.json

echo "✅ Env & Config exportés dans: env_config/"

# =============================================================================
# 15. PLAN D'AUDIT MÉTHODIQUE COMPLET
# =============================================================================
echo ""
echo "📋 15. PLAN D'AUDIT MÉTHODIQUE COMPLET"
echo "====================================="

echo "PLAN D'AUDIT CHANTIERPRO - MÉTHODOLOGIE COMPLÈTE" > plan_audit_complet.txt
echo "=================================================" >> plan_audit_complet.txt
echo "Date: $(date)" >> plan_audit_complet.txt
echo "Objectif: AUDIT COMPLET → CORRECTIONS → PRODUCTION READY" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt

echo "🔍 PHASE 1 - AUDIT TECHNIQUE INFRASTRUCTURE (2-3h)" >> plan_audit_complet.txt
echo "===================================================" >> plan_audit_complet.txt
echo "1.1 BUILD & COMPILATION:" >> plan_audit_complet.txt
echo "- [ ] npm install (vérifier dépendances)" >> plan_audit_complet.txt
echo "- [ ] npm run build (compilation production)" >> plan_audit_complet.txt
echo "- [ ] npm run type-check (TypeScript strict)" >> plan_audit_complet.txt
echo "- [ ] npm run lint (ESLint + fix auto)" >> plan_audit_complet.txt
echo "- [ ] Analyser bundle size et optimisations" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "1.2 BASE DE DONNÉES:" >> plan_audit_complet.txt
echo "- [ ] npx prisma validate (schema valide)" >> plan_audit_complet.txt
echo "- [ ] npx prisma generate (client à jour)" >> plan_audit_complet.txt
echo "- [ ] npx prisma db push (sync structure)" >> plan_audit_complet.txt
echo "- [ ] npx prisma studio (explorer données)" >> plan_audit_complet.txt
echo "- [ ] Tester connexions DB + seed data" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "1.3 ENVIRONMENT & CONFIG:" >> plan_audit_complet.txt
echo "- [ ] Variables .env toutes présentes" >> plan_audit_complet.txt
echo "- [ ] NEXTAUTH_SECRET sécurisé" >> plan_audit_complet.txt
echo "- [ ] DATABASE_URL fonctionnelle" >> plan_audit_complet.txt
echo "- [ ] Middleware protection routes" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🧪 PHASE 2 - TESTS APIS REST (3-4h)" >> plan_audit_complet.txt
echo "====================================" >> plan_audit_complet.txt
echo "2.1 AUTHENTIFICATION:" >> plan_audit_complet.txt
echo "- [ ] Login/logout fonctionnels" >> plan_audit_complet.txt
echo "- [ ] Sessions persistantes" >> plan_audit_complet.txt
echo "- [ ] Protection /dashboard/*" >> plan_audit_complet.txt
echo "- [ ] Rôles utilisateurs" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "2.2 CHANTIERS CRUD (référence):" >> plan_audit_complet.txt
echo "- [ ] GET /api/chantiers → 200" >> plan_audit_complet.txt
echo "- [ ] POST /api/chantiers → 201" >> plan_audit_complet.txt
echo "- [ ] GET/PUT/DELETE /api/chantiers/[id]" >> plan_audit_complet.txt
echo "- [ ] Validation données + erreurs HTTP" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "2.3 MESSAGES (nouveau module):" >> plan_audit_complet.txt
echo "- [ ] Toutes routes /api/messages/*" >> plan_audit_complet.txt
echo "- [ ] CRUD complet messages" >> plan_audit_complet.txt
echo "- [ ] Recherche + contacts" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers" >> plan_audit_complet.txt
echo "- [ ] Rate limiting + sécurité" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🎨 PHASE 3 - TESTS UI/UX COMPLETS (4-5h)" >> plan_audit_complet.txt
echo "=========================================" >> plan_audit_complet.txt
echo "3.1 DASHBOARD PRINCIPAL:" >> plan_audit_complet.txt
echo "- [ ] Chargement < 3s avec données réelles" >> plan_audit_complet.txt
echo "- [ ] Stats cards fonctionnelles" >> plan_audit_complet.txt
echo "- [ ] Navigation vers modules" >> plan_audit_complet.txt
echo "- [ ] Quick actions opérationnelles" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "3.2 MODULE CHANTIERS (référence CRUD):" >> plan_audit_complet.txt
echo "- [ ] Liste + filtres + recherche" >> plan_audit_complet.txt
echo "- [ ] Détail chantier complet" >> plan_audit_complet.txt
echo "- [ ] Formulaire création multi-étapes" >> plan_audit_complet.txt
echo "- [ ] Upload photos + timeline" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "3.3 MODULE MESSAGES (focus audit):" >> plan_audit_complet.txt
echo "- [ ] Interface principale chat" >> plan_audit_complet.txt
echo "- [ ] Nouveau message modal + page" >> plan_audit_complet.txt
echo "- [ ] Recherche messages globale" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers + médias viewer" >> plan_audit_complet.txt
echo "- [ ] Notifications temps réel" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "📱 PHASE 4 - RESPONSIVE & CROSS-PLATFORM (2-3h)" >> plan_audit_complet.txt
echo "================================================" >> plan_audit_complet.txt
echo "4.1 DEVICES:" >> plan_audit_complet.txt
echo "- [ ] Desktop (1920x1080, 1366x768)" >> plan_audit_complet.txt
echo "- [ ] Tablet (iPad portrait/landscape)" >> plan_audit_complet.txt
echo "- [ ] Mobile (iPhone, Android diverses tailles)" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "4.2 BROWSERS:" >> plan_audit_complet.txt
echo "- [ ] Chrome, Firefox, Safari, Edge" >> plan_audit_complet.txt
echo "- [ ] Chrome/Safari mobile" >> plan_audit_complet.txt
echo "- [ ] Fonctionnalités touch mobile" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "4.3 DESIGN CONSISTENCY:" >> plan_audit_complet.txt
echo "- [ ] CSS vanilla cohérent (pas Tailwind mélangé)" >> plan_audit_complet.txt
echo "- [ ] Classes .glass, .card, .btn-primary réutilisées" >> plan_audit_complet.txt
echo "- [ ] Gradients bleu/orange respectés" >> plan_audit_complet.txt
echo "- [ ] Typography Inter partout" >> plan_audit_complet.txt
echo "- [ ] Animations 0.3s ease cohérentes" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "⚡ PHASE 5 - PERFORMANCE & SÉCURITÉ (2-3h)" >> plan_audit_complet.txt
echo "===========================================" >> plan_audit_complet.txt
echo "5.1 PERFORMANCE:" >> plan_audit_complet.txt
echo "- [ ] Core Web Vitals (LCP < 2.5s, CLS < 0.1)" >> plan_audit_complet.txt
echo "- [ ] Recherche temps réel < 300ms" >> plan_audit_complet.txt
echo "- [ ] Navigation fluide entre pages" >> plan_audit_complet.txt
echo "- [ ] Memory leaks + cleanup effects" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "5.2 SÉCURITÉ:" >> plan_audit_complet.txt
echo "- [ ] Validation Zod toutes APIs POST/PUT" >> plan_audit_complet.txt
echo "- [ ] XSS prevention sur inputs" >> plan_audit_complet.txt
echo "- [ ] CSRF protection active" >> plan_audit_complet.txt
echo "- [ ] Rate limiting APIs" >> plan_audit_complet.txt
echo "- [ ] Upload fichiers sécurisé" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🧪 PHASE 6 - EDGE CASES & ROBUSTESSE (2h)" >> plan_audit_complet.txt
echo "==========================================" >> plan_audit_complet.txt
echo "6.1 DONNÉES EDGE CASES:" >> plan_audit_complet.txt
echo "- [ ] Données vides/null gérées gracieusement" >> plan_audit_complet.txt
echo "- [ ] Listes vides → empty state approprié" >> plan_audit_complet.txt
echo "- [ ] Caractères spéciaux dans formulaires" >> plan_audit_complet.txt
echo "- [ ] Limites longueur champs respectées" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "6.2 RÉSEAU:" >> plan_audit_complet.txt
echo "- [ ] Connexion lente simulée" >> plan_audit_complet.txt
echo "- [ ] Connexion coupée/restaurée" >> plan_audit_complet.txt
echo "- [ ] Timeout API avec retry" >> plan_audit_complet.txt
echo "- [ ] Mode dégradé fonctionnel" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "📊 PHASE 7 - RAPPORT & CORRECTIONS (1-2h par bug)" >> plan_audit_complet.txt
echo "==================================================" >> plan_audit_complet.txt
echo "7.1 CATÉGORISATION BUGS:" >> plan_audit_complet.txt
echo "🔴 CRITIQUE: App crash, fonctionnalité core cassée" >> plan_audit_complet.txt
echo "🟠 MAJEUR: Fonctionnalité importante ne marche pas" >> plan_audit_complet.txt
echo "🟡 MINEUR: Bug UX, performance, edge case" >> plan_audit_complet.txt
echo "🔵 COSMÉTIQUE: Design inconsistency, typos" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "7.2 PRIORITÉS CORRECTION:" >> plan_audit_complet.txt
echo "- Corriger TOUS les bugs CRITIQUES avant suite" >> plan_audit_complet.txt
echo "- Corriger bugs MAJEURS avant production" >> plan_audit_complet.txt
echo "- Planifier MINEURS + COSMÉTIQUES version suivante" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "7.3 FORMAT RAPPORT BUG:" >> plan_audit_complet.txt
echo "🔴 BUG #XX - [NIVEAU]" >> plan_audit_complet.txt
echo "LOCALISATION: fichier:ligne + URL" >> plan_audit_complet.txt
echo "DESCRIPTION: problème observé" >> plan_audit_complet.txt
echo "REPRODUCTION: étapes 1, 2, 3" >> plan_audit_complet.txt
echo "ERREUR CONSOLE: logs détaillés" >> plan_audit_complet.txt
echo "IMPACT: conséquences utilisateur" >> plan_audit_complet.txt
echo "SOLUTION: correction proposée" >> plan_audit_complet.txt
echo "STATUS: [TROUVÉ/EN COURS/CORRIGÉ]" >> plan_audit_complet.txt

echo "" >> plan_audit_complet.txt
echo "🎯 LIVRABLES FINAUX:" >> plan_audit_complet.txt
echo "====================" >> plan_audit_complet.txt
echo "✅ Rapport d'audit complet avec bugs catégorisés" >> plan_audit_complet.txt
echo "🔧 Corrections appliquées (bugs critiques + majeurs)" >> plan_audit_complet.txt
echo "📊 Évaluation globale état application" >> plan_audit_complet.txt
echo "🚀 Roadmap corrections restantes" >> plan_audit_complet.txt
echo "📚 Documentation modifications effectuées" >> plan_audit_complet.txt
echo "" >> plan_audit_complet.txt
echo "TEMPS TOTAL ESTIMÉ: 15-20 heures sur 3-4 jours" >> plan_audit_complet.txt
echo "OBJECTIF: Application 100% fonctionnelle, production-ready" >> plan_audit_complet.txt

echo "✅ Plan d'audit complet exporté dans: plan_audit_complet.txt"

# =============================================================================
# 16. OUTILS D'AUDIT & COMMANDES
# =============================================================================
echo ""
echo "🛠️ 16. OUTILS & COMMANDES D'AUDIT"
echo "================================="
mkdir -p audit_tools

echo "OUTILS & COMMANDES AUDIT CHANTIERPRO" > audit_tools/commands_tools.txt
echo "====================================" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🔧 COMMANDES DE BASE:" >> audit_tools/commands_tools.txt
echo "=====================" >> audit_tools/commands_tools.txt
echo "# Installation et setup" >> audit_tools/commands_tools.txt
echo "npm install" >> audit_tools/commands_tools.txt
echo "npm run dev                    # Serveur développement" >> audit_tools/commands_tools.txt
echo "npm run build                  # Build production" >> audit_tools/commands_tools.txt
echo "npm run start                  # Serveur production" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Base de données Prisma" >> audit_tools/commands_tools.txt
echo "npx prisma generate           # Générer client Prisma" >> audit_tools/commands_tools.txt
echo "npx prisma db push           # Sync schema avec DB" >> audit_tools/commands_tools.txt
echo "npx prisma studio            # Interface graphique DB" >> audit_tools/commands_tools.txt
echo "npx prisma migrate reset     # Reset complet DB" >> audit_tools/commands_tools.txt
echo "npx prisma db seed           # Charger données test" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Qualité code" >> audit_tools/commands_tools.txt
echo "npm run lint                  # ESLint vérification" >> audit_tools/commands_tools.txt
echo "npm run lint:fix             # ESLint auto-fix" >> audit_tools/commands_tools.txt
echo "npm run type-check           # TypeScript vérification" >> audit_tools/commands_tools.txt
echo "npx prettier --write .       # Formatage code" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🌐 TESTS NAVIGATEUR (DevTools F12):" >> audit_tools/commands_tools.txt
echo "====================================" >> audit_tools/commands_tools.txt
echo "Console: Erreurs JavaScript" >> audit_tools/commands_tools.txt
echo "Network: Requêtes API + performance" >> audit_tools/commands_tools.txt
echo "Performance: Core Web Vitals" >> audit_tools/commands_tools.txt
echo "Application: LocalStorage, Session, Cookies" >> audit_tools/commands_tools.txt
echo "Lighthouse: Audit complet performance/SEO/accessibilité" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "📱 MODE RESPONSIVE (DevTools):" >> audit_tools/commands_tools.txt
echo "===============================" >> audit_tools/commands_tools.txt
echo "Ctrl+Shift+M (toggle device mode)" >> audit_tools/commands_tools.txt
echo "Presets: iPhone 12, iPad, Pixel 5" >> audit_tools/commands_tools.txt
echo "Custom: 375x667, 768x1024, 1366x768" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "🧪 CURL TESTS APIs:" >> audit_tools/commands_tools.txt
echo "===================" >> audit_tools/commands_tools.txt
echo "# Test authentification" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/auth/session" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Test CRUD chantiers" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/chantiers" >> audit_tools/commands_tools.txt
echo "curl -X POST http://localhost:3000/api/chantiers \\" >> audit_tools/commands_tools.txt
echo "  -H 'Content-Type: application/json' \\" >> audit_tools/commands_tools.txt
echo "  -d '{\"nom\":\"Test Chantier\",\"statut\":\"ACTIF\"}'" >> audit_tools/commands_tools.txt
echo "" >> audit_tools/commands_tools.txt
echo "# Test messages (nouveau module)" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/messages" >> audit_tools/commands_tools.txt
echo "curl -X GET http://localhost:3000/api/messages/contacts" >> audit_tools/commands_tools.txt
echo "curl -X GET 'http://localhost:3000/api/messages/search?q=test'" >> audit_tools/commands_tools.txt

# Debug checklist
echo "" >> audit_tools/commands_tools.txt
echo "🐛 DEBUG CHECKLIST:" >> audit_tools/commands_tools.txt
echo "===================" >> audit_tools/commands_tools.txt
echo "- [ ] Console.log outputs pour tracer flux" >> audit_tools/commands_tools.txt
echo "- [ ] Network tab pour requêtes échouées" >> audit_tools/commands_tools.txt
echo "- [ ] React DevTools pour props/state" >> audit_tools/commands_tools.txt
echo "- [ ] Sources tab pour breakpoints" >> audit_tools/commands_tools.txt
echo "- [ ] Application tab pour storage" >> audit_tools/commands_tools.txt
echo "- [ ] Performance tab pour bottlenecks" >> audit_tools/commands_tools.txt

echo "✅ Outils d'audit exportés dans: audit_tools/"

# =============================================================================
# 17. TEMPLATES CORRECTION BUGS
# =============================================================================
echo ""
echo "🔧 17. TEMPLATES CORRECTION BUGS"
echo "==============================="
mkdir -p bug_fix_templates

# Template rapport de bug
cat > bug_fix_templates/bug_report_template.md << 'EOF'
# 🔴 BUG REPORT #XXX - [CRITIQUE/MAJEUR/MINEUR/COSMÉTIQUE]

## 📍 LOCALISATION
- **Fichier**: `app/dashboard/xxx/page.tsx` (ligne XX)
- **URL**: `/dashboard/xxx`
- **Composant**: `ComponentName`
- **Navigateur**: Chrome 118.0 / Firefox / Safari
- **Device**: Desktop 1920x1080 / Mobile iPhone 12

## 🐛 DESCRIPTION
Description claire et concise du problème observé.

## 🔄 ÉTAPES DE REPRODUCTION
1. Aller sur `/dashboard/xxx`
2. Cliquer sur bouton "Action"
3. Observer comportement incorrect

## ❌ COMPORTEMENT ACTUEL
Ce qui se passe actuellement (incorrect).

## ✅ COMPORTEMENT ATTENDU
Ce qui devrait se passer (correct).

## 🔍 ERREUR CONSOLE
```javascript
TypeError: Cannot read properties of undefined (reading 'push')
    at handleClick (page.tsx:45)
    at onClick (Button.tsx:12)
```

## 📸 CAPTURES ÉCRAN
[Ajouter captures avant/après si pertinent]

## 💥 IMPACT
- **Utilisateur**: Bloque complètement la fonctionnalité X
- **Business**: Empêche création nouveaux chantiers
- **Sévérité**: Critique - fonctionnalité core inutilisable

## 💡 SOLUTION PROPOSÉE
```typescript
// AVANT (buggé)
const handleClick = () => {
  router.push('/nouveau'); // router est undefined
};

// APRÈS (corrigé)
const router = useRouter();
const handleClick = () => {
  router.push('/nouveau');
};
```

## ✅ STATUS
- [ ] TROUVÉ
- [ ] EN COURS DE CORRECTION
- [ ] CORRIGÉ
- [ ] TESTÉ
- [ ] VALIDÉ

## 🧪 TESTS DE VALIDATION
- [ ] Fonctionnalité marche sur Chrome desktop
- [ ] Fonctionnalité marche sur mobile
- [ ] Aucune régression introduite
- [ ] Tests edge cases OK
EOF

# Template fix API
cat > bug_fix_templates/api_fix_template.ts << 'EOF'
// Template correction API - Exemple type
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { z } from 'zod'; // 🔥 CRITIQUE: Toujours valider avec Zod

// 🔐 Schema validation Zod
const CreateMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  destinataireId: z.string().optional(),
  chantierId: z.string().optional(),
  typeMessage: z.enum(['DIRECT', 'CHANTIER', 'GROUPE']),
});

export async function POST(request: NextRequest) {
  try {
    // ✅ 1. Vérification authentification
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' }, 
        { status: 401 }
      );
    }

    // ✅ 2. Validation données avec Zod
    const body = await request.json();
    const validatedData = CreateMessageSchema.parse(body);

    // ✅ 3. Logique métier
    const newMessage = await prisma.message.create({
      data: {
        ...validatedData,
        expediteurId: session.user.id,
        createdAt: new Date(),
      },
      include: {
        expediteur: {
          select: { id: true, nom: true, email: true, avatar: true }
        }
      }
    });

    // ✅ 4. Réponse succès
    return NextResponse.json(newMessage, { status: 201 });

  } catch (error) {
    console.error('❌ Erreur API /api/messages:', error);
    
    // ✅ 5. Gestion erreurs spécifiques
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    // ✅ 6. Erreur générique
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// ✅ 7. Autres méthodes HTTP
export async function GET(request: NextRequest) {
  // Implementation GET...
}
EOF

# Template fix composant
cat > bug_fix_templates/component_fix_template.tsx << 'EOF'
// Template correction composant React
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Toujours importer

interface ComponentProps {
  // ✅ Props typées strictement
  data?: DataType;
  onAction?: (id: string) => void;
  loading?: boolean;
}

export const ComponentName: React.FC<ComponentProps> = ({
  data,
  onAction,
  loading = false
}) => {
  // ✅ State avec types stricts
  const [localState, setLocalState] = useState<StateType | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Hooks nécessaires
  const router = useRouter();

  // ✅ Cleanup effects
  useEffect(() => {
    // Logic...
    
    return () => {
      // Cleanup: intervals, listeners, etc.
    };
  }, []);

  // ✅ Handlers avec useCallback si passés en props
  const handleAction = useCallback(() => {
    try {
      // Vérification avant action
      if (!data?.id) {
        setError('Données manquantes');
        return;
      }

      // Action sécurisée
      onAction?.(data.id);
      router.push('/success');
      
    } catch (err) {
      console.error('Erreur action:', err);
      setError('Action échouée');
    }
  }, [data?.id, onAction, router]);

  // ✅ Gestion états loading/error
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => setError(null)}>Réessayer</button>
      </div>
    );
  }

  // ✅ Gestion données vides
  if (!data) {
    return <div className="empty-state">Aucune donnée disponible</div>;
  }

  return (
    <div className="component-container">
      {/* ✅ JSX avec gestion edge cases */}
      <h2>{data.title || 'Sans titre'}</h2>
      
      <button 
        onClick={handleAction}
        disabled={loading}
        className="btn-primary"
      >
        Action
      </button>
    </div>
  );
};
EOF

# Template fix hook personnalisé
cat > bug_fix_templates/hook_fix_template.ts << 'EOF'
// Template correction hook personnalisé
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (item: T) => Promise<void>;
}

export function useData<T>(endpoint: string): UseDataReturn<T> {
  // ✅ State avec types stricts
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Ref pour éviter state updates après unmount
  const isMountedRef = useRef(true);

  // ✅ Cleanup sur unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ✅ Fetch avec gestion erreurs
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // ✅ Vérification mounted avant setState
      if (isMountedRef.current) {
        setData(result);
      }
      
    } catch (err) {
      console.error('Fetch error:', err);
      
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [endpoint]);

  // ✅ Effect avec cleanup
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Create avec optimistic updates
  const create = useCallback(async (item: T) => {
    try {
      setError(null);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('Création échouée');
      }

      const newItem = await response.json();
      
      if (isMountedRef.current) {
        setData(prev => [...prev, newItem]);
      }
      
    } catch (err) {
      console.error('Create error:', err);
      
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erreur création');
      }
    }
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
  };
}
EOF

echo "✅ Templates correction bugs exportés dans: bug_fix_templates/"

# =============================================================================
# 18. RÉSUMÉ FINAL EXTRACTION
# =============================================================================
echo ""
echo "📊 18. RÉSUMÉ FINAL & INSTRUCTIONS"
echo "=================================="

# Statistiques finales
total_files=$(find . -type f | wc -l | tr -d ' ')
total_dirs=$(find . -type d | wc -l | tr -d ' ')
total_size=$(du -sh . | cut -f1)

echo "EXTRACTION AUDIT CHANTIERPRO - RÉSUMÉ EXÉCUTIF" > RESUME_EXTRACTION_AUDIT.txt
echo "===============================================" >> RESUME_EXTRACTION_AUDIT.txt
echo "Date extraction: $(date)" >> RESUME_EXTRACTION_AUDIT.txt
echo "Dossier: $EXTRACT_DIR" >> RESUME_EXTRACTION_AUDIT.txt
echo "Objectif: AUDIT COMPLET → CORRECTIONS → PRODUCTION READY" >> RESUME_EXTRACTION_AUDIT.txt
echo "" >> RESUME_EXTRACTION_AUDIT.txt

echo "📊 STATISTIQUES EXTRACTION:" >> RESUME_EXTRACTION_AUDIT.txt
echo "===========================" >> RESUME_EXTRACTION_AUDIT.txt
echo "- 📁 Dossiers créés: $total_dirs" >> RESUME_EXTRACTION_AUDIT.txt
echo "- 📄 Fichiers extraits: $total_files" >> RESUME_EXTRACTION_AUDIT.txt
echo "- 💾 Taille totale: $total_size" >> RESUME_EXTRACTION_AUDIT.txt
echo "- 🕐 Temps extraction: ~$(date +%s) secondes" >> RESUME_EXTRACTION_AUDIT.txt
echo "" >> RESUME_EXTRACTION_AUDIT.txt

echo "🎯 CONTENU EXTRACTION ORGANISÉ:" >> RESUME_EXTRACTION_AUDIT.txt
echo "===============================" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ config_build/           - Configuration & dépendances projet" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ database_audit/         - Schema Prisma & analyse DB" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ architecture_app/       - Structure Next.js 14 App Router" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ auth_system/            - Authentification NextAuth complète" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ dashboard_audit/        - Module dashboard principal" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ chantiers_audit/        - Module chantiers (référence CRUD)" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ messages_audit/         - Module messages (focus audit)" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ ui_components/          - Design system & composants UI" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ types_security/         - Types TypeScript & validations" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ hooks_audit/            - Hooks personnalisés & logique" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ apis_audit/             - Toutes APIs REST & tests" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ performance_audit/      - Tests performance & optimisation" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ cross_platform_tests/   - Tests multi-navigateurs & devices" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ env_config/             - Variables environnement & config" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ audit_tools/            - Outils & commandes d'audit" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ bug_fix_templates/      - Templates correction bugs" >> RESUME_EXTRACTION_AUDIT.txt
echo "" >> RESUME_EXTRACTION_AUDIT.txt

echo "🔍 FICHIERS CLÉS POUR AUDIT:" >> RESUME_EXTRACTION_AUDIT.txt
echo "=============================" >> RESUME_EXTRACTION_AUDIT.txt
echo "🎯 plan_audit_complet.txt     - PLAN MÉTHODIQUE 15-20h audit" >> RESUME_EXTRACTION_AUDIT.txt
echo "📋 */xxx_tests.txt           - Checklists tests par module" >> RESUME_EXTRACTION_AUDIT.txt
echo "🔧 bug_fix_templates/        - Templates correction bugs" >> RESUME_EXTRACTION_AUDIT.txt
echo "⚙️ audit_tools/commands_tools.txt - Commandes debug & test" >> RESUME_EXTRACTION_AUDIT.txt
echo "" >> RESUME_EXTRACTION_AUDIT.txt

echo "🚨 POINTS CRITIQUES IDENTIFIÉS:" >> RESUME_EXTRACTION_AUDIT.txt
echo "===============================" >> RESUME_EXTRACTION_AUDIT.txt

# Analyser les fichiers critiques manquants
critical_missing=0

if [ ! -f "../hooks/useMessages.ts" ]; then
    echo "❌ hooks/useMessages.ts - CRITIQUE pour notifications" >> RESUME_EXTRACTION_AUDIT.txt
    critical_missing=$((critical_missing + 1))
fi

if [ ! -f "../app/dashboard/messages/page.tsx" ]; then
    echo "❌ app/dashboard/messages/page.tsx - Page principale messages" >> RESUME_EXTRACTION_AUDIT.txt
    critical_missing=$((critical_missing + 1))
fi

if [ ! -f "../app/api/messages/route.ts" ]; then
    echo "❌ app/api/messages/route.ts - API principale messages" >> RESUME_EXTRACTION_AUDIT.txt
    critical_missing=$((critical_missing + 1))
fi

if [ ! -d "../components/messages" ]; then
    echo "❌ components/messages/ - Composants interface messages" >> RESUME_EXTRACTION_AUDIT.txt
    critical_missing=$((critical_missing + 1))
fi

if [ ! -f "../types/messages.ts" ]; then
    echo "❌ types/messages.ts - Types TypeScript messages" >> RESUME_EXTRACTION_AUDIT.txt
    critical_missing=$((critical_missing + 1))
fi

if [ $critical_missing -eq 0 ]; then
    echo "✅ Aucun fichier critique manquant détecté!" >> RESUME_EXTRACTION_AUDIT.txt
else
    echo "⚠️ $critical_missing fichiers critiques manquants identifiés" >> RESUME_EXTRACTION_AUDIT.txt
fi

echo "" >> RESUME_EXTRACTION_AUDIT.txt
echo "🎯 PROCHAINES ACTIONS IMMÉDIATES:" >> RESUME_EXTRACTION_AUDIT.txt
echo "=================================" >> RESUME_EXTRACTION_AUDIT.txt
echo "1. 📖 LIRE plan_audit_complet.txt (méthodologie 7 phases)" >> RESUME_EXTRACTION_AUDIT.txt
echo "2. 🔧 EXÉCUTER commandes audit_tools/commands_tools.txt" >> RESUME_EXTRACTION_AUDIT.txt
echo "3. 🧪 COMMENCER Phase 1: Build & compilation (2-3h)" >> RESUME_EXTRACTION_AUDIT.txt
echo "4. 🔍 SUIVRE checklists *_tests.txt par module" >> RESUME_EXTRACTION_AUDIT.txt
echo "5. 🐛 UTILISER bug_fix_templates/ pour corrections" >> RESUME_EXTRACTION_AUDIT.txt
echo "" >> RESUME_EXTRACTION_AUDIT.txt
echo "⏱️ PLANNING AUDIT SUGGÉRÉ:" >> RESUME_EXTRACTION_AUDIT.txt
echo "===========================" >> RESUME_EXTRACTION_AUDIT.txt
echo "Jour 1 (6h): Phases 1-2 - Infrastructure & APIs" >> RESUME_EXTRACTION_AUDIT.txt
echo "Jour 2 (6h): Phase 3 - Tests UI/UX complets" >> RESUME_EXTRACTION_AUDIT.txt
echo "Jour 3 (4h): Phases 4-5 - Responsive & Performance" >> RESUME_EXTRACTION_AUDIT.txt
echo "Jour 4 (4h): Phases 6-7 - Edge cases & Corrections" >> RESUME_EXTRACTION_AUDIT.txt
echo "" >> RESUME_EXTRACTION_AUDIT.txt
echo "🏆 OBJECTIF FINAL:" >> RESUME_EXTRACTION_AUDIT.txt
echo "==================" >> RESUME_EXTRACTION_AUDIT.txt
echo "Application ChantierPro 100% fonctionnelle:" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ 0 bug critique" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ Module messages complet et opérationnel" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ Performance optimale (Core Web Vitals)" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ Compatible tous navigateurs/devices" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ Sécurité renforcée (validation, auth, XSS)" >> RESUME_EXTRACTION_AUDIT.txt
echo "✅ UX parfaite et design cohérent" >> RESUME_EXTRACTION_AUDIT.txt
echo "🚀 PRÊTE POUR MISE EN PRODUCTION ET VENTE!" >> RESUME_EXTRACTION_AUDIT.txt

# Finalisation
echo ""
echo "🎉 EXTRACTION AUDIT COMPLET TERMINÉE!"
echo "====================================="
echo ""
echo "📂 CONTENU DU DOSSIER:"
ls -la | head -20

echo ""
echo "📈 RÉSUMÉ TECHNIQUE:"
echo "- ✅ $total_files fichiers analysés et extraits"
echo "- ✅ $total_dirs dossiers organisés thématiquement"
echo "- ✅ Plan d'audit méthodique 7 phases (15-20h)"
echo "- ✅ Checklists détaillées par module"
echo "- ✅ Templates de correction de bugs"
echo "- ✅ Commandes & outils de debug"
echo ""

echo "🎯 LIVRABLE PRÊT POUR CLAUDE:"
echo "- 📋 RESUME_EXTRACTION_AUDIT.txt - Vue d'ensemble"
echo "- 🎯 plan_audit_complet.txt - Méthodologie complète"
echo "- 🔍 Tous dossiers *_audit/ avec fichiers projet"
echo "- 🧪 Checklists tests par module (*_tests.txt)"
echo "- 🔧 Templates corrections (bug_fix_templates/)"
echo ""

echo "🚀 PRÊT À ENVOYER À CLAUDE POUR AUDIT COMPLET!"
echo "Objectif: Audit méthodique → Corrections → Production ready ✨"

# Retour dossier parent
cd ..

echo ""
echo "📍 Extraction terminée dans: ./$EXTRACT_DIR/"
echo "📦 Archiver avec: zip -r ${EXTRACT_DIR}.zip $EXTRACT_DIR/"
echo ""
echo "🎯 MISSION: Fournir TOUTES les informations nécessaires"
echo "   pour un audit complet et des corrections efficaces!"
echo "   de l'application ChantierPro 🏗️💬✨"
echo "- [ ]#!/bin/bash

# Script d'extraction ChantierPro - AUDIT COMPLET v4.0
# À exécuter depuis la racine du projet ChantierPro
# Optimisé pour fournir TOUS les fichiers nécessaires à l'AUDIT COMPLET

echo "🔍 EXTRACTION CHANTIERPRO v4.0 - AUDIT COMPLET QUALITÉ"
echo "========================================================"
echo "Date: $(date)"
echo "Objectif: Extraire TOUS les fichiers pour AUDIT COMPLET et CORRECTION"
echo ""

# Créer dossier d'extraction avec timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
EXTRACT_DIR="audit_complet_${TIMESTAMP}"
mkdir -p "$EXTRACT_DIR"
cd "$EXTRACT_DIR"

echo "📁 Dossier d'extraction: $EXTRACT_DIR"
echo ""

# =============================================================================
# 1. CONFIGURATION & BUILD VERIFICATION
# =============================================================================
echo "🔧 1. CONFIGURATION & BUILD VERIFICATION"
echo "========================================"
mkdir -p config_build

echo "--- package.json ---" > config_build/package.json
cat ../package.json > config_build/package.json 2>/dev/null || echo '{"error": "package.json NON TROUVÉ"}' > config_build/package.json

echo "--- tsconfig.json ---" > config_build/tsconfig.json
cat ../tsconfig.json > config_build/tsconfig.json 2>/dev/null || echo '{"error": "tsconfig.json NON TROUVÉ"}' > config_build/tsconfig.json

echo "--- next.config.js ---" > config_build/next.config.js
cat ../next.config.* > config_build/next.config.js 2>/dev/null || echo '// next.config NON TROUVÉ' > config_build/next.config.js

echo "--- tailwind.config ---" > config_build/tailwind.config.js
cat ../tailwind.config.* > config_build/tailwind.config.js 2>/dev/null || echo '// tailwind.config NON TROUVÉ - App utilise CSS vanilla' > config_build/tailwind.config.js

# Scripts NPM analysis
echo "ANALYSE SCRIPTS NPM DISPONIBLES:" > config_build/npm_scripts_analysis.txt
echo "================================" >> config_build/npm_scripts_analysis.txt
if [ -f "../package.json" ]; then
    echo "Scripts trouvés dans package.json:" >> config_build/npm_scripts_analysis.txt
    grep -A 20 '"scripts"' ../package.json >> config_build/npm_scripts_analysis.txt 2>/dev/null || echo "Aucun script trouvé" >> config_build/npm_scripts_analysis.txt
else
    echo "❌ package.json non trouvé - CRITIQUE" >> config_build/npm_scripts_analysis.txt
fi

echo "" >> config_build/npm_scripts_analysis.txt
echo "VÉRIFICATIONS BUILD NÉCESSAIRES:" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run build (compilation production)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run type-check (vérification TypeScript)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run lint (vérification ESLint)" >> config_build/npm_scripts_analysis.txt
echo "- [ ] npm run dev (serveur développement)" >> config_build/npm_scripts_analysis.txt

# Dependencies analysis
echo "ANALYSE DÉPENDANCES:" > config_build/dependencies_analysis.txt
echo "===================" >> config_build/dependencies_analysis.txt
if [ -f "../package.json" ]; then
    echo "=== PRODUCTION DEPENDENCIES ===" >> config_build/dependencies_analysis.txt
    grep -A 50 '"dependencies"' ../package.json >> config_build/dependencies_analysis.txt 2>/dev/null
    echo "" >> config_build/dependencies_analysis.txt
    echo "=== DEV DEPENDENCIES ===" >> config_build/dependencies_analysis.txt
    grep -A 30 '"devDependencies"' ../package.json >> config_build/dependencies_analysis.txt 2>/dev/null
fi

echo "✅ Configuration et build exportés dans: config_build/"

# =============================================================================
# 2. PRISMA & BASE DE DONNÉES COMPLÈTE
# =============================================================================
echo ""
echo "🗄️ 2. ANALYSE PRISMA & BASE DE DONNÉES"
echo "======================================"
mkdir -p database_audit

echo "--- prisma/schema.prisma ---" > database_audit/schema.prisma
cat ../prisma/schema.prisma > database_audit/schema.prisma 2>/dev/null || echo '// ❌ CRITIQUE: prisma/schema.prisma NON TROUVÉ' > database_audit/schema.prisma

echo "--- lib/db.ts ou lib/prisma.ts ---" > database_audit/db_client.ts
cat ../lib/db.ts > database_audit/db_client.ts 2>/dev/null || cat ../lib/prisma.ts > database_audit/db_client.ts 2>/dev/null || echo '// ❌ CRITIQUE: Client Prisma NON TROUVÉ' > database_audit/db_client.ts

# Analyse du schema Prisma
echo "ANALYSE SCHEMA PRISMA:" > database_audit/schema_analysis.txt
echo "=====================" >> database_audit/schema_analysis.txt
if [ -f "../prisma/schema.prisma" ]; then
    echo "=== MODELS TROUVÉS ===" >> database_audit/schema_analysis.txt
    grep "^model " ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
    echo "" >> database_audit/schema_analysis.txt
    
    echo "=== ENUMS TROUVÉS ===" >> database_audit/schema_analysis.txt
    grep "^enum " ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
    echo "" >> database_audit/schema_analysis.txt
    
    echo "=== PROVIDER DATABASE ===" >> database_audit/schema_analysis.txt
    grep -A 5 "provider" ../prisma/schema.prisma >> database_audit/schema_analysis.txt 2>/dev/null
else
    echo "❌ CRITIQUE: Schema Prisma non trouvé - Impossible de vérifier la DB" >> database_audit/schema_analysis.txt
fi

# Migrations
echo "--- Migrations Info ---" > database_audit/migrations.txt
if [ -d "../prisma/migrations" ]; then
    echo "MIGRATIONS TROUVÉES:" >> database_audit/migrations.txt
    ls -la ../prisma/migrations/ >> database_audit/migrations.txt
    echo "" >> database_audit/migrations.txt
    echo "DERNIÈRE MIGRATION:" >> database_audit/migrations.txt
    find ../prisma/migrations -name "migration.sql" -type f -exec basename "$(dirname {})" \; | tail -1 >> database_audit/migrations.txt
else
    echo "⚠️ Aucune migration trouvée - DB peut être en mode db push" >> database_audit/migrations.txt
fi

# Seed
echo "--- prisma/seed.ts ---" > database_audit/seed.ts
cat ../prisma/seed.ts > database_audit/seed.ts 2>/dev/null || echo '// Seed non trouvé - Données de test à créer' > database_audit/seed.ts

echo "✅ Database audit exporté dans: database_audit/"

# =============================================================================
# 3. ARCHITECTURE COMPLÈTE APP ROUTER NEXT.JS 14
# =============================================================================
echo ""
echo "🏗️ 3. ARCHITECTURE COMPLÈTE NEXT.JS 14"
echo "======================================"
mkdir -p architecture_app

# Layout principal
echo "--- app/layout.tsx ---" > architecture_app/root_layout.tsx
cat ../app/layout.tsx > architecture_app/root_layout.tsx 2>/dev/null || echo '❌ CRITIQUE: app/layout.tsx NON TROUVÉ' > architecture_app/root_layout.tsx

# Page d'accueil
echo "--- app/page.tsx ---" > architecture_app/root_page.tsx
cat ../app/page.tsx > architecture_app/root_page.tsx 2>/dev/null || echo '❌ app/page.tsx NON TROUVÉ' > architecture_app/root_page.tsx

# Global styles
echo "--- app/globals.css ---" > architecture_app/globals.css
cat ../app/globals.css > architecture_app/globals.css 2>/dev/null || echo '❌ CRITIQUE: app/globals.css NON TROUVÉ' > architecture_app/globals.css

# Loading et Error
echo "--- app/loading.tsx ---" > architecture_app/loading.tsx
cat ../app/loading.tsx > architecture_app/loading.tsx 2>/dev/null || echo '// loading.tsx non trouvé - À créer' > architecture_app/loading.tsx

echo "--- app/error.tsx ---" > architecture_app/error.tsx
cat ../app/error.tsx > architecture_app/error.tsx 2>/dev/null || echo '// error.tsx non trouvé - À créer' > architecture_app/error.tsx

echo "--- app/not-found.tsx ---" > architecture_app/not_found.tsx
cat ../app/not-found.tsx > architecture_app/not_found.tsx 2>/dev/null || echo '// not-found.tsx non trouvé - À créer' > architecture_app/not_found.tsx

# Middleware
echo "--- middleware.ts ---" > architecture_app/middleware.ts
cat ../middleware.ts > architecture_app/middleware.ts 2>/dev/null || echo '// middleware.ts non trouvé - Vérifier protection routes' > architecture_app/middleware.ts

# Analysis structure app
echo "ANALYSE STRUCTURE APP ROUTER:" > architecture_app/app_structure.txt
echo "=============================" >> architecture_app/app_structure.txt
if [ -d "../app" ]; then
    find ../app -type f -name "*.tsx" -o -name "*.ts" | head -50 | while read appfile; do
        rel_path=${appfile#../app/}
        echo "✅ $rel_path" >> architecture_app/app_structure.txt
    done
    
    echo "" >> architecture_app/app_structure.txt
    echo "ROUTES DÉTECTÉES:" >> architecture_app/app_structure.txt
    find ../app -name "page.tsx" | sed 's|../app||g' | sed 's|/page.tsx||g' | sed 's|^$|/|g' >> architecture_app/app_structure.txt
else
    echo "❌ CRITIQUE: Dossier /app non trouvé" >> architecture_app/app_structure.txt
fi

echo "✅ Architecture exportée dans: architecture_app/"

# =============================================================================
# 4. SYSTÈME D'AUTHENTIFICATION COMPLET
# =============================================================================
echo ""
echo "🔐 4. SYSTÈME D'AUTHENTIFICATION COMPLET"
echo "======================================="
mkdir -p auth_system

# NextAuth configuration
echo "--- app/api/auth/[...nextauth]/route.ts ---" > auth_system/nextauth_route.ts
cat ../app/api/auth/\[...nextauth\]/route.ts > auth_system/nextauth_route.ts 2>/dev/null || echo '❌ CRITIQUE: NextAuth route NON TROUVÉE' > auth_system/nextauth_route.ts

# Auth configuration lib
echo "--- lib/auth.ts ou lib/authOptions.ts ---" > auth_system/auth_config.ts
cat ../lib/auth.ts > auth_system/auth_config.ts 2>/dev/null || cat ../lib/authOptions.ts > auth_system/auth_config.ts 2>/dev/null || echo '❌ Configuration auth NON TROUVÉE' > auth_system/auth_config.ts

# Auth pages
echo "--- app/auth/login/page.tsx ---" > auth_system/login_page.tsx
cat ../app/auth/login/page.tsx > auth_system/login_page.tsx 2>/dev/null || echo '❌ Page login NON TROUVÉE' > auth_system/login_page.tsx

echo "--- app/auth/register/page.tsx ---" > auth_system/register_page.tsx
cat ../app/auth/register/page.tsx > auth_system/register_page.tsx 2>/dev/null || echo '// Page register non trouvée' > auth_system/register_page.tsx

# Session provider
echo "--- components/providers.tsx ou app/providers.tsx ---" > auth_system/providers.tsx
cat ../components/providers.tsx > auth_system/providers.tsx 2>/dev/null || cat ../app/providers.tsx > auth_system/providers.tsx 2>/dev/null || echo '❌ Session Provider NON TROUVÉ' > auth_system/providers.tsx

# Auth types
echo "--- types/auth.ts ou types/next-auth.d.ts ---" > auth_system/auth_types.ts
cat ../types/auth.ts > auth_system/auth_types.ts 2>/dev/null || cat ../types/next-auth.d.ts > auth_system/auth_types.ts 2>/dev/null || echo '// Types auth non trouvés' > auth_system/auth_types.ts

# Auth analysis
echo "ANALYSE SYSTÈME AUTHENTIFICATION:" > auth_system/auth_analysis.txt
echo "==================================" >> auth_system/auth_analysis.txt
echo "VÉRIFICATIONS À EFFECTUER:" >> auth_system/auth_analysis.txt
echo "- [ ] NextAuth configuré correctement" >> auth_system/auth_analysis.txt
echo "- [ ] Variables d'env (NEXTAUTH_SECRET, NEXTAUTH_URL)" >> auth_system/auth_analysis.txt
echo "- [ ] Protection routes /dashboard/*" >> auth_system/auth_analysis.txt
echo "- [ ] Redirection après login" >> auth_system/auth_analysis.txt
echo "- [ ] Session handling côté client" >> auth_system/auth_analysis.txt
echo "- [ ] Logout functionality" >> auth_system/auth_analysis.txt
echo "- [ ] Gestion des rôles utilisateurs" >> auth_system/auth_analysis.txt

echo "✅ Système auth exporté dans: auth_system/"

# =============================================================================
# 5. DASHBOARD COMPLET - MODULE PRINCIPAL
# =============================================================================
echo ""
echo "📊 5. DASHBOARD COMPLET - AUDIT MODULE PRINCIPAL"
echo "==============================================="
mkdir -p dashboard_audit

# Dashboard layout
echo "--- app/dashboard/layout.tsx ---" > dashboard_audit/layout.tsx
cat ../app/dashboard/layout.tsx > dashboard_audit/layout.tsx 2>/dev/null || echo '❌ CRITIQUE: Dashboard layout NON TROUVÉ' > dashboard_audit/layout.tsx

# Dashboard main page
echo "--- app/dashboard/page.tsx ---" > dashboard_audit/page.tsx
cat ../app/dashboard/page.tsx > dashboard_audit/page.tsx 2>/dev/null || echo '❌ CRITIQUE: Dashboard page NON TROUVÉE' > dashboard_audit/page.tsx

# Tous les sous-modules dashboard
find ../app/dashboard -name "*.tsx" -o -name "*.ts" 2>/dev/null | while read dashfile; do
    rel_path=${dashfile#../app/dashboard/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g')
    echo "--- app/dashboard/$rel_path ---" > "dashboard_audit/dash_$safe_name"
    cat "$dashfile" >> "dashboard_audit/dash_$safe_name" 2>/dev/null
done

# Dashboard components
if [ -d "../components/dashboard" ]; then
    find ../components/dashboard -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/dashboard/$comp_name.tsx ---" > "dashboard_audit/comp_$comp_name.tsx"
        cat "$comp" >> "dashboard_audit/comp_$comp_name.tsx"
    done
fi

# Dashboard analysis
echo "AUDIT DASHBOARD - TESTS À EFFECTUER:" > dashboard_audit/dashboard_tests.txt
echo "====================================" >> dashboard_audit/dashboard_tests.txt
echo "FONCTIONNALITÉS À TESTER:" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Page dashboard se charge sans erreur" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Stats cards affichent des données réelles" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Graphiques se génèrent correctement" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Navigation vers autres modules fonctionne" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Quick actions sont opérationnelles" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Feed d'activité se met à jour" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Notifications badges sont corrects" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Responsive design mobile/tablet" >> dashboard_audit/dashboard_tests.txt
echo "- [ ] Performance de chargement < 3s" >> dashboard_audit/dashboard_tests.txt

echo "✅ Dashboard audit exporté dans: dashboard_audit/"

# =============================================================================
# 6. MODULE CHANTIERS COMPLET - RÉFÉRENCE CRUD
# =============================================================================
echo ""
echo "🏗️ 6. MODULE CHANTIERS - AUDIT CRUD COMPLET"
echo "==========================================="
mkdir -p chantiers_audit

# Pages principales
echo "--- app/dashboard/chantiers/page.tsx ---" > chantiers_audit/main_page.tsx
cat ../app/dashboard/chantiers/page.tsx > chantiers_audit/main_page.tsx 2>/dev/null || echo '❌ Page liste chantiers NON TROUVÉE' > chantiers_audit/main_page.tsx

echo "--- app/dashboard/chantiers/[id]/page.tsx ---" > chantiers_audit/detail_page.tsx
cat ../app/dashboard/chantiers/\[id\]/page.tsx > chantiers_audit/detail_page.tsx 2>/dev/null || echo '❌ Page détail chantier NON TROUVÉE' > chantiers_audit/detail_page.tsx

echo "--- app/dashboard/chantiers/nouveau/page.tsx ---" > chantiers_audit/nouveau_page.tsx
cat ../app/dashboard/chantiers/nouveau/page.tsx > chantiers_audit/nouveau_page.tsx 2>/dev/null || echo '❌ Page nouveau chantier NON TROUVÉE' > chantiers_audit/nouveau_page.tsx

# Layout chantiers
echo "--- app/dashboard/chantiers/layout.tsx ---" > chantiers_audit/layout.tsx
cat ../app/dashboard/chantiers/layout.tsx > chantiers_audit/layout.tsx 2>/dev/null || echo '// Layout chantiers non trouvé' > chantiers_audit/layout.tsx

# APIs Chantiers
echo "--- app/api/chantiers/route.ts ---" > chantiers_audit/api_main.ts
cat ../app/api/chantiers/route.ts > chantiers_audit/api_main.ts 2>/dev/null || echo '❌ CRITIQUE: API chantiers principale NON TROUVÉE' > chantiers_audit/api_main.ts

echo "--- app/api/chantiers/[id]/route.ts ---" > chantiers_audit/api_detail.ts
cat ../app/api/chantiers/\[id\]/route.ts > chantiers_audit/api_detail.ts 2>/dev/null || echo '❌ API chantier détail NON TROUVÉE' > chantiers_audit/api_detail.ts

# Toutes les autres APIs chantiers
find ../app/api -path "*/chantiers/*" -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    echo "--- $api_file ---" > "chantiers_audit/api_$safe_name.ts"
    cat "$api_file" >> "chantiers_audit/api_$safe_name.ts" 2>/dev/null
done

# Composants chantiers
if [ -d "../components/chantiers" ]; then
    find ../components/chantiers -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/chantiers/$comp_name.tsx ---" > "chantiers_audit/comp_$comp_name.tsx"
        cat "$comp" >> "chantiers_audit/comp_$comp_name.tsx"
    done
fi

# Tests chantiers
echo "AUDIT MODULE CHANTIERS - TESTS CRUD:" > chantiers_audit/chantiers_tests.txt
echo "====================================" >> chantiers_audit/chantiers_tests.txt
echo "TESTS FONCTIONNELS À EFFECTUER:" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "📋 LISTE CHANTIERS (/dashboard/chantiers):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Liste se charge avec données réelles" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Filtres par statut fonctionnent" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Recherche temps réel opérationnelle" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Pagination si nombreux résultats" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Actions rapides (voir, modifier, supprimer)" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "🔍 DÉTAIL CHANTIER (/dashboard/chantiers/[id]):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Page détail se charge correctement" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Tabs navigation fonctionne" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Informations complètes affichées" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Timeline événements se charge" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Photos/documents s'affichent" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Modification en place possible" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "➕ NOUVEAU CHANTIER (/dashboard/chantiers/nouveau):" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Formulaire multi-étapes fonctionne" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Validation des champs obligatoires" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Upload photos simulé opérationnel" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Soumission et redirection après création" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Gestion d'erreurs si échec" >> chantiers_audit/chantiers_tests.txt
echo "" >> chantiers_audit/chantiers_tests.txt
echo "🔄 APIs CHANTIERS:" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] GET /api/chantiers (liste)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] POST /api/chantiers (création)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] GET /api/chantiers/[id] (détail)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] PUT /api/chantiers/[id] (modification)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] DELETE /api/chantiers/[id] (suppression)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Codes retour HTTP corrects (200, 400, 404, 500)" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Validation données entrantes" >> chantiers_audit/chantiers_tests.txt
echo "- [ ] Protection auth sur toutes routes" >> chantiers_audit/chantiers_tests.txt

echo "✅ Chantiers audit exporté dans: chantiers_audit/"

# =============================================================================
# 7. MODULE MESSAGES - ÉTAT ACTUEL ET AUDIT
# =============================================================================
echo ""
echo "💬 7. MODULE MESSAGES - AUDIT COMPLET ÉTAT ACTUEL"
echo "================================================"
mkdir -p messages_audit

# Pages messages existantes
echo "--- app/dashboard/messages/page.tsx ---" > messages_audit/main_page.tsx
cat ../app/dashboard/messages/page.tsx > messages_audit/main_page.tsx 2>/dev/null || echo '❌ CRITIQUE: Page messages principale NON TROUVÉE - À CRÉER' > messages_audit/main_page.tsx

echo "--- app/dashboard/messages/layout.tsx ---" > messages_audit/layout.tsx
cat ../app/dashboard/messages/layout.tsx > messages_audit/layout.tsx 2>/dev/null || echo '// Layout messages non trouvé - À créer' > messages_audit/layout.tsx

echo "--- app/dashboard/messages/nouveau/page.tsx ---" > messages_audit/nouveau_page.tsx
cat ../app/dashboard/messages/nouveau/page.tsx > messages_audit/nouveau_page.tsx 2>/dev/null || echo '❌ Page nouveau message NON TROUVÉE - À CRÉER' > messages_audit/nouveau_page.tsx

echo "--- app/dashboard/messages/recherche/page.tsx ---" > messages_audit/recherche_page.tsx
cat ../app/dashboard/messages/recherche/page.tsx > messages_audit/recherche_page.tsx 2>/dev/null || echo '❌ Page recherche messages NON TROUVÉE - À CRÉER' > messages_audit/recherche_page.tsx

# Toutes les autres pages messages
find ../app/dashboard/messages -name "*.tsx" -o -name "*.ts" 2>/dev/null | while read msgfile; do
    rel_path=${msgfile#../app/dashboard/messages/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g')
    echo "--- app/dashboard/messages/$rel_path ---" > "messages_audit/page_$safe_name"
    cat "$msgfile" >> "messages_audit/page_$safe_name" 2>/dev/null
done

# APIs Messages
echo "--- app/api/messages/route.ts ---" > messages_audit/api_main.ts
cat ../app/api/messages/route.ts > messages_audit/api_main.ts 2>/dev/null || echo '❌ CRITIQUE: API messages principale NON TROUVÉE - À CRÉER' > messages_audit/api_main.ts

echo "--- app/api/messages/contacts/route.ts ---" > messages_audit/api_contacts.ts
cat ../app/api/messages/contacts/route.ts > messages_audit/api_contacts.ts 2>/dev/null || echo '❌ API contacts NON TROUVÉE - À CRÉER' > messages_audit/api_contacts.ts

echo "--- app/api/messages/search/route.ts ---" > messages_audit/api_search.ts
cat ../app/api/messages/search/route.ts > messages_audit/api_search.ts 2>/dev/null || echo '❌ API search NON TROUVÉE - À CRÉER' > messages_audit/api_search.ts

# Toutes les autres APIs messages
find ../app/api/messages -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/messages/}
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    if [[ "$safe_name" != "" && "$safe_name" != "route" ]]; then
        echo "--- $api_file ---" > "messages_audit/api_$safe_name.ts"
        cat "$api_file" >> "messages_audit/api_$safe_name.ts" 2>/dev/null
    fi
done

# Composants messages
if [ -d "../components/messages" ]; then
    find ../components/messages -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/messages/$comp_name.tsx ---" > "messages_audit/comp_$comp_name.tsx"
        cat "$comp" >> "messages_audit/comp_$comp_name.tsx"
    done
else
    echo '❌ CRITIQUE: Dossier components/messages NON TROUVÉ' > messages_audit/comp_MANQUANT.txt
    echo 'Composants critiques à créer:' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageBubble.tsx (affichage messages)' >> messages_audit/comp_MANQUANT.txt
    echo '- ConversationList.tsx (liste conversations)' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageInput.tsx (saisie nouveau message)' >> messages_audit/comp_MANQUANT.txt
    echo '- NewMessageModal.tsx (modal nouveau message)' >> messages_audit/comp_MANQUANT.txt
    echo '- ContactSelector.tsx (sélection destinataires)' >> messages_audit/comp_MANQUANT.txt
    echo '- MediaViewer.tsx (visualisation médias)' >> messages_audit/comp_MANQUANT.txt
    echo '- MessageActions.tsx (actions sur messages)' >> messages_audit/comp_MANQUANT.txt
    echo '- UserAvatar.tsx (avatar utilisateur)' >> messages_audit/comp_MANQUANT.txt
fi

# Hook useMessages
echo "--- hooks/useMessages.ts ---" > messages_audit/hook_useMessages.ts
cat ../hooks/useMessages.ts > messages_audit/hook_useMessages.ts 2>/dev/null || echo '❌ CRITIQUE: hooks/useMessages.ts NON TROUVÉ - PRIORITÉ ABSOLUE' > messages_audit/hook_useMessages.ts

# Tests messages complets
echo "AUDIT MODULE MESSAGES - TESTS FONCTIONNELS COMPLETS:" > messages_audit/messages_tests.txt
echo "====================================================" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔥 TESTS CRITIQUES (BLOQUANTS SI KO):" >> messages_audit/messages_tests.txt
echo "======================================" >> messages_audit/messages_tests.txt
echo "- [ ] hooks/useMessages.ts existe et fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] API /api/messages répond correctement" >> messages_audit/messages_tests.txt
echo "- [ ] Page /dashboard/messages se charge" >> messages_audit/messages_tests.txt
echo "- [ ] Envoi d'un message de base fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Affichage liste conversations opérationnel" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "💬 INTERFACE MESSAGES (/dashboard/messages):" >> messages_audit/messages_tests.txt
echo "============================================" >> messages_audit/messages_tests.txt
echo "- [ ] Interface principale se charge sans erreur" >> messages_audit/messages_tests.txt
echo "- [ ] Sidebar conversations s'affiche" >> messages_audit/messages_tests.txt
echo "- [ ] Sélection conversation charge messages" >> messages_audit/messages_tests.txt
echo "- [ ] Zone de saisie nouveau message visible" >> messages_audit/messages_tests.txt
echo "- [ ] Envoi message temps réel fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Messages s'affichent dans l'ordre chronologique" >> messages_audit/messages_tests.txt
echo "- [ ] Scroll automatique vers dernier message" >> messages_audit/messages_tests.txt
echo "- [ ] Statuts messages (envoyé/lu) corrects" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "📝 NOUVEAU MESSAGE (/dashboard/messages/nouveau):" >> messages_audit/messages_tests.txt
echo "================================================" >> messages_audit/messages_tests.txt
echo "- [ ] Modal nouveau message s'ouvre/ferme" >> messages_audit/messages_tests.txt
echo "- [ ] 3 onglets (Direct/Chantier/Groupe) fonctionnent" >> messages_audit/messages_tests.txt
echo "- [ ] Sélection destinataires opérationnelle" >> messages_audit/messages_tests.txt
echo "- [ ] Validation avant envoi fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Page nouveau message alternative accessible" >> messages_audit/messages_tests.txt
echo "- [ ] Étapes de création (si multi-step) naviguent" >> messages_audit/messages_tests.txt
echo "- [ ] Upload fichiers/photos fonctionne" >> messages_audit/messages_tests.txt
echo "- [ ] Redirection après envoi réussi" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔍 RECHERCHE MESSAGES (/dashboard/messages/recherche):" >> messages_audit/messages_tests.txt
echo "=====================================================" >> messages_audit/messages_tests.txt
echo "- [ ] Interface recherche s'affiche" >> messages_audit/messages_tests.txt
echo "- [ ] Champ recherche réagit à la saisie" >> messages_audit/messages_tests.txt
echo "- [ ] Résultats de recherche s'affichent" >> messages_audit/messages_tests.txt
echo "- [ ] Filtres de recherche fonctionnent" >> messages_audit/messages_tests.txt
echo "- [ ] Navigation vers message exact depuis résultat" >> messages_audit/messages_tests.txt
echo "- [ ] Recherche par date, expéditeur, contenu" >> messages_audit/messages_tests.txt
echo "- [ ] Performance recherche acceptable" >> messages_audit/messages_tests.txt
echo "" >> messages_audit/messages_tests.txt
echo "🔄 APIs MESSAGES - TESTS TECHNIQUES:" >> messages_audit/messages_tests.txt
echo "===================================" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages (liste conversations)" >> messages_audit/messages_tests.txt
echo "- [ ] POST /api/messages (envoi message)" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages/contacts (liste contacts)" >> messages_audit/messages_tests.txt
echo "- [ ] GET /api/messages/search?q=term (recherche)" >> messages_audit/messages_tests.txt
echo "- [ ] PUT /api/messages/[id] (modification message)" >> messages_audit/messages_tests.txt
echo "- [ ] DELETE /api/messages/[id] (suppression message)" >> messages_audit/messages_tests.txt
echo "- [ ] POST /api/messages/mark-read (marquer lu)" >> messages_audit/messages_tests.txt
echo "- [ ] Authentification sur toutes les routes" >> messages_audit/messages_tests.txt
echo "- [ ] Validation données avec Zod/Joi" >> messages_audit/messages_tests.txt
echo "- [ ] Gestion erreurs robuste (400, 404, 500)" >> messages_audit/messages_tests.txt
echo "- [ ] Rate limiting implémenté" >> messages_audit/messages_tests.txt

echo "✅ Messages audit exporté dans: messages_audit/"

# =============================================================================
# 8. COMPOSANTS UI GLOBAUX - DESIGN SYSTEM
# =============================================================================
echo ""
echo "🎨 8. COMPOSANTS UI & DESIGN SYSTEM"
echo "=================================="
mkdir -p ui_components

# Composants UI de base
ui_base_components=("button" "input" "card" "badge" "avatar" "modal" "dropdown" "toast" "loading" "error")

for comp in "${ui_base_components[@]}"; do
    echo "--- components/ui/$comp.tsx ---" > "ui_components/$comp.tsx"
    cat "../components/ui/$comp.tsx" > "ui_components/$comp.tsx" 2>/dev/null || echo "❌ $comp.tsx NON TROUVÉ - À CRÉER" > "ui_components/$comp.tsx"
done

# Navigation components
echo "--- components/Navigation.tsx ---" > ui_components/Navigation.tsx
cat ../components/Navigation.tsx > ui_components/Navigation.tsx 2>/dev/null || echo '❌ Navigation.tsx NON TROUVÉ' > ui_components/Navigation.tsx

echo "--- components/Sidebar.tsx ---" > ui_components/Sidebar.tsx
cat ../components/Sidebar.tsx > ui_components/Sidebar.tsx 2>/dev/null || echo '❌ Sidebar.tsx NON TROUVÉ' > ui_components/Sidebar.tsx

echo "--- components/Header.tsx ---" > ui_components/Header.tsx
cat ../components/Header.tsx > ui_components/Header.tsx 2>/dev/null || echo '// Header.tsx non trouvé' > ui_components/Header.tsx

# Layout components
echo "--- components/Layout.tsx ---" > ui_components/Layout.tsx
cat ../components/Layout.tsx > ui_components/Layout.tsx 2>/dev/null || echo '// Layout.tsx non trouvé' > ui_components/Layout.tsx

# Form components
form_components=("form" "field" "select" "checkbox" "radio" "textarea" "file-upload")
for form_comp in "${form_components[@]}"; do
    echo "--- components/ui/$form_comp.tsx ---" > "ui_components/form_$form_comp.tsx"
    cat "../components/ui/$form_comp.tsx" > "ui_components/form_$form_comp.tsx" 2>/dev/null || echo "// $form_comp.tsx non trouvé" > "ui_components/form_$form_comp.tsx"
done

# Analyse CSS Design System
echo "ANALYSE DESIGN SYSTEM CSS:" > ui_components/design_system_analysis.txt
echo "===========================" >> ui_components/design_system_analysis.txt
if [ -f "../app/globals.css" ]; then
    echo "=== VARIABLES CSS GLOBALES ===" >> ui_components/design_system_analysis.txt
    grep -n ":" ../app/globals.css | head -50 >> ui_components/design_system_analysis.txt
    echo "" >> ui_components/design_system_analysis.txt
    echo "=== CLASSES UTILITAIRES DÉTECTÉES ===" >> ui_components/design_system_analysis.txt
    grep -E "\.(glass|card|btn-|gradient)" ../app/globals.css >> ui_components/design_system_analysis.txt 2>/dev/null
else
    echo "❌ CRITIQUE: globals.css non trouvé - Design system manquant" >> ui_components/design_system_analysis.txt
fi

# Tests UI Components
echo "TESTS COMPOSANTS UI - DESIGN SYSTEM:" > ui_components/ui_tests.txt
echo "====================================" >> ui_components/ui_tests.txt
echo "🎨 COHÉRENCE DESIGN:" >> ui_components/ui_tests.txt
echo "- [ ] CSS vanilla cohérent partout (pas de Tailwind mélangé)" >> ui_components/ui_tests.txt
echo "- [ ] Classes réutilisées (.glass, .card, .btn-primary)" >> ui_components/ui_tests.txt
echo "- [ ] Gradients bleu/orange respectés (#3b82f6 → #f97316)" >> ui_components/ui_tests.txt
echo "- [ ] Typography Inter utilisée partout" >> ui_components/ui_tests.txt
echo "- [ ] Animations fluides (0.3s ease)" >> ui_components/ui_tests.txt
echo "- [ ] Hover effects cohérents" >> ui_components/ui_tests.txt
echo "- [ ] Variables CSS globales utilisées" >> ui_components/ui_tests.txt
echo "" >> ui_components/ui_tests.txt
echo "📱 RESPONSIVE DESIGN:" >> ui_components/ui_tests.txt
echo "- [ ] Desktop (1920x1080, 1366x768)" >> ui_components/ui_tests.txt
echo "- [ ] Tablet (768x1024, iPad)" >> ui_components/ui_tests.txt
echo "- [ ] Mobile (375x667, 414x896)" >> ui_components/ui_tests.txt
echo "- [ ] Navigation mobile (hamburger si existe)" >> ui_components/ui_tests.txt
echo "- [ ] Formulaires utilisables sur mobile" >> ui_components/ui_tests.txt
echo "- [ ] Texte lisible toutes tailles" >> ui_components/ui_tests.txt
echo "- [ ] Touch targets > 44px mobile" >> ui_components/ui_tests.txt
echo "" >> ui_components/ui_tests.txt
echo "♿ ACCESSIBILITÉ:" >> ui_components/ui_tests.txt
echo "- [ ] Navigation clavier (Tab, Enter, Escape)" >> ui_components/ui_tests.txt
echo "- [ ] Focus visible éléments interactifs" >> ui_components/ui_tests.txt
echo "- [ ] Contrast ratio suffisant (4.5:1 min)" >> ui_components/ui_tests.txt
echo "- [ ] Alt texts sur images" >> ui_components/ui_tests.txt
echo "- [ ] Labels sur formulaires" >> ui_components/ui_tests.txt
echo "- [ ] ARIA attributes si nécessaire" >> ui_components/ui_tests.txt
echo "- [ ] Pas de clignotements rapides" >> ui_components/ui_tests.txt

echo "✅ UI Components audit exporté dans: ui_components/"

# =============================================================================
# 9. TYPES & VALIDATIONS - SÉCURITÉ
# =============================================================================
echo ""
echo "📝 9. TYPES & VALIDATIONS - AUDIT SÉCURITÉ"
echo "=========================================="
mkdir -p types_security

# Types principaux
echo "--- types/index.ts ---" > types_security/index.ts
cat ../types/index.ts > types_security/index.ts 2>/dev/null || echo '❌ types/index.ts NON TROUVÉ - À CRÉER' > types_security/index.ts

echo "--- types/messages.ts ---" > types_security/messages.ts
cat ../types/messages.ts > types_security/messages.ts 2>/dev/null || echo '❌ CRITIQUE: types/messages.ts NON TROUVÉ - À CRÉER' > types_security/messages.ts

echo "--- types/chantiers.ts ---" > types_security/chantiers.ts
cat ../types/chantiers.ts > types_security/chantiers.ts 2>/dev/null || echo '// types/chantiers.ts non trouvé' > types_security/chantiers.ts

echo "--- types/auth.ts ---" > types_security/auth.ts
cat ../types/auth.ts > types_security/auth.ts 2>/dev/null || echo '// types/auth.ts non trouvé' > types_security/auth.ts

# Next-auth types
echo "--- types/next-auth.d.ts ---" > types_security/next-auth.d.ts
cat ../types/next-auth.d.ts > types_security/next-auth.d.ts 2>/dev/null || echo '// next-auth.d.ts non trouvé' > types_security/next-auth.d.ts

# Validations Zod/Joi
echo "--- lib/validations.ts ---" > types_security/validations.ts
cat ../lib/validations.ts > types_security/validations.ts 2>/dev/null || echo '❌ CRITIQUE: lib/validations.ts NON TROUVÉ - SÉCURITÉ' > types_security/validations.ts

echo "--- lib/schemas.ts ---" > types_security/schemas.ts
cat ../lib/schemas.ts > types_security/schemas.ts 2>/dev/null || echo '// lib/schemas.ts non trouvé' > types_security/schemas.ts

# Utilitaires
echo "--- lib/utils.ts ---" > types_security/utils.ts
cat ../lib/utils.ts > types_security/utils.ts 2>/dev/null || echo '// lib/utils.ts non trouvé' > types_security/utils.ts

# Constants
echo "--- lib/constants.ts ---" > types_security/constants.ts
cat ../lib/constants.ts > types_security/constants.ts 2>/dev/null || echo '// lib/constants.ts non trouvé' > types_security/constants.ts

# Security analysis
echo "AUDIT SÉCURITÉ - VALIDATIONS & TYPES:" > types_security/security_audit.txt
echo "=====================================" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "🔐 VALIDATION DONNÉES ENTRANTES:" >> types_security/security_audit.txt
echo "================================" >> types_security/security_audit.txt
echo "- [ ] Toutes APIs POST/PUT ont validation Zod/Joi" >> types_security/security_audit.txt
echo "- [ ] Sanitisation XSS sur tous inputs" >> types_security/security_audit.txt
echo "- [ ] Validation taille fichiers upload" >> types_security/security_audit.txt
echo "- [ ] Validation types MIME upload" >> types_security/security_audit.txt
echo "- [ ] Limites longueur champs texte" >> types_security/security_audit.txt
echo "- [ ] Validation formats email, URL, etc." >> types_security/security_audit.txt
echo "- [ ] Échappement SQL injection" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "🛡️ PROTECTION ROUTES:" >> types_security/security_audit.txt
echo "=====================" >> types_security/security_audit.txt
echo "- [ ] Middleware auth sur /dashboard/*" >> types_security/security_audit.txt
echo "- [ ] Vérification rôles utilisateur" >> types_security/security_audit.txt
echo "- [ ] CSRF protection" >> types_security/security_audit.txt
echo "- [ ] Rate limiting APIs" >> types_security/security_audit.txt
echo "- [ ] Headers sécurité (HSTS, X-Frame-Options)" >> types_security/security_audit.txt
echo "- [ ] Validation JWT tokens" >> types_security/security_audit.txt
echo "- [ ] Pas de données sensibles en localStorage" >> types_security/security_audit.txt
echo "" >> types_security/security_audit.txt
echo "📊 TYPES TYPESCRIPT:" >> types_security/security_audit.txt
echo "====================" >> types_security/security_audit.txt
echo "- [ ] Types stricts partout (pas de 'any')" >> types_security/security_audit.txt
echo "- [ ] Interfaces cohérentes frontend/backend" >> types_security/security_audit.txt
echo "- [ ] Types générés depuis Prisma utilisés" >> types_security/security_audit.txt
echo "- [ ] Enums pour valeurs fixes" >> types_security/security_audit.txt
echo "- [ ] Types optionnels/obligatoires corrects" >> types_security/security_audit.txt

echo "✅ Types & Sécurité audit exporté dans: types_security/"

# =============================================================================
# 10. HOOKS PERSONNALISÉS - LOGIQUE MÉTIER
# =============================================================================
echo ""
echo "🎣 10. HOOKS PERSONNALISÉS - AUDIT LOGIQUE MÉTIER"
echo "================================================"
mkdir -p hooks_audit

# Hook useMessages (CRITIQUE)
echo "--- hooks/useMessages.ts ---" > hooks_audit/useMessages.ts
cat ../hooks/useMessages.ts > hooks_audit/useMessages.ts 2>/dev/null || echo '❌ CRITIQUE: hooks/useMessages.ts NON TROUVÉ - PRIORITÉ ABSOLUE' > hooks_audit/useMessages.ts

# Autres hooks existants
if [ -d "../hooks" ]; then
    find ../hooks -name "*.ts" -o -name "*.tsx" | while read hook_file; do
        hook_name=$(basename "$hook_file")
        if [ "$hook_name" != "useMessages.ts" ]; then
            echo "--- hooks/$hook_name ---" > "hooks_audit/$hook_name"
            cat "$hook_file" >> "hooks_audit/$hook_name"
        fi
    done
else
    echo '❌ DOSSIER /hooks NON TROUVÉ - À CRÉER' > hooks_audit/HOOKS_MANQUANTS.txt
    echo 'Hooks critiques à créer:' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useMessages.ts (notifications, polling)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useChantiers.ts (gestion CRUD chantiers)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useAuth.ts (session, rôles)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useApi.ts (requêtes HTTP génériques)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useLocalStorage.ts (persistance locale)' >> hooks_audit/HOOKS_MANQUANTS.txt
    echo '- useDebounce.ts (recherche temps réel)' >> hooks_audit/HOOKS_MANQUANTS.txt
fi

# Custom hooks communes qu'on peut chercher
common_hooks=("useAuth" "useApi" "useLocalStorage" "useDebounce" "useChantiers" "useNotifications" "useUpload" "useSearch")

for hook in "${common_hooks[@]}"; do
    echo "--- hooks/$hook.ts ---" > "hooks_audit/$hook.ts"
    cat "../hooks/$hook.ts" > "hooks_audit/$hook.ts" 2>/dev/null || echo "// $hook.ts non trouvé - Peut être utile" > "hooks_audit/$hook.ts"
done

# Tests hooks
echo "AUDIT HOOKS PERSONNALISÉS:" > hooks_audit/hooks_tests.txt
echo "===========================" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "🎣 useMessages (CRITIQUE):" >> hooks_audit/hooks_tests.txt
echo "==========================" >> hooks_audit/hooks_tests.txt
echo "- [ ] Hook existe et est importable" >> hooks_audit/hooks_tests.txt
echo "- [ ] Polling conversations toutes les 30s" >> hooks_audit/hooks_tests.txt
echo "- [ ] État conversations synchronisé" >> hooks_audit/hooks_tests.txt
echo "- [ ] sendMessage fonctionne" >> hooks_audit/hooks_tests.txt
echo "- [ ] Gestion loading/error states" >> hooks_audit/hooks_tests.txt
echo "- [ ] Optimistic updates" >> hooks_audit/hooks_tests.txt
echo "- [ ] Cleanup intervals sur unmount" >> hooks_audit/hooks_tests.txt
echo "- [ ] Types TypeScript corrects" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "🏗️ AUTRES HOOKS MÉTIER:" >> hooks_audit/hooks_tests.txt
echo "========================" >> hooks_audit/hooks_tests.txt
echo "- [ ] useChantiers: CRUD, filtres, recherche" >> hooks_audit/hooks_tests.txt
echo "- [ ] useAuth: session, login/logout, rôles" >> hooks_audit/hooks_tests.txt
echo "- [ ] useApi: requêtes HTTP, cache, error handling" >> hooks_audit/hooks_tests.txt
echo "- [ ] useDebounce: recherche temps réel optimisée" >> hooks_audit/hooks_tests.txt
echo "- [ ] useNotifications: toasts, badges count" >> hooks_audit/hooks_tests.txt
echo "- [ ] useUpload: gestion fichiers, progress" >> hooks_audit/hooks_tests.txt
echo "" >> hooks_audit/hooks_tests.txt
echo "⚡ PERFORMANCE HOOKS:" >> hooks_audit/hooks_tests.txt
echo "====================" >> hooks_audit/hooks_tests.txt
echo "- [ ] Pas de re-renders inutiles" >> hooks_audit/hooks_tests.txt
echo "- [ ] useCallback/useMemo utilisés à bon escient" >> hooks_audit/hooks_tests.txt
echo "- [ ] Cleanup effects (intervals, listeners)" >> hooks_audit/hooks_tests.txt
echo "- [ ] Dependencies arrays correctes" >> hooks_audit/hooks_tests.txt
echo "- [ ] Pas de memory leaks" >> hooks_audit/hooks_tests.txt

echo "✅ Hooks audit exporté dans: hooks_audit/"

# =============================================================================
# 11. ANALYSE COMPLÈTE APIs REST
# =============================================================================
echo ""
echo "🔄 11. ANALYSE COMPLÈTE APIs REST"
echo "================================"
mkdir -p apis_audit

# Trouver TOUTES les APIs
echo "INVENTAIRE COMPLET APIs:" > apis_audit/apis_inventory.txt
echo "========================" >> apis_audit/apis_inventory.txt
find ../app/api -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/}
    echo "✅ $rel_path" >> apis_audit/apis_inventory.txt
    
    # Extraire chaque API
    safe_name=$(echo "$rel_path" | sed 's/[\/\[\]]/_/g' | sed 's/route\.ts$//')
    echo "--- $api_file ---" > "apis_audit/api_$safe_name.ts"
    cat "$api_file" >> "apis_audit/api_$safe_name.ts" 2>/dev/null
done

# Si aucune API trouvée
if [ ! -d "../app/api" ]; then
    echo "❌ CRITIQUE: Dossier /app/api NON TROUVÉ" >> apis_audit/apis_inventory.txt
    echo "APIs critiques manquantes:" >> apis_audit/apis_inventory.txt
    echo "- /api/auth/[...nextauth]/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/chantiers/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/chantiers/[id]/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/contacts/route.ts" >> apis_audit/apis_inventory.txt
    echo "- /api/messages/search/route.ts" >> apis_audit/apis_inventory.txt
fi

# Tests APIs complets
echo "TESTS APIS REST - AUDIT TECHNIQUE COMPLET:" > apis_audit/apis_tests.txt
echo "===========================================" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🔐 AUTHENTIFICATION API:" >> apis_audit/apis_tests.txt
echo "========================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/auth/[...nextauth] (NextAuth endpoints)" >> apis_audit/apis_tests.txt
echo "- [ ] Session handling correct" >> apis_audit/apis_tests.txt
echo "- [ ] Redirections après login/logout" >> apis_audit/apis_tests.txt
echo "- [ ] CSRF protection active" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🏗️ CHANTIERS API (CRUD COMPLET):" >> apis_audit/apis_tests.txt
echo "==================================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers → 200 (liste avec données)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/chantiers → 201 (création réussie)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers/[id] → 200 (détail)" >> apis_audit/apis_tests.txt
echo "- [ ] PUT /api/chantiers/[id] → 200 (modification)" >> apis_audit/apis_tests.txt
echo "- [ ] DELETE /api/chantiers/[id] → 200 (suppression)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/chantiers/inexistant → 404" >> apis_audit/apis_tests.txt
echo "- [ ] POST sans auth → 401" >> apis_audit/apis_tests.txt
echo "- [ ] POST données invalides → 400" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "💬 MESSAGES API (NOUVEAU MODULE):" >> apis_audit/apis_tests.txt
echo "==================================" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages → 200 (conversations)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages → 201 (nouveau message)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages/contacts → 200 (liste contacts)" >> apis_audit/apis_tests.txt
echo "- [ ] GET /api/messages/search?q=term → 200 (résultats)" >> apis_audit/apis_tests.txt
echo "- [ ] PUT /api/messages/[id] → 200 (modification)" >> apis_audit/apis_tests.txt
echo "- [ ] DELETE /api/messages/[id] → 200 (suppression)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages/mark-read → 200 (marquer lu)" >> apis_audit/apis_tests.txt
echo "- [ ] POST /api/messages/files/upload → 201 (upload)" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "⚡ PERFORMANCE & SÉCURITÉ APIs:" >> apis_audit/apis_tests.txt
echo "===============================" >> apis_audit/apis_tests.txt
echo "- [ ] Réponse < 500ms pour requêtes simples" >> apis_audit/apis_tests.txt
echo "- [ ] Pagination sur listes longues" >> apis_audit/apis_tests.txt
echo "- [ ] Rate limiting (100 req/min par user)" >> apis_audit/apis_tests.txt
echo "- [ ] Validation stricte données entrantes" >> apis_audit/apis_tests.txt
echo "- [ ] Logs d'erreurs détaillés" >> apis_audit/apis_tests.txt
echo "- [ ] Headers CORS appropriés" >> apis_audit/apis_tests.txt
echo "- [ ] Gestion erreurs DB (connexion, timeout)" >> apis_audit/apis_tests.txt
echo "" >> apis_audit/apis_tests.txt
echo "🧪 TESTS EDGE CASES:" >> apis_audit/apis_tests.txt
echo "====================" >> apis_audit/apis_tests.txt
echo "- [ ] Données null/undefined gérées" >> apis_audit/apis_tests.txt
echo "- [ ] Caractères spéciaux dans requêtes" >> apis_audit/apis_tests.txt
echo "- [ ] Requêtes simultanées multiples" >> apis_audit/apis_tests.txt
echo "- [ ] Timeout réseau simulé" >> apis_audit/apis_tests.txt
echo "- [ ] DB indisponible temporairement" >> apis_audit/apis_tests.txt
echo "- [ ] Payload trop volumineux → 413" >> apis_audit/apis_tests.txt
echo "- [ ] Méthodes HTTP non supportées → 405" >> apis_audit/apis_tests.txt

echo "✅ APIs audit exporté dans: apis_audit/"

# =============================================================================
# 12. TESTS PERFORMANCE COMPLETS
# =============================================================================
echo ""
echo "⚡ 12. AUDIT PERFORMANCE COMPLET"
echo "==============================="
mkdir -p performance_audit

# Analyse bundle et build
echo "PERFORMANCE - CHECKLIST COMPLÈTE:" > performance_audit/performance_tests.txt
echo "=================================" >> performance_audit/performance_tests.txt
echo "" >> performance_audit/performance_tests.txt
echo "🚀 CHARGEMENT PAGES (CORE WEB VITALS):" >> performance_audit/performance_tests.txt
echo "======================================" >> performance_audit/performance_tests.txt
echo "- [ ] Page d'accueil < 2s (LCP)" >> performance_audit/performance_tests.txt
echo "- [ ] Dashboard < 3s (avec données)" >> performance_audit/performance_tests.txt
echo "- [ ] Liste chantiers < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] Détail chantier < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] Interface messages < 2s" >> performance_audit/performance_tests.txt
echo "- [ ] First Contentful Paint < 1.5s" >> performance_audit/performance_tests.txt
echo "- [ ] Largest Contentful Paint < 2.5s" >> performance_audit/performance_tests.txt
echo "- [ ] Time to Interactive < 3s" >> performance_audit/performance_tests.txt