#!/bin/bash

OUTPUT_FILE="planning_dev_analysis.txt"

echo "🚀 CHANTIERPRO - ANALYSE ESSENTIELLE POUR IA" > $OUTPUT_FILE
echo "=============================================" >> $OUTPUT_FILE
echo "Généré le: $(date)" >> $OUTPUT_FILE
echo "Objectif: Comprendre le projet pour développer" >> $OUTPUT_FILE
echo "=============================================" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# ========================================
# 1. MODÈLE DE DONNÉES (critique)
# ========================================
echo "🗄️ MODÈLE PRISMA (COMPLET - ESSENTIEL)" >> $OUTPUT_FILE
echo "======================================" >> $OUTPUT_FILE

if [ -f "prisma/schema.prisma" ]; then
    cat "prisma/schema.prisma" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
fi

# ========================================
# 2. TYPES TYPESCRIPT (structure)
# ========================================
echo "📝 TYPES PRINCIPAUX" >> $OUTPUT_FILE
echo "==================" >> $OUTPUT_FILE

if [ -f "types/index.ts" ]; then
    cat "types/index.ts" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
fi

# ========================================
# 3. CONFIGURATION AUTH (pattern)
# ========================================
echo "🔐 CONFIGURATION AUTH" >> $OUTPUT_FILE
echo "=====================" >> $OUTPUT_FILE

if [ -f "lib/auth.ts" ]; then
    echo "--- lib/auth.ts ---" >> $OUTPUT_FILE
    cat "lib/auth.ts" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
fi

# Hook auth (structure seulement)
if [ -f "hooks/useAuth.ts" ]; then
    echo "--- useAuth (interfaces) ---" >> $OUTPUT_FILE
    grep -E "(interface|type|export)" "hooks/useAuth.ts" -A 3 | head -20 >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
fi

# ========================================
# 4. PATTERN API (1 exemple complet)
# ========================================
echo "🌐 PATTERN API" >> $OUTPUT_FILE
echo "===============" >> $OUTPUT_FILE

# Prendre une API route comme référence complète
for file in "app/api/chantiers/route.ts" "app/api/devis/route.ts"; do
    if [ -f "$file" ]; then
        echo "--- $file (RÉFÉRENCE COMPLÈTE) ---" >> $OUTPUT_FILE
        cat "$file" >> $OUTPUT_FILE
        echo "" >> $OUTPUT_FILE
        break
    fi
done

# ========================================
# 5. PATTERN HOOK (1 exemple)
# ========================================
echo "🎣 PATTERN HOOK" >> $OUTPUT_FILE
echo "===============" >> $OUTPUT_FILE

for file in "hooks/useDevis.ts" "hooks/useChantiers.ts"; do
    if [ -f "$file" ]; then
        echo "--- $file (RÉFÉRENCE) ---" >> $OUTPUT_FILE
        # Garder structure + une fonction complète
        head -80 "$file" >> $OUTPUT_FILE
        echo "... [reste du hook - pattern visible]" >> $OUTPUT_FILE
        echo "" >> $OUTPUT_FILE
        break
    fi
done

# ========================================
# 6. UTILITAIRES DB
# ========================================
echo "🛠️ UTILITAIRES DB" >> $OUTPUT_FILE
echo "==================" >> $OUTPUT_FILE

if [ -f "lib/db.ts" ]; then
    cat "lib/db.ts" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
fi

if [ -f "lib/utils.ts" ]; then
    cat "lib/utils.ts" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
fi

# ========================================
# 7. STRUCTURE LAYOUT (navigation)
# ========================================
echo "🎨 LAYOUT & NAVIGATION" >> $OUTPUT_FILE
echo "======================" >> $OUTPUT_FILE

if [ -f "app/layout.tsx" ]; then
    echo "--- Layout principal ---" >> $OUTPUT_FILE
    cat "app/layout.tsx" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
fi

# Navigation items (extraire seulement les liens)
if [ -f "components/layout/ModernSidebar.tsx" ]; then
    echo "--- Navigation structure ---" >> $OUTPUT_FILE
    grep -E "(href|path|route)" "components/layout/ModernSidebar.tsx" | head -20 >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
fi

# ========================================
# 8. ARBORESCENCE ESSENTIELLE
# ========================================
echo "📁 STRUCTURE PROJET" >> $OUTPUT_FILE
echo "==================" >> $OUTPUT_FILE

echo "--- API Routes ---" >> $OUTPUT_FILE
find app/api -name "route.ts" | sort | head -15 >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "--- Pages Dashboard ---" >> $OUTPUT_FILE
find app/dashboard -name "page.tsx" | sort | head -10 >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "--- Hooks ---" >> $OUTPUT_FILE
find hooks -name "*.ts" | head -10 >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# ========================================
# 9. GUIDE DÉVELOPPEMENT CONCRET
# ========================================
echo "🎯 GUIDE DÉVELOPPEMENT IA" >> $OUTPUT_FILE
echo "==========================" >> $OUTPUT_FILE

cat << 'GUIDE' >> $OUTPUT_FILE

ARCHITECTURE:
✅ Next.js 15 + React 19 + TypeScript + Prisma + PostgreSQL
✅ Auth: NextAuth + rôles (ADMIN/COMMERCIAL/OUVRIER/CLIENT)
✅ UI: Tailwind CSS + Radix UI

PATTERNS IDENTIFIÉS:

1. API Routes (app/api/[module]/route.ts):
   - GET: pagination + filtres + include relations Prisma
   - POST: validation + création avec relations
   - Gestion erreurs + réponses JSON standardisées

2. Hooks personnalisés (hooks/use[Module].ts):
   - useState pour données + loading + error
   - Functions: fetch, create, update, delete
   - Auto-refresh + pagination

3. Modèle Prisma:
   - Relations: User ↔ Chantier ↔ Message/Planning
   - Enums pour statuts
   - Timestamps automatiques

4. Structure pages:
   - app/dashboard/[module]/page.tsx
   - Protection par rôle via useRequireAuth()
   - Layout dashboard commun

POUR NOUVEAU MODULE:
1. Étendre schema.prisma avec nouveau model
2. Créer app/api/[module]/route.ts (CRUD)
3. Créer hooks/use[Module].ts (logique)
4. Créer components/[module]/ (UI)
5. Créer app/dashboard/[module]/page.tsx
6. Ajouter navigation dans sidebar

GUIDE

echo "" >> $OUTPUT_FILE
echo "=== ANALYSE ESSENTIELLE TERMINÉE ===" >> $OUTPUT_FILE

# Stats
file_size=$(wc -c < "$OUTPUT_FILE")
line_count=$(wc -l < "$OUTPUT_FILE")
echo "📊 STATS: $line_count lignes, $(echo "scale=1; $file_size/1024" | bc -l 2>/dev/null || echo "~30")KB" >> $OUTPUT_FILE

echo ""
echo "✅ Analyse essentielle générée: $OUTPUT_FILE"
echo "🎯 Contient uniquement ce dont l'IA a besoin pour comprendre et développer"
echo "📏 Taille optimisée pour compréhension rapide"
echo ""
echo "🚀 Prêt pour développement IA efficace !"