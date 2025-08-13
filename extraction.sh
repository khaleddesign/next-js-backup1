#!/bin/bash
# Analyseur d'avancement ChantierPro
# Usage: ./analyze_progress.sh

echo "🚀 ANALYSE AVANCEMENT CHANTIERPRO"
echo "=================================="
echo "Date: $(date)"
echo ""

# Fonction pour vérifier si un fichier existe et compter les lignes
check_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        local lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo "✅ $description ($lines lignes)"
        return 0
    else
        echo "❌ $description - MANQUANT"
        return 1
    fi
}

# Fonction pour vérifier un dossier et compter les fichiers
check_directory() {
    local dir="$1"
    local description="$2"
    
    if [ -d "$dir" ]; then
        local count=$(find "$dir" -name "*.tsx" -o -name "*.ts" | wc -l)
        echo "✅ $description ($count fichiers)"
        return 0
    else
        echo "❌ $description - DOSSIER MANQUANT"
        return 1
    fi
}

# Fonction pour tester une URL
test_url() {
    local url="$1"
    local description="$2"
    
    # Vérifier si le serveur dev tourne
    if curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null | grep -q "200\|404"; then
        echo "✅ $description - Serveur accessible"
        return 0
    else
        echo "⚠️  $description - Serveur non démarré"
        return 1
    fi
}

echo "📊 1. INFRASTRUCTURE DE BASE"
echo "----------------------------"
total_base=0
passed_base=0

# Configuration projet
check_file "package.json" "Configuration npm" && ((passed_base++))
((total_base++))

check_file "tsconfig.json" "Configuration TypeScript" && ((passed_base++))
((total_base++))

check_file "prisma/schema.prisma" "Schema base de données" && ((passed_base++))
((total_base++))

check_file ".env" "Variables d'environnement" && ((passed_base++))
((total_base++))

check_file "app/layout.tsx" "Layout principal Next.js" && ((passed_base++))
((total_base++))

echo "Score Infrastructure: $passed_base/$total_base"
echo ""

echo "📱 2. MODULES FONCTIONNELS"
echo "-------------------------"
total_modules=0
passed_modules=0

# Dashboard
check_file "app/dashboard/page.tsx" "Dashboard principal" && ((passed_modules++))
((total_modules++))

check_directory "components/dashboard" "Composants dashboard" && ((passed_modules++))
((total_modules++))

# Module Chantiers  
check_file "app/dashboard/chantiers/page.tsx" "Liste chantiers" && ((passed_modules++))
((total_modules++))

check_file "app/dashboard/chantiers/[id]/page.tsx" "Détail chantier" && ((passed_modules++))
((total_modules++))

check_file "app/dashboard/chantiers/nouveau/page.tsx" "Nouveau chantier" && ((passed_modules++))
((total_modules++))

check_directory "components/chantiers" "Composants chantiers" && ((passed_modules++))
((total_modules++))

# Module Messages
check_file "app/dashboard/messages/page.tsx" "Interface messages" && ((passed_modules++))
((total_modules++))

check_file "app/dashboard/messages/nouveau/page.tsx" "Nouveau message" && ((passed_modules++))
((total_modules++))

check_file "app/dashboard/messages/recherche/page.tsx" "Recherche messages" && ((passed_modules++))
((total_modules++))

check_directory "components/messages" "Composants messages" && ((passed_modules++))
((total_modules++))

# Authentification
check_file "app/auth/login/page.tsx" "Page de connexion" && ((passed_modules++))
((total_modules++))

echo "Score Modules: $passed_modules/$total_modules"
echo ""

echo "🔧 3. APIS ET BACKEND"
echo "--------------------"
total_apis=0
passed_apis=0

# APIs Chantiers
check_file "app/api/chantiers/route.ts" "API Chantiers (liste)" && ((passed_apis++))
((total_apis++))

check_file "app/api/chantiers/[id]/route.ts" "API Chantier (détail)" && ((passed_apis++))
((total_apis++))

# APIs Messages
check_file "app/api/messages/route.ts" "API Messages (principal)" && ((passed_apis++))
((total_apis++))

check_file "app/api/messages/contacts/route.ts" "API Contacts" && ((passed_apis++))
((total_apis++))

check_file "app/api/messages/search/route.ts" "API Recherche" && ((passed_apis++))
((total_apis++))

# Auth
check_file "app/api/auth/[...nextauth]/route.ts" "API Authentification" && ((passed_apis++))
((total_apis++))

# Validations
check_file "lib/validations.ts" "Validations Zod" && ((passed_apis++))
((total_apis++))

echo "Score APIs: $passed_apis/$total_apis"
echo ""

echo "🎨 4. COMPOSANTS UI"
echo "------------------"
total_ui=0
passed_ui=0

check_directory "components/ui" "Composants UI de base" && ((passed_ui++))
((total_ui++))

