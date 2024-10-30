import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { AuthContext } from "@/context/AuthContext";
import useAuth from "@/hooks/useAuth";
import React from "react";

describe("useAuth", () => {
  it("should use AuthContext", () => {
    const mockAuthContextValue = { user: { name: "John Doe" } };
    const wrapper = ({ children }) => (
      <AuthContext.Provider value={mockAuthContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toEqual(mockAuthContextValue);
  });
});
