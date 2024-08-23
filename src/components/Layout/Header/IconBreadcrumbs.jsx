import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@/assets/home.svg";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

function handleClick(event, navigate, path) {
  event.preventDefault();
  navigate(path); // Navigate to the specified path
}

import PropTypes from "prop-types";

export default function IconBreadcrumbs({ parentPage = "", page = "" }) {
  const navigate = useNavigate();

  parentPage = parentPage.replace("/", "");
  page = page.replace("/", "");

  return (
    <div role="presentation">
      {parentPage === "" ? (
        <Breadcrumbs separator={<ChevronRightOutlinedIcon fontSize="small" color="disabled" />} aria-label="breadcrumb">
          <span
            onClick={(event) => handleClick(event, navigate, "/")}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            <Box sx={{ mr: 0.5, ml: 4, }} >
              <img src={HomeIcon} alt="home" className="home" width={"15px"} />
            </Box>
          </span>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="#3538CD"
            fontFamily={"Inter"}
            fontWeight={500}
          >
            {page === "decks"
              ? "All Decks"
              : page === "categories"
              ? "Categories"
              : ""}
          </Typography>
        </Breadcrumbs>
      ) : (
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <span
            onClick={(event) => handleClick(event, navigate, "/")}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            <Box sx={{ mr: 0.5, ml: 4, }} >
              <img src={HomeIcon} alt="home" className="home" width={"15px"} />
            </Box>
          </span>
          <span
            onClick={(event) => handleClick(event, navigate, `/${parentPage}`)}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            {parentPage === "decks"
              ? "All Decks"
              : parentPage === "categories"
              ? "Categories"
              : ""}
          </span>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="#3538CD"
            fontFamily={"Inter"}
            fontWeight={500}
          >
            {page}
          </Typography>
        </Breadcrumbs>
      )}
    </div>
  );
}

IconBreadcrumbs.propTypes = {
  parentPage: PropTypes.string,
  page: PropTypes.string,
};
