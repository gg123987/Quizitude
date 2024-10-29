import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Account from "@/pages/Settings/Profile";
import useAuth from "@/hooks/useAuth";
import useFetchUser from "@/hooks/useFetchUser";
import { supabase } from "@/utils/supabase";
import { useOutletContext } from "react-router-dom";

// Mock the necessary hooks and components
vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useFetchUser");
vi.mock("@/utils/supabase", () => ({
  supabase: {
    auth: {
      updateUser: vi.fn(),
    },
    from: vi.fn(() => ({
      upsert: vi.fn(),
    })),
  },
}));

// Correctly mock the useAvatar hook to return an object
vi.mock("@/hooks/useAvatar", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    avatarUrl: "http://example.com/avatar.jpg",
    loading: false,
    uploading: false,
    handleUpload: vi.fn(),
  })),
}));

vi.mock("react-router-dom", () => ({
  useOutletContext: vi.fn(), // Mock useOutletContext
}));

const mockUser = {
  id: "user-1",
  app_metadata: {
    provider: "google",
  },
};

const mockSession = {
  user: mockUser,
};

describe("Account Component", () => {
  beforeEach(() => {
    // Mock the user fetching hook
    useAuth.mockReturnValue({
      user: mockUser,
      userDetails: { last_session: null },
    });
    useFetchUser.mockReturnValue({
      data: {
        full_name: "John Doe",
        email: "john@example.com",
        avatar_url: "http://example.com/avatar.jpg",
      },
      loading: false,
      error: null,
    });

    // Mock useOutletContext to return the userId
    useOutletContext.mockReturnValue({ userId: mockUser.id });

    // Reset supabase mocks
    supabase.auth.updateUser.mockResolvedValue({ user: mockUser, error: null });
    supabase.from().upsert.mockResolvedValue({ error: null });
  });

  test("renders Account component", () => {
    render(<Account session={mockSession} />);

    // Check if the component renders the user's full name and email
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });
});
