// Ajouter ces états dans app/dashboard/devis/[id]/page.tsx
// Ajouter après les autres useState:
const [showConvertModal, setShowConvertModal] = useState(false);

// Ajouter ce code juste avant la balise de fermeture </div> finale
{/* Modal de conversion */}
{showConvertModal && devis && (
  <ConvertToInvoiceModal
    devis={devis}
    isOpen={showConvertModal}
    onClose={() => setShowConvertModal(false)}
  />
)}
