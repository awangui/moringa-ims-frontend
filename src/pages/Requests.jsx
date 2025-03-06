import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navigation from '../components/Navigation';
import { FiFilter } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const RequestsPage = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [notification, setNotification] = useState('');



  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('http://172.236.2.18:5050/assets');
        const data = await response.json();
        setAssets(data);
        setFilteredAssets(data);

        const uniqueItemTypes = [...new Set(data.map((asset) => asset.item))];
        setItemTypes(uniqueItemTypes);

        const uniqueStatuses = [...new Set(data.map((asset) => asset.status))];
        setStatuses(uniqueStatuses);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await fetch('http://172.236.2.18:5050/locations');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await fetch('http://172.236.2.18:6010/requests');
        const data = await response.json();
        console.log(data);
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchAssets();
    fetchLocations();
    fetchRequests();
  }, []);

  // Filter assets based on search and other filters
  useEffect(() => {
    let filtered = assets.filter(
      (asset) =>
        asset.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((asset) => selectedLocations.includes(asset.location_name));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((asset) => selectedTypes.includes(asset.item));
    }

    if (selectedDate) {
      filtered = filtered.filter((asset) => asset.purchase_date.startsWith(selectedDate));
    }

    if (selectedStatus.length > 0) {
      filtered = filtered.filter((asset) => selectedStatus.includes(asset.status));
    }

    setFilteredAssets(filtered);
  }, [searchQuery, selectedLocations, selectedTypes, selectedDate, selectedStatus, assets]);

  const toggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleStatus = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // If needed, you can use handleRequestSelection to select a request and then navigate
  const handleRequestSelection = (request) => {
    setSelectedRequest(request);
    // Navigate immediately to the assign page with the request data
    navigate('/assignRequests', { state: { selectedRequest: request } });
  };

  // This function now is used for approving a request and then navigating to the AssignRequests page
  const approveRequest = async (requestId) => {
    try {
      const response = await fetch(`http://172.236.2.18:6010/requests/${requestId}/approve`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to approve request:', errorData);
        setNotification('Failed to approve request');
        setTimeout(() => setNotification(''), 3000);
        return;
      }

      setNotification('Request approved successfully');
      setTimeout(() => setNotification(''), 3000);

      // Update the request status using the updated array
      const updatedRequests = requests.map((request) =>
        request.id === requestId ? { ...request, status: 'Approved' } : request
      );
      setRequests(updatedRequests);

      // Find the approved request in the updated list
      const updatedRequest = updatedRequests.find((request) => request.id === requestId);
      if (!updatedRequest) {
        setNotification('Request not found');
        setTimeout(() => setNotification(''), 3000);
        return;
      }

      // Navigate to the AssignRequests page, passing the approved request via state
      navigate('/assignRequests', { state: { selectedRequest: updatedRequest } });
    } catch (error) {
      console.error('Error approving request:', error);
      setNotification('Error approving request');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const response = await fetch(`http://172.236.2.18:6010/requests/${requestId}/reject`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotification('Request rejected successfully');
        setTimeout(() => setNotification(''), 3000);

        const updatedRequests = requests.map((request) =>
          request.id === requestId ? { ...request, status: 'Rejected' } : request
        );
        setRequests(updatedRequests);
      } else {
        const errorData = await response.json();
        console.error('Failed to reject request:', errorData);
        setNotification('Failed to reject request');
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      setNotification('Error rejecting request');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <Navigation>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">REQUESTS</h1>

        {notification && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4">{notification}</div>
        )}

        <div className="mb-4 flex justify-end">
          <input
            type="text"
            placeholder="Search by Item or Status"
            className="border border-[#FF6B35] rounded-md p-2 focus:ring-[#FF6B35] focus:outline-none w-full max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-[#FF6B35] text-white px-4 py-2 rounded flex items-center ml-4"
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? <IoClose size={20} /> : <FiFilter size={20} />} Filter
          </button>
        </div>

        {showFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
            <div
              className={`bg-white p-6 shadow-lg relative overflow-y-auto ${
                locations.length > 10 || itemTypes.length > 10 ? 'w-3/4 h-3/4' : 'w-1/4 h-full'
              }`}
              style={{ maxHeight: '90vh', minWidth: '300px', maxWidth: '90vw' }}
            >
              <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center text-[#FF6B35]">
                Filter
                <button className="text-xl text-[#FF6B35]" onClick={() => setShowFilter(false)}>
                  <IoClose />
                </button>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-[#FF6B35]">Location</label>
                  <div className="grid grid-cols-1 gap-2">
                    {locations.length > 0 ? (
                      locations.map((location) => (
                        <div key={location.id} className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedLocations.includes(location.name)}
                            onChange={() => toggleLocation(location.name)}
                          />
                          <label className="break-words">{location.name}</label>
                        </div>
                      ))
                    ) : (
                      <p>Loading locations...</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#FF6B35]">Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {itemTypes.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleType(type)}
                        />
                        <label className="break-words">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#FF6B35]">Purchase Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-[#FF6B35] rounded focus:ring-[#FF6B35] focus:outline-none"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-[#FF6B35]">Status</label>
                  <div className="grid grid-cols-1 gap-2">
                    {statuses.map((status) => (
                      <div key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedStatus.includes(status)}
                          onChange={() => toggleStatus(status)}
                        />
                        <label className="break-words">{status}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="mt-4 bg-[#FF6B35] text-white px-4 py-2 rounded w-full hover:bg-[#FF6B35]/80 transition"
                onClick={() => setShowFilter(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Assignment Requests</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">ITEM</th>
                <th className="border-b p-2">ASSET NAME</th>
                <th className="border-b p-2">REQUESTED BY</th>
                <th className="border-b p-2">REQUESTED AT</th>
                <th className="border-b p-2">STATUS</th>
                <th className="border-b p-2">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={`${request.id}-${request.asset_id}`}>
                  <td className="border-b p-2">{request.asset_id}</td>
                  <td className="border-b p-2">{request.asset_name}</td>
                  <td className="border-b p-2">{request.user_name}</td>
                  <td className="border-b p-2">{request.requested_at}</td>
                  <td className="border-b p-2">{request.status}</td>
                  <td className="border-b p-2">
                    <button
                      className="bg-green-600 text-white px-4 py-1 rounded mr-2"
                      onClick={() => approveRequest(request.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-1 rounded"
                      onClick={() => rejectRequest(request.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Navigation>
  );
};

export default RequestsPage;
