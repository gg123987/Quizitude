import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GeneralSettings from "@/components/features/Profile/GeneralSettings/GeneralSettings";
import useAuth from "@/hooks/useAuth";
import useAvatar from "@/hooks/useAvatar";
import { deleteUser } from "@/services/userService";

vi.mock("@/hooks/useAuth");
vi.mock("@/services/userService");
vi.mock("@/hooks/useAvatar");

describe("GeneralSettings Component", () => {
  const mockUser = {
    userID: "123",
    email: "test@example.com",
    user_metadata: {
      tempFullName: "John Doe",
    },
    tempEmail: "test@example.com",
  };

  const setEmailMock = vi.fn();
  const setFullNameMock = vi.fn();
  const setAvatarUrlMock = vi.fn();
  const updateProfileMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      passwordReset: vi.fn().mockResolvedValue({}),
    });
    deleteUser.mockResolvedValue({});

    // Mock the return value of useAvatar
    useAvatar.mockReturnValue({
      avatarUrl: null,
      loading: false,
      uploading: false,
      handleUpload: vi.fn(), // Mock handleUpload function
    });

    window.alert = vi.fn();
  });

  test("renders the GeneralSettings component", () => {
    render(
      <GeneralSettings
        user={mockUser}
        setEmail={setEmailMock}
        setFullName={setFullNameMock}
        avatar_url={null}
        setAvatarUrl={setAvatarUrlMock}
        updateProfile={updateProfileMock}
        isGoogleUser={false}
      />
    );

    expect(screen.getByText("Upgrade your Account")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("full-name-input")).toBeInTheDocument();
    expect(screen.getByTestId("save-button")).toBeInTheDocument();
    expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    expect(screen.getByText("Update your profile photo")).toBeInTheDocument();
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(screen.getByText("Deactivate your account")).toBeInTheDocument();
  });

  test("handles email change", () => {
    render(
      <GeneralSettings
        user={mockUser}
        setEmail={setEmailMock}
        setFullName={setFullNameMock}
        avatar_url={null}
        setAvatarUrl={setAvatarUrlMock}
        updateProfile={updateProfileMock}
        isGoogleUser={false}
      />
    );

    const emailInput = screen.getByTestId("email-input");
    fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });

    expect(setEmailMock).toHaveBeenCalledWith("newemail@example.com");
  });

  test("handles full name change", () => {
    render(
      <GeneralSettings
        user={mockUser}
        setEmail={setEmailMock}
        setFullName={setFullNameMock}
        avatar_url={null}
        setAvatarUrl={setAvatarUrlMock}
        updateProfile={updateProfileMock}
        isGoogleUser={false}
      />
    );

    const fullNameInput = screen.getByTestId("full-name-input");
    fireEvent.change(fullNameInput, { target: { value: "Jane Doe" } });

    expect(setFullNameMock).toHaveBeenCalledWith("Jane Doe");
  });

  test("calls updateProfile on save changes", async () => {
    render(
      <GeneralSettings
        user={mockUser}
        setEmail={setEmailMock}
        setFullName={setFullNameMock}
        avatar_url={null}
        setAvatarUrl={setAvatarUrlMock}
        updateProfile={updateProfileMock}
        isGoogleUser={false}
      />
    );

    const saveButton = screen.getByTestId("save-button");
    fireEvent.click(saveButton);

    await waitFor(() => expect(updateProfileMock).toHaveBeenCalled());
  });

  test("handles password reset", async () => {
    render(
      <GeneralSettings
        user={mockUser}
        setEmail={setEmailMock}
        setFullName={setFullNameMock}
        avatar_url={null}
        setAvatarUrl={setAvatarUrlMock}
        updateProfile={updateProfileMock}
        isGoogleUser={false}
      />
    );

    const resetButton = screen.getByTestId("reset-password-button");
    fireEvent.click(resetButton);

    // Wait for the passwordReset function to be called
    await waitFor(() => {
      expect(useAuth().passwordReset).toHaveBeenCalledWith(mockUser.tempEmail);
      expect(window.alert).toHaveBeenCalledWith("Password reset email sent");
      // Ensure that the loading indicator is removed after the action
      expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();
    });
  });

  test("handles account deletion", async () => {
    render(
      <GeneralSettings
        user={mockUser}
        setEmail={setEmailMock}
        setFullName={setFullNameMock}
        avatar_url={null}
        setAvatarUrl={setAvatarUrlMock}
        updateProfile={updateProfileMock}
        isGoogleUser={false}
      />
    );

    const deleteButton = screen.getByTestId("delete-account-button");
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getByText("Yes, Delete");
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith(mockUser.userID);
      expect(window.alert).toHaveBeenCalledWith("Account successfully deleted");
    });
  });

  test("displays pro version popup when upgrade clicked", () => {
    render(
      <GeneralSettings
        user={mockUser}
        setEmail={setEmailMock}
        setFullName={setFullNameMock}
        avatar_url={null}
        setAvatarUrl={setAvatarUrlMock}
        updateProfile={updateProfileMock}
        isGoogleUser={false}
      />
    );

    const upgradeButton = screen.getByTestId("upgrade-button");
    fireEvent.click(upgradeButton);

    expect(screen.getByText("Upgrade to Pro Version")).toBeInTheDocument();
  });
});
