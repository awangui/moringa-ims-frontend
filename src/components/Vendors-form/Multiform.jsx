import React, { useState, useContext } from "react";
import { VendorContext } from "../../pages/VendorContext";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Confirmation from "./Confirmation";

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

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  return step === 6 ? (
    <Confirmation prevStep={prevStep} values={formData} />
  ) : (
    React.createElement([Step1, Step2, Step3, Step4, Step5][step - 1], {
      nextStep,
      prevStep,
      handleChange,
      values: formData,
    })
  );
};

export default MultiStepForm;