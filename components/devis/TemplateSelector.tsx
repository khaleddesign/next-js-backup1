'use client';

import { useState } from 'react';

interface Template {
  id: string;
  nom: string;
  description: string;
  category: string;
  lignes: Array<{
    designation: string;
    quantite: string;
    prixUnitaire: string;
    tva: string;
  }>;
}

interface TemplateSelectorProps {
  onSelectTemplate: (lignes: Template['lignes']) => void;
  onClose: () => void;
}

const templates: Template[] = [
  {
    id: 'renovation-sdb',
    nom: 'Rénovation Salle de Bain',
    description: 'Template complet pour rénovation salle de bain standard',
    category: 'Rénovation',
    lignes: [
      {
        designation: 'Démolition existant (carrelage, sanitaires)',
        quantite: '1',
        prixUnitaire: '800',
        tva: '20'
      },
      {
        designation: 'Plomberie - Évacuation et alimentation',
        quantite: '1',
        prixUnitaire: '1200',
        tva: '20'
      },
      {
        designation: 'Électricité - Prises et éclairage',
        quantite: '1',
        prixUnitaire: '600',
        tva: '20'
      },
      {
        designation: 'Carrelage sol et mur (fourniture et pose)',
        quantite: '15',
        prixUnitaire: '45',
        tva: '20'
      },
      {
        designation: 'Pose receveur de douche 90x90',
        quantite: '1',
        prixUnitaire: '350',
        tva: '20'
      },
      {
        designation: 'Installation WC suspendu',
        quantite: '1',
        prixUnitaire: '400',
        tva: '20'
      },
      {
        designation: 'Meuble vasque avec miroir',
        quantite: '1',
        prixUnitaire: '650',
        tva: '20'
      }
    ]
  },
  {
    id: 'cuisine-equipee',
    nom: 'Cuisine Équipée',
    description: 'Installation cuisine complète avec électroménager',
    category: 'Cuisine',
    lignes: [
      {
        designation: 'Démontage cuisine existante',
        quantite: '1',
        prixUnitaire: '400',
        tva: '20'
      },
      {
        designation: 'Plomberie - Raccordement évier et lave-vaisselle',
        quantite: '1',
        prixUnitaire: '500',
        tva: '20'
      },
      {
        designation: 'Électricité - Prises et éclairage plan de travail',
        quantite: '1',
        prixUnitaire: '800',
        tva: '20'
      },
      {
        designation: 'Meubles bas - 3m linéaires',
        quantite: '3',
        prixUnitaire: '450',
        tva: '20'
      },
      {
        designation: 'Meubles hauts - 2m linéaires',
        quantite: '2',
        prixUnitaire: '320',
        tva: '20'
      },
      {
        designation: 'Plan de travail quartz 3m',
        quantite: '1',
        prixUnitaire: '800',
        tva: '20'
      },
      {
        designation: 'Crédence carrelage métro',
        quantite: '6',
        prixUnitaire: '35',
        tva: '20'
      }
    ]
  },
  {
    id: 'peinture-piece',
    nom: 'Peinture Pièce Standard',
    description: 'Peinture complète d\'une pièce de 20m²',
    category: 'Peinture',
    lignes: [
      {
        designation: 'Préparation surfaces (rebouchage, ponçage)',
        quantite: '1',
        prixUnitaire: '200',
        tva: '10'
      },
      {
        designation: 'Sous-couche murs et plafond',
        quantite: '1',
        prixUnitaire: '150',
        tva: '10'
      },
      {
        designation: 'Peinture plafond - 2 couches',
        quantite: '20',
        prixUnitaire: '8',
       tva: '10'
     },
     {
       designation: 'Peinture murs - 2 couches',
       quantite: '50',
       prixUnitaire: '12',
       tva: '10'
     },
     {
       designation: 'Peinture boiseries (portes, plinthes)',
       quantite: '1',
       prixUnitaire: '180',
       tva: '10'
     }
   ]
 },
 {
   id: 'isolation-combles',
   nom: 'Isolation Combles',
   description: 'Isolation thermique des combles perdus',
   category: 'Isolation',
   lignes: [
     {
       designation: 'Préparation et nettoyage combles',
       quantite: '1',
       prixUnitaire: '150',
       tva: '5.5'
     },
     {
       designation: 'Pose pare-vapeur',
       quantite: '50',
       prixUnitaire: '3',
       tva: '5.5'
     },
     {
       designation: 'Isolation laine de verre 300mm',
       quantite: '50',
       prixUnitaire: '18',
       tva: '5.5'
     },
     {
       designation: 'Pose plancher OSB pour circulation',
       quantite: '20',
       prixUnitaire: '25',
       tva: '5.5'
     }
   ]
 },
 {
   id: 'extension-terrasse',
   nom: 'Terrasse Bois',
   description: 'Création terrasse bois composite 20m²',
   category: 'Extérieur',
   lignes: [
     {
       designation: 'Terrassement et nivellement',
       quantite: '20',
       prixUnitaire: '15',
       tva: '20'
     },
     {
       designation: 'Dalle béton armé 15cm',
       quantite: '20',
       prixUnitaire: '45',
       tva: '20'
     },
     {
       designation: 'Structure lambourdes bois traité',
       quantite: '1',
       prixUnitaire: '400',
       tva: '20'
     },
     {
       designation: 'Lames composite - fourniture et pose',
       quantite: '20',
       prixUnitaire: '65',
       tva: '20'
     },
     {
       designation: 'Finitions (plinthes, angles)',
       quantite: '1',
       prixUnitaire: '200',
       tva: '20'
     }
   ]
 }
];

