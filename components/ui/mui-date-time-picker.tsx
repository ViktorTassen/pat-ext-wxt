import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { type OutlinedInputProps } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

const AmzDateTimePicker = styled((props: any) => (
  <DateTimePicker
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
}));

interface MuiDateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  disablePast?: boolean;
}

export function MuiDateTimePicker({
  value,
  onChange,
  label = "Select Date/Time",
  className,
  disabled = false,
  placeholder = "",
  disablePast = true,
}: MuiDateTimePickerProps) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<any>(null);
  const [current, setCurrent] = useState<HTMLElement | null>(null);
  
  useLayoutEffect(() => {
    setCurrent(ref.current);
  }, []); // fix popper positioning

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleChange = (newValue: any) => {
    if (newValue) {
      const date = newValue.toDate();
      onChange(date);
    } else {
      onChange(undefined);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div ref={ref} className={className}>
        <AmzDateTimePicker
          onChange={handleChange}
          sx={{ width: {xs: "168px", sm:"180px"} }}
          open={open}
          onOpen={() => handleOpenChange(true)}
          disablePast={disablePast}
          label={label}
          value={value ? dayjs(value) : null}
          ampm={false}
          format="MM/DD HH:mm"
          onClose={() => handleOpenChange(false)}
          slotProps={{
            popper: { container: current },
            dialog: { container: current },
            actionBar: {
              actions: ['clear', 'accept']
            },
            field: { shouldRespectLeadingZeros: true, clearable: true, size: "small" },
            textField: {
              placeholder,
              variant: 'filled',
              InputLabelProps: { shrink: true },
              InputProps: {
                value: value ? dayjs(new Date(value)).format('MM/DD HH:mm') : '',
                disableUnderline: true,
                onClick: (e) => {
                  if (!value)
                    // open calendar if no date
                    handleOpenChange(true);
                },
              } as Partial<OutlinedInputProps>,
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}