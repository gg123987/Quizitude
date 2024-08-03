import * as React from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";

function handleClick(event) {
  event.preventDefault();
}

export default function IconBreadcrumbs({ parentPage = "", page = "" }) {
  parentPage = parentPage.replace("/", "");
  page = page.replace("/", "");

  return (
    <div role="presentation">
      {parentPage === "" ? (
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link href="/" passHref>
            <span
              onClick={handleClick}
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
          </Link>
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
          <Link href="/" passHref>
            <span
              onClick={handleClick}
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
          </Link>
          <Link href={`/${parentPage}`} passHref>
            <span
              onClick={handleClick}
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
          </Link>
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