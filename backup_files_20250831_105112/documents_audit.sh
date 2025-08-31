#!/bin/bash

echo "📁 AUDIT MODULE DOCUMENTS - CHANTIERPRO"
echo "========================================"
echo "📅 $(date)"
echo ""

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction pour afficher le statut avec couleur
status_check() {
    local name="$1"
    local file="$2"
    local is_critical="$3"
    
    if [ -f "$file" ]; then
        if [ "$is_critical" = "true" ]; then
            echo -e "  ✅ ${GREEN}$name${NC} - ${GREEN}COMPLET${NC}"
        else
            echo -e "  ✅ ${GREEN}$name${NC}"
        fi
        return 1
    else
        if [ "$is_critical" = "true" ]; then
            echo -e "  ❌ ${RED}$name${NC} - ${RED}MANQUANT (CRITIQUE)${NC}"
        else
            echo -e "  ⚠️  ${YELLOW}$name${NC} - ${YELLOW}MANQUANT${NC}"
        fi
        return 0
    fi
}

# Fonction pour vérifier le contenu d'un fichier
content_check() {
    local name="$1"
    local file="$2"
    local pattern="$3"
    
    if [ -f "$file" ]; then
        if grep -q "$pattern" "$file" 2>/dev/null; then
            echo -e "  ✅ ${GREEN}$name${NC} - ${GREEN}IMPLÉMENTÉ${NC}"
            return 1
        else
            echo -e "  ⚠️  ${YELLOW}$name${NC} - ${YELLOW}PARTIELLEMENT IMPLÉMENTÉ${NC}"
            return 0
        fi
    else
        echo -e "  ❌ ${RED}$name${NC} - ${RED}FICHIER MANQUANT${NC}"
        return 0
    fi
}

# Compteurs
total_files=0
existing_files=0
critical_missing=0

echo -e "${BLUE}📋 1. MODÈLE DE DONNÉES${NC}"
echo "========================"

# Vérification modèle Prisma Documents
if [ -f "prisma/schema.prisma" ]; then
    if grep -q "model Document" "prisma/schema.prisma"; then
        echo -e "  ✅ ${GREEN}Model Document${NC} - ${GREEN}DÉFINI${NC}"
        ((existing_files++))
        
        # Vérifier les champs essentiels
        if grep -q "TypeDocument" "prisma/schema.prisma"; then
            echo -e "    ↳ ${GREEN}Enum TypeDocument défini${NC}"
        else
            echo -e "    ↳ ${YELLOW}Enum TypeDocument manquant${NC}"
        fi
        
        if grep -q "url.*String" "prisma/schema.prisma"; then
            echo -e "    ↳ ${GREEN}Champ URL présent${NC}"
        else
            echo -e "    ↳ ${RED}Champ URL manquant${NC}"
        fi
        
    else
        echo -e "  ❌ ${RED}Model Document${NC} - ${RED}NON DÉFINI${NC}"
        ((critical_missing++))
    fi
else
    echo -e "  ❌ ${RED}Schema Prisma${NC} - ${RED}FICHIER MANQUANT${NC}"
    ((critical_missing++))
fi
((total_files++))

echo ""
echo -e "${BLUE}🌐 2. API ROUTES${NC}"
echo "================"

# API Routes Documents
api_files=(
    "app/api/documents/route.ts:API Documents Principal:true"
    "app/api/documents/[id]/route.ts:API Document ID:true"
    "app/api/documents/upload/route.ts:API Upload:true"
    "app/api/documents/download/[id]/route.ts:API Download:false"
)

for item in "${api_files[@]}"; do
    IFS=':' read -r file name is_critical <<< "$item"
    status_check "$name" "$file" "$is_critical"
    if [ $? -eq 1 ]; then ((existing_files++)); fi
    ((total_files++))
done

echo ""
echo -e "${BLUE}🎣 3. HOOKS MÉTIER${NC}"
echo "=================="

