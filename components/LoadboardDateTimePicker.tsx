import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";

interface LoadboardDateTimePickerProps {
  index: number;
  value: string | null;
  isOpen: boolean;
  handleChange: (newValue: any) => void;
  handleOpenChange: (isOpen: boolean) => void;
}

const AmzDateTimePicker = styled(DateTimePicker)(({ theme }) => ({
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
}));

const LoadboardDateTimePicker: React.FC<LoadboardDateTimePickerProps> = ({ 
  index, 
  value, 
  isOpen,
  handleChange,
  handleOpenChange
}) => {
  const getDateValue = () => {
    if (!value) return null;
    const date = dayjs(value);
    return date.isValid() ? date : null;
  };

  return (
    <AmzDateTimePicker

      onChange={(newValue) => handleChange(newValue)}
      disablePast
      open={isOpen}
      onOpen={() => handleOpenChange(true)}
      onClose={() => handleOpenChange(false)}
      label={index === 0 ? "Start Date/Time" : "End Date/Time"}
      value={getDateValue()}
      ampm={false}
      format="MM/DD HH:mm"
      slotProps={{
        actionBar: { actions: ['clear', 'accept'] },
        field: { shouldRespectLeadingZeros: true, clearable: true },
        textField: {
          fullWidth: true,
          variant: 'filled',
          InputLabelProps: { shrink: true },
          placeholder: 'Keep current',
          InputProps: {
            value: value ? dayjs(new Date(value)).format('MM/DD HH:mm') : '',
            disableUnderline: true,
            onClick: () => {
              if (!isOpen) {
                handleOpenChange(true);
              }
            },
          },
        },
      }}
    />
  );
};

export default LoadboardDateTimePicker;