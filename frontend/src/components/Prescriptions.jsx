// web/src/pages/Prescriptions.jsx
import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Plus,
  Search,
  Filter,
  AlertCircle,
  FileText,
  Printer,
  Download,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [toast, setToast] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Dummy prescriptions data matching the images
  const dummyPrescriptions = [
    {
      id: 1,
      patientName: 'John Doe',
      patientAge: 30,
      patientGender: 'Male',
      physicianName: 'Dr. Maria Santos',
      prescriptionDate: '10/15/2025',
      medications: [
        {
          drugName: 'Tenofovir/Lamivudine/Dolutegravir (TLD)',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: '30 days',
        },
      ],
      notes: 'Continue current regimen and monitor side effects',
      nextRefill: '11/15/2025',
    },
    {
      id: 2,
      patientName: 'Maria Santos',
      patientAge: 35,
      patientGender: 'Female',
      physicianName: 'Dr. Maria Santos',
      prescriptionDate: '10/10/2025',
      medications: [
        {
          drugName: 'Efavirenz 600mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: '30 days',
        },
        {
          drugName: 'Cotrimoxazole 960mg',
          dosage: '1 tablet',
          frequency: 'Once daily',
          duration: '30 days',
        },
      ],
      notes: 'Prophylaxis for opportunistic infections',
      nextRefill: '11/10/2025',
    },
  ];

  useEffect(() => {
    setPrescriptions(dummyPrescriptions);
  }, []);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle after print event
  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
      setShowModal(false);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const handlePrintPrescription = (prescription) => {
    // Set the prescription and show modal for printing
    setSelectedPrescription(prescription);
    setIsPrinting(true);
    setShowModal(true);

    // Wait a moment for the modal to render, then trigger print
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleExportPDF = async (prescription) => {
    try {
      // Create a temporary div element to render the prescription
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.style.backgroundColor = 'white';

      // Add the prescription HTML to the temporary div
      tempDiv.innerHTML = `
        <div class="prescription-header" style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px;">
          <h1 style="margin: 0 0 10px 0;">Medical Prescription</h1>
          <p style="margin: 5px 0;">MyHubCares</p>
          <p style="margin: 5px 0;">123 Healthcare Street, Medical City</p>
        </div>

        <div class="prescription-info" style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <strong>Patient Information</strong><br>
            Name: ${prescription.patientName}<br>
            Age: ${prescription.patientAge} years<br>
            Sex: ${prescription.patientGender}
          </div>
          <div>
            <strong>Prescription Details</strong><br>
            Date: ${prescription.prescriptionDate}<br>
            Rx No: RX-${String(prescription.id).padStart(6, '0')}<br>
            Next Refill: ${prescription.nextRefill}
          </div>
        </div>

        <div class="prescription-section" style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0;">℞ Medications</h3>
          <div class="prescription-drugs">
            ${prescription.medications
              .map(
                (med, index) => `
              <div class="prescription-drug-item" style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #eee;">
                <strong>${index + 1}. ${med.drugName}</strong><br>
                Sig: ${med.dosage} ${med.frequency}<br>
                Duration: ${med.duration}
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="prescription-section" style="margin-bottom: 20px;">
          <strong>Notes:</strong><br>
          ${prescription.notes}
        </div>

        <div class="prescription-footer" style="margin-top: 40px; text-align: right;">
          <div class="prescription-signature" style="display: inline-block; text-align: center; width: 200px;">
            <div class="prescription-signature-line" style="border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px;">
              ${prescription.physicianName}
            </div>
            <small>Prescribing Physician</small>
          </div>
        </div>
      `;

      // Add the temporary div to the body
      document.body.appendChild(tempDiv);

      // Convert the HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      // Remove the temporary div
      document.body.removeChild(tempDiv);

      // Create PDF from canvas
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(
        `Prescription_${prescription.patientName}_${prescription.prescriptionDate}.pdf`
      );

      // Show success toast
      setToast({
        message: 'PDF downloaded successfully.',
        type: 'success',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Show error toast
      setToast({
        message: 'Failed to generate PDF. Please try again.',
        type: 'error',
      });
    }
  };

  const getFilteredPrescriptions = () => {
    let filtered = prescriptions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (prescription) =>
          prescription.patientName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          prescription.physicianName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          prescription.medications.some((med) =>
            med.drugName.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return filtered;
  };

  const renderPrescriptionList = () => {
    const filteredPrescriptions = getFilteredPrescriptions();

    if (filteredPrescriptions.length === 0) {
      return (
        <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>
          No prescriptions found
        </p>
      );
    }

    return filteredPrescriptions.map((prescription) => {
      return (
        <div
          key={prescription.id}
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '10px',
            }}
          >
            <div>
              <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>
                {prescription.patientName}
              </h3>
              <p
                style={{ margin: '5px 0', color: '#6c757d', fontSize: '14px' }}
              >
                Prescribed by: {prescription.physicianName}
              </p>
              <p
                style={{ margin: '5px 0', color: '#6c757d', fontSize: '14px' }}
              >
                Date: {prescription.prescriptionDate}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                onClick={() => handleViewPrescription(prescription)}
                style={{
                  padding: '6px 12px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FileText size={14} />
                View
              </button>
              <button
                onClick={() => handlePrintPrescription(prescription)}
                style={{
                  padding: '6px 12px',
                  background: 'white',
                  color: '#007bff',
                  border: '1px solid #007bff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Printer size={14} />
                Print
              </button>
              <button
                onClick={() => handleExportPDF(prescription)}
                style={{
                  padding: '6px 12px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Download size={14} />
                Export PDF
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>Medications:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {prescription.medications.map((med, index) => (
                <li
                  key={index}
                  style={{ marginBottom: '5px', fontSize: '14px' }}
                >
                  {med.drugName} - {med.dosage}, {med.frequency}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '10px', fontSize: '14px' }}>
            <strong>Notes:</strong> {prescription.notes}
          </div>

          <div style={{ fontSize: '14px' }}>
            <strong>Next Refill:</strong> {prescription.nextRefill}
          </div>
        </div>
      );
    });
  };

  return (
    <div style={{ padding: '20px', paddingTop: '80px' }}>
      {/* Header with Title */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: '#333', fontSize: '24px' }}>
            Prescriptions
          </h2>
          <p
            style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '14px' }}
          >
            Manage digital prescriptions
          </p>
        </div>
        <button
          style={{
            padding: '10px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={16} />
          Create Prescription
        </button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={18}
            color="#6c757d"
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px 8px 36px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* Prescriptions List - Hidden when printing */}
      <div className="no-print">{renderPrescriptionList()}</div>

      {/* Modal for viewing/printing prescription details */}
      {showModal && selectedPrescription && (
        <div
          className={isPrinting ? 'print-modal' : 'no-print'}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isPrinting ? 'white' : 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: isPrinting ? 'flex-start' : 'center',
            zIndex: 1000,
            padding: isPrinting ? '20mm' : '0',
          }}
        >
          <div
            className="prescription-content"
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: isPrinting ? '0' : '8px',
              width: isPrinting ? '100%' : '90%',
              maxWidth: isPrinting ? '100%' : '600px',
              maxHeight: isPrinting ? 'none' : 'calc(100vh - 104px)',
              overflow: isPrinting ? 'visible' : 'auto',
              boxShadow: isPrinting ? 'none' : '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            {/* Only show header and buttons when not printing */}
            {!isPrinting && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2 style={{ margin: 0 }}>Prescription Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '5px',
                    borderRadius: '4px',
                  }}
                >
                  <X size={24} color="#6c757d" />
                </button>
              </div>
            )}

            <div className="prescription-template">
              <div
                className="prescription-header"
                style={{
                  textAlign: 'center',
                  marginBottom: '30px',
                  borderBottom: '2px solid #eee',
                  paddingBottom: '20px',
                }}
              >
                <h1 style={{ margin: '0 0 10px 0' }}>Medical Prescription</h1>
                <p style={{ margin: '5px 0' }}>MyHubCares</p>
                <p style={{ margin: '5px 0' }}>
                  123 Healthcare Street, Medical City
                </p>
              </div>

              <div
                className="prescription-info"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '30px',
                }}
              >
                <div>
                  <strong>Patient Information</strong>
                  <br />
                  Name: {selectedPrescription.patientName}
                  <br />
                  Age: {selectedPrescription.patientAge} years
                  <br />
                  Sex: {selectedPrescription.patientGender}
                </div>
                <div>
                  <strong>Prescription Details</strong>
                  <br />
                  Date: {selectedPrescription.prescriptionDate}
                  <br />
                  Rx No: RX-{String(selectedPrescription.id).padStart(6, '0')}
                  <br />
                  Next Refill: {selectedPrescription.nextRefill}
                </div>
              </div>

              <div
                className="prescription-section"
                style={{ marginBottom: '20px' }}
              >
                <h3 style={{ margin: '0 0 10px 0' }}>℞ Medications</h3>
                <div className="prescription-drugs">
                  {selectedPrescription.medications.map((med, index) => (
                    <div
                      key={index}
                      className="prescription-drug-item"
                      style={{
                        marginBottom: '15px',
                        paddingBottom: '10px',
                        borderBottom: '1px dashed #eee',
                      }}
                    >
                      <strong>
                        {index + 1}. {med.drugName}
                      </strong>
                      <br />
                      Sig: {med.dosage} {med.frequency}
                      <br />
                      Duration: {med.duration}
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="prescription-section"
                style={{ marginBottom: '20px' }}
              >
                <strong>Notes:</strong>
                <br />
                {selectedPrescription.notes}
              </div>

              <div
                className="prescription-footer"
                style={{ marginTop: '40px', textAlign: 'right' }}
              >
                <div
                  className="prescription-signature"
                  style={{
                    display: 'inline-block',
                    textAlign: 'center',
                    width: '200px',
                  }}
                >
                  <div
                    className="prescription-signature-line"
                    style={{
                      borderBottom: '1px solid #333',
                      paddingBottom: '5px',
                      marginBottom: '5px',
                    }}
                  >
                    {selectedPrescription.physicianName}
                  </div>
                  <small>Prescribing Physician</small>
                </div>
              </div>
            </div>

            {/* Only show buttons when not printing */}
            {!isPrinting && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '20px',
                }}
              >
                <button
                  onClick={() => handleExportPDF(selectedPrescription)}
                  style={{
                    padding: '8px 16px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Download size={16} />
                  Export PDF
                </button>
                <button
                  onClick={() => handlePrintPrescription(selectedPrescription)}
                  style={{
                    padding: '8px 16px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Printer size={16} />
                  Print
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className="no-print"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor:
              toast.type === 'success'
                ? '#28a745'
                : toast.type === 'error'
                ? '#dc3545'
                : '#17a2b8',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            animation: 'slideIn 0.3s ease',
            zIndex: 9999,
          }}
        >
          {toast.type === 'success' ? (
            <Check size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span style={{ fontSize: '14px' }}>{toast.message}</span>
        </div>
      )}

      {/* Print-specific styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          
          .print-modal, .print-modal * {
            visibility: visible;
          }
          
          .print-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: block !important;
            background: white !important;
            padding: 20mm;
            box-sizing: border-box;
          }
          
          .prescription-content {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          
          @page {
            margin: 20mm;
          }
        }
      `}</style>
    </div>
  );
};

export default Prescriptions;
