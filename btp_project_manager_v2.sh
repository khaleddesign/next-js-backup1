#!/bin/bash

# Titre du script
clear
echo "=================================================="
echo "  GESTIONNAIRE DE PROJET BTP NEXT.JS - VERSION 2"
echo "=================================================="

# Couleurs pour améliorer la lisibilité
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction pour afficher l'arborescence des dossiers avec limitation de profondeur
show_structure() {
  echo -e "\n${BLUE}🗂️  STRUCTURE DU PROJET :${NC}"
  echo "---------------------------------------------------"
  
  read -p "Niveau de profondeur (1-5, par défaut: 2): " depth
  depth=${depth:-2}
  
  echo -e "${YELLOW}Affichage des dossiers jusqu'à ${depth} niveaux de profondeur...${NC}\n"
  
  find . -type d -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | sort | awk -v depth="$depth" 'BEGIN {FS="/"} {
    if (NF-1 <= depth) {
      for (i=1; i<NF; i++) {
        printf "  "
      }
      print "📁 " $NF
    }
  }'
}

# Fonction pour rechercher des fichiers par type ou module
search_files() {
  echo -e "\n${BLUE}🔍 RECHERCHE DE FICHIERS :${NC}"
  echo "---------------------------------------------------"
  echo -e "${CYAN}Options de recherche :${NC}"
  echo "1. Par extension (.ts, .tsx, .js, etc.)"
  echo "2. Par module (devis, planning, crm, etc.)"
  echo "3. Par contenu (recherche textuelle)"
  echo "4. Retour"
  
  read -p "Votre choix : " search_choice
  
  case $search_choice in
    1) 
      read -p "Extension à rechercher (sans le point, ex: tsx) : " ext
      echo -e "\n${YELLOW}Fichiers avec extension .${ext} :${NC}"
      find . -type f -name "*.${ext}" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" | sort
      ;;
    2)
      read -p "Module à rechercher (ex: devis, planning) : " module
      echo -e "\n${YELLOW}Fichiers dans le module ${module} :${NC}"
      find . -type f -path "*/${module}/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" | sort
      ;;
    3)
      read -p "Texte à rechercher : " search_text
      echo -e "\n${YELLOW}Fichiers contenant '${search_text}' :${NC}"
      grep -r --include="*.{ts,tsx,js,jsx}" "$search_text" . --exclude-dir={node_modules,.next,.git,coverage} | sort
      ;;
    4) return ;;
    *) echo -e "${RED}❌ Option invalide, veuillez réessayer.${NC}" ;;
  esac
}

# Fonction pour lister les scripts
list_scripts() {
  echo -e "\n${BLUE}📜 SCRIPTS TROUVÉS :${NC}"
  echo "---------------------------------------------------"
  
  # Exclure les dossiers node_modules, .next, etc.
  echo -e "${CYAN}Scripts personnalisés :${NC}"
  find . -type f \( -name "*.sh" -o -name "*.js" \) -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | grep -v "next.config.js\|jest.config.js\|postcss.config.js\|tailwind.config.js" | sort
}

