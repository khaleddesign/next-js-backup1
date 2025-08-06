#!/bin/bash

# Script d'extraction ChantierPro - Module Messagerie v3.0
# À exécuter depuis la racine du projet ChantierPro
# Optimisé pour fournir TOUS les fichiers nécessaires au développement

echo "🚀 EXTRACTION CHANTIERPRO v3.0 - MODULE MESSAGERIE COMPLET"
echo "============================================================"
echo "Date: $(date)"
echo "Objectif: Extraire TOUS les fichiers pour développement module messagerie"
echo ""

# Créer dossier d'extraction avec timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
EXTRACT_DIR="extraction_messagerie_${TIMESTAMP}"
mkdir -p "$EXTRACT_DIR"
cd "$EXTRACT_DIR"

echo "📁 Dossier d'extraction: $EXTRACT_DIR"
echo ""

# =============================================================================
# 1. CONFIGURATION PROJECT & DEPENDENCIES
# =============================================================================
echo "📦 1. CONFIGURATION ET DÉPENDANCES"
echo "=================================="
mkdir -p config

echo "--- package.json ---" > config/package.json
cat ../package.json > config/package.json 2>/dev/null || echo '{"error": "package.json non trouvé"}' > config/package.json

echo "--- package-lock.json (extraits) ---" > config/package-lock-info.txt
if [ -f "../package-lock.json" ]; then
    head -100 ../package-lock.json > config/package-lock-info.txt
    echo "... (package-lock complet disponible)" >> config/package-lock-info.txt
else
    echo "package-lock.json non trouvé" > config/package-lock-info.txt
fi

echo "--- tsconfig.json ---" > config/tsconfig.json
cat ../tsconfig.json > config/tsconfig.json 2>/dev/null || echo '{"error": "tsconfig.json non trouvé"}' > config/tsconfig.json

echo "--- next.config ---" > config/next.config.js
cat ../next.config.* > config/next.config.js 2>/dev/null || echo '// next.config non trouvé' > config/next.config.js

echo "--- tailwind.config ---" > config/tailwind.config.js
cat ../tailwind.config.* > config/tailwind.config.js 2>/dev/null || echo '// tailwind.config non trouvé' > config/tailwind.config.js

echo "--- postcss.config ---" > config/postcss.config.js
cat ../postcss.config.* > config/postcss.config.js 2>/dev/null || echo '// postcss.config non trouvé' > config/postcss.config.js

echo "✅ Configuration exportée dans: config/"

# =============================================================================
# 2. DATABASE SCHEMA & SETUP
# =============================================================================
echo ""
echo "🗄️ 2. BASE DE DONNÉES COMPLÈTE"
echo "=============================="
mkdir -p database

echo "--- prisma/schema.prisma ---" > database/schema.prisma
cat ../prisma/schema.prisma > database/schema.prisma 2>/dev/null || echo '// schema.prisma non trouvé' > database/schema.prisma

echo "--- lib/db.ts ---" > database/db.ts
cat ../lib/db.ts > database/db.ts 2>/dev/null || echo '// lib/db.ts non trouvé' > database/db.ts

echo "--- prisma/seed.ts ---" > database/seed.ts
cat ../prisma/seed.ts > database/seed.ts 2>/dev/null || echo '// prisma/seed.ts non trouvé' > database/seed.ts

# Variables d'env (masquées)
echo "--- Variables d'environnement (structure) ---" > database/env-structure.txt
if [ -f "../.env.example" ]; then
    cat ../.env.example > database/env-structure.txt
elif [ -f "../.env" ]; then
    grep -E "^[A-Z_]+=" ../.env | sed 's/=.*/=***MASKED***/' > database/env-structure.txt
else
    echo "# Aucun fichier .env trouvé" > database/env-structure.txt
    echo "DATABASE_URL=***REQUIRED***" >> database/env-structure.txt
    echo "NEXTAUTH_SECRET=***REQUIRED***" >> database/env-structure.txt
    echo "NEXTAUTH_URL=***REQUIRED***" >> database/env-structure.txt
fi

# Migrations info
echo "--- Migrations disponibles ---" > database/migrations-info.txt
if [ -d "../prisma/migrations" ]; then
    ls -la ../prisma/migrations/ > database/migrations-info.txt
    echo "" >> database/migrations-info.txt
    echo "Dernière migration:" >> database/migrations-info.txt
    find ../prisma/migrations -name "*.sql" -type f | head -1 | xargs cat >> database/migrations-info.txt 2>/dev/null || echo "Aucun fichier SQL trouvé" >> database/migrations-info.txt
else
    echo "Aucune migration trouvée" > database/migrations-info.txt
fi

echo "✅ Base de données exportée dans: database/"

# =============================================================================
# 3. STYLES & DESIGN SYSTEM
# =============================================================================
echo ""
echo "🎨 3. STYLES ET DESIGN SYSTEM"
echo "============================="
mkdir -p styles

echo "--- app/globals.css ---" > styles/globals.css
cat ../app/globals.css > styles/globals.css 2>/dev/null || cat ../styles/globals.css > styles/globals.css 2>/dev/null || echo '/* globals.css non trouvé */' > styles/globals.css

