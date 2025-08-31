"use client";

import { PDFGenerator } from "@/lib/services/pdf-generator";

interface DevisPrintViewProps {
  devis: any;
  mode?: "print" | "pdf" | "email";
}

export default function DevisPrintView({ devis, mode = "print" }: DevisPrintViewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR"
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const handleDownloadPDF = async () => {
    try {
      const blob = await PDFGenerator.genererDevisPDF(devis);
      const filename = `${devis.type.toLowerCase()}_${devis.numero}.pdf`;
      PDFGenerator.telechargerPDF(blob, filename);
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      alert("Erreur lors de la génération du PDF");
    }
  };

  return (
    <div style={{
      maxWidth: "210mm",
      minHeight: "297mm",
      margin: "0 auto",
      padding: "20mm",
      background: "white",
      color: "#000",
      fontSize: "12px",
      lineHeight: "1.4",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Bouton téléchargement si pas en mode print */}
      {mode !== "print" && (
        <div style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 1000
        }}>
          <button
            onClick={handleDownloadPDF}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            📄 Télécharger PDF
          </button>
        </div>
      )}

      {/* En-tête Entreprise */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "30px",
        borderBottom: "2px solid #3b82f6",
        paddingBottom: "20px"
      }}>
        <div>
          <div style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#3b82f6",
            marginBottom: "10px"
          }}>
            🏗️ ChantierPro
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>
            123 Avenue de la Construction<br/>
            75001 Paris, France<br/>
            Tél: +33 1 23 45 67 89<br/>
            Email: contact@chantierpro.fr<br/>
            SIRET: 123 456 789 00012
          </div>
        </div>
        
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: devis.type === "DEVIS" ? "#3b82f6" : "#f97316",
            marginBottom: "10px"
          }}>
            {devis.type === "DEVIS" ? "📄 DEVIS" : "🧾 FACTURE"}
          </div>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
            N° {devis.numero}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            Date: {formatDate(devis.dateCreation)}
          </div>
          {devis.dateValidite && (
            <div style={{ fontSize: "12px", color: "#666" }}>
              Valide jusqu'au: {formatDate(devis.dateValidite)}
            </div>
          )}
        </div>
      </div>

      {/* Informations Client */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
        marginBottom: "30px"
      }}>
        <div>
          <h3 style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#3b82f6",
            marginBottom: "10px",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "5px"
          }}>
            FACTURER À
          </h3>
          <div style={{ fontSize: "12px" }}>
            <strong>{devis.client.name}</strong><br/>
            {devis.client.company && (
              <>
                {devis.client.company}<br/>
              </>
            )}
            {devis.client.address && (
              <>
                {devis.client.address}<br/>
              </>
            )}
            Email: {devis.client.email}<br/>
            {devis.client.phone && (
              <>Tél: {devis.client.phone}</>
            )}
          </div>
        </div>

        {devis.chantier && (
          <div>
            <h3 style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#3b82f6",
              marginBottom: "10px",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "5px"
            }}>
              CHANTIER
            </h3>
            <div style={{ fontSize: "12px" }}>
              <strong>{devis.chantier.nom}</strong><br/>
              {devis.chantier.adresse}
            </div>
          </div>
        )}
      </div>

      {/* Objet */}
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#3b82f6",
          marginBottom: "10px"
        }}>
          OBJET
        </h3>
        <div style={{
          fontSize: "12px",
          padding: "10px",
          background: "#f8fafc",
          borderRadius: "5px",
          border: "1px solid #e5e7eb"
        }}>
          {devis.objet}
        </div>
      </div>

      {/* Tableau des Lignes */}
      <div style={{ marginBottom: "30px" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "11px"
        }}>
          <thead>
            <tr style={{ background: "#3b82f6", color: "white" }}>
              <th style={{
                padding: "10px 8px",
                textAlign: "left",
                borderRight: "1px solid white"
              }}>
                DÉSIGNATION
              </th>
              <th style={{
                padding: "10px 8px",
                textAlign: "center",
                borderRight: "1px solid white",
                width: "60px"
              }}>
                QTÉ
              </th>
              <th style={{
                padding: "10px 8px",
                textAlign: "right",
                borderRight: "1px solid white",
                width: "80px"
              }}>
                PRIX UNIT.
              </th>
              <th style={{
                padding: "10px 8px",
                textAlign: "center",
                borderRight: "1px solid white",
                width: "50px"
              }}>
                TVA
              </th>
              <th style={{
                padding: "10px 8px",
                textAlign: "right",
                width: "80px"
              }}>
                TOTAL HT
              </th>
            </tr>
          </thead>
          <tbody>
            {devis.ligneDevis.map((ligne: any, index: number) => (
              <tr key={ligne.id} style={{
                borderBottom: "1px solid #e5e7eb",
                background: index % 2 === 0 ? "white" : "#f8fafc"
              }}>
                <td style={{ padding: "8px", borderRight: "1px solid #e5e7eb" }}>
                  {ligne.description}
                </td>
                <td style={{
                  padding: "8px",
                  textAlign: "center",
                  borderRight: "1px solid #e5e7eb"
                }}>
                  {ligne.quantite}
                </td>
                <td style={{
                  padding: "8px",
                  textAlign: "right",
                  borderRight: "1px solid #e5e7eb"
                }}>
                  {formatCurrency(Number(ligne.prixUnit))}
                </td>
                <td style={{
                  padding: "8px",
                  textAlign: "center",
                  borderRight: "1px solid #e5e7eb"
                }}>
                  20%
                </td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  {formatCurrency(Number(ligne.total))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "30px"
      }}>
        <div style={{ width: "300px" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px"
          }}>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "8px", fontWeight: "bold" }}>Total HT:</td>
              <td style={{ padding: "8px", textAlign: "right" }}>
                {formatCurrency(Number(devis.totalHT))}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "8px", fontWeight: "bold" }}>TVA:</td>
              <td style={{ padding: "8px", textAlign: "right" }}>
                {formatCurrency(Number(devis.totalTVA))}
              </td>
            </tr>
            <tr style={{
              background: "#3b82f6",
              color: "white",
              fontWeight: "bold"
            }}>
              <td style={{ padding: "10px", fontSize: "14px" }}>TOTAL TTC:</td>
              <td style={{ padding: "10px", textAlign: "right", fontSize: "14px" }}>
                {formatCurrency(Number(devis.totalTTC))}
              </td>
            </tr>
          </table>
        </div>
      </div>

      {/* Notes et Conditions */}
      {(devis.notes || devis.conditionsVente) && (
        <div style={{ marginBottom: "30px" }}>
          {devis.notes && (
            <div style={{ marginBottom: "15px" }}>
              <h4 style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#3b82f6",
                marginBottom: "5px"
              }}>
                NOTES:
              </h4>
              <div style={{
                fontSize: "11px",
                padding: "8px",
                background: "#f8fafc",
                borderRadius: "3px",
                border: "1px solid #e5e7eb"
              }}>
                {devis.notes}
              </div>
            </div>
          )}

          {devis.conditionsVente && (
            <div>
              <h4 style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#3b82f6",
                marginBottom: "5px"
              }}>
                CONDITIONS DE VENTE:
              </h4>
              <div style={{
                fontSize: "11px",
                padding: "8px",
                background: "#f8fafc",
                borderRadius: "3px",
                border: "1px solid #e5e7eb"
              }}>
                {devis.conditionsVente}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pied de page */}
      <div style={{
        borderTop: "1px solid #e5e7eb",
        paddingTop: "15px",
        fontSize: "10px",
        color: "#666",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "5px" }}>
          {devis.type === "DEVIS" ? 
            "Devis gratuit et sans engagement - Valable 30 jours" :
            "Merci de régler cette facture dans les délais convenus"
          }
        </div>
        <div>
          ChantierPro - Votre partenaire construction de confiance
        </div>
      </div>

      {/* Styles d'impression */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          * {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
