#!/bin/bash

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 VÉRIFICATION SYSTÈME BTP COMPLET${NC}"
echo "=================================================="

# Compteurs
total_files=0
existing_files=0
missing_files=0
total_lines=0

# Fonction pour vérifier un fichier
check_file() {
    local file_path="$1"
    local description="$2"
    
    total_files=$((total_files + 1))
    
    if [ -f "$file_path" ]; then
        local lines=$(wc -l < "$file_path" 2>/dev/null || echo "0")
        total_lines=$((total_lines + lines))
        existing_files=$((existing_files + 1))
        echo -e "${GREEN}✅ $file_path${NC} (${lines} lignes) - $description"
    else
        missing_files=$((missing_files + 1))
        echo -e "${RED}❌ $file_path${NC} - $description"
    fi
}

echo -e "\n${YELLOW}📁 STRUCTURE GÉNÉRALE${NC}"
echo "--------------------"
check_file "app/globals.css" "Design system complet"
check_file "app/layout.tsx" "Layout principal avec providers"
check_file "app/page.tsx" "Page d'accueil"
check_file "middleware.ts" "Protection routes"
check_file "next.config.js" "Configuration Next.js"
check_file "package.json" "Dépendances et scripts"

echo -e "\n${YELLOW}🔐 AUTHENTIFICATION${NC}"
echo "--------------------"
check_file "lib/auth.ts" "Configuration NextAuth"
check_file "lib/db.ts" "Client Prisma"
check_file "lib/utils.ts" "Fonctions utilitaires"
check_file "app/api/auth/[...nextauth]/route.ts" "API NextAuth"
check_file "app/auth/signin/page.tsx" "Page connexion"

echo -e "\n${YELLOW}🗄️ BASE DE DONNÉES${NC}"
echo "--------------------"
check_file "prisma/schema.prisma" "Modèles de données"
check_file "prisma/seed.ts" "Données d'exemple"
check_file "types/global.d.ts" "Types TypeScript"

echo -e "\n${YELLOW}📊 DASHBOARD${NC}"
echo "--------------------"
check_file "app/dashboard/layout.tsx" "Layout dashboard"
check_file "app/dashboard/page.tsx" "Dashboard principal"

echo -e "\n${YELLOW}👥 GESTION UTILISATEURS${NC}"
echo "--------------------"
check_file "app/dashboard/users/page.tsx" "Interface utilisateurs"
check_file "app/api/users/route.ts" "API CRUD utilisateurs"
check_file "app/api/users/[id]/route.ts" "API utilisateur individuel"
check_file "components/admin/UserManagement.tsx" "Gestionnaire équipe"
check_file "components/auth/LoginForm.tsx" "Formulaire connexion"
check_file "components/auth/UserProfile.tsx" "Profil utilisateur"

echo -e "\n${YELLOW}💰 SYSTÈME DEVIS${NC}"
echo "--------------------"
check_file "app/dashboard/devis/page.tsx" "Liste devis"
check_file "app/dashboard/devis/[id]/page.tsx" "Détail devis"
check_file "app/api/devis/route.ts" "API CRUD devis"
check_file "app/api/devis/[id]/route.ts" "API devis individuel"
check_file "app/api/devis/[id]/lignes/route.ts" "API lignes devis"
check_file "app/api/devis/[id]/pdf/route.ts" "API génération PDF"
check_file "components/devis/DevisManager.tsx" "Gestionnaire devis"
check_file "components/devis/DevisForm.tsx" "Formulaire création devis"
check_file "components/devis/LigneDevisForm.tsx" "Formulaire lignes devis"
check_file "components/devis/DevisPreview.tsx" "Aperçu PDF devis"
check_file "components/devis/PrixCalculator.tsx" "Calculateur prix"
check_file "components/devis/RetenueGarantie.tsx" "Gestion garantie"
check_file "components/devis/SignatureElectronique.tsx" "Signature numérique"

