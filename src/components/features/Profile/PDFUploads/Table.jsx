import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import FilterListIcon from "@mui/icons-material/FilterList";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

const headCells = [
  { id: "name", numeric: false, disablePadding: true, label: "File name" },
  { id: "size", numeric: true, disablePadding: false, label: "File size" },
  { id: "decks", numeric: true, disablePadding: false, label: "Decks" },
  {
    id: "uploadAt",
    numeric: true,
    disablePadding: false,
    label: "Date uploaded",
  },
  { id: "genDel", numeric: true, disablePadding: false, label: "" },
];

const EnhancedTableHead = ({ numSelected, onSelectAllClick, rowCount }) => (
  <TableHead>
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          indeterminate={numSelected > 0 && numSelected < rowCount}
          checked={rowCount > 0 && numSelected === rowCount}
          onChange={onSelectAllClick}
          inputProps={{ "aria-label": "select all desserts" }}
        />
      </TableCell>
      {headCells.map((headCell) => (
        <TableCell
          key={headCell.id}
          align="left"
          padding={headCell.disablePadding ? "none" : "normal"}
        >
          {headCell.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const EnhancedTableToolbar = ({ numSelected }) => (
  <Toolbar>
    <Typography variant="h6" id="tableTitle" component="div">
      PDF Uploads
    </Typography>
    {numSelected > 0 && (
      <Tooltip title="Delete">
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    )}
  </Toolbar>
);

const EnhancedTable = ({ data, onDelete, onGenerate }) => {
  const [selected, setSelected] = React.useState([]);
  const rowsPerPage = 6;
  const [page, setPage] = React.useState(0);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box
      sx={{
        width: "100%",
        height: "90%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <EnhancedTableToolbar numSelected={selected.length} />
      <TableContainer component={Paper}>
        <Table>
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={data.length}
          />
          <TableBody>
            {data.map((row) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      onClick={(event) => handleClick(event, row.id)}
                      checked={isItemSelected}
                    />
                  </TableCell>

                  <TableCell>
                    <InsertDriveFileOutlinedIcon
                      sx={{ verticalAlign: "middle", marginRight: "15px" }}
                    />
                    {row.name}
                  </TableCell>
                  <TableCell>{(row.size / 1024).toFixed(0)} KB</TableCell>
                  <TableCell>{row.deck_count}</TableCell>
                  <TableCell>
                    {new Date(row.uploaded_at)
                      .toLocaleDateString("en-AU", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      .replace(/(\d+)\s(\w+)\s(\d+)/, "$2 $1, $3")}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      sx={{
                        textTransform: "none",
                        color: "#0012ff",
                      }}
                      variant="text"
                      onClick={() => onGenerate(row)}
                    >
                      Generate
                    </Button>
                    <Button
                      sx={{
                        textTransform: "none",
                        color: "#606060",
                      }}
                      variant="text"
                      onClick={() => onDelete(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

EnhancedTable.propTypes = {
  data: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired,
};

export default EnhancedTable;
