import React, { useState, useRef, useEffect } from "react";
import { format, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, X } from "lucide-react";

interface DateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function DateTimePicker({
  value,
  onChange,
  label,
  className,
  disabled = false,
  placeholder = "Select date and time",
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);
  const [timeInput, setTimeInput] = useState(value ? format(value, "HH:mm") : "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Update internal state when value prop changes
  useEffect(() => {
    setDate(value);
    setTimeInput(value ? format(value, "HH:mm") : "");
  }, [value]);

  // Handle date selection from calendar
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      return;
    }

    let newDate = new Date(selectedDate);
    
    // If we have a time, apply it to the new date
    if (timeInput) {
      try {
        const [hours, minutes] = timeInput.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          newDate.setHours(hours, minutes);
        }
      } catch (e) {
        console.error("Error parsing time:", e);
      }
    }
    
    setDate(newDate);
  };

  // Handle time input changes
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeInput = e.target.value;
    setTimeInput(newTimeInput);
    
    // If we have a date and valid time, update the date with the new time
    if (date && /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(newTimeInput)) {
      try {
        const [hours, minutes] = newTimeInput.split(":").map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours, minutes);
        setDate(newDate);
      } catch (e) {
        console.error("Error updating time:", e);
      }
    }
  };

  // Apply changes and close popover
  const handleApply = () => {
    onChange(date);
    setOpen(false);
  };

  // Clear the selection
  const handleClear = () => {
    setDate(undefined);
    setTimeInput("");
    onChange(undefined);
    setOpen(false);
  };

  // Format the display value - using 24-hour format
  const displayValue = date 
    ? `${format(date, "MM/dd/yyyy")} ${format(date, "HH:mm")}`
    : "";

  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-9 px-3 py-1",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue || placeholder}
            {value && (
              <X 
                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
            <div className="mt-4 flex items-end gap-2">
              <div className="grid gap-1 flex-1">
                <Label htmlFor="time" className="text-xs font-medium">Time (24h format)</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 opacity-50" />
                  <Input
                    id="time"
                    ref={inputRef}
                    value={timeInput}
                    onChange={handleTimeChange}
                    type="time"
                    className="w-full h-8 text-sm"
                    placeholder="HH:MM (24h)"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
              <Button size="sm" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DateTimePicker24h({
  value,
  onChange,
  ...props
}: DateTimePickerProps) {
  return (
    <DateTimePicker
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}