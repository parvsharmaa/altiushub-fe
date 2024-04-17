import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { headCells } from '../const';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const initialState = {
  id: '',
  date: '20-02-2024',
  i_no: 0,
  c_name: '',
  bill_address: '',
  ship_address: '',
  gst: '',
  items: [],
  bill_sundrys: [],
  total_amount: 0,
};

const Form = ({ handleClose, rows, setRows }) => {
  const [details, setDetails] = useState(initialState);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const checkValidation = () => {
    return (
      details.id &&
      details.i_no !== 0 &&
      details.c_name &&
      details.bill_address &&
      details.ship_address &&
      details.gst &&
      details.total_amount !== 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkValidation()) {
      setError(true);
    } else {
      setRows([...rows, details]);
      setDetails(initialState);
      setError(false);
      handleClose();
      navigate('/invoices', { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {headCells.map((item) => {
        if (['date', 'bill_sundrys', 'items'].includes(item.id)) return null;
        return (
          <TextField
            key={item.id}
            name={item.id}
            label={item.label}
            variant='outlined'
            fullWidth
            value={details[item.id]}
            onChange={handleChange}
            margin='normal'
          />
        );
      })}
      {error && (
        <Alert severity='error'>Please verify the fields entered !!</Alert>
      )}
      <Button variant='contained' color='primary' type='submit'>
        Submit
      </Button>
    </form>
  );
};

export default Form;
