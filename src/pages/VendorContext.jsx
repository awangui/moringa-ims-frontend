import React, { createContext, useState } from "react";

export const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]); 

  const addVendor = (newVendor) => {
    setVendors((prevVendors) => {
      console.log("Previous Vendors:", prevVendors); 
      console.log("New Vendor:", newVendor);
      return [...prevVendors, newVendor]; 
    });
  };

  return (
    <VendorContext.Provider value={{ vendors, addVendor }}>
      {children}
    </VendorContext.Provider>
  );
};
