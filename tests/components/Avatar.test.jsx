import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Avatar from "@/components/features/Profile/Avatar/Avatar";
import useAvatar from "@/hooks/useAvatar";

// Mock the useAvatar hook
vi.mock("@/hooks/useAvatar");

describe("Avatar Component", () => {
  const userId = "123";
  const url = "https://example.com/avatar.jpg";
  const size = 100;
  const onUploadMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the Avatar component", () => {
    useAvatar.mockReturnValue({
      avatarUrl: null,
      loading: false,
      uploading: false,
      handleUpload: vi.fn(),
    });

    render(
      <Avatar userId={userId} url={url} size={size} onUpload={onUploadMock} />
    );
    expect(screen.getByText("Click here to set up avatar")).toBeInTheDocument();
  });

  test("displays loading state", () => {
    useAvatar.mockReturnValue({
      avatarUrl: null,
      loading: true,
      uploading: false,
      handleUpload: vi.fn(),
    });

    render(
      <Avatar userId={userId} url={url} size={size} onUpload={onUploadMock} />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays avatar image when url is provided", () => {
    useAvatar.mockReturnValue({
      avatarUrl: url,
      loading: false,
      uploading: false,
      handleUpload: vi.fn(),
    });

    render(
      <Avatar userId={userId} url={url} size={size} onUpload={onUploadMock} />
    );
    const avatarImage = screen.getByAltText("Avatar");
    expect(avatarImage).toHaveAttribute("src", url);
    expect(avatarImage).toHaveStyle(`height: ${size}px`);
    expect(avatarImage).toHaveStyle(`width: ${size}px`);
  });

  test("displays no image fallback when no avatar url is provided", () => {
    useAvatar.mockReturnValue({
      avatarUrl: null,
      loading: false,
      uploading: false,
      handleUpload: vi.fn(),
    });

    render(
      <Avatar userId={userId} url={null} size={size} onUpload={onUploadMock} />
    );
    expect(screen.getByText("Click here to set up avatar")).toBeInTheDocument();
  });

  test("calls handleUpload when a file is selected", () => {
    const file = new File(["(⌐□_□)"], "avatar.png", { type: "image/png" });
    useAvatar.mockReturnValue({
      avatarUrl: null,
      loading: false,
      uploading: false,
      handleUpload: vi.fn(),
    });

    render(
      <Avatar userId={userId} url={null} size={size} onUpload={onUploadMock} />
    );

    // Simulate clicking on the avatar to trigger the file input
    const avatarContainer = screen.getByText("Click here to set up avatar");
    fireEvent.click(avatarContainer);

    // Simulate file selection
    const fileInput = screen.getByLabelText("Avatar Upload Input");
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(useAvatar().handleUpload).toHaveBeenCalledWith(file);
  });
});
