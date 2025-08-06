#!/bin/bash

# Script d'extraction complète pour ChantierPro
# À exécuter depuis la racine du projet

echo "🔍 EXTRACTION CHANTIERPRO - ANALYSE COMPLÈTE"
echo "================================================="

# Créer un dossier temporaire pour l'extraction
mkdir -p temp_extraction
cd temp_extraction

echo ""
echo "📁 1. STRUCTURE DU PROJET"
echo "=========================="
tree -I 'node_modules|.git|.next|dist|build' ../ > structure.txt
echo "Structure exportée dans: temp_extraction/structure.txt"

echo ""
echo "📦 2. CONFIGURATION PROJET"
echo "==========================="
echo "--- Package.json ---" > config.txt
cat ../package.json >> config.txt
echo -e "\n\n--- tsconfig.json ---" >> config.txt
cat ../tsconfig.json >> config.txt
echo -e "\n\n--- next.config.js ---" >> config.txt
cat ../next.config.* >> config.txt 2>/dev/null || echo "Pas de next.config trouvé" >> config.txt
echo "Configuration exportée dans: temp_extraction/config.txt"

echo ""
echo "🗄️ 3. SCHEMA PRISMA & DB"
echo "========================"
echo "--- Schema Prisma ---" > database.txt
cat ../prisma/schema.prisma >> database.txt 2>/dev/null || echo "Schema Prisma non trouvé" >> database.txt
echo -e "\n\n--- lib/db.ts ---" >> database.txt
cat ../lib/db.ts >> database.txt 2>/dev/null || echo "lib/db.ts non trouvé" >> database.txt
echo -e "\n\n--- .env (variables sans valeurs) ---" >> database.txt
grep -E "^[A-Z_]+" ../.env 2>/dev/null | sed 's/=.*/=***/' >> database.txt || echo "Pas de .env trouvé" >> database.txt
echo "Base de données exportée dans: temp_extraction/database.txt"

echo ""
echo "🎨 4. STYLES & CSS"
echo "=================="
cat ../app/globals.css > styles.css 2>/dev/null || cat ../styles/globals.css > styles.css 2>/dev/null || echo "/* Globals.css non trouvé */" > styles.css
echo "Styles exportés dans: temp_extraction/styles.css"

echo ""
echo "🏗️ 5. PAGES CHANTIERS EXISTANTES"
echo "================================"
mkdir -p pages_chantiers

# Dashboard principal
echo "--- app/dashboard/page.tsx ---" > pages_chantiers/dashboard.tsx
cat ../app/dashboard/page.tsx >> pages_chantiers/dashboard.tsx 2>/dev/null || echo "// Dashboard non trouvé" >> pages_chantiers/dashboard.tsx

# Liste chantiers
echo "--- app/dashboard/chantiers/page.tsx ---" > pages_chantiers/liste.tsx
cat ../app/dashboard/chantiers/page.tsx >> pages_chantiers/liste.tsx 2>/dev/null || echo "// Liste chantiers non trouvée" >> pages_chantiers/liste.tsx

# Détail chantier
echo "--- app/dashboard/chantiers/[id]/page.tsx ---" > pages_chantiers/detail.tsx
cat ../app/dashboard/chantiers/\[id\]/page.tsx >> pages_chantiers/detail.tsx 2>/dev/null || echo "// Détail chantier non trouvé" >> pages_chantiers/detail.tsx

# Nouveau chantier
echo "--- app/dashboard/chantiers/nouveau/page.tsx ---" > pages_chantiers/nouveau.tsx
cat ../app/dashboard/chantiers/nouveau/page.tsx >> pages_chantiers/nouveau.tsx 2>/dev/null || echo "// Nouveau chantier non trouvé" >> pages_chantiers/nouveau.tsx

echo "Pages chantiers exportées dans: temp_extraction/pages_chantiers/"

echo ""
echo "🔌 6. API ROUTES EXISTANTES"
echo "============================"
mkdir -p api_routes

