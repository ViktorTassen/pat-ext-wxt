import React, { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

export function CalendarWidget() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isOpen, setIsOpen] = useState(true) // Set to true by default to show calendar initially

  const toggleCalendar = () => {
    setIsOpen(!isOpen)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    // Example: If you want to filter Amazon's UI based on the selected date
    if (selectedDate) {
      console.log(`Filtering for date: ${format(selectedDate, 'yyyy-MM-dd')}`)
      // Here you could potentially trigger Amazon's own date filter if needed
    }
  }

  return (
    <div className="calendar-widget bg-white rounded-md shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Filter by Date</h3>
        <Button variant="outline" size="sm" onClick={toggleCalendar}>
          {isOpen ? "Hide" : "Show"} Calendar
        </Button>
      </div>
      
      {date && (
        <div className="text-sm text-gray-600 mb-2">
          Selected: <span className="font-medium">{format(date, 'PPP')}</span>
        </div>
      )}
      
      {isOpen && (
        <div className="calendar-container">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded border"
          />
        </div>
      )}
    </div>
  )
}