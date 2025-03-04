"use client";

import * as React from "react";
import { CalendarIcon, Clock, X } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Date Picker Component
interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
}

export function DatePicker({
  date,
  setDate,
  label = "Select date",
  placeholder = "MM/DD/YYYY"
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && date) {
      // Keep the time from the current date
      const newDate = new Date(selectedDate);
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      setDate(newDate);
    } else if (selectedDate) {
      // If no previous date, set time to 00:00
      setDate(selectedDate);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the popover from opening
    setDate(undefined);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isFloating = isFocused || !!date;

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }
    }}>
      <PopoverTrigger asChild>
        <div 
          className={cn(
            "relative w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            isOpen && "ring-2 ring-ring ring-offset-2"
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={0}
        >
          <label
            className={cn(
              "absolute left-3 pointer-events-none transition-all duration-200",
              isFloating
                ? "transform -translate-y-4 scale-75 text-xs text-primary origin-[0] top-2 z-10 bg-background px-1"
                : "top-1/2 -translate-y-1/2 text-muted-foreground"
            )}
          >
            {label}
          </label>
          <div className={cn(
            "flex items-center w-full",
            isFloating && "pt-2"
          )}>
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className={cn(
              "flex-grow",
              !date && "text-muted-foreground"
            )}>
              {date ? format(date, "MM/dd/yyyy") : ""}
            </span>
          </div>
          {date && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full p-0 hover:bg-gray-200"
              onClick={handleClear}
              aria-label="Clear date"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// Time Picker Component
interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
}

export function TimePicker({
  date,
  setDate,
  label = "Select time",
  placeholder = "HH:mm"
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );
  
  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (!date) {
      // If no date is selected, create one with today's date
      const newDate = new Date();
      if (type === "hour") {
        newDate.setHours(parseInt(value, 10));
        newDate.setMinutes(0);
      } else {
        newDate.setMinutes(parseInt(value, 10));
      }
      setDate(newDate);
    } else {
      // Update existing date
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(parseInt(value, 10));
      } else {
        newDate.setMinutes(parseInt(value, 10));
      }
      setDate(newDate);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the popover from opening
    setDate(undefined);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isFloating = isFocused || !!date;

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }
    }}>
      <PopoverTrigger asChild>
        <div 
          className={cn(
            "relative w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            isOpen && "ring-2 ring-ring ring-offset-2"
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={0}
        >
          <label
            className={cn(
              "absolute left-3 pointer-events-none transition-all duration-200",
              isFloating
                ? "transform -translate-y-4 scale-75 text-xs text-primary origin-[0] top-2 z-10 bg-background px-1"
                : "top-1/2 -translate-y-1/2 text-muted-foreground"
            )}
          >
            {label}
          </label>
          <div className={cn(
            "flex items-center w-full",
            isFloating && "pt-2"
          )}>
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className={cn(
              "flex-grow",
              !date && "text-muted-foreground"
            )}>
              {date ? format(date, "HH:mm") : ""}
            </span>
          </div>
          {date && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full p-0 hover:bg-gray-200"
              onClick={handleClear}
              aria-label="Clear time"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2">
          <div className="flex py-2 h-[300px]">
            {/* Hours column */}
            <div className="flex-1 px-2 border-r border-border">
              <div className="text-xs text-center text-muted-foreground mb-1">Hour</div>
              <ScrollArea className="h-full">
                <div className="flex flex-col">
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      variant={date && date.getHours() === parseInt(hour, 10) ? "default" : "ghost"}
                      className="py-1.5 px-3 h-auto text-sm justify-center"
                      onClick={() => handleTimeChange("hour", hour)}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            {/* Minutes column */}
            <div className="flex-1 px-2">
              <div className="text-xs text-center text-muted-foreground mb-1">Minute</div>
              <ScrollArea className="h-full">
                <div className="flex flex-col">
                  {minutes.map((minute) => (
                    <Button
                      key={minute}
                      variant={date && date.getMinutes() === parseInt(minute, 10) ? "default" : "ghost"}
                      className="py-1.5 px-3 h-auto text-sm justify-center"
                      onClick={() => handleTimeChange("minute", minute)}
                    >
                      {minute}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}