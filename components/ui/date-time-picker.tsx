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

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  calendarLabel?: string;
  timeLabel?: string;
  placeholder?: string;
}

export function DateTimePicker({
  date,
  setDate,
  label = "Pick a date and time",
  calendarLabel = "Select date",
  timeLabel = "Select time",
  placeholder = "MM/DD/YYYY HH:mm"
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const [calendarHeight, setCalendarHeight] = React.useState(300);

  // Effect to measure calendar height
  React.useEffect(() => {
    if (calendarRef.current) {
      const height = calendarRef.current.clientHeight;
      if (height > 0) {
        setCalendarHeight(height);
      }
    }
  }, [isOpen]);

  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );
  
  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal pr-8",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              <span>{format(date, "MM/dd/yyyy HH:mm")}</span>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
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
        <div className="flex flex-col sm:flex-row">
          <div className="p-2 flex flex-col" ref={calendarRef}>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-border">
            <div className="px-3 py-2 text-center border-b">
              <div className="flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2 opacity-70" />
                <span className="text-sm font-medium">{timeLabel}</span>
              </div>
            </div>
            <div className="flex py-2" style={{ height: `${calendarHeight - 80}px` }}>
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
        </div>
      </PopoverContent>
    </Popover>
  );
}