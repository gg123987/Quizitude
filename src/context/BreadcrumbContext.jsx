import React, { createContext, useContext, useState } from "react";

// Create a context for the breadcrumb data
const BreadcrumbContext = createContext();

export function BreadcrumbProvider({ children }) {
  // State to hold breadcrumb data with initial values
  const [breadcrumbData, setBreadcrumbData] = useState({
    categoryId: null,
    deckId: null,
  });

  return (
    // Provide the breadcrumb data and setter function to the children
    <BreadcrumbContext.Provider value={{ breadcrumbData, setBreadcrumbData }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

/**
 * Custom hook to use the breadcrumb context.
 *
 * @returns {Object} The breadcrumb context value, including breadcrumb data and the setter function.
 */
export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}
