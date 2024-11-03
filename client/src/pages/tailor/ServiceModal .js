const ServiceModal = ({ onClose, onSave }) => {
    
    const [serviceName, setServiceName] = useState('');

    const handleSave = () => {
      onSave({ name: serviceName });
      onClose();
    };
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Add Service</h2>
          <input 
            type="text" 
            value={serviceName} 
            onChange={(e) => setServiceName(e.target.value)} 
            placeholder="Service Name" 
            className="w-full p-2 mb-2 border rounded"
          />
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    );
  };

export default ServiceModal;