"use client";
import { useState, useEffect } from 'react';
import type { DesignConfig } from '@/src/app/draw/page';

interface QuoteExportProps {
  design: DesignConfig;
  price: number;
  onExportComplete?: () => void;
  canvasImage?: string | null; // Optional canvas image data URL
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

export function QuoteExport({ design, price, onExportComplete, canvasImage }: QuoteExportProps) {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(canvasImage || null);
  
  // Update current image when prop changes
  useEffect(() => {
    if (canvasImage) {
      setCurrentImage(canvasImage);
    }
  }, [canvasImage]);
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Generate HTML content for PDF
  const getPDFContent = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>DoorWin Craft - Quotation</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 28px; font-weight: bold; color: #1e3a5f; }
            .quote-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .design-specs { margin-bottom: 20px; }
            .price-section { background: #e3f2fd; padding: 20px; border-radius: 8px; text-align: center; }
            .total-price { font-size: 32px; font-weight: bold; color: #2196f3; }
            /* Footer scaled to ~70% of original */
            .footer { margin-top: 28px; text-align: center; color: #666; font-size: 9px; line-height: 1.25; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">DoorWin Craft</div>
            <div style="color: #666; margin-top: 8px;">Professional Window & Door Design</div>
          </div>
          
          <div class="quote-details">
            <h2 style="margin-top: 0;">Quotation</h2>
            <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
            <div><strong>Project:</strong> ${design.type === 'window' ? 'Window' : 'Door'} Design</div>
          </div>

          ${currentImage ? `
          <div class="design-specs" style="text-align: center; margin-bottom: 30px;">
            <h3 style="margin-bottom: 16px;">Design Preview</h3>
            <img src="${currentImage}" alt="Design Preview" style="max-width: 100%; max-height: 400px; border: 2px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
          </div>
          ` : ''}
          
          <div class="design-specs">
            <h3>Design Specifications</h3>
            <table>
              <tr>
                <th>Specification</th>
                <th>Details</th>
              </tr>
              <tr>
                <td>Type</td>
                <td>${design.type === 'window' ? 'Window' : 'Door'}</td>
              </tr>
              <tr>
                <td>Template</td>
                <td>${design.template}</td>
              </tr>
              <tr>
                <td>Dimensions</td>
                <td>${design.width}mm × ${design.height}mm</td>
              </tr>
              <tr>
                <td>Material</td>
                <td>${design.material.toUpperCase()}</td>
              </tr>
              <tr>
                <td>Frame Depth</td>
                <td>${design.frameDepth}mm</td>
              </tr>
              <tr>
                <td>Color</td>
                <td style="background: ${design.color}; width: 30px; height: 20px; display: inline-block; border: 1px solid #ddd;"></td>
              </tr>
              <tr>
                <td>Glass</td>
                <td>${design.glass ? 'Yes' : 'No'}</td>
              </tr>
            </table>
          </div>

          ${formData.name ? `
          <div class="design-specs">
            <h3>Customer Information</h3>
            <div><strong>Name:</strong> ${formData.name}</div>
            <div><strong>Email:</strong> ${formData.email}</div>
            <div><strong>Phone:</strong> ${formData.phone}</div>
            ${formData.address ? `<div><strong>Address:</strong> ${formData.address}</div>` : ''}
            ${formData.notes ? `<div><strong>Notes:</strong> ${formData.notes}</div>` : ''}
          </div>
          ` : ''}

          <div class="price-section">
            <div style="font-size: 18px; margin-bottom: 10px;">Total Price</div>
            <div class="total-price">${price.toFixed(2)} SAR</div>
            <div style="color: #666; margin-top: 8px;">(Excluding 15% VAT)</div>
          </div>

          <div class="footer">
            <div>DoorWin Craft - Professional Window & Door Design Platform</div>
            <div style="margin-top: 8px;">This quotation is valid for 30 days</div>
          </div>
        </body>
      </html>
    `;

    return htmlContent;
  };

  // Download PDF as file
  const downloadPDF = () => {
    const htmlContent = getPDFContent();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `doorwin-quotation-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    if (onExportComplete) {
      onExportComplete();
    }
  };

  // Print PDF
  const printPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = getPDFContent();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    
    if (onExportComplete) {
      onExportComplete();
    }
  };

  // Share via Email
  const shareViaEmail = () => {
    const subject = encodeURIComponent(`DoorWin Craft Quotation - ${design.type === 'window' ? 'Window' : 'Door'} Design`);
    const body = encodeURIComponent(`
Hello,

Please find attached the quotation for your ${design.type} design:

Design Details:
- Type: ${design.type === 'window' ? 'Window' : 'Door'}
- Template: ${design.template}
- Dimensions: ${design.width}mm × ${design.height}mm
- Material: ${design.material.toUpperCase()}
- Price: ${price.toFixed(2)} SAR

This quotation is valid for 30 days.

Best regards,
DoorWin Craft Team
    `);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Share via WhatsApp
  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `*DoorWin Craft Quotation*\n\n` +
      `*Design:* ${design.type === 'window' ? 'Window' : 'Door'} - ${design.template}\n` +
      `*Dimensions:* ${design.width}mm × ${design.height}mm\n` +
      `*Material:* ${design.material.toUpperCase()}\n` +
      `*Price:* ${price.toFixed(2)} SAR\n\n` +
      `This quotation is valid for 30 days.`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  // Copy shareable link (for future implementation with backend)
  const copyShareLink = async () => {
    try {
      // Create a shareable link with design data encoded
      const designData = encodeURIComponent(JSON.stringify({
        type: design.type,
        template: design.template,
        width: design.width,
        height: design.height,
        material: design.material,
        price: price,
        timestamp: Date.now()
      }));
      
      const shareLink = `${window.location.origin}/quote?design=${designData}`;
      await navigator.clipboard.writeText(shareLink);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the lead data to your backend
    console.log('Lead submitted:', formData);
    
    // Then generate PDF
    printPDF();
    setShowLeadForm(false);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    }}>
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📄 Export Quotation
      </div>

      {!showLeadForm ? (
        <div>
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '16px'
          }}>
            Generate a professional quotation PDF with your design details.
            {!canvasImage && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#ff9800' }}>
                💡 Tip: Capture the design image first for a better PDF preview.
              </div>
            )}
          </div>
          <button
            onClick={() => setShowLeadForm(true)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1976d2';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2196f3';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Request Quote (Add Contact Info)
          </button>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <button
              onClick={downloadPDF}
              style={{
                padding: '12px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#45a049';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#4caf50';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              💾 Download
            </button>
            <button
              onClick={printPDF}
              style={{
                padding: '12px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1976d2';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2196f3';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🖨️ Print
            </button>
          </div>

          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#666',
            marginTop: '16px',
            marginBottom: '8px',
            paddingBottom: '8px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            Share Options:
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px'
          }}>
            <button
              onClick={shareViaEmail}
              style={{
                padding: '10px',
                background: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📧 Email
            </button>
            <button
              onClick={shareViaWhatsApp}
              style={{
                padding: '10px',
                background: '#25d366',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#20ba5a';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#25d366';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              💬 WhatsApp
            </button>
            <button
              onClick={copyShareLink}
              style={{
                padding: '10px',
                background: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                gridColumn: '1 / -1'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🔗 Copy Share Link
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitLead}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#333'
          }}>
            Contact Information
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '4px',
              color: '#666'
            }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '4px',
              color: '#666'
            }}>
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '4px',
              color: '#666'
            }}>
              Phone *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '4px',
              color: '#666'
            }}>
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '4px',
              color: '#666'
            }}>
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowLeadForm(false)}
              style={{
                flex: 1,
                padding: '12px',
                background: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1976d2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2196f3';
              }}
            >
              Generate Quote
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