export default function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
 const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
 const [searchTerm, setSearchTerm] = useState('');

 const categories = ['Tous', ...Array.from(new Set(templates.map(t => t.category)))];

 const filteredTemplates = templates.filter(template => {
   const matchesCategory = selectedCategory === 'Tous' || template.category === selectedCategory;
   const matchesSearch = template.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        template.description.toLowerCase().includes(searchTerm.toLowerCase());
   return matchesCategory && matchesSearch;
 });

 const calculateTotal = (lignes: Template['lignes']) => {
   const total = lignes.reduce((sum, ligne) => {
     const quantite = parseFloat(ligne.quantite) || 0;
     const prix = parseFloat(ligne.prixUnitaire) || 0;
     return sum + (quantite * prix);
   }, 0);
   
   return new Intl.NumberFormat('fr-FR', {
     style: 'currency',
     currency: 'EUR'
   }).format(total);
 };

 return (
   <div style={{
     position: 'fixed',
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
     background: 'rgba(0,0,0,0.5)',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     zIndex: 1000,
     padding: '1rem'
   }}>
     <div style={{
       background: 'white',
       borderRadius: '1rem',
       maxWidth: '800px',
       width: '100%',
       maxHeight: '90vh',
       overflow: 'hidden',
       display: 'flex',
       flexDirection: 'column'
     }}>
       <div style={{
         padding: '1.5rem',
         borderBottom: '1px solid #e2e8f0',
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center'
       }}>
         <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem' }}>
           📋 Templates de Devis
         </h3>
         <button
           onClick={onClose}
           style={{
             padding: '0.5rem',
             border: 'none',
             background: '#f1f5f9',
             borderRadius: '0.5rem',
             cursor: 'pointer',
             color: '#64748b'
           }}
         >
           ✕
         </button>
       </div>

       <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
         <div style={{ 
           display: 'flex',
           gap: '1rem',
           marginBottom: '1rem',
           flexWrap: 'wrap',
           alignItems: 'center'
         }}>
           <div style={{ display: 'flex', gap: '0.5rem' }}>
             {categories.map((category) => (
               <button
                 key={category}
                 onClick={() => setSelectedCategory(category)}
                 style={{
                   padding: '0.5rem 1rem',
                   border: 'none',
                   borderRadius: '0.5rem',
                   background: selectedCategory === category ? '#3b82f6' : '#f1f5f9',
                   color: selectedCategory === category ? 'white' : '#64748b',
                   cursor: 'pointer',
                   fontSize: '0.875rem',
                   fontWeight: '500'
                 }}
               >
                 {category}
               </button>
             ))}
           </div>
           
           <input
             type="text"
             placeholder="Rechercher un template..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             style={{
               padding: '0.5rem 1rem',
               border: '1px solid #d1d5db',
               borderRadius: '0.5rem',
               background: 'white',
               minWidth: '200px',
               fontSize: '0.875rem'
             }}
           />
         </div>
       </div>

       <div style={{ 
         flex: 1,
         overflow: 'auto',
         padding: '1rem'
       }}>
         {filteredTemplates.length === 0 ? (
           <div style={{
             textAlign: 'center',
             padding: '3rem',
             color: '#64748b'
           }}>
             <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
             <p>Aucun template trouvé</p>
           </div>
         ) : (
           <div style={{
             display: 'grid',
             gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
             gap: '1rem'
           }}>
             {filteredTemplates.map((template) => (
               <div
                 key={template.id}
                 style={{
                   border: '1px solid #e2e8f0',
                   borderRadius: '0.75rem',
                   padding: '1.5rem',
                   cursor: 'pointer',
                   transition: 'all 0.2s ease'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-2px)';
                   e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = 'none';
                 }}
                 onClick={() => onSelectTemplate(template.lignes)}
               >
                 <div style={{ marginBottom: '1rem' }}>
                   <div style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'flex-start',
                     marginBottom: '0.5rem'
                   }}>
                     <h4 style={{ 
                       margin: 0,
                       color: '#1e293b',
                       fontSize: '1.125rem',
                       fontWeight: '600'
                     }}>
                       {template.nom}
                     </h4>
                     <span style={{
                       background: '#f0f9ff',
                       color: '#0369a1',
                       padding: '0.25rem 0.5rem',
                       borderRadius: '0.5rem',
                       fontSize: '0.75rem',
                       fontWeight: '500'
                     }}>
                       {template.category}
                     </span>
                   </div>
                   <p style={{
                     margin: 0,
                     color: '#64748b',
                     fontSize: '0.875rem',
                     lineHeight: '1.4'
                   }}>
                     {template.description}
                   </p>
                 </div>

                 <div style={{ marginBottom: '1rem' }}>
                   <h5 style={{
                     margin: '0 0 0.5rem 0',
                     color: '#374151',
                     fontSize: '0.875rem',
                     fontWeight: '500'
                   }}>
                     Aperçu des lignes:
                   </h5>
                   <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                     {template.lignes.slice(0, 3).map((ligne, index) => (
                       <div key={index} style={{ marginBottom: '0.25rem' }}>
                         • {ligne.designation.length > 40 ? 
                           `${ligne.designation.substring(0, 40)}...` : 
                           ligne.designation}
                       </div>
                     ))}
                     {template.lignes.length > 3 && (
                       <div style={{ fontStyle: 'italic', marginTop: '0.25rem' }}>
                         ... et {template.lignes.length - 3} autres lignes
                       </div>
                     )}
                   </div>
                 </div>

                 <div style={{
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
                   paddingTop: '1rem',
                   borderTop: '1px solid #e2e8f0'
                 }}>
                   <div>
                     <div style={{
                       fontSize: '0.75rem',
                       color: '#64748b',
                       marginBottom: '0.25rem'
                     }}>
                       {template.lignes.length} ligne{template.lignes.length > 1 ? 's' : ''}
                     </div>
                     <div style={{
                       fontSize: '1rem',
                       fontWeight: '600',
                       color: '#059669'
                     }}>
                       {calculateTotal(template.lignes)}
                     </div>
                   </div>
                   <div style={{
                     padding: '0.5rem 1rem',
                     background: '#3b82f6',
                     color: 'white',
                     borderRadius: '0.5rem',
                     fontSize: '0.875rem',
                     fontWeight: '500'
                   }}>
                     Utiliser ce template
                   </div>
                 </div>
               </div>
             ))}
           </div>
         )}
       </div>
     </div>
   </div>
 );
}
