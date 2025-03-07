import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // assuming React Router is used
import Navigation from '../components/Navigation';
import SideBar from '@/components/SideBar';

const AssignRequests = () => {
  // Get the selected request passed from the previous page
  const location = useLocation();
  const navigate = useNavigate();
  const initialRequest = location.state?.selectedRequest; // Ensure this is passed via navigation

  const [selectedRequest] = useState(initialRequest || null);
  const [locationId, setLocationId] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [locations, setLocations] = useState([]);
  const [notification, setNotification] = useState('');

  // If no selectedRequest is available, you may choose to redirect back or show an error.

  useEffect(() => {
    if (!selectedRequest) {
      // For example, redirect back to the requests page
      navigate('/requests');
    }
  }, [selectedRequest, navigate]);

//   // Fetch locations for the dropdown
//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const response = await fetch('http://172.236.2.18:5050/locations');
//         const data = await response.json();
//         setLocations(data);
//       } catch (error) {
//         console.error('Error fetching locations:', error);
//       }
//     };
//     fetchLocations();
//   }, []);

  // Handle assignment submission
  const handleAssignment = async () => {
    if (!selectedRequest || !returnDate) {
      setNotification('Please fill in all fields');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    const confirmAssignment = window.confirm(
      `Are you sure you want to assign ${selectedRequest.asset_name} to ${selectedRequest.user_name}?`
    );
    if (!confirmAssignment) return;

    const assignment = {
      asset_id: selectedRequest.asset_id,
      assigned_to: selectedRequest.user_name,
      assigned_date: new Date().toISOString().split('T')[0],
      return_date: returnDate,
    };
    console.log(assignment)
    try {
      const response = await fetch('http://172.236.2.18:5050/assignments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment),
      });

      if (response.ok) {
        setNotification('Asset successfully assigned');
        setTimeout(() => setNotification(''), 3000);
        // Navigate back to requests or another page after a successful assignment
        navigate('/requests');
      } else {
        const errorData = await response.json();
        console.error('Failed to assign asset:', errorData);
        setNotification('Failed to assign asset');
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (error) {
        console.error('Error assigning asset:', error);
        setNotification(`Error assigning asset: ${error.message}`);
        setTimeout(() => setNotification(''), 3000);
      }
      
  };

  return (
    <> 
    <div className="wrapper" style={{ display: "flex", gap: "100px"}}>
      <SideBar/>
      <div className="flex justify-center items-center min-h-screen px-4">
    <div className="p-6 max-w-md w-full">
      <h1 className="text-2xl font-semibold mb-4">Assign Asset</h1>

      {notification && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
          {notification}
        </div>
      )}

      {/* Debug log */}
      {console.log('Rendering assignment form with selectedRequest:', selectedRequest)}

      {/* Asset ID */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Asset ID</label>
        <p className="p-2 border rounded bg-gray-100">{selectedRequest?.asset_id}</p>
      </div>

      {/* Asset Name */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Asset Name</label>
        <p className="p-2 border rounded bg-gray-100">{selectedRequest?.asset_name}</p>
      </div>

      {/* Assigned To */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Assigned To (User  ID: {selectedRequest?.user_id})
        </label>
        <p className="p-2 border rounded bg-gray-100">{selectedRequest?.user_name}</p>
      </div>

      {/* Request Status */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Request Status</label>
        <p className="p-2 border rounded bg-gray-100">{selectedRequest?.status}</p>
      </div>

      {/* Requested At */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Requested At</label>
        <p className="p-2 border rounded bg-gray-100">{selectedRequest?.requested_at}</p>
      </div>

      {/* Return Date Input */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Return Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
          onClick={() => navigate(-1)}
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
  </div>
    </>
  );
};

export default AssignRequests;
