#!/bin/zsh

# Script pour créer automatiquement une route API Next.js
# Usage: ./make_api.sh app/api/devis/[id]/garantie

# Vérifier si un chemin a été fourni
if [ -z "$1" ]; then
  echo "❌ Utilisation: $0 chemin/vers/route (ex: app/api/devis/[id]/garantie)"
  exit 1
fi

# Supprimer un éventuel slash final
API_PATH="${1%/}"

# Ajouter automatiquement /route.ts si non précisé
FILE_PATH="$API_PATH/route.ts"

# Créer les dossiers nécessaires
mkdir -p "$API_PATH"

# Créer le fichier s'il n'existe pas
if [ ! -f "$FILE_PATH" ]; then
  cat > "$FILE_PATH" << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

// Exemple GET
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: `Hello depuis ${params.id}` });
}
EOF
  echo "✅ Fichier créé : $FILE_PATH"
else
  echo "⚠️ Le fichier existe déjà : $FILE_PATH"
fi

