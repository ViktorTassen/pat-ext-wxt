import React, { useState, useEffect } from "react";
import { Checkbox, Box } from "@mui/material";

interface OrderCheckboxProps {
  orderId: string;
}

export function OrderCheckbox({ orderId }: OrderCheckboxProps) {
  const [checked, setChecked] = useState(false);
  
  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
    
    // Dispatch a custom event to notify the OrderManagement component
    window.dispatchEvent(new CustomEvent('orderSelected', {
      detail: {
        orderId,
        selected: isChecked
      }
    }));
  };

  return (
    <Box 
      className="order-checkbox-container" 
      sx={{ 
        display: 'flex', 
      }}
    >
      <Checkbox 
        className="order-checkbox" 
        checked={checked} 
        onChange={handleCheckedChange} 
      />
    </Box>
  );
}