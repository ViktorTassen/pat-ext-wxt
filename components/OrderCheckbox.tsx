import React, { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"

export function OrderCheckbox() {
  const [checked, setChecked] = useState(false)
  
  const handleCheckedChange = (checked: boolean) => {
    setChecked(checked)
    
    // Get the parent element (which should contain the order ID)
    const parentElement = document.getElementById('order-checkbox-container')?.parentElement
    const orderId = parentElement?.querySelector('.order-id')?.textContent?.trim()
    
    if (orderId) {
      console.log(`Order ${orderId} ${checked ? 'selected' : 'unselected'}`)
      
      // Dispatch a custom event to notify the OrderManagement component
      window.dispatchEvent(new CustomEvent('orderSelected', {
        detail: {
          orderId,
          selected: checked
        }
      }));
    }
  }

  return (
    <span id="order-checkbox-container" className="flex float-left mr-4">
      <Checkbox 
        id="order-checkbox" 
        checked={checked} 
        onCheckedChange={handleCheckedChange} 
      />
    </span>
  )
}