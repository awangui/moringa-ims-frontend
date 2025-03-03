import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { FiFilter } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [approvalStatus, setApprovalStatus] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('https://api.example.com/requests');
        const data = await response.json();
        setRequests(data);
        setFilteredRequests(data);
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

  // Handle search input
  useEffect(() => {
    let filtered = requests.filter(
      (request) =>
        request.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filters
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((request) => selectedLocations.includes(request.location));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((request) => selectedTypes.includes(request.type));
    }

    if (selectedDate) {
      filtered = filtered.filter((request) => request.dateCreated.startsWith(selectedDate));
    }

    if (approvalStatus.length > 0) {
      filtered = filtered.filter((request) =>
        approvalStatus.includes(request.isApproved ? 'Approved' : 'Not Approved')
      );
    }

    setFilteredRequests(filtered);
  }, [searchQuery, selectedLocations, selectedTypes, selectedDate, approvalStatus, requests]);

  // Handle location filter change
  const toggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location]
    );
  };

  // Handle type filter change
  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Handle approval filter change
  const toggleApproval = (status) => {
    setApprovalStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  return (
    <Navigation>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Requests</h1>

        {/* Search & Filter */}
        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Search by Item or Type"
            className="border border-[#FF6B35] rounded-md p-2 focus:ring-[#FF6B35] focus:outline-none w-full max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button className="ml-4 flex items-center bg-gray-200 px-4 py-2 rounded" onClick={() => setShowFilter(true)}>
            <FiFilter className="mr-2" /> Filter
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">ITEM</th>
              <th className="border-b p-2">TYPE</th>
              <th className="border-b p-2">QUANTITY</th>
              <th className="border-b p-2">LOCATION</th>
              <th className="border-b p-2">DATE CREATED</th>
              <th className="border-b p-2">DUE DATE</th>
              <th className="border-b p-2">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td className="border-b p-2">{request.item}</td>
                <td className="border-b p-2">{request.type}</td>
                <td className="border-b p-2">{request.quantity}</td>
                <td className="border-b p-2">{request.location}</td>
                <td className="border-b p-2">{request.dateCreated}</td>
                <td className="border-b p-2 font-bold">{request.dueDate}</td>
                <td className="border-b p-2">
                  {request.action ? (
                    <button className="bg-indigo-600 text-white px-4 py-1 rounded">
                      {request.action}
                    </button>
                  ) : (
                    request.assignedTo
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filter Sidebar */}
      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
          <div className="w-1/4 bg-white p-6 shadow-lg h-full relative">
            <button className="absolute top-4 right-4 text-xl" onClick={() => setShowFilter(false)}>
              <IoClose />
            </button>
            <h2 className="text-xl font-bold mb-4">Filter</h2>

            {/* Locations */}
            <div>
              <label className="block mb-2 font-semibold">Location</label>
              {locations.length > 0 ? (
                locations.map((location) => (
                  <div key={location.id}>
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedLocations.includes(location.name)}
                      onChange={() => toggleLocation(location.name)}
                    />
                    <label>{location.name}</label>
                  </div>
                ))
              ) : (
                <p>Loading locations...</p>
              )}
            </div>

            {/* Type */}
            <div className="mt-4">
              <label className="block mb-2 font-semibold">Type</label>
              {['Inventory', 'Fixed Asset'].map((type) => (
                <div key={type}>
                  <input type="checkbox" className="mr-2" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} />
                  <label>{type}</label>
                </div>
              ))}
            </div>

            {/* Date Created */}
            <div className="mt-4">
              <label className="block mb-2 font-semibold">Date Created</label>
              <input type="date" className="w-full p-2 border rounded" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>

            {/* Approval */}
            <div className="mt-4">
              <label className="block mb-2 font-semibold">Approval</label>
              {['Approved', 'Not Approved'].map((status) => (
                <div key={status}>
                  <input type="checkbox" className="mr-2" checked={approvalStatus.includes(status)} onChange={() => toggleApproval(status)} />
                  <label>{status}</label>
                </div>
              ))}
            </div>

            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded w-full" onClick={() => setShowFilter(false)}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </Navigation>
  );
};

export default RequestsPage;