# Hooks Documents
hook_files=(
    "hooks/useDocuments.ts:Hook Documents Principal:true"
    "hooks/useFileUpload.ts:Hook Upload Fichiers:true"
    "hooks/useDocumentPreview.ts:Hook Preview:false"
)

for item in "${hook_files[@]}"; do
    IFS=':' read -r file name is_critical <<< "$item"
    status_check "$name" "$file" "$is_critical"
    if [ $? -eq 1 ]; then ((existing_files++)); fi
    ((total_files++))
done

echo ""
echo -e "${BLUE}🧩 4. COMPOSANTS UI${NC}"
echo "=================="

# Composants Documents
component_files=(
    "components/documents:Dossier Composants Documents:true"
    "components/documents/DocumentUpload.tsx:Composant Upload:true"
    "components/documents/DocumentList.tsx:Liste Documents:true"
    "components/documents/DocumentCard.tsx:Carte Document:true"
    "components/documents/DocumentPreview.tsx:Preview Document:false"
    "components/documents/DocumentFilters.tsx:Filtres Documents:false"
)

for item in "${component_files[@]}"; do
    IFS=':' read -r file name is_critical <<< "$item"
    if [[ "$file" == *"/" ]]; then
        # C'est un dossier
        if [ -d "$file" ]; then
            echo -e "  ✅ ${GREEN}$name${NC} - ${GREEN}EXISTE${NC}"
            ((existing_files++))
        else
            if [ "$is_critical" = "true" ]; then
                echo -e "  ❌ ${RED}$name${NC} - ${RED}MANQUANT (CRITIQUE)${NC}"
                ((critical_missing++))
            else
                echo -e "  ⚠️  ${YELLOW}$name${NC} - ${YELLOW}MANQUANT${NC}"
            fi
        fi
    else
        status_check "$name" "$file" "$is_critical"
        if [ $? -eq 1 ]; then ((existing_files++)); fi
    fi
    ((total_files++))
done

echo ""
echo -e "${BLUE}📄 5. PAGES INTERFACE${NC}"
echo "===================="

# Pages Documents
page_files=(
    "app/dashboard/documents/page.tsx:Page Documents Principal:true"
    "app/dashboard/documents/[id]/page.tsx:Page Détail Document:true"
    "app/dashboard/documents/upload/page.tsx:Page Upload Document:true"
    "app/dashboard/documents/layout.tsx:Layout Documents:false"
)

for item in "${page_files[@]}"; do
    IFS=':' read -r file name is_critical <<< "$item"
    status_check "$name" "$file" "$is_critical"
    if [ $? -eq 1 ]; then ((existing_files++)); fi
    ((total_files++))
done

echo ""
echo -e "${BLUE}📱 6. NAVIGATION & LAYOUT${NC}"
echo "========================="

# Vérification navigation Documents
if [ -f "components/layout/ModernSidebar.tsx" ]; then
    if grep -q "documents\|Documents" "components/layout/ModernSidebar.tsx"; then
        echo -e "  ✅ ${GREEN}Navigation Documents${NC} - ${GREEN}INTÉGRÉE${NC}"
        ((existing_files++))
    else
        echo -e "  ⚠️  ${YELLOW}Navigation Documents${NC} - ${YELLOW}NON INTÉGRÉE${NC}"
    fi
else
    echo -e "  ❌ ${RED}Sidebar Navigation${NC} - ${RED}FICHIER MANQUANT${NC}"
fi
((total_files++))

echo ""
echo -e "${BLUE}📊 7. TYPES TYPESCRIPT${NC}"
echo "======================"

# Types Documents
if [ -f "types/index.ts" ]; then
    if grep -q "Document\|TypeDocument" "types/index.ts"; then
        echo -e "  ✅ ${GREEN}Types Documents${NC} - ${GREEN}DÉFINIS${NC}"
        ((existing_files++))
    else
        echo -e "  ⚠️  ${YELLOW}Types Documents${NC} - ${YELLOW}NON DÉFINIS${NC}"
    fi
