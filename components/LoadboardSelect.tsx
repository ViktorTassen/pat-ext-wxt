import React, { useRef, useLayoutEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  type SelectProps,
  type SelectChangeEvent
} from "@mui/material";

interface LoadboardSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: Array<{value: string, label: string }>;
  fullWidth?: boolean;
  size?: "small" | "medium";
}

// Styled Select component to match other inputs
const AmzSelect = styled(Select)(({ theme }) => ({
  '&.MuiFilledInput-root': {
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
  }
}));

const LoadboardSelect: React.FC<LoadboardSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  fullWidth = true,
  size = "small",
}) => {

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
      },
    },
  };

  return (
    <FormControl fullWidth={fullWidth} variant="filled" size={size}>
      <InputLabel shrink id={id}>{label}</InputLabel>
      <AmzSelect
        labelId={id}
        value={value}
        onChange={(event) => onChange(event as SelectChangeEvent<string>)}
        label={label}
        MenuProps={{ ...MenuProps }}
        size={size}
        disableUnderline
        fullWidth
        sx={{
          minWidth: '120px',
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </AmzSelect>
    </FormControl>
  );
};

export default LoadboardSelect;