import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BasicTabs from "@/components/features/DisplayDecks/TabSelect";

describe("BasicTabs Component", () => {
  let value;
  const handleTabChange = vi.fn();
  const tabsData = [{ label: "Tab 1" }, { label: "Tab 2" }, { label: "Tab 3" }];

  beforeEach(() => {
    value = 0; // Initialize the value to the first tab index
    vi.clearAllMocks(); // Clear mock calls before each test
  });

  it("renders without crashing", () => {
    render(
      <BasicTabs
        value={value}
        onTabChange={handleTabChange}
        tabsData={tabsData}
      />
    );

    // Check if all tab labels are in the document
    tabsData.forEach((tab) => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it("displays the correct number of tabs", () => {
    render(
      <BasicTabs
        value={value}
        onTabChange={handleTabChange}
        tabsData={tabsData}
      />
    );

    const tabElements = screen.getAllByRole("tab"); // Get all tab elements
    expect(tabElements.length).toBe(tabsData.length); // Check if the number of tabs is correct
  });

  it("calls onTabChange when a tab is clicked", () => {
    render(
      <BasicTabs
        value={value}
        onTabChange={handleTabChange}
        tabsData={tabsData}
      />
    );

    // Simulate clicking on the second tab
    fireEvent.click(screen.getByText("Tab 2"));

    expect(handleTabChange).toHaveBeenCalled(); // Check if the handler was called
    expect(handleTabChange).toHaveBeenCalledWith(expect.anything(), 1); // Check if it was called with the new tab index
  });

  it("shows the correct tab panel when a tab is selected", () => {
    const { rerender } = render(
      <BasicTabs
        value={value}
        onTabChange={handleTabChange}
        tabsData={tabsData}
      />
    );

    // The first tab is selected
    expect(screen.getByText("Tab 1")).toBeVisible(); // Ensure the first tab is visible

    // Change the value to select the second tab
    value = 1;
    rerender(
      <BasicTabs
        value={value}
        onTabChange={handleTabChange}
        tabsData={tabsData}
      />
    );

    expect(screen.getByText("Tab 2")).toBeVisible(); // Ensure the second tab is visible
  });
});
