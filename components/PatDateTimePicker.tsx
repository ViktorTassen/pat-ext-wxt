import React, { useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";

const AmzDateTimePicker = styled(DateTimePicker)(({ theme }) => ({
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
}));

interface LoadboardDateTimePickerProps {
  index: number;
  value: string | null;
  isOpen: boolean;
  handleChange: (newValue: any) => void;
  handleOpenChange: (isOpen: boolean) => void;
}

const LoadboardDateTimePicker: React.FC<LoadboardDateTimePickerProps> = ({ 
  index, 
  value, 
  isOpen, 
  handleChange, 
  handleOpenChange 
}) => {
  const [open, setOpen] = useState(!!isOpen);
  const containerRef = useRef(null);

  const handleToggleOpen = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      handleOpenChange(false);
    }
  };

  const getDateValue = () => {
    if (!value) return null;
    const date = dayjs(value);
    return date.isValid() ? date : null;
  };

  return (
    <AmzDateTimePicker
      onChange={(newValue) => handleChange(newValue)}
      open={open}
      onOpen={() => handleToggleOpen(true)}
      disablePast
      label={index === 0 ? "Start Date/Time" : "End Date/Time"}
      value={getDateValue()}
      ampm={false}
      format="MM/DD HH:mm"
      onClose={() => handleToggleOpen(false)}
      slotProps={{
        actionBar: { actions: ['clear', 'accept'] },
        field: { shouldRespectLeadingZeros: true, clearable: true },
        textField: {
          placeholder: '',
          variant: 'filled',
          InputLabelProps: { shrink: true },
          InputProps: {
            disableUnderline: true,
            onClick: () => { if (!value) handleToggleOpen(true); },
          },
        },
      }}
    />
  );
};

export default LoadboardDateTimePicker;