echo -e "\n${YELLOW}🏗️ SITUATIONS TRAVAUX${NC}"
echo "--------------------"
check_file "components/devis/situations/SituationManager.tsx" "Gestionnaire situations"
check_file "components/devis/situations/SituationCard.tsx" "Carte situation"
check_file "components/devis/situations/SituationForm.tsx" "Formulaire situation"
check_file "components/devis/situations/ProgressionTracker.tsx" "Suivi avancement"

echo -e "\n${YELLOW}💎 TVA BTP${NC}"
echo "--------------------"
check_file "components/devis/tva/TVAMultiTaux.tsx" "TVA multi-taux BTP"

echo -e "\n${YELLOW}📅 PLANNING GANTT${NC}"
echo "--------------------"
check_file "app/dashboard/projets/page.tsx" "Liste projets"
check_file "app/dashboard/projets/[id]/layout.tsx" "Layout projet"
check_file "app/dashboard/projets/[id]/page.tsx" "Vue générale projet"
check_file "app/dashboard/projets/[id]/planning/page.tsx" "Planning Gantt"
check_file "app/api/projets/[id]/planning/route.ts" "API planning projet"
check_file "app/api/taches/[id]/route.ts" "API gestion tâches"
check_file "components/planning/GanttChart.tsx" "Diagramme Gantt"
check_file "components/planning/PlanningManager.tsx" "Gestionnaire planning"
check_file "components/planning/TaskForm.tsx" "Formulaire tâches"
check_file "components/planning/TaskDetail.tsx" "Détail tâche"

echo -e "\n${YELLOW}👥 CRM CLIENT${NC}"
echo "--------------------"
check_file "app/dashboard/crm/clients/page.tsx" "Interface CRM"
check_file "components/crm/ClientDetail.tsx" "Fiche client détaillée"
check_file "components/crm/InteractionsList.tsx" "Suivi interactions"
check_file "components/crm/OpportunitesPipeline.tsx" "Pipeline commercial"
check_file "components/crm/ClientStats.tsx" "Analytics client"

echo -e "\n${YELLOW}📚 BIBLIOTHÈQUE PRIX${NC}"
echo "--------------------"
check_file "app/dashboard/admin/bibliotheque/page.tsx" "Interface prix BTP"
check_file "app/api/bibliotheque-prix/route.ts" "API CRUD prix"
check_file "app/api/bibliotheque-prix/[id]/route.ts" "API prix individuel"
check_file "app/api/bibliotheque-prix/import/route.ts" "API import prix"
check_file "app/api/bibliotheque-prix/export/route.ts" "API export prix"
check_file "components/admin/BibliothequeManager.tsx" "Gestionnaire prix BTP"

echo -e "\n${YELLOW}🎨 COMPOSANTS UI${NC}"
echo "--------------------"
check_file "components/ui/Sidebar.tsx" "Navigation principale"
check_file "components/ui/Header.tsx" "En-tête avec auth"
check_file "components/ui/LoadingSpinner.tsx" "Composant chargement"

echo -e "\n${BLUE}📊 RÉSULTATS VÉRIFICATION${NC}"
echo "=================================================="
echo -e "Total fichiers attendus: ${BLUE}$total_files${NC}"
echo -e "Fichiers existants: ${GREEN}$existing_files${NC}"
echo -e "Fichiers manquants: ${RED}$missing_files${NC}"
echo -e "Total lignes de code: ${YELLOW}$total_lines${NC}"

# Calcul pourcentage
if [ $total_files -gt 0 ]; then
    percentage=$((existing_files * 100 / total_files))
    echo -e "Taux de complétion: ${GREEN}$percentage%${NC}"
fi

echo ""

# Vérification structure dossiers
echo -e "${BLUE}📁 VÉRIFICATION STRUCTURE DOSSIERS${NC}"
echo "=================================================="

