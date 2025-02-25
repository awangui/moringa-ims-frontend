import React from 'react';
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

  return (
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
                <button className="btn btn-link">Edit</button>
                <button className="btn btn-link text-danger">Delete</button>
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
  );
};

export default Team;