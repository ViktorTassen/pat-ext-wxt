import React from "react";
import { styled } from "@mui/material/styles";
import { TextField, type TextFieldProps } from "@mui/material";

interface LoadboardTextFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size?: "small" | "medium";
  fullWidth?: boolean;
  InputLabelProps?: object;
  InputProps?: object;
}

const AmzTextField = styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    overflow: 'hidden',
    borderRadius: 4,
    fontSize: "0.8rem",
    backgroundColor: "transparent",
    border: '1px solid',
    borderColor: "#6f7880",
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: "transparent",
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused': {
      backgroundColor: "transparent",
      boxShadow: `0px 0px 0px 1px ${theme.palette.primary.main}`,
      borderColor: theme.palette.primary.main,
    },
    '&:before, &:after': {
      display: 'none',
    },
  },
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

const LoadboardTextField: React.FC<LoadboardTextFieldProps> = ({ 
  label, 
  value, 
  placeholder, 
  onChange, 
  size = "small",
  fullWidth = false,
  InputLabelProps = {},
  InputProps = {}
}) => {
  return (
    <AmzTextField
      variant="filled"
      size={size}
      type="number"
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth={fullWidth}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps
      }}
      InputProps={{
        ...InputProps
      }}
    />
  );
};

export default LoadboardTextField;