# Extraire tous les fichiers CSS
find ../ -name "*.css" -not -path "*/node_modules/*" -not -path "*/.next/*" | head -10 | while read cssfile; do
    filename=$(basename "$cssfile")
    dirname=$(basename "$(dirname "$cssfile")")
    echo "--- $cssfile ---" > "styles/${dirname}_${filename}"
    cat "$cssfile" >> "styles/${dirname}_${filename}"
done

echo "✅ Styles exportés dans: styles/"

# =============================================================================
# 4. LAYOUT & MAIN PAGES
# =============================================================================
echo ""
echo "🏠 4. LAYOUTS ET PAGES PRINCIPALES"
echo "=================================="
mkdir -p layouts_pages

# Layout principal
echo "--- app/layout.tsx ---" > layouts_pages/layout.tsx
cat ../app/layout.tsx > layouts_pages/layout.tsx 2>/dev/null || echo '// app/layout.tsx non trouvé' > layouts_pages/layout.tsx

# Page d'accueil
echo "--- app/page.tsx ---" > layouts_pages/page.tsx
cat ../app/page.tsx > layouts_pages/page.tsx 2>/dev/null || echo '// app/page.tsx non trouvé' > layouts_pages/page.tsx

# Loading & Error
echo "--- app/loading.tsx ---" > layouts_pages/loading.tsx
cat ../app/loading.tsx > layouts_pages/loading.tsx 2>/dev/null || echo '// app/loading.tsx non trouvé' > layouts_pages/loading.tsx

echo "--- app/error.tsx ---" > layouts_pages/error.tsx
cat ../app/error.tsx > layouts_pages/error.tsx 2>/dev/null || echo '// app/error.tsx non trouvé' > layouts_pages/error.tsx

# Dashboard layout
echo "--- app/dashboard/layout.tsx ---" > layouts_pages/dashboard-layout.tsx
cat ../app/dashboard/layout.tsx > layouts_pages/dashboard-layout.tsx 2>/dev/null || echo '// dashboard/layout.tsx non trouvé' > layouts_pages/dashboard-layout.tsx

# Dashboard main page
echo "--- app/dashboard/page.tsx ---" > layouts_pages/dashboard-page.tsx
cat ../app/dashboard/page.tsx > layouts_pages/dashboard-page.tsx 2>/dev/null || echo '// dashboard/page.tsx non trouvé' > layouts_pages/dashboard-page.tsx

echo "✅ Layouts et pages exportés dans: layouts_pages/"

# =============================================================================
# 5. AUTHENTIFICATION COMPLÈTE
# =============================================================================
echo ""
echo "🔐 5. SYSTÈME D'AUTHENTIFICATION"
echo "==============================="
mkdir -p auth

# NextAuth config
echo "--- app/api/auth/[...nextauth]/route.ts ---" > auth/nextauth-route.ts
cat ../app/api/auth/\[...nextauth\]/route.ts > auth/nextauth-route.ts 2>/dev/null || echo '// nextauth route non trouvée' > auth/nextauth-route.ts

# Auth lib
echo "--- lib/auth.ts ---" > auth/auth-lib.ts
cat ../lib/auth.ts > auth/auth-lib.ts 2>/dev/null || echo '// lib/auth.ts non trouvé' > auth/auth-lib.ts

# Middleware
echo "--- middleware.ts ---" > auth/middleware.ts
cat ../middleware.ts > auth/middleware.ts 2>/dev/null || echo '// middleware.ts non trouvé' > auth/middleware.ts

# Auth pages
echo "--- app/auth/login/page.tsx ---" > auth/login-page.tsx
cat ../app/auth/login/page.tsx > auth/login-page.tsx 2>/dev/null || echo '// login page non trouvée' > auth/login-page.tsx

echo "--- app/auth/register/page.tsx ---" > auth/register-page.tsx
cat ../app/auth/register/page.tsx > auth/register-page.tsx 2>/dev/null || echo '// register page non trouvée' > auth/register-page.tsx

# Providers
echo "--- components/providers.tsx ---" > auth/providers.tsx
cat ../components/providers.tsx > auth/providers.tsx 2>/dev/null || echo '// providers.tsx non trouvé' > auth/providers.tsx

echo "✅ Authentification exportée dans: auth/"

# =============================================================================
# 6. MODULE CHANTIERS (RÉFÉRENCE)
# =============================================================================
echo ""
echo "🏗️ 6. MODULE CHANTIERS (RÉFÉRENCE ARCHITECTURE)"
echo "=============================================="
mkdir -p chantiers

# Pages chantiers
echo "--- app/dashboard/chantiers/page.tsx ---" > chantiers/page.tsx
cat ../app/dashboard/chantiers/page.tsx > chantiers/page.tsx 2>/dev/null || echo '// chantiers page non trouvée' > chantiers/page.tsx

echo "--- app/dashboard/chantiers/[id]/page.tsx ---" > chantiers/detail-page.tsx
cat ../app/dashboard/chantiers/\[id\]/page.tsx > chantiers/detail-page.tsx 2>/dev/null || echo '// chantier détail non trouvé' > chantiers/detail-page.tsx

