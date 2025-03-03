import React from "react";
import { useNavigate } from "react-router-dom";

const Step1 = ({ nextStep, handleChange, values }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/vendors");
  };


  return (
    <div className="vendors">     
      <form className="vendorForm row g-3">
        <div className="col-md-6">
          <label htmlFor="inputName" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="e.g John Doe"
            onChange={handleChange}
            value={values.name}
          />
        </div>
        <div className="col-6">
          <label htmlFor="inputEmail" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="e.g Johndoe@gmail.com"
            onChange={handleChange}
            value={values.email}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPhone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            placeholder="Enter phone number"
            onChange={handleChange}
            value={values.phone}
          />
        </div>
        <div className="col-6">
          <label htmlFor="inputBio" className="form-label">
            Bio
          </label>
          <textarea
            className="form-control"
            id="bio"
            name="bio"
            rows="5"
            onChange={handleChange}
            value={values.bio}
          ></textarea>
        </div>
        <div className="col-md-6">
          <label htmlFor="inputKRAPin" className="form-label">
            KRA Pin
          </label>
          <input
            type="text"
            className="form-control"
            id="kraPin"
            name="kraPin"
            placeholder="Enter KRA Pin"
            onChange={handleChange}
            value={values.kraPin}
          />
        </div>

        <div className="col-md-6">
          <input
            className="form-check-input"
            type="checkbox"
            id="status"
            name="status"
            onChange={handleChange}
            checked={values.status}
          />
          <label className="form-check-label" htmlFor="status">
            Activate
          </label>
        </div>
        <button type="button" onClick={nextStep} className="btn btn-primary">
          Continue
        </button>
      </form>
      <button className="backButton" onClick={handleBackClick}>Back</button>
    </div>
  );
};

export default Step1;
