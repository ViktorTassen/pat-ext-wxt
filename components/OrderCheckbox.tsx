import React, { useState } from "react"
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
      // Here you could implement additional functionality like:
      // - Storing selected orders in state
      // - Highlighting the entire row
      // - Adding batch actions for selected orders
    }
  }

  return (
    <div id="order-checkbox-container" className="flex items-center space-x-2 mr-2">
      <Checkbox 
        id="order-checkbox" 
        checked={checked} 
        onCheckedChange={handleCheckedChange} 
      />
    </div>
  )
}