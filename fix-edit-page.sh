#!/bin/bash

file="app/dashboard/devis/[id]/edit/page.tsx"

# Supprimer les imports en double et corriger
sed -i '' '
1,5d
' "$file"

# Ajouter les bons imports au début
cat > temp_header.txt << 'HEADEREOF'
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TotauxCalculator from '@/components/devis/TotauxCalculator';
import LigneDevisComponent from '@/components/devis/LigneDevis';

HEADEREOF

# Reconstruire le fichier
cat temp_header.txt "$file" > temp_file.tsx
mv temp_file.tsx "$file"
rm temp_header.txt

echo "edit/page.tsx corrigé"
