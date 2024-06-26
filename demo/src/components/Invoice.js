import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/joy/Box';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Tooltip from '@mui/joy/Tooltip';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { visuallyHidden } from '@mui/utils';
import { headCells } from '../const';
import { Button, Modal } from '@mui/material';
import Form from './Form';

function labelDisplayedRows({ from, to, count }) {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <thead>
      <tr>
        <th>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                'aria-label': 'select all desserts',
              },
            }}
            sx={{ verticalAlign: 'sub' }}
          />
        </th>
        {headCells.map((headCell) => {
          const active = orderBy === headCell.id;
          return (
            <th
              key={headCell.id}
              aria-sort={
                active
                  ? { asc: 'ascending', desc: 'descending' }[order]
                  : undefined
              }
            >
              <Link
                underline='none'
                color='neutral'
                textColor={active ? 'primary.plainColor' : undefined}
                component='button'
                onClick={createSortHandler(headCell.id)}
                fontWeight='lg'
                startDecorator={
                  headCell.numeric ? (
                    <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                  ) : null
                }
                endDecorator={
                  !headCell.numeric ? (
                    <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                  ) : null
                }
                sx={{
                  '& svg': {
                    transition: '0.2s',
                    transform:
                      active && order === 'desc'
                        ? 'rotate(0deg)'
                        : 'rotate(180deg)',
                  },
                  '&:hover': { '& svg': { opacity: 1 } },
                }}
              >
                {headCell.label}
                {active ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </Link>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: 'background.level1',
        }),
        borderTopLeftRadius: 'var(--unstable_actionRadius)',
        borderTopRightRadius: 'var(--unstable_actionRadius)',
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          level='body-lg'
          sx={{ flex: '1 1 100%' }}
          id='tableTitle'
          component='div'
        >
          Invoices
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton size='sm' color='danger' variant='solid'>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton size='sm' variant='outlined' color='neutral'>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const Invoice = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [rows, setRows] = React.useState([
    {
      id: '1',
      date: '29-01-2024',
      i_no: 10,
      c_name: 'John',
      bill_address: 'ans',
      ship_address: 'abs',
      gst: '101201',
      items: ['apple', 'orange'],
      bill_sundrys: [],
      total_amount: 100,
    },
    {
      id: '2',
      date: '29-01-2024',
      i_no: 10,
      c_name: 'John',
      bill_address: 'ans',
      ship_address: 'abs',
      gst: '101201',
      items: ['apple', 'orange'],
      bill_sundrys: [],
      total_amount: 100,
    },
    {
      id: '3',
      date: '29-01-2024',
      i_no: 10,
      c_name: 'John',
      bill_address: 'ans',
      ship_address: 'abs',
      gst: '101201',
      items: ['apple', 'orange'],
      bill_sundrys: [],
      total_amount: 100,
    },
    {
      id: '4',
      date: '29-01-2024',
      i_no: 10,
      c_name: 'John',
      bill_address: 'ans',
      ship_address: 'abs',
      gst: '101201',
      items: ['apple', 'orange'],
      bill_sundrys: [],
      total_amount: 100,
    },
  ]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    setRowsPerPage(parseInt(newValue.toString(), 10));
    setPage(0);
  };

  const getLabelDisplayedRowsTo = () => {
    if (rows.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? rows.length
      : Math.min(rows.length, (page + 1) * rowsPerPage);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <Button
        variant='contained'
        color='success'
        sx={{ marginBottom: '10px' }}
        onClick={handleOpen}
      >
        Add Invoice
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'white',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Form handleClose={handleClose} rows={rows} setRows={setRows} />
        </Box>
      </Modal>
      <Sheet
        variant='outlined'
        sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm' }}
      >
        <EnhancedTableToolbar numSelected={selected.length} />
        <Table
          aria-labelledby='tableTitle'
          hoverRow
          sx={{
            '--TableCell-headBackground': 'transparent',
            '--TableCell-selectedBackground': (theme) =>
              theme.vars.palette.success.softBg,
            '& thead th:nth-child(1)': {
              width: '40px',
            },
            '& thead th:nth-child(2)': {
              width: '30%',
            },
            '& tr > *:nth-child(n+3)': { textAlign: 'right' },
          }}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <tbody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <tr
                    onClick={(event) => handleClick(event, row.id)}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    style={
                      isItemSelected
                        ? {
                            '--TableCell-dataBackground':
                              'var(--TableCell-selectedBackground)',
                            '--TableCell-headBackground':
                              'var(--TableCell-selectedBackground)',
                          }
                        : {}
                    }
                  >
                    <th scope='row'>
                      <Checkbox
                        checked={isItemSelected}
                        slotProps={{
                          input: {
                            'aria-labelledby': labelId,
                          },
                        }}
                        sx={{ verticalAlign: 'top' }}
                      />
                    </th>
                    <td id={labelId} scope='row'>
                      {row.id}
                    </td>
                    <td>{row.date}</td>
                    <td>{row.i_no}</td>
                    <td>{row.c_name}</td>
                    <td>{row.bill_address}</td>
                    <td>{row.ship_address}</td>
                    <td>{row.gst}</td>
                    <td>{row.items.join(', ')}</td>
                    <td>{row.bill_sundrys.join(', ')}</td>
                    <td>{row.total_amount}</td>
                  </tr>
                );
              })}
            {emptyRows > 0 && (
              <tr
                style={{
                  height: `calc(${emptyRows} * 40px)`,
                  '--TableRow-hoverBackground': 'transparent',
                }}
              >
                <td colSpan={11} aria-hidden />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={11}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    justifyContent: 'flex-end',
                  }}
                >
                  <FormControl orientation='horizontal' size='sm'>
                    <FormLabel>Rows per page:</FormLabel>
                    <Select
                      onChange={handleChangeRowsPerPage}
                      value={rowsPerPage}
                    >
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={25}>25</Option>
                    </Select>
                  </FormControl>
                  <Typography textAlign='center' sx={{ minWidth: 80 }}>
                    {labelDisplayedRows({
                      from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                      to: getLabelDisplayedRowsTo(),
                      count: rows.length === -1 ? -1 : rows.length,
                    })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size='sm'
                      color='neutral'
                      variant='outlined'
                      disabled={page === 0}
                      onClick={() => handleChangePage(page - 1)}
                      sx={{ bgcolor: 'background.surface' }}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                      size='sm'
                      color='neutral'
                      variant='outlined'
                      disabled={
                        rows.length !== -1
                          ? page >= Math.ceil(rows.length / rowsPerPage) - 1
                          : false
                      }
                      onClick={() => handleChangePage(page + 1)}
                      sx={{ bgcolor: 'background.surface' }}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Box>
                </Box>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </>
  );
};

export default Invoice;
