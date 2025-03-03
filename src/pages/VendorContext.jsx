import React, { createContext, useState, useEffect } from "react";

export const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("http://172.236.2.18:5555/vendors/");
        if (!response.ok) throw new Error("Failed to fetch vendors");
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  return (
    <VendorContext.Provider value={{ vendors, setVendors }}>
      {children}
    </VendorContext.Provider>
  );
};
