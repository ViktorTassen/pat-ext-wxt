import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { TextField, ThemeProvider, type OutlinedInputProps, type TextFieldProps } from "@mui/material";

interface LoadboardFilterProps {
  filter: any;
  index: number;
  label: string;
  value: any;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => void;
  expanded: boolean;
}

// CUSTOM CSS STYLED
const AmzTextField = styled((props: TextFieldProps) => (
  <TextField
    InputProps={{ disableUnderline: true, inputProps: { min: 0, inputMode: 'decimal' } } as Partial<OutlinedInputProps>}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiFilledInput-root': {
    overflow: 'hidden',
    borderRadius: 4,
    fontSize: "0.9rem",
    backgroundColor: "#fff",
    border: '1px solid',
    borderColor: "#6f7880",
    '&:hover': {
      backgroundColor: "#fff",
    },
    '&.Mui-focused': {
      backgroundColor: "#fff",
      boxShadow: "0px 0px 0px 1px #00688d",
      borderColor: theme.palette.primary.main,

    },
  },
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

const LoadboardTextField: React.FC<LoadboardFilterProps> = ({ filter, index, label, value, onChange, expanded }) => {

  const [error, setError] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.trim() === "") {
      setError(true);
    } else {
      setError(false);
    }
    onChange(e, index, label);
  };

  
  return (
        <AmzTextField
          size="small"
          sx={{ width: 95 }}
          type="number"
          variant="filled"
          placeholder={placeholder}
          error={error}
          label={label}
          value={value}
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
  );
};

export default LoadboardTextField;
