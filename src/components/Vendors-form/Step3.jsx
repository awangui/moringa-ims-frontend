import React from "react";

const Step3 = ({ nextStep, prevStep, handleChange, values }) => {
return (
    <>
        <div className="vendors">
            <h3 className="page-title">Add Vendor Address</h3>
            <div className="vendorFormSteps">
                <div className="vendorFormStep vendorFormStepActive">
                    Add Vendor Details
                </div>
                <div className="vendorFormStep vendorFormStepActive">
                    Add Contact Person
                </div>
                <div className="vendorFormStep vendorFormStepActive">
                    Add Vendor Adress
                </div>
                <div className="vendorFormStep">Add Payment Details</div>
                <div className="vendorFormStep">Add Vendor Documents</div>
                <div className="vendorFormStep">Confirmation</div>
                <div className="vendorFormStep">Cancel</div>
            </div>
            <div>
                <form className="vendorForm row g-3">
                    <div className="col-md-6">
                        <label htmlFor="inputAddress" className="form-label">
                            Address
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="address"
                            name="address"
                            placeholder="Enter address"
                            onChange={handleChange}
                            value={values.address}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputCountry" className="form-label">
                            Country
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="country"
                            name="country"
                            placeholder="e.g Kenya"
                            onChange={handleChange}
                            value={values.country}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputCounty" className="form-label">
                            County
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="county"
                            name="county"
                            placeholder="E.g Nairobi"
                            onChange={handleChange}
                            value={values.county}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputCity" className="form-label">
                            City
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="city"
                            placeholder="E.g Nairobi"
                            onChange={handleChange}
                            value={values.city}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputPostalCode" className="form-label">
                            Postal Code
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="postalCode"
                            name="postalCode"
                            placeholder="Enter Postal Code"
                            onChange={handleChange}
                            value={values.postalCode}
                        />
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
            </div>
            <br />
            <button onClick={prevStep}>Back</button>
        </div>
    </>
);
};

export default Step3;
