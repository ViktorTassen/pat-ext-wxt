import React, { useState } from "react";
import { Checkbox, Box } from "@mui/material";

export function OrderCheckbox() {
  const [checked, setChecked] = useState(false);
  
  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
    
    // Get the parent element (which should contain the order ID)
    const parentElement = document.getElementById('order-checkbox-container')?.parentElement;
    const orderId = parentElement?.querySelector('.order-id')?.textContent?.trim();
    
    if (orderId) {
      console.log(`Order ${orderId} ${isChecked ? 'selected' : 'unselected'}`);
      
      // Dispatch a custom event to notify the OrderManagement component
      window.dispatchEvent(new CustomEvent('orderSelected', {
        detail: {
          orderId,
          selected: isChecked
        }
      }));
    }
  };

  return (
    <Box 
      id="order-checkbox-container" 
      sx={{ 
        display: 'flex', 
        float: 'left', 
        mr: 2 
      }}
    >
      <Checkbox 
        id="order-checkbox" 
        checked={checked} 
        onChange={handleCheckedChange} 
      />
    </Box>
  );
}