directories=(
    "app/api/auth"
    "app/api/users"
    "app/api/devis"
    "app/api/projets"
    "app/api/taches"
    "app/api/bibliotheque-prix"
    "app/dashboard/users"
    "app/dashboard/devis"
    "app/dashboard/projets"
    "app/dashboard/crm/clients"
    "app/dashboard/admin/bibliotheque"
    "components/ui"
    "components/auth"
    "components/admin"
    "components/devis/situations"
    "components/devis/tva"
    "components/planning"
    "components/crm"
    "lib"
    "prisma"
    "types"
)

missing_dirs=0
existing_dirs=0

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $dir/${NC}"
        existing_dirs=$((existing_dirs + 1))
    else
        echo -e "${RED}❌ $dir/${NC}"
        missing_dirs=$((missing_dirs + 1))
    fi
done

echo ""
echo -e "Dossiers existants: ${GREEN}$existing_dirs${NC}/${BLUE}${#directories[@]}${NC}"
echo -e "Dossiers manquants: ${RED}$missing_dirs${NC}"

# Vérification package.json
echo -e "\n${BLUE}📦 VÉRIFICATION PACKAGE.JSON${NC}"
echo "=================================================="

if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json trouvé${NC}"
    
    # Vérifier les dépendances principales
    deps_to_check=("next" "react" "typescript" "@prisma/client" "next-auth")
    
    for dep in "${deps_to_check[@]}"; do
        if grep -q "\"$dep\"" package.json; then
            echo -e "${GREEN}✅ $dep${NC}"
        else
            echo -e "${RED}❌ $dep manquant${NC}"
        fi
    done
else
    echo -e "${RED}❌ package.json non trouvé${NC}"
fi

# Test de syntaxe TypeScript (si tsc disponible)
echo -e "\n${BLUE}🔍 TEST SYNTAXE TYPESCRIPT${NC}"
echo "=================================================="

if command -v npx >/dev/null 2>&1; then
    echo "Test de compilation TypeScript..."
    if npx tsc --noEmit --skipLibCheck 2>/dev/null; then
        echo -e "${GREEN}✅ Compilation TypeScript réussie${NC}"
    else
        echo -e "${YELLOW}⚠️ Erreurs de compilation TypeScript détectées${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ npx non disponible, test TypeScript ignoré${NC}"
fi

# Résumé final
echo -e "\n${BLUE}🎯 RÉSUMÉ FINAL${NC}"
echo "=================================================="

if [ $missing_files -eq 0 ] && [ $missing_dirs -eq 0 ]; then
    echo -e "${GREEN}🎉 SYSTÈME BTP COMPLET !${NC}"
    echo -e "${GREEN}Tous les fichiers et dossiers sont présents.${NC}"
    echo -e "${GREEN}Le système est prêt à fonctionner.${NC}"
elif [ $missing_files -lt 5 ] && [ $missing_dirs -eq 0 ]; then
    echo -e "${YELLOW}⚠️ SYSTÈME QUASI COMPLET${NC}"
    echo -e "${YELLOW}Quelques fichiers mineurs manquent mais le système devrait fonctionner.${NC}"
else
    echo -e "${RED}❌ SYSTÈME INCOMPLET${NC}"
    echo -e "${RED}Plusieurs fichiers importants manquent.${NC}"
    echo -e "${RED}Le système pourrait ne pas fonctionner correctement.${NC}"
fi

echo -e "\n${BLUE}📝 COMMANDES SUIVANTES RECOMMANDÉES :${NC}"
echo "=================================================="
echo -e "${YELLOW}npm install${NC}                    # Installer les dépendances"
echo -e "${YELLOW}npx prisma generate${NC}            # Générer le client Prisma"
echo -e "${YELLOW}npm run dev${NC}                    # Lancer en mode développement"
echo -e "${YELLOW}npx prisma studio${NC}              # Interface base de données (optionnel)"

