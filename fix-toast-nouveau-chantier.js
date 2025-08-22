const fs = require('fs');

// Lire le fichier
let content = fs.readFileSync('app/dashboard/chantiers/nouveau/page.tsx', 'utf8');

// Corriger l'import
content = content.replace(
  'import { useToast, showSuccessToast, showErrorToast } from "@/components/ui/Toast";',
  'import { useToast } from "@/components/ui/Toast";'
);

// Corriger l'usage dans le composant (supprimer les lignes problématiques)
content = content.replace(
  /const { addToast } = useToast\(\);\s*const successToast = showSuccessToast\(addToast\);\s*const errorToast = showErrorToast\(addToast\);/,
  'const { addToast } = useToast();'
);

// Corriger les appels successToast
content = content.replace(
  /successToast\(\s*"([^"]+)"\s*\);/g,
  'addToast({ type: "success", title: "$1" });'
);

// Corriger les appels errorToast
content = content.replace(
  /errorToast\(\s*"([^"]+)"\s*\);/g,
  'addToast({ type: "error", title: "$1" });'
);

fs.writeFileSync('app/dashboard/chantiers/nouveau/page.tsx', content);
console.log('✅ Fichier corrigé !');
