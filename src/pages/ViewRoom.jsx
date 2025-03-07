// import Navigation from '../components/Navigation';
import SideBar from '@/components/SideBar';
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
        const response = await fetch(`http://172.236.2.18:5050/locations/${id}`);
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
      navigate('/spaces');
    } catch (error) {
      console.error('Failed to delete space:', error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!room) return <p className="text-center text-red-500">Room not found</p>;

  return (
    // <Navigation>
    <div className="wrapper" style={{ display: "flex", gap: "20px"}}>
      <SideBar/>
      <div className="min-h-screen bg-gray-100 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl">
          <h1 className="text-4xl font-extrabold text-[#0D2240] text-center mb-8">
            {room.name}
          </h1>

          <div className="bg-[#FDF6F0] shadow-md rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-700 text-lg mb-2">
                  ROOM NO. <span className="font-semibold">{room.id}</span>
                </p>
                <p className="text-gray-700">
                  DESCRIPTION: {room.description}
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  to={`/editSpace/${room.id}`}
                  className="bg-[#0D2240] text-white px-6 py-2 rounded-md hover:bg-[#FF6B35] transition no-underline"
                >
                  Edit Room
                </Link>
                <button
                  className="bg-[#0D2240] text-white px-6 py-2 rounded-md hover:bg-[#FF6B35] transition"
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

          <h2 className="text-3xl font-bold text-[#0D2240] text-center mb-6">
            Assigned Items
          </h2>
          <div className="bg-[#FDF6F0] shadow-md rounded-2xl p-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white text-[#0D2240]">
                  <th className="border border-gray-300 px-6 py-3">ITEM ID</th>
                  <th className="border border-gray-300 px-6 py-3">ITEM NAME</th>
                  <th className="border border-gray-300 px-6 py-3">SERIAL NUMBER</th>
                </tr>
              </thead>
              <tbody>
                {room.assets && room.assets.length > 0 ? (
                  room.assets.map((item) => (
                    <tr key={item.id} className="text-center">
                      <td className="border border-gray-300 px-6 py-3 text-[#FF6B35]">
                        {item.id}
                      </td>
                      <td className="border border-gray-300 px-6 py-3 text-[#0D2240]">
                        {item.item}
                      </td>
                      <td className="border border-gray-300 px-6 py-3 text-gray-600">
                        {item.serial_no}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">
                      No items assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/spaces"
              className="inline-block bg-[#FF6B35] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#0D2240] transition no-underline"
            >
              Back
            </Link>
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
              <h2 className="text-xl font-bold text-[#0D2240] mb-4">
                Delete Room
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this room? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-[#0D2240] text-white px-4 py-2 rounded-md hover:bg-[#FF6B35] transition"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#0D2240] text-white px-4 py-2 rounded-md hover:bg-[#FF6B35] transition"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    // </Navigation>
  );
}

export default ViewRoom;