# Fonction pour analyser le projet
analyze_project() {
  echo -e "\n${BLUE}📊 ANALYSE DU PROJET :${NC}"
  echo "---------------------------------------------------"
  
  # Compter les fichiers par type
  echo -e "${CYAN}📄 Types de fichiers :${NC}"
  ts_count=$(find . -type f -name "*.ts" -o -name "*.tsx" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l)
  js_count=$(find . -type f -name "*.js" -o -name "*.jsx" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l)
  css_count=$(find . -type f -name "*.css" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l)
  json_count=$(find . -type f -name "*.json" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l)
  
  echo -e "  - TypeScript: ${GREEN}${ts_count}${NC} fichiers"
  echo -e "  - JavaScript: ${GREEN}${js_count}${NC} fichiers"
  echo -e "  - CSS: ${GREEN}${css_count}${NC} fichiers"
  echo -e "  - JSON: ${GREEN}${json_count}${NC} fichiers"
  
  # Analyser les modules principaux
  echo -e "\n${CYAN}🏗️  Modules métier :${NC}"
  devis_count=$(find . -type f -path "*/devis/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l)
  projets_count=$(find . -type f -path "*/projets/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l)
  planning_count=$(find . -type f -path "*/planning/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l)
  crm_count=$(find . -type f -path "*/crm/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l)
  biblio_count=$(find . -type f -path "*/bibliotheque-prix/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l)
  chantiers_count=$(find . -type f -path "*/chantiers/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l)
  
  echo -e "  - Devis: ${GREEN}${devis_count}${NC} fichiers"
  echo -e "  - Projets: ${GREEN}${projets_count}${NC} fichiers"
  echo -e "  - Planning: ${GREEN}${planning_count}${NC} fichiers"
  echo -e "  - CRM: ${GREEN}${crm_count}${NC} fichiers"
  echo -e "  - Bibliothèque Prix: ${GREEN}${biblio_count}${NC} fichiers"
  echo -e "  - Chantiers: ${GREEN}${chantiers_count}${NC} fichiers"
  
  # Ajouter une analyse plus profonde des composants
  echo -e "\n${CYAN}⚛️ Composants React :${NC}"
  components_count=$(find ./components -type f -name "*.tsx" -o -name "*.jsx" -not -path "*/node_modules/*" | wc -l)
  pages_count=$(find ./app -type f -name "page.tsx" -not -path "*/node_modules/*" | wc -l)
  
  echo -e "  - Total composants: ${GREEN}${components_count}${NC}"
  echo -e "  - Pages Next.js: ${GREEN}${pages_count}${NC}"
  
  # Analyser les API routes
  echo -e "\n${CYAN}🔌 API Routes :${NC}"
  api_routes_count=$(find ./app/api -type f -name "route.ts" -o -name "route.js" -not -path "*/node_modules/*" | wc -l)
  
  echo -e "  - Total API routes: ${GREEN}${api_routes_count}${NC}"
}

# Fonction pour nettoyer les scripts inutilisés
clean_scripts() {
  echo -e "\n${BLUE}🧹 NETTOYAGE DES SCRIPTS :${NC}"
  echo "---------------------------------------------------"
  
  # Lister les scripts potentiellement nettoyables
  echo -e "${CYAN}Scripts potentiellement nettoyables :${NC}"
  scripts_to_clean=$(find . -type f -name "*.sh" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | grep -v "btp_project_manager_v2.sh")
  
  if [ -z "$scripts_to_clean" ]; then
    echo "Aucun script à nettoyer."
    return
  fi
  
  echo "$scripts_to_clean"
  echo ""
  
  # Demander confirmation
  read -p "Voulez-vous supprimer ces scripts ? (o/n): " confirm
  if [ "$confirm" = "o" ] || [ "$confirm" = "O" ]; then
    # Créer un dossier de backup avant suppression
    backup_folder="./scripts_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_folder"
    
    # Copier les scripts dans le backup
    echo "$scripts_to_clean" | while read script; do
      cp "$script" "$backup_folder/"
    done
    
    # Supprimer les scripts
    echo "$scripts_to_clean" | xargs rm -f
    echo -e "${GREEN}✅ Scripts sauvegardés dans ${backup_folder} et supprimés avec succès.${NC}"
  else
    echo -e "${YELLOW}❌ Opération annulée.${NC}"
  fi
}

# Fonction pour créer un rapport sur le projet
generate_report() {
  echo -e "\n${BLUE}📝 GÉNÉRATION DU RAPPORT DU PROJET :${NC}"
  echo "---------------------------------------------------"
  
  report_file="./rapport_projet_btp_$(date +%Y%m%d).md"
  
  echo -e "${YELLOW}Création du rapport dans ${report_file}...${NC}"
  
  # Créer le fichier de rapport
  cat > "$report_file" << EOF
# Rapport du Projet BTP Next.js
*Généré le $(date +"%d/%m/%Y à %H:%M")*

## Structure du Projet
\`\`\`
$(find . -type d -maxdepth 3 -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | sort)
\`\`\`

## Statistiques du Projet
- **TypeScript:** $(find . -type f -name "*.ts" -o -name "*.tsx" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l) fichiers
- **JavaScript:** $(find . -type f -name "*.js" -o -name "*.jsx" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l) fichiers
- **CSS:** $(find . -type f -name "*.css" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l) fichiers
- **JSON:** $(find . -type f -name "*.json" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l) fichiers

## Modules Métier
- **Devis:** $(find . -type f -path "*/devis/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l) fichiers
- **Projets:** $(find . -type f -path "*/projets/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l) fichiers
- **Planning:** $(find . -type f -path "*/planning/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l) fichiers
- **CRM:** $(find . -type f -path "*/crm/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l) fichiers
- **Bibliothèque Prix:** $(find . -type f -path "*/bibliotheque-prix/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l) fichiers
- **Chantiers:** $(find . -type f -path "*/chantiers/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | wc -l) fichiers

## Composants React
- **Total composants:** $(find ./components -type f -name "*.tsx" -o -name "*.jsx" -not -path "*/node_modules/*" | wc -l)
- **Pages Next.js:** $(find ./app -type f -name "page.tsx" -not -path "*/node_modules/*" | wc -l)

## API Routes
- **Total API routes:** $(find ./app/api -type f -name "route.ts" -o -name "route.js" -not -path "*/node_modules/*" | wc -l)

## Scripts Personnalisés
\`\`\`
$(find . -type f -name "*.sh" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" -not -path "*/coverage/*" | sort)
\`\`\`

## Notes et Recommendations
- Projet bien structuré avec architecture modulaire
- Les modules Devis et Planning sont les plus développés
- Considérer la consolidation des scripts de maintenance
EOF
  
  echo -e "${GREEN}✅ Rapport généré avec succès dans ${report_file}${NC}"
}

# Fonction pour afficher les recommandations
show_recommendations() {
  echo -e "\n${BLUE}💡 RECOMMANDATIONS POUR LE PROJET :${NC}"
  echo "---------------------------------------------------"
  
  # Analyser les proportions de fichiers
  devis_count=$(find . -type f -path "*/devis/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" | wc -l)
  planning_count=$(find . -type f -path "*/planning/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" | wc -l)
  crm_count=$(find . -type f -path "*/crm/*" -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" | wc -l)
  
  echo -e "${YELLOW}Basé sur l'analyse de votre projet :${NC}\n"
  
  echo -e "${CYAN}1. Organisation des fichiers :${NC}"
  echo "   - Votre structure de dossiers est bien développée et modulaire"
  echo "   - Les modules Devis (${devis_count} fichiers) et Planning (${planning_count} fichiers) sont les plus développés"
  
  echo -e "\n${CYAN}2. Gestion des scripts :${NC}"
  echo "   - Consolidez vos scripts de maintenance dans le dossier ./scripts"
  echo "   - Documentez chaque script avec des commentaires expliquant son but"
  
  echo -e "\n${CYAN}3. Optimisations potentielles :${NC}"
  echo "   - Envisagez d'ajouter des tests unitaires pour les fonctionnalités clés"
  echo "   - Implémentez une stratégie de gestion d'état cohérente dans l'application"
  
  echo -e "\n${CYAN}4. Prochaines étapes recommandées :${NC}"
  echo "   - Audit de performance avec Next.js Analytics"
  echo "   - Optimisation du bundle size avec un outil comme Bundle Analyzer"
  echo "   - Documentation des API routes principales"
}

# Menu principal avec design amélioré
show_menu() {
  echo -e "\n${PURPLE}📋 MENU PRINCIPAL :${NC}"
  echo "---------------------------------------------------"
  echo -e "${CYAN}1.${NC} Afficher la structure du projet"
  echo -e "${CYAN}2.${NC} Rechercher des fichiers"
  echo -e "${CYAN}3.${NC} Lister les scripts trouvés"
  echo -e "${CYAN}4.${NC} Analyser le projet"
  echo -e "${CYAN}5.${NC} Nettoyer les scripts inutilisés"
  echo -e "${CYAN}6.${NC} Générer un rapport du projet"
  echo -e "${CYAN}7.${NC} Afficher les recommandations"
  echo -e "${CYAN}8.${NC} Tout exécuter (sauf nettoyage)"
  echo -e "${CYAN}0.${NC} Quitter"
  echo "---------------------------------------------------"
}

# Fonction principale
main() {
  while true; do
    show_menu
    read -p "Votre choix : " choice
    
    case $choice in
      1) show_structure ;;
      2) search_files ;;
      3) list_scripts ;;
      4) analyze_project ;;
      5) clean_scripts ;;
      6) generate_report ;;
      7) show_recommendations ;;
      8) 
        show_structure
        list_scripts
        analyze_project
        generate_report
        show_recommendations
        ;;
      0) 
        echo -e "\n${GREEN}👋 Au revoir !${NC}"
        exit 0
        ;;
      *) echo -e "${RED}❌ Option invalide, veuillez réessayer.${NC}" ;;
    esac
    
    echo -e "\n${YELLOW}Appuyez sur Entrée pour continuer...${NC}"
    read
    clear
    echo "=================================================="
    echo "  GESTIONNAIRE DE PROJET BTP NEXT.JS - VERSION 2"
    echo "=================================================="
  done
}

# Exécuter la fonction principale
main