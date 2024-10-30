import { renderHook } from "@testing-library/react-hooks";
import { describe, it, expect } from "vitest";
import useModal from "@/hooks/useModal";
import ModalContext from "@/context/ModalContext";
import { createContext, useContext } from "react";

describe("useModal", () => {
  it("should throw an error if used outside of ModalProvider", () => {
    const { result } = renderHook(() => useModal());
    expect(result.error).toEqual(
      new Error("useModal must be used within a ModalProvider")
    );
  });

  it("should return context value if used within ModalProvider", () => {
    const mockContextValue = {
      isOpen: true,
      openModal: vi.fn(),
      closeModal: vi.fn(),
    };
    const wrapper = ({ children }) => (
      <ModalContext.Provider value={mockContextValue}>
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useModal(), { wrapper });
    expect(result.current).toBe(mockContextValue);
  });
});
