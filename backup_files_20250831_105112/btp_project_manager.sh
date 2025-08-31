#!/bin/bash

# Titre du script
echo "==============================================="
echo "  SCRIPT DE GESTION PROJET BTP NEXT.JS"
echo "==============================================="

# Fonction pour afficher l'arborescence des dossiers (avec limitation de profondeur)
show_structure() {
  echo -e "\n🗂️  STRUCTURE DU PROJET :"
  echo "---------------------------------------------"
  find . -type d -not -path "*/node_modules/*" -not -path "*/\.git/*" -not -path "*/\.next/*" | sort | while read dir; do
    # Calcul du niveau d'indentation
    level=$(echo "$dir" | tr -cd '/' | wc -c)
    indent=$(printf '%*s' $((level * 2)) '')
    # Affichage du dossier avec indentation
    echo "${indent}📁 ${dir##*/}"
  done
}

# Fonction pour lister les fichiers scripts
list_scripts() {
  echo -e "\n📜 SCRIPTS TROUVÉS :"
  echo "---------------------------------------------"
  find . -type f -name "*.sh" -o -name "*.js" -not -path "*/node_modules/*" -not -path "*/\.next/*" | sort
}

# Fonction pour analyser le projet
analyze_project() {
  echo -e "\n📊 ANALYSE DU PROJET :"
  echo "---------------------------------------------"
  
  # Compter les fichiers par type
  echo "📄 Types de fichiers :"
  echo "  - TypeScript: $(find . -type f -name "*.ts" -o -name "*.tsx" -not -path "*/node_modules/*" -not -path "*/\.next/*" | wc -l)"
  echo "  - JavaScript: $(find . -type f -name "*.js" -o -name "*.jsx" -not -path "*/node_modules/*" -not -path "*/\.next/*" | wc -l)"
  echo "  - CSS: $(find . -type f -name "*.css" -not -path "*/node_modules/*" -not -path "*/\.next/*" | wc -l)"
  echo "  - JSON: $(find . -type f -name "*.json" -not -path "*/node_modules/*" -not -path "*/\.next/*" | wc -l)"
  
  # Analyser les modules principaux
  echo -e "\n🏗️  Modules métier :"
  echo "  - Devis: $(find . -type f -path "*/devis/*" -not -path "*/node_modules/*" -not -path "*/\.next/*" | wc -l) fichiers"
  echo "  - Projets: $(find . -type f -path "*/projets/*" -not -path "*/node_modules/*" -not -path "*/\.next/*" | wc -l) fichiers"
  echo "  - Planning: $(find . -type f -path "*/planning/*" -not -path "*/node_modules/*" -not -path "*/\.next/*" | wc -l) fichiers"
  echo "  - CRM: $(find . -type f -path "*/crm/*" -not -path "*/node_modules/*" -not -path "*/\.next/*" | wc -l) fichiers"
  echo "  - Bibliothèque Prix: $(find . -type f -path "*/bibliotheque-prix/*" -not -path "*/node_modules/*" -not -path "*/\.next/*" | wc -l) fichiers"
}

# Fonction pour nettoyer les scripts inutilisés
clean_scripts() {
  echo -e "\n🧹 NETTOYAGE DES SCRIPTS :"
  echo "---------------------------------------------"
  
  # Lister les scripts potentiellement nettoyables
  echo "Scripts potentiellement nettoyables :"
  # Lister les scripts qui ne sont pas référencés dans package.json
  scripts_to_clean=$(find . -type f -name "*.sh" -not -path "*/node_modules/*" -not -path "*/\.next/*")
  
  if [ -z "$scripts_to_clean" ]; then
    echo "Aucun script à nettoyer."
    return
  fi
  
  echo "$scripts_to_clean"
  echo ""
  
  # Demander confirmation
  read -p "Voulez-vous supprimer ces scripts ? (o/n): " confirm
  if [ "$confirm" = "o" ] || [ "$confirm" = "O" ]; then
    echo "$scripts_to_clean" | xargs rm -f
    echo "✅ Scripts supprimés avec succès."
  else
    echo "❌ Opération annulée."
  fi
}

# Menu principal
while true; do
  echo -e "\n📋 MENU PRINCIPAL :"
  echo "---------------------------------------------"
  echo "1. Afficher la structure du projet"
  echo "2. Lister les scripts trouvés"
  echo "3. Analyser le projet"
  echo "4. Nettoyer les scripts inutilisés"
  echo "5. Tout exécuter"
  echo "0. Quitter"
  echo "---------------------------------------------"
  
  read -p "Votre choix : " choice
  
  case $choice in
    1) show_structure ;;
    2) list_scripts ;;
    3) analyze_project ;;
    4) clean_scripts ;;
    5) 
      show_structure
      list_scripts
      analyze_project
      clean_scripts
      ;;
    0) 
      echo -e "\n👋 Au revoir !"
      exit 0
      ;;
    *) echo "❌ Option invalide, veuillez réessayer." ;;
  esac
done