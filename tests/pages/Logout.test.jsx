import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Logout from "@/pages/Auth/Logout";

describe("Logout Component", () => {
  it("renders CircularProgress", () => {
    const { getByRole } = render(<Logout />);
    expect(getByRole("progressbar")).toBeInTheDocument();
  });
});
