"use client";

import * as React from "react";
import { CalendarIcon, Clock, X } from "lucide-react";
import { format, isValid, parse } from "date-fns";
import { IMaskInput } from 'react-imask';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
}

export function DateTimePicker({
  date,
  setDate,
  label = "Select date and time"
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(date ? format(date, "MM/dd/yyyy HH:mm") : "");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = React.useState<string>("date");

  // Update input value when date prop changes
  React.useEffect(() => {
    if (date && isValid(date)) {
      setInputValue(format(date, "MM/dd/yyyy HH:mm"));
    } else if (!date) {
      setInputValue("");
    }
  }, [date]);

  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );
  
  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      
      // If we have an existing date, preserve the time
      if (date) {
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
      }
      
      setDate(newDate);
      setInputValue(format(newDate, "MM/dd/yyyy HH:mm"));
      setActiveTab("time"); // Switch to time tab after selecting date
    }
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    const newDate = date ? new Date(date) : new Date();
    
    if (type === "hour") {
      newDate.setHours(parseInt(value, 10));
    } else {
      newDate.setMinutes(parseInt(value, 10));
    }
    
    setDate(newDate);
    setInputValue(format(newDate, "MM/dd/yyyy HH:mm"));
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Try to parse the date and time if it matches the expected format
    if (value.length === 16) { // MM/DD/YYYY HH:MM format has 16 characters
      try {
        const parsedDate = parse(value, "MM/dd/yyyy HH:mm", new Date());
        if (isValid(parsedDate)) {
          setDate(parsedDate);
        }
      } catch (error) {
        // Invalid format, do nothing
      }
    }
  };

  const handleClear = () => {
    setDate(undefined);
    setInputValue("");
    setIsOpen(false);
  };

  const handleConfirm = () => {
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!inputValue) {
      setIsFocused(false);
    }
  };

  const isFloating = isFocused || !!inputValue;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <div 
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              isOpen && "ring-2 ring-ring ring-offset-2"
            )}
            onClick={() => setIsOpen(true)}
          >
            {label && (
              <label
                className={cn(
                  "absolute left-3 pointer-events-none transition-all duration-200",
                  isFloating
                    ? "transform -translate-y-[1.4rem] scale-75 text-xs text-primary origin-[0] top-1/2 z-10 bg-background px-1"
                    : "top-1/2 -translate-y-1/2 text-muted-foreground"
                )}
              >
                {label}
              </label>
            )}
            <div className="flex items-center w-full">
              <IMaskInput
                ref={inputRef}
                mask="00/00/0000 00:00"
                unmask={false}
                lazy={true}
                placeholderChar="_"
                value={inputValue}
                onAccept={handleInputChange}
                className={cn(
                  "w-full bg-transparent border-0 focus:outline-none focus:ring-0",
                  isFloating && "pt-2"
                )}
                placeholder=""
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <div className="flex items-center gap-1">
                {inputValue && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="h-5 w-5 rounded-full hover:bg-gray-200 flex items-center justify-center"
                    tabIndex={-1}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          <Tabs defaultValue="date" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="date" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Date</span>
              </TabsTrigger>
              <TabsTrigger value="time" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Time</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="date" className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </TabsContent>
            <TabsContent value="time" className="p-0">
              <div className="p-3">
                <div className="flex py-2 h-[250px]">
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
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 p-3 border-t">
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// For backward compatibility
export function DatePicker(props: DateTimePickerProps) {
  return <DateTimePicker {...props} />;
}

export function TimePicker(props: DateTimePickerProps) {
  return <DateTimePicker {...props} />;
}