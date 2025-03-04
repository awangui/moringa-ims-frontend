import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import { FiFilter } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const RequestsPage = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [requests, setRequests] = useState([]); // State to store assignment requests
  const [locations, setLocations] = useState([]);
  const [itemTypes, setItemTypes] = useState([]); // State to store unique item types
  const [statuses, setStatuses] = useState([]); // State to store unique statuses
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [notification, setNotification] = useState('');
  const [showAssignmentForm, setShowAssignmentForm] = useState(false); // State to show/hide assignment form
  const [selectedRequest, setSelectedRequest] = useState(null); // State to store the selected request
  const [locationId, setLocationId] = useState(''); // State for location ID input
  const [returnDate, setReturnDate] = useState(''); // State for return date input

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('http://172.236.2.18:5050/assets');
        const data = await response.json();
        setAssets(data);
        setFilteredAssets(data);

        // Extract unique item types from assets
        const uniqueItemTypes = [...new Set(data.map((asset) => asset.item))];
        setItemTypes(uniqueItemTypes);

        // Extract unique statuses from assets
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
        const response = await fetch('http://172.236.2.18:5050/requests');
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchAssets();
    fetchLocations();
    fetchRequests();
  }, []);

  // Handle search input and filters
  useEffect(() => {
    let filtered = assets.filter(
      (asset) =>
        asset.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filters
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

  // Handle status filter change
  const toggleStatus = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Handle assignment request selection
  const handleRequestSelection = (request) => {
    setSelectedRequest(request);
    setShowAssignmentForm(true);
  };

  // Handle assignment form submission
  const handleAssignment = async () => {
    if (!selectedRequest || !locationId || !returnDate) {
      setNotification('Please fill in all fields');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    const confirmAssignment = window.confirm(
      `Are you sure you want to assign this asset to ${selectedRequest.assigned_to} at the selected location?`
    );
    if (!confirmAssignment) return;

    const assignment = {
      asset_id: selectedRequest.asset_id,
      location_id: locationId,
      assigned_to: selectedRequest.assigned_to,
      assigned_date: selectedRequest.assignment_date,
      return_date: returnDate,
    };

    try {
      const response = await fetch('http://172.236.2.18:5050/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignment),
      });

      if (response.ok) {
        setNotification('Asset successfully assigned');
        setTimeout(() => setNotification(''), 3000);

        // Update the local state to reflect the assignment
        const updatedAssets = assets.map((asset) =>
          asset.id === selectedRequest.asset_id
            ? { ...asset, status: 'Assigned', location_id: locationId }
            : asset
        );
        setAssets(updatedAssets);
        setFilteredAssets(updatedAssets);

        // Remove the assigned request from the requests list
        const updatedRequests = requests.filter(
          (request) => request.asset_id !== selectedRequest.asset_id
        );
        setRequests(updatedRequests);

        // Reset form and selected request
        setShowAssignmentForm(false);
        setSelectedRequest(null);
        setLocationId('');
        setReturnDate('');
      } else {
        setNotification('Failed to assign asset');
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (error) {
      console.error('Error assigning asset:', error);
      setNotification('Error assigning asset');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <Navigation>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Assets</h1>

        {notification && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
            {notification}
          </div>
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

        {/* Filter Sidebar */}
        {showFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
            <div className="w-1/4 bg-white p-6 shadow-lg h-full relative">
              <button
                className="absolute top-4 right-4 text-xl"
                onClick={() => setShowFilter(false)}
              >
                <IoClose />
              </button>
              <h2 className="text-xl font-bold mb-4">Filter</h2>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block mb-2 font-semibold">Type</label>
                  {itemTypes.map((type) => (
                    <div key={type}>
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                      />
                      <label>{type}</label>
                    </div>
                  ))}
                </div>

                {/* Purchase Date */}
                <div>
                  <label className="block mb-2 font-semibold">Purchase Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block mb-2 font-semibold">Status</label>
                  {statuses.map((status) => (
                    <div key={status}>
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedStatus.includes(status)}
                        onChange={() => toggleStatus(status)}
                      />
                      <label>{status}</label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded w-full"
                onClick={() => setShowFilter(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Requests Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Assignment Requests</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">ITEM</th>
                <th className="border-b p-2">ASSIGNED TO</th>
                <th className="border-b p-2">ASSIGNMENT DATE</th>
                <th className="border-b p-2">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.asset_id}>
                  <td className="border-b p-2">{request.item}</td>
                  <td className="border-b p-2">{request.assigned_to}</td>
                  <td className="border-b p-2">{request.assignment_date}</td>
                  <td className="border-b p-2">
                    <button
                      className="bg-indigo-600 text-white px-4 py-1 rounded"
                      onClick={() => handleRequestSelection(request)}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Assignment Form */}
        {showAssignmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Assign Asset</h2>
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Location</label>
                <select
                  className="w-full p-2 border rounded"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Return Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                  onClick={() => setShowAssignmentForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                  onClick={handleAssignment}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assets Table */}
        <table className="w-full text-left border-collapse">
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
      </div>
    </Navigation>
  );
};

export default RequestsPage;