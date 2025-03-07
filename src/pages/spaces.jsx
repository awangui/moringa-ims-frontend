// import Navigation from '../components/Navigation';
import SideBar from '@/components/SideBar';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { FiSearch } from 'react-icons/fi'; 

function SpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); 

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch('http://172.236.2.18:5050/locations'); 
        const data = await response.json();
        setSpaces(data);
        setFilteredSpaces(data);
      } catch (error) {
        console.error('Failed to fetch spaces:', error);
      }
    };

    fetchSpaces();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredSpaces(
      spaces.filter((space) =>
        space.name.toLowerCase().includes(value)
      )
    );
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await fetch(`http://172.236.2.18:5050/locations/${selectedId}`, {
        method: 'DELETE',
      });
      setSpaces(spaces.filter(space => space.id !== selectedId));
      setFilteredSpaces(filteredSpaces.filter(space => space.id !== selectedId));
      setShowConfirm(false);
      setSelectedId(null);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); 
    } catch (error) {
      console.error('Failed to delete space:', error);
    }
  };

  return (
    // <Navigation>
    <div className="wrapper" style={{ display: "flex", gap: "100px"}}>
      <SideBar/>
<div className={`p-6 bg-white shadow-md rounded-lg px-4 ${showConfirm ? 'blur-sm' : ''}`}>
  <h1 className="text-2xl font-bold text-[#0D2240] mb-4">ROOMS</h1>
  
  {/* Search & Add Room */}
  <div className="mb-4 flex justify-between items-center">
    <div className="relative">
      <input 
        type="text" 
        placeholder="Search by Name" 
        value={searchTerm}
        onChange={handleSearch}
        className="border border-[#FF6B35] rounded-md p-2 pl-10 focus:ring-[#FF6B35] focus:outline-none"
      />
    </div>
    <Link to={`/AddRoom`}>
      <button className="bg-[#0D2240] text-white px-4 py-2 rounded-md hover:bg-[#FF6B35]">
        + Add Room
      </button>
    </Link>
  </div>

  {/* Table */}
  <table className="w-full border-collapse border border-gray-200">
    <thead>
      <tr className="bg-[#FDF6F0] text-[#0D2240]">
        <th className="border border-gray-200 px-4 py-2">ROOM NO.</th>
        <th className="border border-gray-200 px-4 py-2">ROOM NAME</th>
        <th className="border border-gray-200 px-4 py-2">LOCATION</th>
        <th className="border border-gray-200 px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredSpaces.map((space) => (
        <tr key={space.id} className="text-center">
          <td className="border border-gray-200 px-4 py-2">{space.id}</td>
          <td className="border border-gray-200 px-4 py-2">{space.name}</td>
          <td className="border border-gray-200 px-4 py-2">{space.description}</td>
          <td className="border border-gray-200 px-4 py-2 flex justify-center space-x-4">
            <Link 
              to={`/ViewRoom/${space.id}`} 
              className="text-[#0D2240] hover:text-[#FF6B35] font-semibold no-underline"
            >
              View Room
            </Link>
            <Link 
              to={`/editSpace/${space.id}`} 
              className="text-[#0D2240] hover:text-[#FF6B35] font-semibold no-underline"
            >
              Edit Room
            </Link>
            <button 
              className="bg-[#0D2240] text-white px-4 py-2 rounded-md hover:bg-[#FF6B35]"
              onClick={() => {
                setSelectedId(space.id);
                setShowConfirm(true);
              }}
            >
              Delete Room
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
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

      
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h2 className="text-lg font-bold text-[#0D2240]">Success</h2>
            <p className="text-green-600 font-semibold mt-2">✅ Room deleted successfully!</p>
            <button 
              className="bg-[#0D2240] text-white px-4 py-2 rounded-md hover:bg-[#FF6B35] mt-4"
              onClick={() => setShowSuccess(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    // </Navigation>
  );
}

export default SpacesPage;
