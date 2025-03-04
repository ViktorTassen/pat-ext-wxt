import React, { useState } from "react";
import { format } from "date-fns";
import { 
  Button, 
  Typography, 
  Box, 
  Paper 
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export function CalendarWidget() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [isOpen, setIsOpen] = useState(true); // Set to true by default to show calendar initially

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  const handleDateSelect = (selectedDate: Date | null) => {
    setDate(selectedDate);
    // Example: If you want to filter Amazon's UI based on the selected date
    if (selectedDate) {
      console.log(`Filtering for date: ${format(selectedDate, 'yyyy-MM-dd')}`);
      // Here you could potentially trigger Amazon's own date filter if needed
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 1 
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Filter by Date</Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={toggleCalendar}
        >
          {isOpen ? "Hide" : "Show"} Calendar
        </Button>
      </Box>
      
      {date && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Selected: <Box component="span" sx={{ fontWeight: 'medium' }}>{format(date, 'PPP')}</Box>
        </Typography>
      )}
      
      {isOpen && (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={date}
              onChange={handleDateSelect}
            />
          </LocalizationProvider>
        </Box>
      )}
    </Paper>
  );
}