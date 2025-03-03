import React from "react";

const Step2 = ({ nextStep, prevStep, handleChange, values }) => {
  return (
    <>
      <div className="vendors">
        <form className="vendorForm step2 row g-3">
          <h3 style={{ textAlign: "center" }}>Contact Person Details</h3>
          <div className="col-md-12">
            <label htmlFor="contactPersonName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="contactPersonName"
              name="contactPersonName"
              placeholder="e.g John Doe"
              onChange={handleChange}
              value={values.contactPersonName}
            />
          </div>

          <div className="col-12">
            <label htmlFor="contactPersonEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="contactPersonEmail"
              name="contactPersonEmail"
              placeholder="e.g Johndoe@gmail.com"
              onChange={handleChange}
              value={values.contactPersonEmail}
            />
          </div>

          <div className="col-md-12">
            <label htmlFor="contactPersonPhone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              className="form-control"
              id="contactPersonPhone"
              name="contactPersonPhone"
              placeholder="Enter phone number"
              onChange={handleChange}
              value={values.contactPersonPhone}
            />
          </div>

          <div className="col-12">
            <button type="button" onClick={nextStep} className="btn btn-primary">
              Continue
            </button>
          </div>
        </form>

        <button className="backButton" onClick={prevStep}>
          Back
        </button>
      </div>
    </>
  );
};

export default Step2;
