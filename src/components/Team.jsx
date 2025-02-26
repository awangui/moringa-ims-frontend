import React, { useState } from 'react';
import '../App.css'; // Ensure your custom styles are included.

const Team = () => {
  const teamMembers = [
    {
      name: 'Stephanie Mwoya',
      email: 'stephaniemwoya@gmail.com',
      phone: '+254712598987',
      role: 'superAdmin',
    },
    // Add more members as needed
  ];

  const [showMenuIndex, setShowMenuIndex] = useState(null);

  const handleMenuClick = (index) => {
    setShowMenuIndex(showMenuIndex === index ? null : index);
  };

  const handleEdit = (member) => {
    // Handle edit action
    console.log('Edit:', member);
  };

  const handleDelete = (member) => {
    // Handle delete action
    console.log('Delete:', member);
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Team</h2>
          <button className="btn btn-primary">Add User</button>
        </div>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search"
        />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member, index) => (
              <tr key={index}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.role}</td>
                <td>
                  <div className="dropdown">
                    <button
                      className="btn btn-link"
                      onClick={() => handleMenuClick(index)}
                    >
                      &#x22EE; {/* Three dots */}
                    </button>
                    {showMenuIndex === index && (
                      <div className="dropdown-menu">
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(member)}
                        >
                          Edit
                        </button>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDelete(member)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-between align-items-center">
          <span>Showing 1 to 10 of 57 entries</span>
          <nav>
            <ul className="pagination">
              <li className="page-item"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              {/* Add more pagination as needed */}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Team;