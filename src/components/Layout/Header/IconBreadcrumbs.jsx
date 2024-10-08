import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@/assets/home.svg";
import { Link, useLocation } from "react-router-dom";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import useDeck from "@/hooks/useDeck";
import useCategory from "@/hooks/useCategory";

// Static mapping for fixed segments
const staticMappings = {
  flashcards: "Flashcards",
  decks: "All Decks",
  categories: "Categories",
  scores: "Scores",
  settings: "Settings",
  notifications: "Notifications",
  // Add other static mappings as needed
};

export default function IconBreadcrumbs() {
  const location = useLocation();

  // Get the current pathname and split it into segments
  const pathnames = location.pathname.split("/").filter((x) => x);

  // If pathnames are empty, return null
  if (pathnames.length === 0) {
    return null;
  }

  // Extract the type and ID from pathnames
  const [type, id] = pathnames;

  // Fetch the deck and category details based on type
  const { deck, loading: deckLoading } = useDeck(type === "decks" ? id : null);
  const { category, loading: categoryLoading } = useCategory(
    type === "categories" ? id : null
  );

  // Handle loading states
  if (deckLoading || categoryLoading) {
    return <div>Loading...</div>;
  }

  // Function to get the name from an ID or static mapping
  const getNameFromId = (type, id) => {
    if (type === "decks" && deck) return deck.name;
    if (type === "categories" && category) return category.name;
    return staticMappings[type] || id;
  };

  // Map pathnames to display names
  const formattedPathnames = pathnames.map((segment, index) => {
    if (index === 0) {
      // First segment, use static mapping
      return staticMappings[segment] || segment;
    } else if (index === 1) {
      // Second segment, use dynamic data based on type
      return getNameFromId(pathnames[0], segment);
    }
    return segment;
  });

  return (
    <Breadcrumbs
      separator={<ChevronRightOutlinedIcon fontSize="small" color="disabled" />}
      aria-label="breadcrumb"
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        flexWrap: "nowrap",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img src={HomeIcon} alt="home" className="home" width={"15px"} />
      </Link>

      {pathnames.map((segment, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return (
          <Link
            key={to}
            to={to}
            style={{
              textDecoration: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography color="#3538CD" fontFamily={"Inter"} fontWeight={500}>
              {formattedPathnames[index]}{" "}
            </Typography>
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
