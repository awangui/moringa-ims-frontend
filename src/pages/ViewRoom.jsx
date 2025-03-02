import Navigation from '../components/navigation';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ViewRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://172.236.2.18:5050/locations//${id}`);
        if (!response.ok) throw new Error('Failed to fetch room data');
        const data = await response.json();
        setRoom(data);
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);
  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const response = await fetch(`http://172.236.2.18:5050/locations/${selectedId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete room');
  
      setSpaces(spaces.filter(space => space.id !== selectedId));
      setShowConfirm(false);
      setSelectedId(null);
      
      navigate('/spaces');  // Navigate back after deletion
    } catch (error) {
      console.error('Failed to delete space:', error);
    }
  };
  

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!room) return <p className="text-center text-red-500">Room not found</p>;

  return (
    <>
    <Navigation>
    <div className="p-6 bg-[#FDF6F0] min-h-screen">
      <h1 className="text-3xl font-bold text-[#0D2240] mb-6">{room.name}</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-600 text-lg">ROOM NO. {room.id}</p>
            <p className="text-gray-600">DESCRIPTION: {room.description}</p>
          </div>
          <div className="space-x-2">
          
            <Link to={`/editSpace/${room.id}`} className="bg-[#0D2240] text-white px-4 py-2 rounded hover:bg-[#FF6B35]">Edit Room</Link>
            <button 
                    className="text-red-600 hover:text-[#FF6B35] font-semibold" 
                    onClick={() => {
                      setSelectedId(room.id);
                      setShowConfirm(true);
                    }}
                  >
                    Delete Room
                  </button>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#0D2240] my-6">Assigned Items</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-[#FDF6F0] text-[#0D2240]">
              <th className="border border-gray-300 px-4 py-2">ITEM ID</th>
              <th className="border border-gray-300 px-4 py-2">ITEM NAME</th>
              <th className="border border-gray-300 px-4 py-2">SERIAL NUMBER</th>
            </tr>
          </thead>
          <tbody>
            {room.assets && room.assets.length > 0 ? (
              room.assets.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2 text-[#FF6B35]">{item.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.item}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.serial_no}</td>
                 
                
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No items assigned</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Link to={`/spaces`} className="bg-[#0D2240] text-white px-4 py-2 rounded hover:bg-[#FF6B35]">Back</Link>
    </div>
    
    {/* Delete Confirmation Modal */}
    {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-bold text-[#0D2240]">Delete Room</h2>
            <p className="text-gray-600">Are you sure you want to delete this room? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                className="bg-gray-300 text-[#0D2240] px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
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
    </>
  );
}

export default ViewRoom;
