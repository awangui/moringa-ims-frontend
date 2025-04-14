import { useEffect, useState } from 'react';
import SideBar from '@/components/SideBar';
import { FiFilter } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const ReturnsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [notification, setNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses] = useState(['approved', 'rejected']);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('http://172.236.2.18:5050/assignments');
        if (!response.ok) {
          throw new Error(`Failed to fetch assignments: ${response.statusText}`);
        }
        const data = await response.json();
        // Ensure data is an array and handle missing properties
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: Expected an array of assignments');
        }
        const sanitizedData = data.map((assignment) => ({
          id: assignment.id || '',
          asset_id: assignment.asset_id || '',
          asset_name: assignment.asset_name || 'Unknown Asset',
          assigned_to: assignment.assigned_to || 'Unknown User',
          assigned_date: assignment.assigned_date || 'N/A',
          location_name: assignment.location_name || 'N/A',
          status: assignment.status || 'pending', // Default to 'pending' if status is missing
        }));
        setAssignments(sanitizedData);
        setFilteredAssignments(sanitizedData);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setNotification(`Error fetching assignments: ${error.message}`);
        setTimeout(() => setNotification(''), 3000);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await fetch('http://172.236.2.18:5050/locations');
        if (!response.ok) {
          throw new Error(`Failed to fetch locations: ${response.statusText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: Expected an array of locations');
        }
        const sanitizedLocations = data.map((location) => ({
          name: location.name || 'Unknown Location',
        }));
        setLocations(sanitizedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setNotification(`Error fetching locations: ${error.message}`);
        setTimeout(() => setNotification(''), 3000);
      }
    };

    fetchAssignments();
    fetchLocations();
  }, []);

  // Handle search and filters
  useEffect(() => {
    let filtered = assignments.filter((assignment) => {
      const assetName = (assignment.asset_name || '').toLowerCase();
      const assignedTo = (assignment.assigned_to || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      return assetName.includes(query) || assignedTo.includes(query);
    });

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((assignment) =>
        selectedLocations.includes(assignment.location_name)
      );
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((assignment) =>
        selectedStatuses.includes(assignment.status)
      );
    }

    setFilteredAssignments(filtered);
  }, [searchQuery, selectedLocations, selectedStatuses, assignments]);

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

  const approveReturn = async (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) {
      setNotification('Assignment not found.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    if (assignment.status === 'approved') {
      setNotification('Return is already approved.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    const confirmApprove = window.confirm(
      `Are you sure you want to approve the return of "${assignment.asset_name}" assigned to ${assignment.assigned_to}?`
    );
    if (!confirmApprove) return;

    try {
      // Update asset status to available
      const returnResponse = await fetch(`http://172.236.2.18:5050/assets/return/${assignment.asset_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!returnResponse.ok) {
        const errorData = await returnResponse.json();
        throw new Error(`Failed to update asset status: ${errorData.message || returnResponse.statusText}`);
      }

      // Update assignment status to approved
      const patchResponse = await fetch(`http://172.236.2.18:5050/assignments/${assignmentId}/return`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!patchResponse.ok) {
        const errorData = await patchResponse.json();
        throw new Error(`Failed to update assignment: ${errorData.message || patchResponse.statusText}`);
      }

      setNotification('Return approved successfully');
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignmentId ? { ...a, status: 'approved' } : a))
      );
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error approving return:', error);
      setNotification(`Error approving return: ${error.message}`);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const rejectReturn = async (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) {
      setNotification('Assignment not found.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    if (assignment.status === 'rejected') {
      setNotification('Return is already rejected.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    const confirmReject = window.confirm(
      `Are you sure you want to reject the return of "${assignment.asset_name}" assigned to ${assignment.assigned_to}?`
    );
    if (!confirmReject) return;

    try {
      // Update assignment status to rejected
      const patchResponse = await fetch(`http://172.236.2.18:5050/assignments/${assignmentId}/return`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!patchResponse.ok) {
        const errorData = await patchResponse.json();
        throw new Error(`Failed to update assignment: ${errorData.message || patchResponse.statusText}`);
      }

      setNotification('Return rejected successfully');
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignmentId ? { ...a, status: 'rejected' } : a))
      );
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error rejecting return:', error);
      setNotification(`Error rejecting return: ${error.message}`);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="wrapper" style={{ display: 'flex', gap: '100px' }}>
      <SideBar />
      <div className="flex flex-col items-center justify-start bg-gray-50 min-h-screen w-full px-4">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">RETURNS</h1>

        {notification && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-6 w-full max-w-md">
            {notification}
          </div>
        )}

        {/* Search & Filter */}
        <div className="mb-6 flex justify-between items-center w-full max-w-md">
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

        {/* Filter Options */}
        {showFilter && (
          <div className="bg-white p-4 rounded-lg shadow-lg mt-2 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-[#FF6B35]">Filter Options</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Location</label>
                <div className="grid grid-cols-1 gap-2">
                  {locations.map((location, index) => (
                    <div key={index} className="flex items-center">
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
            </div>
            <button
              className="mt-4 bg-[#FF6B35] text-white px-4 py-2 rounded w-full hover:bg-[#FF6B35]/90 transition"
              onClick={() => setShowFilter(false)}
            >
              Apply Filters
            </button>
          </div>
        )}

        {/* Assignments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden w-full max-w-6xl">
          <table className="w-full text-left">
            <thead className="border border-gray-200 px-4 py-2">
              <tr>
                <th className="p-4">ASSET NAME</th>
                <th className="p-4">ASSIGNED TO</th>
                <th className="p-4">ASSIGNED DATE</th>
                <th className="p-4">LOCATION</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment, index) => (
                <tr
                  key={assignment.id || index} // Fallback to index if id is missing
                  className={`border-b hover:bg-gray-100 transition ${
                    index % 2 === 0 ? 'bg-gray-50' : ''
                  }`}
                >
                  <td className="p-4">{assignment.asset_name}</td>
                  <td className="p-4">{assignment.assigned_to}</td>
                  <td className="p-4">{assignment.assigned_date}</td>
                  <td className="p-4">{assignment.location_name}</td>
                  <td className="p-4">{assignment.status}</td>
                  <td className="p-4">
                    <div className="flex space-x-4">
                      <button
                        className={`bg-[#0D2240] text-white px-6 py-3 text-lg font-semibold rounded-2xl transition duration-300 ease-in-out shadow-md ${
                          assignment.status === 'approved'
                            ? 'cursor-not-allowed opacity-50'
                            : 'hover:bg-[#FF6B35]'
                        }`}
                        onClick={() => approveReturn(assignment.id)}
                        disabled={assignment.status === 'approved'}
                      >
                        Approve
                      </button>
                      <button
                        className={`bg-[#0D2240] text-white px-6 py-3 text-lg font-semibold rounded-2xl transition duration-300 ease-in-out shadow-md ${
                          assignment.status === 'rejected'
                            ? 'cursor-not-allowed opacity-50'
                            : 'hover:bg-[#FF6B35]'
                        }`}
                        onClick={() => rejectReturn(assignment.id)}
                        disabled={assignment.status === 'rejected'}
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
  );
};

export default ReturnsPage;