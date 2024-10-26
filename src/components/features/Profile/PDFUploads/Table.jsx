import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

function createData(id, name, size, flashcards, uploadAt, fileId) {
    return {
        id,
        name,
        size,
        flashcards,
        uploadAt,
        fileId
    };
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'File name',
    },
    {
        id: 'size',
        numeric: true,
        disablePadding: false,
        label: 'File size',
    },
    {
        id: 'flashcards',
        numeric: true,
        disablePadding: false,
        label: 'Flashcards',
    },
    {
        id: 'uploadAt',
        numeric: true,
        disablePadding: false,
        label: 'Date uploaded',
    },
    {
        id: 'genDel',
        numeric: true,
        disablePadding: false,
        label: '',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } =
        props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align='left'
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sx={{ fontSize: '12px', fontWeight: '300' }}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar() {
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    justifyContent: 'space-between',
                }
            ]}
        >
            {(
                <Typography
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    PDF Uploads
                </Typography>
            )}

            {(
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

EnhancedTable.propTypes = {
    data: PropTypes.shape({
        fileId: PropTypes.arrayOf(PropTypes.number).isRequired,
        flashcards: PropTypes.arrayOf(PropTypes.number).isRequired,
        name: PropTypes.arrayOf(PropTypes.string).isRequired,
        size: PropTypes.arrayOf(PropTypes.number).isRequired,
        uploadedAt: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired
};

export default function EnhancedTable({ data, onDelete }) {
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const rowsPerPage = 6;
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (data.fileId && data.fileId.length > 0) {
            const newRows = data.fileId.map((id, index) =>
                createData(
                    index + 1,
                    data.name[index],
                    data.size[index],
                    data.flashcards[index],
                    data.uploadedAt[index],
                    id
                )
            );
            setRows(newRows);
            console.log("New rows created:", newRows);
        } else {
            setRows([]);
        }
    }, [data]);
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    // Handles the select all check box
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
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
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    // Page change handlers
    const handleNextPage = () => {
        if ((page + 1) * rowsPerPage < rows.length) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    // Function determines cell bg colour
    const getCellBackgroundColor = (rowIndex) => {
        return rowIndex % 2 === 0 ? '#f7f7f7' : 'white';
    }
    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...rows]
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage],
    );

    return (
        <Box sx={{ width: '70%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'default' }}
                                    >
                                        <TableCell padding="checkbox" sx={{ backgroundColor: getCellBackgroundColor(row.id + 1) }}>
                                            <Checkbox
                                                color="primary"
                                                onClick={(event) => handleClick(event, row.id)}
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            sx={{
                                                fontWeight: '500',
                                                backgroundColor: getCellBackgroundColor(row.id + 1),
                                                width: '20rem'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Box sx={{
                                                    backgroundColor: '#e9e9e9',
                                                    borderRadius: '50%',
                                                    width: 40,
                                                    height: 40,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 1.2
                                                }}>
                                                    <InsertDriveFileOutlinedIcon />
                                                </Box >
                                                <div>
                                                    <div style={{
                                                        maxWidth: '13rem', // Adjust to change when the file names are cut
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {row.name}

                                                    </div>
                                                    <span style={{
                                                        fontWeight: '100',
                                                        color: '#5b5b5b'
                                                    }}>
                                                        {row.size}
                                                    </span>
                                                </div>
                                            </Box>

                                        </TableCell>
                                        <TableCell align="left" sx={{ backgroundColor: getCellBackgroundColor(row.id + 1), color: '#5b5b5b' }}>{row.size}</TableCell>
                                        <TableCell align="left" sx={{ backgroundColor: getCellBackgroundColor(row.id + 1), color: '#5b5b5b' }}>{row.fileId}</TableCell>
                                        <TableCell align="left" sx={{ backgroundColor: getCellBackgroundColor(row.id + 1), color: '#5b5b5b' }}>{row.uploadAt}</TableCell>
                                        <TableCell align="right" sx={{ backgroundColor: getCellBackgroundColor(row.id + 1), color: '#5b5b5b' }}>
                                            <Button
                                                sx={{
                                                    textTransform: 'none',
                                                    color: '#0012ff'
                                                }}
                                                variant="text"
                                                onClick={() => handleDelete()} // TODO: MAKE and CHANGE TO handleGenerate()
                                            >
                                                Generate
                                            </Button>
                                            <Button
                                                sx={{
                                                    textTransform: 'none',
                                                    color: '#606060'
                                                }}
                                                variant="text"
                                                onClick={() => onDelete(row.fileId)} // Call delete function
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Box style={{
                display: 'flex',
                position: 'fixed',
                bottom: '1rem',
                justifyContent: 'space-between',
                width: '74rem'
            }}>
                <Button variant="outlined" onClick={handlePreviousPage} sx={{
                    textTransform: 'none',
                    color: '#606060',
                    borderColor: '#b7b7b7',
                }}>
                    Previous
                </Button>
                <span>
                    Page {page + 1} of {totalPages}
                </span>
                <Button variant="outlined" onClick={handleNextPage} sx={{
                    textTransform: 'none',
                    color: '#606060',
                    borderColor: '#b7b7b7'
                }}>
                    Next
                </Button>
            </Box>
        </Box>
    );
}