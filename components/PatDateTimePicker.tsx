import React, { useRef, useState } from "react";
import { styled } from "@mui/material/styles";
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

interface LoadboardMaxDepTimePickerProps {
  filter: any;
  index: number;
  value: string | null;
  isOpen: boolean;
  handleCalendarChange: (value: any, index: number, field: string) => void;
  handleCalendarOpenChange: (isOpen: boolean, index: number, field: string) => void;
}

const LoadboardMaxDepTimePicker: React.FC<LoadboardMaxDepTimePickerProps> = ({ 
  filter, 
  index, 
  value, 
  isOpen, 
  handleCalendarChange, 
  handleCalendarOpenChange 
}) => {
  const [open, setOpen] = useState<boolean>(!!isOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      handleCalendarOpenChange(false, index, 'calendarOpen');
    }
  };

  // Safely parse the date value
  const getDateValue = () => {
    if (!value) return null;
    
    try {
      const date = dayjs(value);
      return date.isValid() ? date : null;
    } catch (e) {
      console.error("Invalid date value:", value);
      return null;
    }
  };

  // Format date for display
  const getFormattedDate = () => {
    const date = getDateValue();
    return date ? date.format('MM/DD HH:mm') : '';
  };

  return (
    <div ref={containerRef}>
      <AmzDateTimePicker
        onChange={(newValue: any) => {
          handleCalendarChange(newValue, index, 'maxDepartureTime');
        }}
        // sx={{ width: {xs: "168px", sm:"180px"} }}
        open={open}
        onOpen={() => handleOpenChange(true)}
        disablePast={true}
        label={index === 0 ? "Start Date/Time" : "End Date/Time"}
        value={getDateValue()}
        ampm={false}
        format="MM/DD HH:mm"
        onClose={() => handleOpenChange(false)}
        slotProps={{
          popper: { container: containerRef.current },
          dialog: { container: containerRef.current },
          actionBar: {
            actions: ['clear', 'accept']
          },
          field: { shouldRespectLeadingZeros: true, clearable: true, size: "small" },
          textField: {
            placeholder: '',
            variant: 'filled',
            InputLabelProps: { shrink: true },
            InputProps: {
              value: getFormattedDate(),
              disableUnderline: true,
              onClick: () => {
                if (!value) {
                  handleOpenChange(true);
                }
              },
            } as Partial<OutlinedInputProps>,
          },
        }}
      />
    </div>
  );
};

export default LoadboardMaxDepTimePicker;