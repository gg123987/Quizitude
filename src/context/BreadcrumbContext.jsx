import React, { createContext, useContext, useState } from "react";

const BreadcrumbContext = createContext();

export function BreadcrumbProvider({ children }) {
  const [breadcrumbData, setBreadcrumbData] = useState({
    categoryId: null,
    deckId: null,
  });

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbData, setBreadcrumbData }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}
