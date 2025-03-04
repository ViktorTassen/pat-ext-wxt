import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { TextField, type OutlinedInputProps, type TextFieldProps } from "@mui/material";

interface LoadboardFilterProps {
  filter?: any;
  index?: number;
  label: string;
  value: any;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, index?: number, field?: string) => void;
  expanded?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
  InputLabelProps?: object;
  InputProps?: object;
}

// CUSTOM CSS STYLED
const AmzTextField = styled((props: TextFieldProps) => (
  <TextField
    variant="filled"
    InputProps={{ disableUnderline: true, inputProps: { min: 0, inputMode: 'decimal' } } as Partial<OutlinedInputProps>}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiFilledInput-root': {
    overflow: 'hidden',
    borderRadius: 4,
    fontSize: "0.8rem",
    backgroundColor: "transparent",
    border: '1px solid',
    borderColor: "#6f7880",
    '&:hover': {
      backgroundColor: "transparent",
    },
    '&.Mui-focused': {
      backgroundColor: "transparent",
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

const LoadboardTextField: React.FC<LoadboardFilterProps> = ({ 
  filter, 
  index, 
  label, 
  value, 
  placeholder, 
  onChange, 
  expanded,
  size = "small",
  fullWidth = false,
  InputLabelProps = {},
  InputProps = {}
}) => {
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
      size={size}
      type="number"
      placeholder={placeholder}
      error={error}
      label={label}
      value={value}
      onChange={handleInputChange}
      fullWidth={fullWidth}
      InputLabelProps={{
        shrink: true,
        
        ...InputLabelProps
      }}
      InputProps={InputProps}
    />
  );
};

export default LoadboardTextField;