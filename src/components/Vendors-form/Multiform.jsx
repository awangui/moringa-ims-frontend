import React, { useState, useContext } from "react";
import { VendorContext } from "../../pages/VendorContext";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Confirmation from "./Confirmation";
import Navigation from "../Navigation";

const stepTitles = {
  1: "Add Vendor Details",
  2: "Add Contact Person",
  3: "Add Vendor Address",
  4: "Add Payment Details",
  5: "Add Vendor Documents",
  6: "Confirmation",
};

const MultiStepForm = () => {
  const { addVendor } = useContext(VendorContext);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
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

  const Cancel = () => {
    window.location.href = "/vendors";
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Navigation>
    <div className="multiStepForm">
      {/* Page Title - Dynamically changes based on step */}
      <h3 className="page-title">{stepTitles[step]}</h3>

      {/* Navigation Bar */}
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
          Add Vendor Documents
        </button>
        <button className={`vendorFormStep ${step === 6 ? "vendorFormStepActive" : ""}`} onClick={() => goToStep(6)}>
          Confirmation
        </button>
        <button className="vendorFormStep" onClick={Cancel}>
          Cancel
        </button>
      </div>

      {/* Render Step Component */}
      {step === 6 ? (
        <Confirmation prevStep={prevStep} values={formData} />
      ) : (
        React.createElement([Step1, Step2, Step3, Step4, Step5][step - 1], {
          nextStep,
          prevStep,
          handleChange,
          values: formData,
        })
      )}
    </div>
    </Navigation>
  );
};

export default MultiStepForm;
