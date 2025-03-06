import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Confirmation from "./Confirmation";
import Navigation from "../Navigation";
import { useNavigate } from "react-router-dom";
const stepTitles = {
  1: "Add Vendor Details",
  2: "Add Contact Person",
  3: "Add Vendor Address",
  4: "Add Payment Details",
  5: "Confirmation",
};

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
    status: false,
    kraPin: "",
    address: "",
    city: "",
    country: "",
    county: "",
    postalCode: "",
    bankName: "",
    accountNumber: "",
    mpesaPaybill: "",
    buyGoodsTill: "",
  });

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);
  const goToStep = (stepNumber) => setStep(stepNumber);

  const navigate = useNavigate();

  const Cancel = () => {
    navigate("/vendors");  
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  

  return (
    <Navigation>
      <div className="multiStepForm">
        <h3 className="page-title">{stepTitles[step]}</h3>

        <div className="vendorFormSteps">
          <button className={`vendorFormStep ${step === 1 ? "vendorFormStepActive" : ""}`} onClick={() => goToStep(1)}>
            Add Vendor Details
          </button>
          <button className={`vendorFormStep ${step === 2 ? "vendorFormStepActive" : ""}`} onClick={() => goToStep(2)}>
            Add Contact Person
          </button>
          <button className={`vendorFormStep ${step === 3 ? "vendorFormStepActive" : ""}`} onClick={() => goToStep(3)}>
            Add Vendor Address
          </button>
          <button className={`vendorFormStep ${step === 4 ? "vendorFormStepActive" : ""}`} onClick={() => goToStep(4)}>
            Add Payment Details
          </button>
          <button className={`vendorFormStep ${step === 5 ? "vendorFormStepActive" : ""}`} onClick={() => goToStep(5)}>
            Confirmation
          </button>
          <button className="vendorFormStep" onClick={Cancel}>
            Cancel
          </button>
        </div>

        {/* Render Step Component */}
{step === 5 ? (
  <Confirmation prevStep={prevStep} values={values} />
) : (
  (() => {
    const StepComponent = [Step1, Step2, Step3, Step4][step - 1];
    return <StepComponent nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={values} />;
  })()
)}

      </div>
    </Navigation>
  );
};

export default MultiStepForm;