echo "--- app/dashboard/chantiers/nouveau/page.tsx ---" > chantiers/nouveau-page.tsx
cat ../app/dashboard/chantiers/nouveau/page.tsx > chantiers/nouveau-page.tsx 2>/dev/null || echo '// nouveau chantier non trouvé' > chantiers/nouveau-page.tsx

# API Chantiers
echo "--- app/api/chantiers/route.ts ---" > chantiers/api-main.ts
cat ../app/api/chantiers/route.ts > chantiers/api-main.ts 2>/dev/null || echo '// api chantiers non trouvée' > chantiers/api-main.ts

echo "--- app/api/chantiers/[id]/route.ts ---" > chantiers/api-detail.ts
cat ../app/api/chantiers/\[id\]/route.ts > chantiers/api-detail.ts 2>/dev/null || echo '// api chantier détail non trouvée' > chantiers/api-detail.ts

# Composants chantiers (exemples d'architecture)
if [ -d "../components/chantiers" ]; then
    find ../components/chantiers -name "*.tsx" | head -5 | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/chantiers/$comp_name.tsx ---" > "chantiers/comp-$comp_name.tsx"
        cat "$comp" >> "chantiers/comp-$comp_name.tsx"
    done
fi

echo "✅ Module chantiers (référence) exporté dans: chantiers/"

# =============================================================================
# 7. MODULE MESSAGES EXISTANT (ÉTAT ACTUEL)
# =============================================================================
echo ""
echo "💬 7. MODULE MESSAGES - ÉTAT ACTUEL"
echo "=================================="
mkdir -p messages_existant

# Pages messages
echo "--- app/dashboard/messages/page.tsx ---" > messages_existant/page.tsx
cat ../app/dashboard/messages/page.tsx > messages_existant/page.tsx 2>/dev/null || echo '// messages page NON TROUVÉE - À CRÉER' > messages_existant/page.tsx

# Layout messages
echo "--- app/dashboard/messages/layout.tsx ---" > messages_existant/layout.tsx
cat ../app/dashboard/messages/layout.tsx > messages_existant/layout.tsx 2>/dev/null || echo '// messages layout NON TROUVÉ - À CRÉER' > messages_existant/layout.tsx

# API Messages existantes
echo "--- app/api/messages/route.ts ---" > messages_existant/api-main.ts
cat ../app/api/messages/route.ts > messages_existant/api-main.ts 2>/dev/null || echo '// API messages principale NON TROUVÉE - À CRÉER' > messages_existant/api-main.ts

echo "--- app/api/messages/chantier/[id]/route.ts ---" > messages_existant/api-chantier.ts
cat ../app/api/messages/chantier/\[id\]/route.ts > messages_existant/api-chantier.ts 2>/dev/null || echo '// API messages chantier NON TROUVÉE - À CRÉER' > messages_existant/api-chantier.ts

echo "--- app/api/messages/mark-read/route.ts ---" > messages_existant/api-mark-read.ts
cat ../app/api/messages/mark-read/route.ts > messages_existant/api-mark-read.ts 2>/dev/null || echo '// API mark-read NON TROUVÉE - À CRÉER' > messages_existant/api-mark-read.ts

