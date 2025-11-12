// web/src/pages/ClinicalVisits.jsx
import React, { useState, useEffect } from 'react';
import { X, Check, Download, Plus, Search, Filter } from 'lucide-react';

const ClinicalVisits = () => {
  const [clinicalVisits, setClinicalVisits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [toast, setToast] = useState(null);

  // Dummy clinical visits data
  const dummyClinicalVisits = [
    {
      id: 1,
      patientName: 'John Doe',
      visitDate: '2025-10-15',
      visitType: 'Follow-up',
      whoStage: 'Stage 1',
      notes:
        'Patient doing well on current regimen. No complaints. Continue current treatment plan.',
    },
    {
      id: 2,
      patientName: 'Maria Santos',
      visitDate: '2025-10-10',
      visitType: 'Follow-up',
      whoStage: 'Stage 1',
      notes:
        'Discussed importance of adherence. Patient reports occasional missed doses. Reinforced counseling on medication adherence.',
    },
  ];

  useEffect(() => {
    setClinicalVisits(dummyClinicalVisits);
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

  const handleExportPDF = () => {
    setToast({ message: 'Exporting...', type: 'info' });

    setTimeout(() => {
      const pdfContent = generatePDFContent();
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'clinical_visits.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToast({
        message: 'Exported successfully. clinical visits',
        type: 'success',
      });
    }, 1500);
  };

  const handleExportSinglePDF = (visit) => {
    setToast({ message: 'Exporting...', type: 'info' });

    setTimeout(() => {
      const pdfContent = generateSinglePDFContent(visit);
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clinical_visit_${visit.patientName.replace(
        /\s+/g,
        '_'
      )}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToast({
        message: 'Exported successfully. clinical visits',
        type: 'success',
      });
    }, 1500);
  };

  const generatePDFContent = () => {
    let content = 'CLINICAL VISITS REPORT\n\n';
    clinicalVisits.forEach((visit, index) => {
      content += `Visit ${index + 1}\n`;
      content += `Patient: ${visit.patientName}\n`;
      content += `Date: ${formatDate(visit.visitDate)}\n`;
      content += `Visit Type: ${visit.visitType}\n`;
      content += `WHO Stage: ${visit.whoStage}\n`;
      content += `Notes: ${visit.notes}\n\n`;
    });
    content += `Generated on: ${formatDate(
      new Date().toISOString().split('T')[0]
    )}`;
    return content;
  };

  const generateSinglePDFContent = (visit) => {
    let content = 'CLINICAL VISIT REPORT\n\n';
    content += `Patient: ${visit.patientName}\n`;
    content += `Date: ${formatDate(visit.visitDate)}\n`;
    content += `Visit Type: ${visit.visitType}\n`;
    content += `WHO Stage: ${visit.whoStage}\n`;
    content += `Notes: ${visit.notes}\n\n`;
    content += `Generated on: ${formatDate(
      new Date().toISOString().split('T')[0]
    )}`;
    return content;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const handleViewDetails = (visit) => {
    setSelectedVisit(visit);
    setModalMode('view');
    setShowModal(true);
  };

  const handleRecordNewVisit = () => {
    setSelectedVisit(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleSaveVisit = (visitData) => {
    if (modalMode === 'add') {
      const newVisit = {
        id:
          clinicalVisits.length > 0
            ? Math.max(...clinicalVisits.map((v) => v.id)) + 1
            : 1,
        ...visitData,
      };
      setClinicalVisits([...clinicalVisits, newVisit]);
      setToast({
        message: 'Clinical visit recorded successfully',
        type: 'success',
      });
    }
    setShowModal(false);
    setSelectedVisit(null);
  };

  // ✅ Fixed: use a const instead of class-style method
  const renderRecentActivity = () => {
    if (clinicalVisits.length === 0) {
      return (
        <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>
          No clinical visits found
        </p>
      );
    }

    return clinicalVisits.map((visit) => (
      <div
        key={visit.id}
        style={{
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '18px' }}>
            {visit.patientName}
          </h3>
          <div
            style={{ marginBottom: '5px', color: '#007bff', fontSize: '14px' }}
          >
            📅 {formatDate(visit.visitDate)} • {visit.visitType}
          </div>
          <div
            style={{ marginBottom: '5px', color: '#6c757d', fontSize: '14px' }}
          >
            WHO Stage: {visit.whoStage}
          </div>
          <div style={{ color: '#333', fontStyle: 'italic', fontSize: '14px' }}>
            "
            {visit.notes.length > 50
              ? visit.notes.substring(0, 50) + '...'
              : visit.notes}
            "
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleViewDetails(visit)}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            View Details
          </button>
          <button
            onClick={() => handleExportSinglePDF(visit)}
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Export PDF
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div style={{ padding: '20px', paddingTop: '80px' }}>
      {/* Header */}
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
            Clinical Visits
          </h2>
          <p
            style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '14px' }}
          >
            Record and manage patient consultations
          </p>
        </div>
        <button
          onClick={handleRecordNewVisit}
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
          Record New Visit
        </button>
      </div>

      {/* Search and Filter */}
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
            placeholder="Search clinical visits..."
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
        <div style={{ position: 'relative' }}>
          <Filter
            size={18}
            color="#6c757d"
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '8px 12px 8px 36px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              appearance: 'none',
            }}
          >
            <option value="all">All Types</option>
            <option value="Initial Consultation">Initial Consultation</option>
            <option value="Follow-up">Follow-up</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div>{renderRecentActivity()}</div>

      {/* Modal */}
      {showModal && (
        <ClinicalVisitModal
          mode={modalMode}
          visit={selectedVisit}
          onClose={() => {
            setShowModal(false);
            setSelectedVisit(null);
          }}
          onSave={handleSaveVisit}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
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
            <Download size={20} />
          )}
          <span style={{ fontSize: '14px' }}>{toast.message}</span>
        </div>
      )}

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
            `}</style>
    </div>
  );
};

const ClinicalVisitModal = ({ mode, visit, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    visit || {
      patientName: '',
      visitDate: '',
      visitType: '',
      whoStage: '',
      notes: '',
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        paddingTop: '64px',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: 'calc(100vh - 104px)',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: 0 }}>
            {mode === 'add' ? 'Record Clinical Visit' : 'Visit Details'}
          </h2>
          <button
            onClick={onClose}
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

        {mode === 'view' ? (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#6c757d',
                }}
              >
                Patient Name
              </label>
              <div
                style={{
                  padding: '8px',
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                }}
              >
                {visit.patientName}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#6c757d',
                }}
              >
                Visit Date
              </label>
              <div
                style={{
                  padding: '8px',
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                }}
              >
                📅 {formatDate(visit.visitDate)}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#6c757d',
                }}
              >
                Visit Type
              </label>
              <div
                style={{
                  padding: '8px',
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                }}
              >
                {visit.visitType}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#6c757d',
                }}
              >
                WHO Stage
              </label>
              <div
                style={{
                  padding: '8px',
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                }}
              >
                {visit.whoStage}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#6c757d',
                }}
              >
                Clinical Notes
              </label>
              <div
                style={{
                  padding: '8px',
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                  minHeight: '80px',
                }}
              >
                {visit.notes}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={onClose}
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
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                Patient Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                Visit Date <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                Visit Type
              </label>
              <select
                name="visitType"
                value={formData.visitType}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                }}
              >
                <option value="">Select type</option>
                <option value="Initial Consultation">
                  Initial Consultation
                </option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                WHO Stage
              </label>
              <select
                name="whoStage"
                value={formData.whoStage}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                }}
              >
                <option value="">Select stage</option>
                <option value="Stage 1">Stage 1</option>
                <option value="Stage 2">Stage 2</option>
                <option value="Stage 3">Stage 3</option>
                <option value="Stage 4">Stage 4</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                Clinical Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Save Visit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClinicalVisits;
