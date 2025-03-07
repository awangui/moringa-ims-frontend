import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Navigation from '../components/Navigation';
import SideBar from '@/components/SideBar';
import { FiFilter } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [notification, setNotification] = useState('');
  

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://172.236.2.18:6010/requests');
        const data = await response.json();
        setRequests(data);
        setFilteredRequests(data);

        // Extract unique statuses from requests
        const uniqueStatuses = [...new Set(data.map((request) => request.status))];
        setStatuses(uniqueStatuses);
      } catch (error) {
        console.error('Error fetching requests:', error);
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

    fetchRequests();
    fetchLocations();
  }, []);

  // Handle search and filters
  useEffect(() => {
    let filtered = requests.filter(
      (request) =>
        request.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((request) =>
        selectedLocations.includes(request.location_name)
      );
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((request) =>
        selectedStatuses.includes(request.status)
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((request) =>
        request.requested_at.startsWith(selectedDate)
      );
    }

    setFilteredRequests(filtered);
  }, [searchQuery, selectedLocations, selectedStatuses, selectedDate, requests]);

  const toggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location]
    );
  };

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

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

      const updatedRequests = requests.map((request) =>
        request.id === requestId ? { ...request, status: 'Approved' } : request
      );
      setRequests(updatedRequests);

      const updatedRequest = updatedRequests.find((request) => request.id === requestId);
      if (!updatedRequest) {
        setNotification('Request not found');
        setTimeout(() => setNotification(''), 3000);
        return;
      }

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
    // <Navigation>
    <div className="wrapper" style={{ display: "flex", gap: "100px"}}>
    <SideBar/>
    <div className="flex flex-col items-center justify-start bg-gray-50 min-h-screen w-full px-4"> {/* Full width and no padding */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">REQUESTS</h1>
  
      {notification && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-6 w-full max-w-md"> {/* Centered notification */}
          {notification}
        </div>
      )}
  
      <div className="mb-6 flex justify-between items-center w-full max-w-md"> {/* Full width for search and filter */}
        <input
          type="text"
          placeholder="Search by Asset Name or Status"
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#FF6B35] focus:outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-[#FF6B35] text-white px-4 py-2 rounded flex items-center ml-4 hover:bg-[#FF6B35]/90 transition"
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? <IoClose size={20} /> : <FiFilter size={20} />} Filter
        </button>
      </div>
  
      {showFilter && (
        <div className="bg-white p-4 rounded-lg shadow-lg mt-2 w-full max-w-md"> {/* Full width for filter options */}
          <h2 className="text-xl font-semibold mb-4 text-[#FF6B35]">Filter Options</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Location</label>
              <div className="grid grid-cols-1 gap-2">
                {locations.map((location) => (
                  <div key={location.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedLocations.includes(location.name)}
                      onChange={() => toggleLocation(location.name)}
                    />
                    <label className="text-gray-700">{location.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Status</label>
              <div className="grid grid-cols-1 gap-2">
                {statuses.map((status) => (
                  <div key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => toggleStatus(status)}
                    />
                    <label className="text-gray-700">{status}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Requested Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          <button
            className="mt-4 bg-[#FF6B35] text-white px-4 py-2 rounded w-full hover:bg-[#FF6B35]/90 transition"
            onClick={() => setShowFilter(false)}
          >
            Apply Filters
          </button>
        </div>
      )}
  
      <div className="bg-white rounded-lg shadow overflow-hidden w-full max-w-6xl"> {/* Full width for table */}
        <table className="w-full text-left">
          <thead className="border border-gray-200 px-4 py-2">
            <tr>
              <th className="p-4">ITEM</th>
              <th className="p-4">ASSET NAME</th>
              <th className="p-4">REQUESTED BY</th>
              <th className="p-4">REQUESTED AT</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) => (
              <tr key={request.id} className={`border-b hover:bg-gray-100 transition ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                <td className="p-4">{request.asset_id}</td>
                <td className="p-4">{request.asset_name}</td>
                <td className="p-4">{request.user_name}</td>
                <td className="p-4">{request.requested_at}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      request.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="p-4">
                <div className="flex space-x-4">
  <button
    className="bg-[#0D2240] text-white px-6 py-3 text-lg font-semibold rounded-2xl hover:bg-[#FF6B35] transition duration-300 ease-in-out shadow-md"
    onClick={() => approveRequest(request.id)}
  >
    Approve
  </button>
  <button
    className="bg-[#0D2240] text-white px-6 py-3 text-lg font-semibold rounded-2xl hover:bg-[#FF6B35] transition duration-300 ease-in-out shadow-md"
    onClick={() => rejectRequest(request.id)}
  >
    Reject
  </button>
</div>


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  // </Navigation>
  );
};

export default RequestsPage;