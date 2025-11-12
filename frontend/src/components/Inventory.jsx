// web/src/pages/Inventory.jsx
import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Search, Filter, AlertCircle } from 'lucide-react';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [toast, setToast] = useState(null);

  // Dummy inventory data matching the images
  const dummyInventory = [
    {
      id: 1,
      drugName: 'Tenofovir/Lamivudine/Dolutegravir (TLD)',
      stockQuantity: 500,
      unit: 'tablets',
      expiryDate: '12/31/2026',
      reorderLevel: 100,
      supplier: 'MyHubCares Pharmacy',
    },
    {
      id: 2,
      drugName: 'Efavirenz 600mg',
      stockQuantity: 250,
      unit: 'tablets',
      expiryDate: '06/15/2026',
      reorderLevel: 100,
      supplier: 'MyHubCares Pharmacy',
    },
    {
      id: 3,
      drugName: 'Atazanavir 300mg',
      stockQuantity: 80,
      unit: 'tablets',
      expiryDate: '09/30/2025',
      reorderLevel: 100,
      supplier: 'MyHubCares Pharmacy',
    },
    {
      id: 4,
      drugName: 'Ritonavir 100mg',
      stockQuantity: 150,
      unit: 'tablets',
      expiryDate: '03/15/2026',
      reorderLevel: 100,
      supplier: 'MyHubCares Pharmacy',
    },
    {
      id: 5,
      drugName: 'Cotrimoxazole 960mg',
      stockQuantity: 800,
      unit: 'tablets',
      expiryDate: '11/30/2026',
      reorderLevel: 200,
      supplier: 'MyHubCares Pharmacy',
    },
  ];

  useEffect(() => {
    setInventory(dummyInventory);
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

  const handleShowAddItemModal = () => {
    setSelectedItem(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleShowEditItemModal = (item) => {
    setSelectedItem(item);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleShowRestockModal = (item) => {
    setSelectedItem(item);
    setModalMode('restock');
    setShowModal(true);
  };

  const handleAddItem = (itemData) => {
    const newItem = {
      id:
        inventory.length > 0 ? Math.max(...inventory.map((i) => i.id)) + 1 : 1,
      ...itemData,
    };
    setInventory([...inventory, newItem]);
    setToast({
      message: 'Inventory item added successfully',
      type: 'success',
    });
    setShowModal(false);
  };

  const handleUpdateItem = (itemData) => {
    const updatedInventory = inventory.map((item) =>
      item.id === selectedItem.id ? { ...item, ...itemData } : item
    );
    setInventory(updatedInventory);
    setToast({
      message: 'Inventory item updated successfully',
      type: 'success',
    });
    setShowModal(false);
  };

  const handleRestockItem = (quantity) => {
    const updatedInventory = inventory.map((item) =>
      item.id === selectedItem.id
        ? { ...item, stockQuantity: item.stockQuantity + parseInt(quantity) }
        : item
    );
    setInventory(updatedInventory);
    setToast({
      message: `Successfully added ${quantity} units to inventory`,
      type: 'success',
    });
    setShowModal(false);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedInventory = inventory.filter((item) => item.id !== itemId);
      setInventory(updatedInventory);
      setToast({
        message: 'Inventory item deleted successfully',
        type: 'success',
      });
    }
  };

  const getFilteredInventory = () => {
    let filtered = inventory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType === 'low') {
      filtered = filtered.filter(
        (item) => item.stockQuantity <= item.reorderLevel
      );
    } else if (filterType === 'expiring') {
      filtered = filtered.filter((item) => {
        const expiryDate = new Date(item.expiryDate);
        const monthsUntilExpiry =
          (expiryDate - new Date()) / (1000 * 60 * 60 * 24 * 30);
        return monthsUntilExpiry < 3;
      });
    }

    return filtered;
  };

  const renderInventoryGrid = () => {
    const filteredInventory = getFilteredInventory();

    if (filteredInventory.length === 0) {
      return (
        <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>
          No inventory items found
        </p>
      );
    }

    return filteredInventory.map((item) => {
      const isLowStock = item.stockQuantity <= item.reorderLevel;
      const expiryDate = new Date(item.expiryDate);
      const monthsUntilExpiry =
        (expiryDate - new Date()) / (1000 * 60 * 60 * 24 * 30);
      const isExpiringSoon = monthsUntilExpiry < 3;

      return (
        <div
          key={item.id}
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: isLowStock ? '1px solid #dc3545' : 'none',
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
            <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>
              {item.drugName}
            </h3>
            <div style={{ display: 'flex', gap: '5px' }}>
              {isLowStock && (
                <span
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertCircle size={12} />
                  LOW STOCK
                </span>
              )}
              {isExpiringSoon && (
                <span
                  style={{
                    background: '#ffc107',
                    color: '#333',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  EXPIRING SOON
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: isLowStock ? '#dc3545' : '#007bff',
              marginBottom: '10px',
            }}
          >
            {item.stockQuantity} {item.unit}
          </div>

          <div
            style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}
          >
            <strong>Reorder Level:</strong> {item.reorderLevel} {item.unit}
          </div>

          <div
            style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}
          >
            <strong>Expiry:</strong> {item.expiryDate}
          </div>

          <div
            style={{ fontSize: '14px', color: '#6c757d', marginBottom: '15px' }}
          >
            <strong>Supplier:</strong> {item.supplier}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleShowEditItemModal(item)}
              style={{
                padding: '6px 12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleShowRestockModal(item)}
              style={{
                padding: '6px 12px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Restock
            </button>
            <button
              onClick={() => handleDeleteItem(item.id)}
              style={{
                padding: '6px 12px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Delete
            </button>
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
            Inventory Management
          </h2>
          <p
            style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '14px' }}
          >
            Manage medication stock and supplies
          </p>
        </div>
        <button
          onClick={handleShowAddItemModal}
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
          Add New Item
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
            placeholder="Search inventory..."
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '8px 12px 8px 36px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              appearance: 'none',
            }}
          >
            <option value="all">All Items</option>
            <option value="low">Low Stock</option>
            <option value="expiring">Expiring Soon</option>
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '15px',
        }}
      >
        {renderInventoryGrid()}
      </div>

      {/* Modal */}
      {showModal && (
        <InventoryModal
          mode={modalMode}
          item={selectedItem}
          onClose={() => setShowModal(false)}
          onAdd={handleAddItem}
          onUpdate={handleUpdateItem}
          onRestock={handleRestockItem}
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
            <AlertCircle size={20} />
          )}
          <span style={{ fontSize: '14px' }}>{toast.message}</span>
        </div>
      )}

      {/* Add keyframes for animation */}
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

const InventoryModal = ({
  mode,
  item,
  onClose,
  onAdd,
  onUpdate,
  onRestock,
}) => {
  const [formData, setFormData] = useState(
    item || {
      drugName: '',
      stockQuantity: '',
      unit: 'tablets',
      expiryDate: '',
      reorderLevel: '',
      supplier: '',
    }
  );

  const [restockQuantity, setRestockQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'add') {
      onAdd(formData);
    } else if (mode === 'edit') {
      onUpdate(formData);
    }
  };

  const handleRestock = (e) => {
    e.preventDefault();
    onRestock(restockQuantity);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (mode === 'restock') {
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
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
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
            <h2 style={{ margin: 0 }}>Restock Item</h2>
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

          <form onSubmit={handleRestock}>
            <div style={{ marginBottom: '15px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                  color: '#6c757d',
                }}
              >
                Drug Name
              </label>
              <input
                type="text"
                value={item.drugName}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                }}
              />
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
                Current Stock
              </label>
              <input
                type="text"
                value={`${item.stockQuantity} ${item.unit}`}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                Quantity to Add <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                required
                min="1"
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
                Restock
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
            {mode === 'add' ? 'Add Inventory Item' : 'Edit Inventory Item'}
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Drug Name <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="drugName"
              value={formData.drugName}
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

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                Stock Quantity <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                Unit <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                }}
              >
                <option value="tablets">Tablets</option>
                <option value="capsules">Capsules</option>
                <option value="bottles">Bottles</option>
                <option value="vials">Vials</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                Expiry Date <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
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
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: 'bold',
                }}
              >
                Reorder Level <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Supplier <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
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

          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
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
              {mode === 'add' ? 'Add Item' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inventory;
