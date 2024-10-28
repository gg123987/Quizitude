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

/**
 * headCells array defines the columns for the table.
 * Each object in the array represents a column with the following properties:
 * - id: The unique identifier for the column.
 * - numeric: Boolean value to determine if the column is numeric.
 * - disablePadding: Boolean value to determine if padding should be disabled.
 * - label: The column header text.
 */
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

/**
 * EnhancedTableHead component renders the header of a table with a selectable checkbox.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {number} props.numSelected - The number of selected rows.
 * @param {function} props.onSelectAllClick - The function to call when the select all checkbox is clicked.
 * @param {number} props.rowCount - The total number of rows in the table.
 *
 * @returns {JSX.Element} The rendered table head component.
 *
 */
const EnhancedTableHead = ({ numSelected, onSelectAllClick, rowCount }) => (
  <TableHead>
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          indeterminate={numSelected > 0 && numSelected < rowCount} // Indeterminate state when some but not all rows are selected
          checked={rowCount > 0 && numSelected === rowCount} // Checked state when all rows are selected
          onChange={onSelectAllClick}
          inputProps={{ "aria-label": "select all files" }}
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

// EnhancedTableToolbar component renders a toolbar with action buttons for the table.
// It displays the number of selected rows and provides a delete button when rows are selected.
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

/**
 * EnhancedTable component renders a table with selectable rows, pagination, and action buttons.
 *
 * @component
 * @param {Object[]} data - Array of data objects to be displayed in the table.
 * @param {Function} onDelete - Callback function to handle the deletion of a row.
 * @param {Function} onGenerate - Callback function to handle the generation action for a row.
 *
 * @example
 * const data = [
 *   { id: 1, name: 'File1', size: 2048, deck_count: 3, uploaded_at: '2023-01-01T00:00:00Z' },
 *   { id: 2, name: 'File2', size: 1024, deck_count: 5, uploaded_at: '2023-02-01T00:00:00Z' }
 * ];
 * const handleDelete = (id) => { console.log(`Delete row with id ${id}`); };
 * const handleGenerate = (row) => { console.log(`Generate action for row`, row); };
 *
 * <EnhancedTable data={data} onDelete={handleDelete} onGenerate={handleGenerate} />
 *
 * @returns {JSX.Element} The rendered EnhancedTable component.
 */
const EnhancedTable = ({ data, onDelete, onGenerate }) => {
  const [selected, setSelected] = React.useState([]);
  const rowsPerPage = 6;
  const [page, setPage] = React.useState(0);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      console.log(newSelected);
      return;
    }
    setSelected([]);
  };

  /**
   * Handles the click event for selecting or deselecting an item.
   *
   * @param {Object} event - The click event object.
   * @param {string|number} id - The unique identifier of the item to be selected or deselected.
   *
   * This function updates the `selected` state by either adding or removing the given `id`.
   * - If the `id` is not in the `selected` array, it adds the `id`.
   * - If the `id` is the first element in the `selected` array, it removes the first element.
   * - If the `id` is the last element in the `selected` array, it removes the last element.
   * - If the `id` is in the middle of the `selected` array, it removes that specific element.
   *
   * @returns {void}
   */
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
                      data-testid={`checkbox-${row.id}`}
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
                      data-testid={`delete-button-${row.id}`}
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
