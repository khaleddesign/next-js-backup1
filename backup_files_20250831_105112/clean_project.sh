#!/bin/bash

# Nom: clean_project.sh
# Description: Script interactif pour identifier et supprimer les fichiers potentiellement inutiles
# Usage: ./clean_project.sh

# Création d'un dossier de backup
BACKUP_DIR="./backup_files_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "==============================================" 
echo "  NETTOYAGE INTERACTIF DU PROJET BTP"
echo "=============================================="
echo "Ce script va vous aider à identifier et supprimer les fichiers potentiellement inutiles."
echo "ATTENTION: Tous les fichiers seront d'abord sauvegardés dans $BACKUP_DIR"
echo ""

# Fonction pour lister et gérer les scripts potentiellement redondants
clean_scripts() {
    echo "Recherche de scripts potentiellement redondants..."
    
    # Liste de scripts à exclure de la suppression
    KEEP_SCRIPTS=(
        "./btp_project_manager_v2.sh"  # Le script principal de gestion
        "./scripts/analyze_progress.sh" # Script d'analyse de progression
    )
    
    # Trouver tous les scripts .sh
    SCRIPTS_LIST=$(find . -type f -name "*.sh" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/backup_files_*/*")
    
    echo -e "\nScripts trouvés :"
    echo "---------------------------------------------------"
    echo "$SCRIPTS_LIST"
    echo ""
    
    echo "Scripts à conserver par défaut:"
    for script in "${KEEP_SCRIPTS[@]}"; do
        echo "- $script"
    done
    echo ""
    
    # Demander confirmation pour chaque script
    for script in $SCRIPTS_LIST; do
        # Vérifier si le script est dans la liste à conserver
        KEEP=false
        for keep_script in "${KEEP_SCRIPTS[@]}"; do
            if [ "$script" = "$keep_script" ]; then
                KEEP=true
                break
            fi
        done
        
        if [ "$KEEP" = true ]; then
            echo "Conservation de $script (script essentiel)"
            continue
        fi
        
        # Afficher les premières lignes du script pour aider à la décision
        echo -e "\n---------------------------------------------------"
        echo "Contenu de $script (premières lignes):"
        head -n 10 "$script"
        echo "---------------------------------------------------"
        
        read -p "Supprimer $script? (o/n/v - v pour voir tout le contenu): " choice
        
        if [ "$choice" = "v" ]; then
            # Afficher tout le contenu
            echo -e "\nContenu complet de $script:"
            cat "$script"
            read -p "Supprimer $script? (o/n): " choice
        fi
        
        if [ "$choice" = "o" ]; then
            # Faire une sauvegarde avant la suppression
            cp "$script" "$BACKUP_DIR/"
            rm "$script"
            echo "✅ $script supprimé (sauvegardé dans $BACKUP_DIR)"
        else
            echo "⏭️ $script conservé"
        fi
    done
}

# Fonction pour trouver et gérer les fichiers temporaires ou logs
clean_temp_files() {
    echo -e "\nRecherche de fichiers temporaires et logs..."
    
    # Extensions et patterns de fichiers temporaires courants
    TEMP_PATTERNS=(
        "*.tmp"
        "*.log"
        "*.bak"
        "*.swp"
        "*~"
        "*.old"
    )
    
    # Construire la commande find
    FIND_CMD="find . -type f \( "
    first=true
    
    for pattern in "${TEMP_PATTERNS[@]}"; do
        if [ "$first" = true ]; then
            FIND_CMD="$FIND_CMD -name \"$pattern\""
            first=false
        else
            FIND_CMD="$FIND_CMD -o -name \"$pattern\""
        fi
    done
    
    FIND_CMD="$FIND_CMD \) -not -path \"*/node_modules/*\" -not -path \"*/.git/*\" -not -path \"*/backup_files_*/*\""
    
    # Exécuter la commande et stocker le résultat
    TEMP_FILES=$(eval "$FIND_CMD")
    
    if [ -z "$TEMP_FILES" ]; then
        echo "Aucun fichier temporaire trouvé."
        return
    fi
    
    echo -e "\nFichiers temporaires trouvés:"
    echo "$TEMP_FILES"
    echo ""
    
    read -p "Supprimer tous ces fichiers temporaires? (o/n/i - i pour interactivement): " choice
    
    if [ "$choice" = "o" ]; then
        # Backup et suppression de tous les fichiers
        echo "$TEMP_FILES" | while read file; do
            if [ -n "$file" ]; then
                cp "$file" "$BACKUP_DIR/"
                rm "$file"
            fi
        done
        echo "✅ Tous les fichiers temporaires ont été supprimés (sauvegardés dans $BACKUP_DIR)"
    elif [ "$choice" = "i" ]; then
        # Mode interactif
        echo "$TEMP_FILES" | while read file; do
            if [ -n "$file" ]; then
                read -p "Supprimer $file? (o/n): " subchoice
                if [ "$subchoice" = "o" ]; then
                    cp "$file" "$BACKUP_DIR/"
                    rm "$file"
                    echo "✅ $file supprimé"
                else
                    echo "⏭️ $file conservé"
                fi
            fi
        done
    else
        echo "⏭️ Conservation de tous les fichiers temporaires"
    fi
}

# Fonction pour gérer les fichiers dupliqués
find_duplicates() {
    echo -e "\nRecherche de fichiers potentiellement dupliqués..."
    echo "Cette opération peut prendre du temps, veuillez patienter..."
    
    # Utilisation de la commande find pour lister tous les fichiers
    find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.next/*" -not -path "*/backup_files_*/*" | sort > /tmp/all_files.txt
    
    # Recherche des fichiers avec des noms similaires
    echo -e "\nFichiers avec des noms similaires:"
    echo "---------------------------------------------------"
    
    # Rechercher les fichiers contenant "copy", "copie", "old", "backup", etc.
    grep -i -E '(copy|copie|old|backup|bak|tmp|temp)' /tmp/all_files.txt
    
    echo -e "\nNOTE: Pour une analyse plus approfondie des doublons basée sur le contenu,"
    echo "il est recommandé d'utiliser un outil spécialisé comme 'fdupes' ou 'rdfind'."
    echo "Ces outils ne sont pas inclus dans ce script pour des raisons de sécurité."
}

# Fonction pour analyser les dossiers vides
clean_empty_dirs() {
    echo -e "\nRecherche de dossiers vides..."
    
    EMPTY_DIRS=$(find . -type d -empty -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.next/*" -not -path "*/backup_files_*/*")
    
    if [ -z "$EMPTY_DIRS" ]; then
        echo "Aucun dossier vide trouvé."
        return
    fi
    
    echo -e "\nDossiers vides trouvés:"
    echo "$EMPTY_DIRS"
    echo ""
    
    read -p "Supprimer tous les dossiers vides? (o/n/i - i pour interactivement): " choice
    
    if [ "$choice" = "o" ]; then
        echo "$EMPTY_DIRS" | xargs -r rmdir
        echo "✅ Tous les dossiers vides ont été supprimés"
    elif [ "$choice" = "i" ]; then
        # Mode interactif
        echo "$EMPTY_DIRS" | while read dir; do
            if [ -n "$dir" ]; then
                read -p "Supprimer le dossier vide $dir? (o/n): " subchoice
                if [ "$subchoice" = "o" ]; then
                    rmdir "$dir"
                    echo "✅ $dir supprimé"
                else
                    echo "⏭️ $dir conservé"
                fi
            fi
        done
    else
        echo "⏭️ Conservation de tous les dossiers vides"
    fi
}

# Menu principal
while true; do
    echo -e "\nMENU DE NETTOYAGE:"
    echo "---------------------------------------------------"
    echo "1. Gérer les scripts potentiellement redondants"
    echo "2. Nettoyer les fichiers temporaires et logs"
    echo "3. Rechercher les fichiers potentiellement dupliqués"
    echo "4. Nettoyer les dossiers vides"
    echo "5. Tout nettoyer (exécuter toutes les options)"
    echo "0. Quitter"
    echo "---------------------------------------------------"
    
    read -p "Votre choix: " main_choice
    
    case $main_choice in
        1) clean_scripts ;;
        2) clean_temp_files ;;
        3) find_duplicates ;;
        4) clean_empty_dirs ;;
        5)
            clean_scripts
            clean_temp_files
            find_duplicates
            clean_empty_dirs
            ;;
        0)
            echo -e "\nRécapitulatif des opérations:"
            echo "---------------------------------------------------"
            echo "Fichiers sauvegardés dans: $BACKUP_DIR"
            echo "Pour restaurer un fichier: cp $BACKUP_DIR/nom_fichier emplacement_original"
            echo ""
            echo "Nettoyage terminé. Au revoir!"
            exit 0
            ;;
        *)
            echo "Option invalide. Veuillez réessayer."
            ;;
    esac
done