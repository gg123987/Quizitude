import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

function handleClick(event, navigate, path) {
  event.preventDefault();
  navigate(path); // Navigate to the specified path
}

export default function IconBreadcrumbs({ parentPage = "", page = "" }) {
  const navigate = useNavigate(); // Initialize navigate function

  parentPage = parentPage.replace("/", "");
  page = page.replace("/", "");

  return (
    <div role="presentation">
      {parentPage === "" ? (
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
            <HomeIcon sx={{ mr: 0.5, ml: 4 }} fontSize="small" />
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
            <HomeIcon sx={{ mr: 0.5, ml: 4 }} fontSize="small" />
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
