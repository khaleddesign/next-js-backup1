# 🔴 BUG REPORT #XXX - [CRITIQUE/MAJEUR/MINEUR/COSMÉTIQUE]

## 📍 LOCALISATION
- **Fichier**: `app/dashboard/xxx/page.tsx` (ligne XX)
- **URL**: `/dashboard/xxx`
- **Composant**: `ComponentName`
- **Navigateur**: Chrome 118.0 / Firefox / Safari
- **Device**: Desktop 1920x1080 / Mobile iPhone 12

## 🐛 DESCRIPTION
Description claire et concise du problème observé.

## 🔄 ÉTAPES DE REPRODUCTION
1. Aller sur `/dashboard/xxx`
2. Cliquer sur bouton "Action"
3. Observer comportement incorrect

## ❌ COMPORTEMENT ACTUEL
Ce qui se passe actuellement (incorrect).

## ✅ COMPORTEMENT ATTENDU
Ce qui devrait se passer (correct).

## 🔍 ERREUR CONSOLE
```javascript
TypeError: Cannot read properties of undefined (reading 'push')
    at handleClick (page.tsx:45)
    at onClick (Button.tsx:12)
```

## 📸 CAPTURES ÉCRAN
[Ajouter captures avant/après si pertinent]

## 💥 IMPACT
- **Utilisateur**: Bloque complètement la fonctionnalité X
- **Business**: Empêche création nouveaux chantiers
- **Sévérité**: Critique - fonctionnalité core inutilisable

## 💡 SOLUTION PROPOSÉE
```typescript
// AVANT (buggé)
const handleClick = () => {
  router.push('/nouveau'); // router est undefined
};

// APRÈS (corrigé)
const router = useRouter();
const handleClick = () => {
  router.push('/nouveau');
};
```

## ✅ STATUS
- [ ] TROUVÉ
- [ ] EN COURS DE CORRECTION
- [ ] CORRIGÉ
- [ ] TESTÉ
- [ ] VALIDÉ

## 🧪 TESTS DE VALIDATION
- [ ] Fonctionnalité marche sur Chrome desktop
- [ ] Fonctionnalité marche sur mobile
- [ ] Aucune régression introduite
- [ ] Tests edge cases OK
