import Navigation from '../components/Navigation';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditSpace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setLocation] = useState('');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const response = await fetch(`http://172.236.2.18:5050/locations/${id}`);
        if (!response.ok) throw new Error('Failed to fetch space data');
        const data = await response.json();
        
        setName(data.name);
        setLocation(data.description);
        setAssets(data.assets || []); 
      } catch (error) {
        console.error('Error fetching space:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceData();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://172.236.2.18:5050/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) throw new Error('Failed to update space');

      navigate('/spaces');
    } catch (error) {
      console.error('Error updating space:', error);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://172.236.2.18:5050/locations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete space');

      navigate('/spaces');
    } catch (error) {
      console.error('Error deleting space:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Navigation>
      <div className="p-6 bg-white shadow-md rounded-lg px-4">
        <h1 className="text-2xl font-bold text-[#0D2240] mb-4">Edit Room</h1>
        
        {/* Room Details */}
        <div className="mb-4">
          <label className="block text-[#0D2240] font-medium mb-1">Description</label>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setLocation(e.target.value)}
            className="border border-[#FF6B35] focus:ring-[#FF6B35] rounded-md p-2 w-full focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[#0D2240] font-medium mb-1">Room Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="border border-[#FF6B35] focus:ring-[#FF6B35] rounded-md p-2 w-full focus:outline-none"
          />
        </div>

        {/* Fixed Assets Table */}
        <h2 className="text-lg font-bold text-[#0D2240] my-4">Items</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-[#FDF6F0] text-[#0D2240]">
              <th className="border border-gray-200 px-4 py-2">ITEM ID</th>
              <th className="border border-gray-200 px-4 py-2">ITEM NAME</th>
              <th className="border border-gray-200 px-4 py-2">SERIAL NUMBER</th>
              
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <tr key={asset.id} className="text-center">
                  <td className="border border-gray-200 px-4 py-2">{asset.id}</td>
                  <td className="border border-gray-200 px-4 py-2 text-[#0D2240]">{asset.item}</td>
                  <td className="border border-gray-200 px-4 py-2 text-[#FF6B35]">{asset.serial_no}</td>
              
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No items assigned</td>
              </tr>
            )}
          </tbody>
        </table>
            
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button 
            className="bg-gray-200 text-[#0D2240] px-4 py-2 rounded-md hover:bg-gray-300"
            onClick={() => navigate('/spaces')}
          >
            Cancel
          </button>
          <button 
            className="bg-[#FF6B35] text-white px-4 py-2 rounded-md hover:bg-[#D94F00]"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
          <button 
            className="bg-[#0D2240] text-white px-4 py-2 rounded-md hover:bg-[#FF6B35]"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold text-[#0D2240] mb-2">Delete Room</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this room? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button 
                className="bg-gray-200 text-[#0D2240] px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Navigation>
  );
}

export default EditSpace;