# API Chantiers
echo "--- app/api/chantiers/route.ts ---" > api_routes/chantiers_main.ts
cat ../app/api/chantiers/route.ts >> api_routes/chantiers_main.ts 2>/dev/null || echo "// API chantiers principale non trouvée" >> api_routes/chantiers_main.ts

echo "--- app/api/chantiers/[id]/route.ts ---" > api_routes/chantiers_detail.ts
cat ../app/api/chantiers/\[id\]/route.ts >> api_routes/chantiers_detail.ts 2>/dev/null || echo "// API chantier détail non trouvée" >> api_routes/chantiers_detail.ts

echo "API Routes exportées dans: temp_extraction/api_routes/"

echo ""
echo "🧩 7. COMPOSANTS CHANTIERS"
echo "=========================="
mkdir -p components_chantiers

# Composants dashboard
for comp in StatsCard QuickActions ActivityFeed; do
  echo "--- components/dashboard/$comp.tsx ---" > components_chantiers/dashboard_$comp.tsx
  cat ../components/dashboard/$comp.tsx >> components_chantiers/dashboard_$comp.tsx 2>/dev/null || echo "// $comp non trouvé" >> components_chantiers/dashboard_$comp.tsx
done

# Composants chantiers
for comp in ChantierCard StatusBadge ProgressBar SearchFilter ChantierTabs ChantierHero; do
  echo "--- components/chantiers/$comp.tsx ---" > components_chantiers/$comp.tsx
  cat ../components/chantiers/$comp.tsx >> components_chantiers/$comp.tsx 2>/dev/null || echo "// $comp non trouvé" >> components_chantiers/$comp.tsx
done

echo "Composants exportés dans: temp_extraction/components_chantiers/"

echo ""
echo "🔐 8. AUTHENTIFICATION"
echo "====================="
echo "--- lib/auth.ts ---" > auth.txt
cat ../lib/auth.ts >> auth.txt 2>/dev/null || echo "// lib/auth.ts non trouvé" >> auth.txt
echo -e "\n\n--- middleware.ts ---" >> auth.txt
cat ../middleware.ts >> auth.txt 2>/dev/null || echo "// middleware.ts non trouvé" >> auth.txt
echo "Auth exportée dans: temp_extraction/auth.txt"

echo ""
echo "📊 9. ÉTAT DE L'APPLICATION"
echo "=========================="
echo "Application status:" > app_status.txt
echo "==================" >> app_status.txt
echo "Date: $(date)" >> app_status.txt
echo "" >> app_status.txt

# Vérifier si les dépendances sont installées
if [ -d "../node_modules" ]; then
  echo "✅ node_modules: Installé" >> app_status.txt
else
  echo "❌ node_modules: Non installé (npm install requis)" >> app_status.txt
fi

# Vérifier Prisma
if [ -f "../prisma/schema.prisma" ]; then
  echo "✅ Prisma: Schema présent" >> app_status.txt
else
  echo "❌ Prisma: Schema manquant" >> app_status.txt
fi

# Vérifier .env
if [ -f "../.env" ]; then
  echo "✅ Environnement: .env présent" >> app_status.txt
else
  echo "❌ Environnement: .env manquant" >> app_status.txt
fi

echo "Status exporté dans: temp_extraction/app_status.txt"

echo ""
echo "🎯 10. RÉSUMÉ FINAL"
echo "==================="
echo "Tous les fichiers ont été extraits dans le dossier: temp_extraction/"
echo ""
echo "Pour voir le contenu:"
echo "cd temp_extraction"
echo "ls -la"
echo ""
echo "Pour tout zipper:"
echo "zip -r chantierpro_extraction.zip temp_extraction/"
echo ""
echo "Fichiers créés:"
echo "- structure.txt (arborescence)"
echo "- config.txt (package.json, tsconfig...)"
echo "- database.txt (schema Prisma, db config)"
echo "- styles.css (CSS global)"
echo "- auth.txt (configuration auth)"
echo "- app_status.txt (état application)"
echo "- pages_chantiers/ (toutes les pages)"
echo "- api_routes/ (toutes les API)"
echo "- components_chantiers/ (tous les composants)"
echo ""
echo "✨ Extraction terminée ! Prêt pour l'analyse."