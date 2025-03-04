import React from "react";
const Step4 = ({ nextStep, prevStep, handleChange, values }) => {
  return (
    <>
      <div className="vendors">
        <form className="vendorForm step4 row g-3">
          <div className="col-md-12">
            <label htmlFor="inputBankName" className="form-label">
              Bank Name
            </label>
            <input
              type="text"
              className="form-control"
              id="bankName"
              name="bankName"
              placeholder="Enter bank name"
              onChange={handleChange}
              values={values.bankName}
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="inputAccountNumber" className="form-label">
              Account Number
            </label>
            <input
              type="text"
              className="form-control"
              id="accountNumber"
              name="accountNumber"
            placeholder="Enter account number"
            onChange={handleChange}
            value={values.accountNumber}


            />
          </div>
          <div className="col-12">
            <label htmlFor="inputMpesaPaybill" className="form-label">
              MPESA Paybill No
            </label>
            <input
              type="MpesaPaybill"
              className="form-control"
              id="mpesaPaybill"
              name="mpesaPaybill"
              placeholder="e.g 522533"
                onChange={handleChange}
                value={values.mpesaPaybill}
            />
          </div>
          <div className="col-12">
            <label htmlFor="BuyGoodsTill" className="form-label">
              MPESA Buy Goods Till No
            </label>
            <input
  className="form-control"
  id="BuyGoodsTill"
  name="buyGoodsTill" 
  onChange={handleChange}
  value={values.buyGoodsTill} 
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
        <button className="backButton" onClick={prevStep}>
          Back
        </button>
      </div>
    </>
  );
};

export default Step4;
