import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, IconButton, Stack, TextField } from "@mui/material";
import { type OutlinedInputProps } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

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

const LoadboardMaxDepTimePicker: React.FC<any> = ({ filter, index, value, isOpen, handleCalendarChange, handleCalendarOpenChange }) => {
  const [open, setOpen] = useState<boolean>(!!isOpen);

  const [current, setCurrent] = useState<HTMLElement | null>(null);
  const ref = useRef<any>(null);
  useLayoutEffect(() => {
    setCurrent(ref.current)
  }) // fix popper positioning

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      handleCalendarOpenChange(false, index, 'calendarOpen');
      
    }
  };

  return (
    <div ref={ref}>
    <AmzDateTimePicker
      onChange={(e: any) => {
        console.log('e', e);
        handleCalendarChange(e, index, 'maxDepartureTime');
        // handleOpenChange(false); // Close the picker after selection
      }}

      sx={{ width: {xs: "168px", sm:"180px"} }}
      open={open}
      onOpen={() => handleOpenChange(true)}
      disablePast={true}
      label="Max Departure"
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
          placeholder: '',
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
  );
};

export default LoadboardMaxDepTimePicker;