else
    echo -e "  ❌ ${RED}Types Index${NC} - ${RED}FICHIER MANQUANT${NC}"
fi
((total_files++))

echo ""
echo -e "${BLUE}🔧 8. CONFIGURATION UPLOAD${NC}"
echo "==========================="

# Configuration pour upload de fichiers
config_files=(
    "next.config.js:Config Upload Next.js:false"
    "lib/storage.ts:Configuration Stockage:false"
    "lib/file-utils.ts:Utilitaires Fichiers:false"
)

for item in "${config_files[@]}"; do
    IFS=':' read -r file name is_critical <<< "$item"
    status_check "$name" "$file" "$is_critical"
    if [ $? -eq 1 ]; then ((existing_files++)); fi
    ((total_files++))
done

echo ""
echo -e "${PURPLE}📊 ANALYSE DÉTAILLÉE${NC}"
echo "===================="

# Analyse du contenu des fichiers existants
if [ -f "app/api/documents/route.ts" ]; then
    echo -e "${CYAN}🔍 Analyse API Documents:${NC}"
    if grep -q "export async function GET" "app/api/documents/route.ts"; then
        echo -e "  ✅ ${GREEN}Méthode GET implémentée${NC}"
    else
        echo -e "  ❌ ${RED}Méthode GET manquante${NC}"
    fi
    
    if grep -q "export async function POST" "app/api/documents/route.ts"; then
        echo -e "  ✅ ${GREEN}Méthode POST implémentée${NC}"
    else
        echo -e "  ❌ ${RED}Méthode POST manquante${NC}"
    fi
    
    if grep -q "multer\|formidable\|FormData" "app/api/documents/route.ts"; then
        echo -e "  ✅ ${GREEN}Gestion upload fichiers${NC}"
    else
        echo -e "  ❌ ${RED}Gestion upload manquante${NC}"
    fi
    echo ""
fi

if [ -f "components/documents/DocumentUpload.tsx" ]; then
    echo -e "${CYAN}🔍 Analyse Composant Upload:${NC}"
    lines=$(wc -l < "components/documents/DocumentUpload.tsx")
    if [ "$lines" -gt 100 ]; then
        echo -e "  ✅ ${GREEN}Composant complet ($lines lignes)${NC}"
    elif [ "$lines" -gt 50 ]; then
        echo -e "  ⚠️  ${YELLOW}Composant moyen ($lines lignes)${NC}"
    else
        echo -e "  ❌ ${RED}Composant minimal ($lines lignes)${NC}"
    fi
    
    if grep -q "drag.*drop\|dropzone" "components/documents/DocumentUpload.tsx"; then
        echo -e "  ✅ ${GREEN}Drag & Drop supporté${NC}"
    else
        echo -e "  ❌ ${RED}Drag & Drop manquant${NC}"
    fi
    echo ""
fi

# Vérifier les extensions de fichiers supportées
if [ -f "app/api/documents/upload/route.ts" ]; then
    echo -e "${CYAN}🔍 Types de fichiers supportés:${NC}"
    if grep -q "pdf\|PDF" "app/api/documents/upload/route.ts"; then
        echo -e "  ✅ ${GREEN}PDF supporté${NC}"
    else
        echo -e "  ❌ ${RED}PDF non supporté${NC}"
    fi
    
    if grep -q "image\|jpg\|png\|jpeg" "app/api/documents/upload/route.ts"; then
        echo -e "  ✅ ${GREEN}Images supportées${NC}"
    else
        echo -e "  ❌ ${RED}Images non supportées${NC}"
    fi
    echo ""
fi

# Calcul du pourcentage global
percentage=$((existing_files * 100 / total_files))

echo ""
echo -e "${PURPLE}🎯 RÉSULTATS FINAUX${NC}"
echo "==================="
echo -e "📁 Fichiers analysés: ${BLUE}$total_files${NC}"
echo -e "✅ Fichiers existants: ${GREEN}$existing_files${NC}"
echo -e "❌ Fichiers manquants: ${RED}$((total_files - existing_files))${NC}"
echo -e "🚨 Critiques manquants: ${RED}$critical_missing${NC}"
echo ""

