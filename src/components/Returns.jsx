import React, { useState } from 'react';
import '../App.css';

const Returns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [fixedAssetFilter, setFixedAssetFilter] = useState('');
  const [dateReturned, setDateReturned] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('');
  const [quantityToReturn, setQuantityToReturn] = useState('');
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Sample data for the table
  const returnsData = [
    { item: 'Projector', type: 'Fixed Asset', quantity: 26, location: 'Student Lab', dateReturned: '22/02/2025', approvedBy: '01/03/2025' },
    { item: 'Laptop', type: 'Fixed Asset', quantity: 15, location: 'Room 101', dateReturned: '20/02/2025', approvedBy: '02/03/2025' },
    { item: 'Marker Pen', type: 'Consumable', quantity: 50, location: 'Room 102', dateReturned: '21/02/2025', approvedBy: '03/03/2025' },
    { item: 'Charger', type: 'Fixed Asset', quantity: 10, location: 'Kitchen', dateReturned: '19/02/2025', approvedBy: '04/03/2025' },
    { item: 'Whiteboard', type: 'Fixed Asset', quantity: 5, location: 'Room 401', dateReturned: '23/02/2025', approvedBy: '05/03/2025' },
  ];

  const handleReturn = () => {
    setShowSuccessMessage(true);
    setShowReturnPopup(false);
    setQuantityToReturn('');
  };

  const handleApplyFilters = () => {
    setShowFilterPopup(true);
    setShowReturnPopup(true);  // Show quantity return popup
  };

  const filteredReturns = returnsData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="returns-container">
      <h1>Returns</h1>
      <input 
        type="text" 
        placeholder="Search" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="search-input"
      />

      <div className="table-and-filter">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>TYPE</th>
                <th>QUANTITY</th>
                <th>LOCATION</th>
                <th>DATE RETURNED</th>
                <th>APPROVED BY</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((returnItem, index) => (
                <tr key={index}>
                  <td>{returnItem.item}</td>
                  <td>{returnItem.type}</td>
                  <td>{returnItem.quantity}</td>
                  <td>{returnItem.location}</td>
                  <td>{returnItem.dateReturned}</td>
                  <td>{returnItem.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`filter-section ${showFilterPopup ? 'show' : ''}`}>
          <button onClick={() => setShowFilterPopup(!showFilterPopup)} className="toggle-filter">
            {showFilterPopup ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showFilterPopup && (
            <div className="filter-popup">
              <h2>Filter</h2>
              <div className="filter-item">
                <label>Location</label>
                <input 
                  type="text" 
                  value={locationFilter} 
                  onChange={(e) => setLocationFilter(e.target.value)} 
                  placeholder="Enter location (e.g., Student Lab, Room 101)" 
                />
              </div>

              <div className="filter-item">
                <label>Fixed Assets</label>
                <input 
                  type="text" 
                  value={fixedAssetFilter} 
                  onChange={(e) => setFixedAssetFilter(e.target.value)} 
                  placeholder="Enter asset (e.g., Projector, Laptop)" 
                />
              </div>

              <div className="filter-item">
                <label>Date Returned</label>
                <input 
                  type="date" 
                  value={dateReturned} 
                  onChange={(e) => setDateReturned(e.target.value)} 
                />
              </div>

              <h3>Approval</h3>
              <select value={approvalFilter} onChange={(e) => setApprovalFilter(e.target.value)}>
                <option value="">Select</option>
                <option value="Approved">Approved</option>
                <option value="Not Approved">Not Approved</option>
              </select>

              <h3>Generate Report</h3>
              <select>
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </select>

              <div className="filter-buttons">
                <button className="apply-button" onClick={handleApplyFilters}>Apply</button>
                <button onClick={() => setShowFilterPopup(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <button className="download-report">Download Report</button>
      </div>

      {showReturnPopup && (
        <div className="modal">
          <div className="modal-content">
            <h3 style={{ color: 'orange' }}>Specify Quantity to be Returned</h3>
            <p>Quantity borrowed: 200</p>
            <label htmlFor="quantityInput" className="input-label">Enter quantity:</label>
            <input 
              id="quantityInput"
              type="number" 
              value={quantityToReturn} 
              onChange={(e) => setQuantityToReturn(e.target.value)} 
              placeholder="Enter quantity" 
            />
            <div className="modal-buttons">
              <button style={{ backgroundColor: '#0F013A', color: 'white' }} onClick={handleReturn}>Return</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="modal-success">
          <div className="modal-content">
            <h3>Items Returned Successfully!</h3>
            <button onClick={() => setShowSuccessMessage(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="entries-info">
          Showing {Math.min(entriesPerPage, filteredReturns.length)} of {returnsData.length} entries
        </span>
        <div className="d-flex align-items-center">
          <div className="pagination">
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
            <button className={`page-link ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
            <button className={`page-link ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</button>
            <button className={`page-link ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>3</button>
            <button className={`page-link ${currentPage === 4 ? 'active' : ''}`} onClick={() => setCurrentPage(4)}>4</button>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * entriesPerPage >= returnsData.length}>&gt;</button>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center mt-3 justify-content-start">
        <label htmlFor="entriesPerPage" style={{ marginRight: '10px' }}>Entries per page:</label>
        <select
          id="entriesPerPage"
          className="form-control entries-dropdown"
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>
    </div>
  );
};

export default Returns;