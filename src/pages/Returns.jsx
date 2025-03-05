import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { FiFilter } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const RequestsPage = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notification, setNotification] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false); // Added showFilter state

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('http://172.236.2.18:5050/assets');
        const data = await response.json();
        setAssets(data);
        setFilteredAssets(data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await fetch('http://172.236.2.18:5050/assignments');
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchAssets();
    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = assets.filter(asset =>
      asset.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAssets(filtered);
  }, [searchQuery, assets]);

  const handleReturnAsset = async () => {
    if (!selectedAssignment) {
      setNotification('Please select an assignment to return the asset.');
      return;
    }

    const confirmReturn = window.confirm(`Are you sure you want to return the asset assigned to ${selectedAssignment.assigned_to}?`);
    if (!confirmReturn) return;

    try {
      const returnResponse = await fetch(`http://172.236.2.18:5050/assets/return/${selectedAssignment.asset_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!returnResponse.ok) throw new Error('Failed to return asset');

      const patchResponse = await fetch(`http://172.236.2.18:5050/assignments/${selectedAssignment.id}/return`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!patchResponse.ok) throw new Error('Failed to update assignment');

      setNotification('Asset returned successfully');
      setRequests((prev) => prev.filter(req => req.id !== selectedAssignment.id));
      setSelectedAssignment(null);
    } catch (error) {
      console.error('Error returning asset:', error);
      setNotification('Error returning asset');
    }
  };

  return (
    <Navigation>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">RETURNS</h1>

        {notification && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4">{notification}</div>
        )}

        {/* Search & Filter */}
        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Search by Item or Status"
            className="border border-[#FF6B35] rounded-md p-2 focus:ring-[#FF6B35] focus:outline-none w-full max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-[#FF6B35] text-white px-4 py-2 rounded flex items-center"
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? <IoClose size={20} /> : <FiFilter size={20} />} Filter
          </button>
        </div>

        {/* Assets Table */}
        <table className="w-full text-left border-collapse mb-4">
          <thead>
            <tr>
              <th className="border-b p-2">ITEM</th>
              <th className="border-b p-2">SPECIFICATIONS</th>
              <th className="border-b p-2">SERIAL NO</th>
              <th className="border-b p-2">PURCHASE DATE</th>
              <th className="border-b p-2">STATUS</th>
              <th className="border-b p-2">LOCATION</th>
              <th className="border-b p-2">ASSIGNED TO</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset.id}>
                <td className="border-b p-2">{asset.item}</td>
                <td className="border-b p-2">{asset.specifications}</td>
                <td className="border-b p-2">{asset.serial_no}</td>
                <td className="border-b p-2">{asset.purchase_date}</td>
                <td className="border-b p-2">{asset.status}</td>
                <td className="border-b p-2">{asset.location_name}</td>
                <td className="border-b p-2">{asset.assigned_to}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Flex Container for Dropdown and Assignment Details */}
        <div className="flex">
          {/* Assignments Dropdown */}
          <div className="mr-4 w-1/2">
            <label className="block mb-2 font-semibold">Select Assignment:</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedAssignment ? selectedAssignment.id : ''}
              onChange={(e) => {
                const selected = requests.find(req => req.id === parseInt(e.target.value));
                setSelectedAssignment(selected);
              }}
            >
              <option value="">-- Select Assignment --</option>
              {requests.map((request) => (
                <option key={request.id} value={request.id}>
                  {`Asset ID: ${request.asset_id} - Assigned To: ${request.assigned_to} - Assigned Date: ${request.assigned_date} - Return Date: ${request.return_date || 'N/A'}`}
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Details Form */}
          {selectedAssignment && (
            <div className="w-1/2 p-4 border rounded bg-gray-100">
              <h2 className="text-lg font-semibold mb-2">Assignment Details</h2>
              <form>
                <div className="mb-2">
                  <label className="block font-medium">Asset ID:</label>
                  <input
                    type="text"
                    value={selectedAssignment.asset_id}
                    readOnly
                    className="border p-2 w-full rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Assigned To:</label>
                  <input
                    type="text"
                    value={selectedAssignment.assigned_to}
                    readOnly
                    className="border p-2 w-full rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Assigned Date:</label>
                  <input
                    type="text"
                    value={selectedAssignment.assigned_date}
                    readOnly
                    className="border p-2 w-full rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Return Date:</label>
                  <input
                    type="text"
                    value={selectedAssignment.return_date || 'N/A'}
                    readOnly
                    className="border p-2 w-full rounded"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Return Asset Button */}
        <div className="mb-4 mt-4">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={handleReturnAsset}
          >
            Return Asset
          </button>
        </div>
      </div>
    </Navigation>
  );
};

export default RequestsPage;