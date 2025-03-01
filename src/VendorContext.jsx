import React, { createContext, useState } from "react";

export const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]); // ✅ Initialize empty array

  const addVendor = (newVendor) => {
    setVendors((prevVendors) => {
      console.log("Previous Vendors:", prevVendors); // ✅ Debugging
      console.log("New Vendor:", newVendor);
      return [...prevVendors, newVendor]; // ✅ Append instead of overwriting
    });
  };

  return (
    <VendorContext.Provider value={{ vendors, addVendor }}>
      {children}
    </VendorContext.Provider>
  );
};
