import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SettingsNavbar from "@/components/features/Profile/SettingsNavbar/SettingsNavbar";

describe("SettingsNavbar Component", () => {
  let setActiveTab;

  beforeEach(() => {
    setActiveTab = vi.fn(); // Mock function for setActiveTab
  });

  test("renders all tabs correctly", () => {
    render(<SettingsNavbar activeTab="Streak" setActiveTab={setActiveTab} />);

    const tabs = screen.getAllByRole("listitem");
    expect(tabs).toHaveLength(4); // Ensure there are 4 tabs

    // Check if all tabs are rendered
    expect(screen.getByText("Streak")).toBeInTheDocument();
    expect(screen.getByText("View Score History")).toBeInTheDocument();
    expect(screen.getByText("PDF Uploads")).toBeInTheDocument();
    expect(screen.getByText("General Settings")).toBeInTheDocument();
  });

  test("highlights the active tab", () => {
    render(<SettingsNavbar activeTab="Streak" setActiveTab={setActiveTab} />);

    const activeTab = screen.getByText("Streak");
    expect(activeTab).toHaveClass("active"); // Check if the active tab has the class 'active'
  });

  test("calls setActiveTab when a tab is clicked", () => {
    render(<SettingsNavbar activeTab="Streak" setActiveTab={setActiveTab} />);

    const viewScoreHistoryTab = screen.getByText("View Score History");
    fireEvent.click(viewScoreHistoryTab);

    expect(setActiveTab).toHaveBeenCalledTimes(1); // Ensure the function is called once
    expect(setActiveTab).toHaveBeenCalledWith("View Score History"); // Check it was called with the correct tab
  });

  test("does not highlight inactive tabs", () => {
    render(<SettingsNavbar activeTab="Streak" setActiveTab={setActiveTab} />);

    const pdfUploadsTab = screen.getByText("PDF Uploads");
    expect(pdfUploadsTab).not.toHaveClass("active"); // Check that inactive tabs do not have the 'active' class
  });
});
