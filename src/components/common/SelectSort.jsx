import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled } from "@mui/material/styles";

const CssTextField = styled(TextField)({
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#E0E3E7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#E0E3E7",
    },
  },
  "& .MuiSelect-select": {
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#F2F4F7",
  },
});

const defaultSort = [
  {
    value: "Recently Created",
    label: "Recently Created",
  },
  {
    value: "Last Modified",
    label: "Last Modified",
  },
  {
    value: "Alphabetical",
    label: "Alphabetical",
  },
  {
    value: "Oldest",
    label: "Oldest",
  },
];

import PropTypes from "prop-types";

export default function SelectSort({
  sortOptions = defaultSort,
  onSortChange,
  width = "19ch",
}) {
  SelectSort.propTypes = {
    sortOptions: PropTypes.array,
    onSortChange: PropTypes.func.isRequired,
    width: PropTypes.string,
  };

  const handleChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: width },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <CssTextField
          id="outlined-select-sort"
          select
          label=""
          defaultValue={sortOptions[0].value}
          size="small"
          variant="outlined"
          SelectProps={{
            IconComponent: KeyboardArrowDownIcon,
          }}
          onChange={handleChange}
        >
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#344054",
                "&:hover": {
                  backgroundColor: "#F9FAFB",
                },
                "&.Mui-selected": {
                  backgroundColor: "#F2F4F7",
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </CssTextField>
      </div>
    </Box>
  );
}
