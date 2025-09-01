#!/bin/bash

echo "Correction des erreurs restantes..."

# 1. Corriger lib/services/pdf-generator.ts
sed -i '' 's/devis.notes ? notesLines.length \* 5 + 20 : 20/devis.notes ? 40 : 20/' lib/services/pdf-generator.ts

# 2. Corriger components/ui/index.ts exports par défaut
echo "Correction des exports UI..."
cat > components/ui/index.ts << 'UIEOF'
// Exports corrigés
export { Card } from './card';
export { Button } from './button';  
export { Badge } from './badge';
export { Avatar } from './avatar';
export { Input } from './input';
export { Progress } from './progress';
UIEOF

echo "Corrections appliquées"
