import React from "react";

const Step5 = ({ nextStep, prevStep, handleChange, values }) => {
  return (
    <>
      <div className="vendors">
        <form className="vendorForm step5 row g-3"> <h3 style={{ textAlign: "center" }}></h3>
          <div className="col-md-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="vendorDocumentName"
              name="vendorDocumentName"
              placeholder="e.g John Doe"
            onChange={handleChange}
            values={values.vendorDocumentName}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputType" className="form-label">
              Type
            </label>
            <input
              type="text"
              className="form-control"
              id="vendorDocumentType"
              name="vendorDocumentType"
              placeholder="Enter type of document"
              onChange={handleChange}
              value={values.vendorDocumentType}
            />
          </div>

          <div className="col-md-12">
            <label htmlFor="inputUrl" className="form-label">
              URL
            </label>
            <input
              type="text"
              className="form-control"
              id="vendorDocumentUrl"
              name="vendorDocumentUrl"
              placeholder="Enter URL"
              onChange={handleChange}
              value={values.vendorDocumentUrl}
            />
          </div>

          <div className="col-md-12">
            <button className="btn btn-primary">Upload Document</button>
          </div>
          <div className="col-12">
            <button
              type="submit"
              onClick={nextStep}
              className="btn btn-primary"
            >
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

export default Step5;
