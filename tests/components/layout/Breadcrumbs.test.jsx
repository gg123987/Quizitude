import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import IconBreadcrumbs from "@/components/Layout/Header/IconBreadcrumbs";
import * as DeckHook from "@/hooks/useDeck";
import * as CategoryHook from "@/hooks/useCategory";

vi.mock("@/hooks/useDeck");
vi.mock("@/hooks/useCategory");

describe("IconBreadcrumbs", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders static breadcrumbs correctly", () => {
    // Mocking the hooks to return initial states
    DeckHook.default.mockReturnValue({ deck: null, loading: false });
    CategoryHook.default.mockReturnValue({ category: null, loading: false });

    render(
      <MemoryRouter initialEntries={["/decks/1"]}>
        <IconBreadcrumbs />
      </MemoryRouter>
    );

    const allDecksElements = screen.getAllByText("All Decks");
    expect(allDecksElements.length).toBeGreaterThan(0); // Check that it exists
    expect(allDecksElements[0]).toBeInTheDocument(); // Ensure at least one is in the document
  });

  it("renders dynamic breadcrumbs with deck name", () => {
    // Mocking the hooks to return specific deck data
    DeckHook.default.mockReturnValue({
      deck: { name: "Sample Deck" },
      loading: false,
    });
    CategoryHook.default.mockReturnValue({ category: null, loading: false });

    render(
      <MemoryRouter initialEntries={["/decks/123"]}>
        <IconBreadcrumbs />
      </MemoryRouter>
    );

    expect(screen.getByText("All Decks")).toBeInTheDocument();
    expect(screen.getByText("Sample Deck")).toBeInTheDocument();
  });

  it("renders dynamic breadcrumbs with category name", () => {
    // Mocking the hooks to return specific category data
    DeckHook.default.mockReturnValue({ deck: null, loading: false });
    CategoryHook.default.mockReturnValue({
      category: { name: "Sample Category" },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/categories/456"]}>
        <IconBreadcrumbs />
      </MemoryRouter>
    );

    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Sample Category")).toBeInTheDocument();
  });

  it("displays loading state while fetching data", () => {
    // Mocking the hooks to indicate loading state
    DeckHook.default.mockReturnValue({ deck: null, loading: true });
    CategoryHook.default.mockReturnValue({ category: null, loading: true });

    render(
      <MemoryRouter initialEntries={["/decks/1"]}>
        <IconBreadcrumbs />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("does not render breadcrumbs for empty pathnames", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <IconBreadcrumbs />
      </MemoryRouter>
    );

    expect(screen.queryByText("All Decks")).not.toBeInTheDocument();
    expect(screen.queryByText("Categories")).not.toBeInTheDocument();
  });
});