# Tous les autres endpoints messages
find ../app/api/messages -name "route.ts" 2>/dev/null | while read api_file; do
    rel_path=${api_file#../app/api/messages/}
    safe_name=$(echo "$rel_path" | sed 's/\[//g' | sed 's/\]//g' | sed 's/\//_/g' | sed 's/route\.ts$//')
    echo "--- $api_file ---" > "messages_existant/api-$safe_name.ts"
    cat "$api_file" >> "messages_existant/api-$safe_name.ts" 2>/dev/null || echo "// Erreur lecture $api_file" >> "messages_existant/api-$safe_name.ts"
done

echo "✅ Messages existants exportés dans: messages_existant/"

# =============================================================================
# 8. COMPOSANTS MESSAGES EXISTANTS
# =============================================================================
echo ""
echo "🧩 8. COMPOSANTS MESSAGES EXISTANTS"
echo "==================================="
mkdir -p composants_messages

if [ -d "../components/messages" ]; then
    find ../components/messages -name "*.tsx" | while read comp; do
        comp_name=$(basename "$comp" .tsx)
        echo "--- components/messages/$comp_name.tsx ---" > "composants_messages/$comp_name.tsx"
        cat "$comp" >> "composants_messages/$comp_name.tsx"
    done
else
    echo '// Dossier components/messages NON TROUVÉ - À CRÉER' > composants_messages/README.txt
    echo '// Composants à créer selon spécifications:' >> composants_messages/README.txt
    echo '// - MessageBubble.tsx' >> composants_messages/README.txt
    echo '// - ConversationList.tsx' >> composants_messages/README.txt
    echo '// - MessageInput.tsx' >> composants_messages/README.txt
    echo '// - UserAvatar.tsx' >> composants_messages/README.txt
    echo '// - NewMessageModal.tsx' >> composants_messages/README.txt
    echo '// - MediaViewer.tsx' >> composants_messages/README.txt
    echo '// - MessageActions.tsx' >> composants_messages/README.txt
    echo '// - TypingIndicator.tsx' >> composants_messages/README.txt
fi

echo "✅ Composants messages exportés dans: composants_messages/"

# =============================================================================
# 9. HOOKS EXISTANTS ET À CRÉER
# =============================================================================
echo ""
echo "🎣 9. HOOKS EXISTANTS ET À CRÉER"
echo "==============================="
mkdir -p hooks

# Hook useMessages (CRITIQUE)
echo "--- hooks/useMessages.ts ---" > hooks/useMessages.ts
cat ../hooks/useMessages.ts > hooks/useMessages.ts 2>/dev/null || echo '// hooks/useMessages.ts NON TROUVÉ - À CRÉER PRIORITÉ 1' > hooks/useMessages.ts

# Autres hooks existants
if [ -d "../hooks" ]; then
    find ../hooks -name "*.ts" -o -name "*.tsx" | while read hook; do
        hook_name=$(basename "$hook")
        if [ "$hook_name" != "useMessages.ts" ]; then
            echo "--- hooks/$hook_name ---" > "hooks/$hook_name"
            cat "$hook" >> "hooks/$hook_name"
        fi
    done
fi

echo "✅ Hooks exportés dans: hooks/"

# =============================================================================
# 10. COMPOSANTS UI DE BASE
# =============================================================================
echo ""
echo "🎨 10. COMPOSANTS UI DE BASE"
echo "==========================="
mkdir -p composants_ui

# Composants UI critiques
ui_components=("button" "input" "card" "badge" "avatar" "modal" "dropdown" "toast")

for comp in "${ui_components[@]}"; do
    echo "--- components/ui/$comp.tsx ---" > "composants_ui/$comp.tsx"
    cat "../components/ui/$comp.tsx" > "composants_ui/$comp.tsx" 2>/dev/null || echo "// $comp.tsx NON TROUVÉ - À CRÉER" > "composants_ui/$comp.tsx"
done

# Composants de navigation
echo "--- components/Navigation.tsx ---" > composants_ui/Navigation.tsx
cat ../components/Navigation.tsx > composants_ui/Navigation.tsx 2>/dev/null || echo '// Navigation.tsx non trouvé' > composants_ui/Navigation.tsx

echo "--- components/Sidebar.tsx ---" > composants_ui/Sidebar.tsx
cat ../components/Sidebar.tsx > composants_ui/Sidebar.tsx 2>/dev/null || echo '// Sidebar.tsx non trouvé' > composants_ui/Sidebar.tsx

echo "✅ Composants UI exportés dans: composants_ui/"

# =============================================================================
# 11. TYPES ET UTILS
# =============================================================================
echo ""
echo "📝 11. TYPES ET UTILITAIRES"
echo "=========================="
mkdir -p types_utils

# Types
echo "--- types/index.ts ---" > types_utils/index.ts
cat ../types/index.ts > types_utils/index.ts 2>/dev/null || echo '// types/index.ts non trouvé' > types_utils/index.ts

echo "--- types/messages.ts ---" > types_utils/messages.ts
cat ../types/messages.ts > types_utils/messages.ts 2>/dev/null || echo '// types/messages.ts NON TROUVÉ - À CRÉER' > types_utils/messages.ts

# Utils
echo "--- lib/utils.ts ---" > types_utils/utils.ts
cat ../lib/utils.ts > types_utils/utils.ts 2>/dev/null || echo '// lib/utils.ts non trouvé' > types_utils/utils.ts

# Validations (si Zod utilisé)
echo "--- lib/validations.ts ---" > types_utils/validations.ts
cat ../lib/validations.ts > types_utils/validations.ts 2>/dev/null || echo '// lib/validations.ts NON TROUVÉ - À CRÉER POUR SÉCURITÉ' > types_utils/validations.ts

echo "✅ Types et utils exportés dans: types_utils/"

# =============================================================================
# 12. ANALYSE STRUCTURE PROJET
# =============================================================================
echo ""
echo "📊 12. ANALYSE STRUCTURE PROJET"
echo "==============================="

echo "STRUCTURE COMPLÈTE DU PROJET" > structure_analyse.txt
echo "============================" >> structure_analyse.txt
echo "Date: $(date)" >> structure_analyse.txt
echo "" >> structure_analyse.txt

# Structure avec tree
if command -v tree >/dev/null 2>&1; then
    tree -I 'node_modules|.git|.next|dist|build|temp_*|extraction_*' ../ >> structure_analyse.txt
else
    find .. -type f -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.css" | grep -E '\.(tsx?|jsx?|json|css)$' | grep -v node_modules | grep -v .next | sort >> structure_analyse.txt
fi

echo "" >> structure_analyse.txt
echo "FICHIERS MANQUANTS CRITIQUES:" >> structure_analyse.txt
echo "=============================" >> structure_analyse.txt

missing_files=()

# Vérifications critiques
if [ ! -f "../hooks/useMessages.ts" ]; then
    missing_files+=("❌ hooks/useMessages.ts - CRITIQUE pour notifications")
fi

if [ ! -f "../app/dashboard/messages/page.tsx" ]; then
    missing_files+=("❌ app/dashboard/messages/page.tsx - Page principale messages")
fi

if [ ! -d "../components/messages" ]; then
    missing_files+=("❌ components/messages/ - Dossier composants messages")
fi

if [ ! -f "../app/api/messages/route.ts" ]; then
    missing_files+=("❌ app/api/messages/route.ts - API principale messages")
fi

if [ ! -f "../types/messages.ts" ]; then
    missing_files+=("❌ types/messages.ts - Types TypeScript")
fi

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ Tous les fichiers critiques sont présents!" >> structure_analyse.txt
else
    for missing in "${missing_files[@]}"; do
        echo "$missing" >> structure_analyse.txt
    done
fi

echo "✅ Analyse structure exportée dans: structure_analyse.txt"

# =============================================================================
# 13. PLAN DE DÉVELOPPEMENT
# =============================================================================
echo ""
echo "🎯 13. PLAN DE DÉVELOPPEMENT DÉTAILLÉ"
echo "====================================="

echo "PLAN DE DÉVELOPPEMENT MODULE MESSAGERIE" > plan_developpement.txt
echo "=======================================" >> plan_developpement.txt
echo "Date: $(date)" >> plan_developpement.txt
echo "Objectif: Module messagerie complet ChantierPro" >> plan_developpement.txt
echo "" >> plan_developpement.txt

echo "🔥 PHASE 1 - FONDATIONS (PRIORITÉ CRITIQUE)" >> plan_developpement.txt
echo "===========================================" >> plan_developpement.txt
echo "[ ] 1.1 Créer hooks/useMessages.ts avec polling" >> plan_developpement.txt
echo "[ ] 1.2 Créer types/messages.ts avec interfaces complètes" >> plan_developpement.txt
echo "[ ] 1.3 Créer app/api/messages/route.ts (CRUD de base)" >> plan_developpement.txt
echo "[ ] 1.4 Créer components/messages/MessageBubble.tsx" >> plan_developpement.txt
echo "[ ] 1.5 Créer components/messages/ConversationList.tsx" >> plan_developpement.txt
echo "[ ] 1.6 Créer app/dashboard/messages/page.tsx (interface de base)" >> plan_developpement.txt
echo "[ ] 1.7 Tester le flux de base: affichage et envoi messages" >> plan_developpement.txt
echo "" >> plan_developpement.txt

echo "🚀 PHASE 2 - FONCTIONNALITÉS CORE (PRIORITÉ 1)" >> plan_developpement.txt
echo "===============================================" >> plan_developpement.txt
echo "[ ] 2.1 Nouveau message: NewMessageModal + ContactSelector" >> plan_developpement.txt
echo "[ ] 2.2 Page app/dashboard/messages/nouveau/page.tsx" >> plan_developpement.txt
echo "[ ] 2.3 API app/api/messages/contacts/route.ts" >> plan_developpement.txt
echo "[ ] 2.4 Recherche: app/dashboard/messages/recherche/page.tsx" >> plan_developpement.txt
echo "[ ] 2.5 API app/api/messages/search/route.ts" >> plan_developpement.txt
echo "[ ] 2.6 Upload fichiers: FileUploadZone + API upload" >> plan_developpement.txt
echo "[ ] 2.7 Viewer médias: MediaViewer.tsx" >> plan_developpement.txt
echo "" >> plan_developpement.txt

echo "⚡ PHASE 3 - INTERACTIONS AVANCÉES (PRIORITÉ 2)" >> plan_developpement.txt
echo "================================================" >> plan_developpement.txt
echo "[ ] 3.1 Actions contextuelles: MessageActions menu" >> plan_developpement.txt
echo "[ ] 3.2 Threads/Réponses: MessageThread component" >> plan_developpement.txt
echo "[ ] 3.3 Modification/Suppression messages" >> plan_developpement.txt
echo "[ ] 3.4 Messages épinglés" >> plan_developpement.txt
echo "[ ] 3.5 Statuts messages: envoyé/lu/erreur" >> plan_developpement.txt
echo "[ ] 3.6 TypingIndicator temps réel" >> plan_developpement.txt
echo "" >> plan_developpement.txt

echo "🔔 PHASE 4 - NOTIFICATIONS (PRIORITÉ 2)" >> plan_developpement.txt
echo "========================================" >> plan_developpement.txt
echo "[ ] 4.1 NotificationBadge dans dashboard" >> plan_developpement.txt
echo "[ ] 4.2 Toast notifications" >> plan_developpement.txt
echo "[ ] 4.3 Notifications navigateur" >> plan_developpement.txt
echo "[ ] 4.4 Préférences notifications par conversation" >> plan_developpement.txt
echo "[ ] 4.5 Sons notifications différenciés" >> plan_developpement.txt
echo "" >> plan_developpement.txt

echo "👥 PHASE 5 - CONTACTS & UX (PRIORITÉ 3)" >> plan_developpement.txt
echo "========================================" >> plan_developpement.txt
echo "[ ] 5.1 Page app/dashboard/contacts/page.tsx" >> plan_developpement.txt
echo "[ ] 5.2 Système favoris contacts" >> plan_developpement.txt
echo "[ ] 5.3 Statuts présence utilisateurs" >> plan_developpement.txt
echo "[ ] 5.4 Raccourcis clavier" >> plan_developpement.txt
echo "[ ] 5.5 Vue mobile responsive" >> plan_developpement.txt
echo "" >> plan_developpement.txt

echo "🛡️ PHASE 6 - SÉCURITÉ & PERFORMANCE (PRIORITÉ 4)" >> plan_developpement.txt
echo "==================================================" >> plan_developpement.txt
echo "[ ] 6.1 Validation Zod toutes APIs" >> plan_developpement.txt
echo "[ ] 6.2 Rate limiting messages" >> plan_developpement.txt
echo "[ ] 6.3 Sanitisation XSS" >> plan_developpement.txt
echo "[ ] 6.4 Permissions granulaires par chantier" >> plan_developpement.txt
echo "[ ] 6.5 Cache optimisé (SWR/TanStack Query)" >> plan_developpement.txt
echo "[ ] 6.6 Virtualisation listes longues" >> plan_developpement.txt
echo "" >> plan_developpement.txt

echo "🧪 PHASE 7 - TESTS & DÉPLOIEMENT (FINAL)" >> plan_developpement.txt
echo "=========================================" >> plan_developpement.txt
echo "[ ] 7.1 Tests unitaires composants critiques" >> plan_developpement.txt
echo "[ ] 7.2 Tests E2E flux messagerie" >> plan_developpement.txt
echo "[ ] 7.3 Tests API avec différents scénarios" >> plan_developpement.txt
echo "[ ] 7.4 Documentation utilisateur" >> plan_developpement.txt
echo "[ ] 7.5 Optimisations finales performance" >> plan_developpement.txt
echo "" >> plan_developpement.txt

echo "📋 TEMPS ESTIMÉ:" >> plan_developpement.txt
echo "- Phase 1: 1-2 jours (critique)" >> plan_developpement.txt
echo "- Phase 2: 2-3 jours (core features)" >> plan_developpement.txt
echo "- Phase 3: 2-3 jours (interactions)" >> plan_developpement.txt
echo "- Phase 4: 1-2 jours (notifications)" >> plan_developpement.txt
echo "- Phase 5: 1-2 jours (UX/contacts)" >> plan_developpement.txt
echo "- Phase 6: 1-2 jours (sécurité)" >> plan_developpement.txt
echo "- Phase 7: 1 jour (tests)" >> plan_developpement.txt
echo "TOTAL: 9-15 jours développement" >> plan_developpement.txt

echo "✅ Plan de développement exporté dans: plan_developpement.txt"

# =============================================================================
# 14. FICHIERS TEMPLATES DE DÉMARRAGE
# =============================================================================
echo ""
echo "📋 14. TEMPLATES DE DÉMARRAGE"
echo "============================="
mkdir -p templates

# Template useMessages hook
cat > templates/useMessages-template.ts << 'EOF'
// hooks/useMessages.ts - Template de démarrage
import { useState, useEffect, useCallback } from 'react';

export interface Message {
  id: string;
  expediteurId: string;
  destinataireId?: string;
  chantierId?: string;
  message: string;
  photos: string[];
  files: string[];
  typeMessage: 'DIRECT' | 'CHANTIER' | 'GROUPE';
  parentId?: string;
  lu: boolean;
  createdAt: string;
  updatedAt: string;
  expediteur: {
    id: string;
    nom: string;
    email: string;
    avatar?: string;
  };
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  type: 'DIRECT' | 'CHANTIER' | 'GROUPE';
  chantierId?: string;
  updatedAt: string;
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Polling toutes les 30s
  useEffect(() => {
    const fetchConversations = async () => {
      // TODO: Implémenter fetch API
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback(async (data: any) => {
    setSending(true);
    try {
      // TODO: Implémenter envoi
    } finally {
      setSending(false);
    }
  }, []);

  return {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    sendMessage,
    loading,
    sending
  };
};
EOF

# Template MessageBubble
cat > templates/MessageBubble-template.tsx << 'EOF'
// components/messages/MessageBubble.tsx - Template
import React from 'react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = true
}) => {
  return (
    <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
      {/* TODO: Implémenter bubble avec styles glass */}
      <div className="message-content">
        {message.message}
      </div>
      <div className="message-meta">
        {new Date(message.createdAt).toLocaleTimeString()}
        {isOwn && (
          <span className={`status ${message.lu ? 'read' : 'sent'}`}>
            {message.lu ? '✓✓' : '✓'}
          </span>
        )}
      </div>
    </div>
  );
};
EOF

# Template API Messages
cat > templates/api-messages-template.ts << 'EOF'
// app/api/messages/route.ts - Template API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // TODO: Récupérer conversations utilisateur
    const conversations = await prisma.message.findMany({
      // TODO: Implémenter query
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Erreur API messages:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    
    // TODO: Validation avec Zod
    // TODO: Créer message en DB
    
    const newMessage = await prisma.message.create({
      data: {
        // TODO: Mapper les données
      },
      include: {
        expediteur: true,
      }
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Erreur création message:', error);
    return NextResponse.json(
      { error: 'Erreur création message' },
      { status: 500 }
    );
  }
}
EOF

# Template Page Messages
cat > templates/messages-page-template.tsx << 'EOF'
// app/dashboard/messages/page.tsx - Template
'use client';

import React from 'react';
import { useMessages } from '@/hooks/useMessages';

export default function MessagesPage() {
  const {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    sendMessage,
    loading
  } = useMessages();

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="messages-container">
      <div className="messages-layout">
        {/* Sidebar conversations */}
        <aside className="conversations-sidebar glass">
          <div className="sidebar-header">
            <h2>Messages</h2>
            <button className="btn-primary">
              Nouveau
            </button>
          </div>
          {/* TODO: ConversationList */}
        </aside>

        {/* Zone chat principal */}
        <main className="chat-main">
          {activeConversation ? (
            <>
              {/* Header conversation */}
              <header className="chat-header glass">
                {/* TODO: Info conversation */}
              </header>

              {/* Messages */}
              <div className="messages-area">
                {/* TODO: Liste messages */}
              </div>

              {/* Input message */}
              <footer className="message-input-area">
                {/* TODO: MessageInput */}
              </footer>
            </>
          ) : (
            <div className="no-conversation">
              <p>Sélectionnez une conversation</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
EOF

echo "✅ Templates de démarrage créés dans: templates/"

# =============================================================================
# 15. CHECKLIST PRE-DÉVELOPPEMENT
# =============================================================================
echo ""
echo "✅ 15. CHECKLIST PRÉ-DÉVELOPPEMENT"
echo "=================================="

echo "CHECKLIST PRÉ-DÉVELOPPEMENT MODULE MESSAGERIE" > checklist_pre_dev.txt
echo "=============================================" >> checklist_pre_dev.txt
echo "" >> checklist_pre_dev.txt

echo "🔍 VÉRIFICATIONS ENVIRONMENT:" >> checklist_pre_dev.txt
echo "=============================" >> checklist_pre_dev.txt

# Vérifications critiques
checks=(
    "node_modules:$([ -d '../node_modules' ] && echo '✅' || echo '❌')"
    "package.json:$([ -f '../package.json' ] && echo '✅' || echo '❌')"
    "prisma/schema.prisma:$([ -f '../prisma/schema.prisma' ] && echo '✅' || echo '❌')"
    ".env:$([ -f '../.env' ] && echo '✅' || echo '❌ Créer depuis .env.example')"
    "globals.css:$([ -f '../app/globals.css' ] && echo '✅' || echo '❌')"
    "DB migrations:$([ -d '../prisma/migrations' ] && echo '✅' || echo '⚠️ Peut être vide')"
)

for check in "${checks[@]}"; do
    key="${check%%:*}"
    status="${check##*:}"
    echo "[ ] $key: $status" >> checklist_pre_dev.txt
done

echo "" >> checklist_pre_dev.txt
echo "🚀 COMMANDES À EXÉCUTER AVANT DÉVELOPPEMENT:" >> checklist_pre_dev.txt
echo "===========================================" >> checklist_pre_dev.txt
echo "[ ] npm install                    # Installer dépendances" >> checklist_pre_dev.txt
echo "[ ] npm run db:generate           # Générer client Prisma" >> checklist_pre_dev.txt
echo "[ ] npm run db:push              # Appliquer schema DB" >> checklist_pre_dev.txt
echo "[ ] npm run db:seed              # Données de test (si disponible)" >> checklist_pre_dev.txt
echo "[ ] npm run dev                  # Démarrer serveur dev" >> checklist_pre_dev.txt
echo "" >> checklist_pre_dev.txt

echo "📁 DOSSIERS À CRÉER SI MANQUANTS:" >> checklist_pre_dev.txt
echo "=================================" >> checklist_pre_dev.txt
echo "[ ] mkdir -p app/dashboard/messages" >> checklist_pre_dev.txt
echo "[ ] mkdir -p app/dashboard/messages/nouveau" >> checklist_pre_dev.txt
echo "[ ] mkdir -p app/dashboard/messages/recherche" >> checklist_pre_dev.txt
echo "[ ] mkdir -p app/dashboard/contacts" >> checklist_pre_dev.txt
echo "[ ] mkdir -p app/api/messages" >> checklist_pre_dev.txt
echo "[ ] mkdir -p app/api/messages/contacts" >> checklist_pre_dev.txt
echo "[ ] mkdir -p app/api/messages/search" >> checklist_pre_dev.txt
echo "[ ] mkdir -p app/api/messages/files/upload" >> checklist_pre_dev.txt
echo "[ ] mkdir -p components/messages" >> checklist_pre_dev.txt
echo "[ ] mkdir -p hooks" >> checklist_pre_dev.txt
echo "[ ] mkdir -p types" >> checklist_pre_dev.txt

echo "✅ Checklist exportée dans: checklist_pre_dev.txt"

# =============================================================================
# 16. RÉSUMÉ FINAL ET INSTRUCTIONS
# =============================================================================
echo ""
echo "📋 16. RÉSUMÉ FINAL"
echo "=================="

echo "RÉSUMÉ EXTRACTION CHANTIERPRO - MODULE MESSAGERIE" > resume_final.txt
echo "=================================================" >> resume_final.txt
echo "Date extraction: $(date)" >> resume_final.txt
echo "Dossier: $EXTRACT_DIR" >> resume_final.txt
echo "" >> resume_final.txt

echo "📊 STATISTIQUES EXTRACTION:" >> resume_final.txt
echo "===========================" >> resume_final.txt
echo "- Fichiers extraits: $(find . -type f | wc -l | tr -d ' ')" >> resume_final.txt
echo "- Dossiers créés: $(find . -type d | wc -l | tr -d ' ')" >> resume_final.txt
echo "- Taille totale: $(du -sh . | cut -f1)" >> resume_final.txt
echo "" >> resume_final.txt

echo "✅ FICHIERS CRITIQUES DISPONIBLES:" >> resume_final.txt
echo "==================================" >> resume_final.txt
echo "✅ Configuration projet (config/)" >> resume_final.txt
echo "✅ Schema base de données (database/)" >> resume_final.txt
echo "✅ Système authentification (auth/)" >> resume_final.txt
echo "✅ Styles et design system (styles/)" >> resume_final.txt
echo "✅ Architecture de référence (chantiers/)" >> resume_final.txt
echo "✅ État actuel messages (messages_existant/)" >> resume_final.txt
echo "✅ Templates de démarrage (templates/)" >> resume_final.txt
echo "✅ Plan de développement détaillé" >> resume_final.txt
echo "" >> resume_final.txt

echo "🎯 PROCHAINES ACTIONS RECOMMANDÉES:" >> resume_final.txt
echo "===================================" >> resume_final.txt
echo "1. Vérifier checklist_pre_dev.txt" >> resume_final.txt
echo "2. Analyser structure_analyse.txt pour fichiers manquants" >> resume_final.txt
echo "3. Suivre plan_developpement.txt phase par phase" >> resume_final.txt
echo "4. Utiliser templates/ comme base de démarrage" >> resume_final.txt
echo "5. Commencer par PHASE 1 (hooks/useMessages.ts)" >> resume_final.txt
echo "" >> resume_final.txt

echo "🚀 COMMANDES DE DÉMARRAGE RAPIDE:" >> resume_final.txt
echo "=================================" >> resume_final.txt
echo "# Dans le projet ChantierPro:" >> resume_final.txt
echo "npm install" >> resume_final.txt
echo "npm run db:generate" >> resume_final.txt
echo "npm run db:push" >> resume_final.txt
echo "npm run dev" >> resume_final.txt
echo "" >> resume_final.txt
echo "# Puis copier les templates vers le projet" >> resume_final.txt
echo "cp templates/useMessages-template.ts ../hooks/useMessages.ts" >> resume_final.txt
echo "cp templates/MessageBubble-template.tsx ../components/messages/MessageBubble.tsx" >> resume_final.txt
echo "cp templates/api-messages-template.ts ../app/api/messages/route.ts" >> resume_final.txt
echo "cp templates/messages-page-template.tsx ../app/dashboard/messages/page.tsx" >> resume_final.txt

echo "✅ Résumé final exporté dans: resume_final.txt"

# =============================================================================
# FINALISATION
# =============================================================================
echo ""
echo "🎉 EXTRACTION COMPLÈTE TERMINÉE!"
echo "==============================="
echo ""
echo "📂 Contenu du dossier $EXTRACT_DIR:"
ls -la

echo ""
echo "📈 RÉSUMÉ:"
echo "- ✅ $(find . -name "*.ts" -o -name "*.tsx" | wc -l | tr -d ' ') fichiers TypeScript/React analysés"
echo "- ✅ $(find . -name "*.txt" | wc -l | tr -d ' ') fichiers d'analyse générés"
echo "- ✅ $(find . -type d | wc -l | tr -d ' ') dossiers organisés"
echo "- ✅ Templates de démarrage créés"
echo "- ✅ Plan de développement détaillé"
echo "- ✅ Checklist pré-développement"

echo ""
echo "🎯 PROCHAINES ÉTAPES:"
echo "1. 📖 Lire resume_final.txt pour vue d'ensemble"
echo "2. ✅ Suivre checklist_pre_dev.txt"
echo "3. 🚀 Commencer développement avec plan_developpement.txt"
echo "4. 📋 Utiliser templates/ comme base"
echo ""

echo "📦 Pour archiver l'extraction:"
echo "cd .. && zip -r ${EXTRACT_DIR}.zip $EXTRACT_DIR/"
echo ""

echo "🚀 READY TO CODE! Tous les éléments sont disponibles pour développer"
echo "   le module messagerie ChantierPro complet! 💬✨"

# Retour au dossier parent
cd ..

echo ""
echo "📍 Extraction terminée dans: ./$EXTRACT_DIR"
echo "📧 Prêt pour envoi à Claude pour développement!"