check_file "types/index.ts" "Types TypeScript" && ((passed_ui++))
((total_ui++))

check_file "hooks/useMessages.ts" "Hook Messages" && ((passed_ui++))
((total_ui++))

check_file "app/globals.css" "Styles globaux" && ((passed_ui++))
((total_ui++))

echo "Score UI/UX: $passed_ui/$total_ui"
echo ""

echo "🧪 5. TESTS DE FONCTIONNEMENT"
echo "-----------------------------"

# Test de compilation
echo "Test compilation TypeScript..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Compilation réussie"
    compilation_ok=1
else
    echo "❌ Erreurs de compilation"
    compilation_ok=0
fi

# Test si serveur peut démarrer (en arrière-plan pour 10s)
echo "Test démarrage serveur..."
timeout 10s npm run dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 5

# Test des URLs principales
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "✅ Serveur Next.js démarre correctement"
    
    # Tuer le serveur de test
    kill $SERVER_PID > /dev/null 2>&1
    server_ok=1
else
    echo "❌ Problème démarrage serveur"
    server_ok=0
fi

echo ""

echo "📈 6. SCORE GLOBAL ET DIAGNOSTIC"
echo "================================"

total_points=$((total_base + total_modules + total_apis + total_ui + 2))
passed_points=$((passed_base + passed_modules + passed_apis + passed_ui + compilation_ok + server_ok))
percentage=$((passed_points * 100 / total_points))

echo "Score Total: $passed_points/$total_points ($percentage%)"
echo ""

# Diagnostic par niveau
if [ $percentage -ge 90 ]; then
    status="🎉 PRODUCTION READY"
    next_steps="Prêt pour mise en production et commercialisation !"
elif [ $percentage -ge 75 ]; then
    status="🚀 QUASI COMPLET"
    next_steps="Finaliser les fonctionnalités manquantes et tests finaux"
elif [ $percentage -ge 50 ]; then
    status="🔧 EN DÉVELOPPEMENT"
    next_steps="Continuer le développement des modules principaux"
elif [ $percentage -ge 25 ]; then
    status="🏗️  INFRASTRUCTURE OK"
    next_steps="Développer les fonctionnalités métier"
else
    status="❌ PROJET INCOMPLET"
    next_steps="Corriger les problèmes de base avant de continuer"
fi

echo "📊 STATUT PROJET: $status"
echo "🎯 PROCHAINES ÉTAPES: $next_steps"
echo ""

echo "🔍 7. ANALYSE DÉTAILLÉE"
echo "========================"

# Fonctionnalités complètes vs incomplètes
echo "MODULES COMPLETS:"
[ $passed_base -eq $total_base ] && echo "✅ Infrastructure (100%)" || echo "⚠️  Infrastructure ($((passed_base * 100 / total_base))%)"
[ $passed_modules -eq $total_modules ] && echo "✅ Modules fonctionnels (100%)" || echo "⚠️  Modules fonctionnels ($((passed_modules * 100 / total_modules))%)"
[ $passed_apis -eq $total_apis ] && echo "✅ APIs Backend (100%)" || echo "⚠️  APIs Backend ($((passed_apis * 100 / total_apis))%)"
[ $passed_ui -eq $total_ui ] && echo "✅ Interface UI/UX (100%)" || echo "⚠️  Interface UI/UX ($((passed_ui * 100 / total_ui))%)"

echo ""
echo "RECOMMANDATIONS PRIORITAIRES:"

if [ $passed_base -lt $total_base ]; then
    echo "🔴 URGENT: Corriger la configuration de base"
fi

if [ $compilation_ok -eq 0 ]; then
    echo "🔴 CRITIQUE: Résoudre les erreurs de compilation TypeScript"
fi

if [ $server_ok -eq 0 ]; then
    echo "🔴 CRITIQUE: Corriger les problèmes de démarrage serveur"
fi

if [ $passed_modules -lt $total_modules ]; then
    echo "🟡 IMPORTANT: Finaliser les modules manquants"
fi

echo ""
echo "🎯 FOCUS RECOMMANDÉ:"
if [ $percentage -lt 50 ]; then
    echo "   → Corriger les bugs critiques d'abord"
elif [ $percentage -lt 75 ]; then
    echo "   → Finaliser le module Messages pour avoir un MVP complet"
else
    echo "   → Tests finaux et préparation commercialisation"
fi

echo ""
echo "📝 RAPPORT SAUVEGARDÉ: project_status_$(date +%Y%m%d_%H%M%S).txt"

# Sauvegarder le rapport
{
    echo "ChantierPro - Rapport d'avancement $(date)"
    echo "Score: $passed_points/$total_points ($percentage%)"
    echo "Statut: $status"
    echo "Prochaines étapes: $next_steps"
} > "scripts/project_status_$(date +%Y%m%d_%H%M%S).txt"

echo "✅ Analyse terminée !"