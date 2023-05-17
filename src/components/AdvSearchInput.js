import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { InputBase } from '@mui/material';


const Item = styled(Paper)(({ theme }) => ({ backgroundColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#FFFFFF', padding: theme.spacing(1), textAlign: 'center', color: '#FFFFFFFF', }));

const FormComponent = ({ setState, state, label }) => (
  <Item sx={{ p: '.1rem 1.5rem', display: 'flex', alignItems: 'center', width: "11rem", borderRadius: 6, height: "2.3rem", marginBottom: "1rem", color: 'black' }}>
    <form>
      <label htmlFor={label}>
        {label}
        <InputBase
          type="Search"
          id={label}
          value={state}
          placeholder="Enter Keywords"
          onChange={e => setState(e.target.value)}
        />
      </label>
    </form>
  
  
  </Item> 

  
);

export default function useForm(defaultState, label) {
  const [state, setState] = useState(defaultState);

  return [
    state,
    <FormComponent state={state} setState={setState} label={label} />,
    setState
  ];
}