# Barre de progression visuelle
echo -e "${CYAN}📊 PROGRESSION MODULE DOCUMENTS:${NC}"
bar_length=40
filled_length=$((percentage * bar_length / 100))
empty_length=$((bar_length - filled_length))

bar="["
for ((i=1; i<=filled_length; i++)); do bar+="█"; done
for ((i=1; i<=empty_length; i++)); do bar+="░"; done
bar+="]"

if [ "$percentage" -ge 80 ]; then
    color=$GREEN
    status="EXCELLENT"
elif [ "$percentage" -ge 60 ]; then
    color=$YELLOW
    status="BON"
elif [ "$percentage" -ge 40 ]; then
    color=$YELLOW
    status="MOYEN"
else
    color=$RED
    status="FAIBLE"
fi

echo -e "${color}$bar $percentage% - $status${NC}"
echo ""

# Recommandations spécifiques aux Documents
echo -e "${PURPLE}🎯 RECOMMANDATIONS DOCUMENTS${NC}"
echo "============================="

if [ "$critical_missing" -gt 3 ]; then
    echo -e "${RED}🚨 URGENT: Module Documents non fonctionnel${NC}"
    echo -e "   ${RED}→ Créer les API routes de base${NC}"
    echo -e "   ${RED}→ Développer les composants d'upload${NC}"
elif [ "$percentage" -ge 70 ]; then
    echo -e "${GREEN}🎉 Module Documents bien avancé !${NC}"
    echo -e "   ${GREEN}→ Finaliser les fonctionnalités manquantes${NC}"
    echo -e "   ${GREEN}→ Tester l'upload et le preview${NC}"
elif [ "$percentage" -ge 50 ]; then
    echo -e "${YELLOW}⚡ Module Documents en développement${NC}"
    echo -e "   ${YELLOW}→ Compléter les composants UI${NC}"
    echo -e "   ${YELLOW}→ Implémenter la gestion des fichiers${NC}"
else
    echo -e "${RED}🔧 Module Documents à démarrer${NC}"
    echo -e "   ${RED}→ Commencer par les API routes${NC}"
    echo -e "   ${RED}→ Créer le système d'upload${NC}"
fi

echo ""
echo -e "${CYAN}💡 PROCHAINES ÉTAPES SUGGÉRÉES:${NC}"

if [ "$critical_missing" -gt 4 ]; then
    echo -e "1. ${RED}Créer API routes documents (upload/download)${NC}"
    echo -e "2. ${RED}Développer composant DocumentUpload${NC}"
    echo -e "3. ${YELLOW}Créer système de preview${NC}"
elif [ "$percentage" -lt 70 ]; then
    echo -e "1. ${YELLOW}Finaliser les composants manquants${NC}"
    echo -e "2. ${YELLOW}Implémenter drag & drop${NC}"
    echo -e "3. ${GREEN}Ajouter filtres et recherche${NC}"
else
    echo -e "1. ${GREEN}Tests fonctionnels upload/download${NC}"
    echo -e "2. ${GREEN}Optimisation preview fichiers${NC}"
    echo -e "3. ${GREEN}Gestion permissions avancées${NC}"
fi

echo ""
echo -e "${CYAN}🔧 FONCTIONNALITÉS CRITIQUES DOCUMENTS:${NC}"
echo -e "• ${YELLOW}Upload fichiers (PDF, images, plans)${NC}"
echo -e "• ${YELLOW}Preview en ligne${NC}"
echo -e "• ${YELLOW}Organisation par chantier${NC}"
echo -e "• ${YELLOW}Gestion des permissions${NC}"
echo -e "• ${YELLOW}Recherche et filtres${NC}"
echo -e "• ${YELLOW}Versioning et historique${NC}"

echo ""
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}🏁 Audit Documents terminé - $(date)${NC}"
echo -e "${BLUE}===========================================${NC}"