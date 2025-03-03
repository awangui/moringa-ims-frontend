import React from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// You'll need to add the popover component
// npx shadcn-ui@latest add popover

export const DatePicker = ({ 
  value, 
  onChange, 
  placeholderText = "Select date", 
  className 
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : placeholderText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <ReactDatePicker
          selected={value}
          onChange={onChange}
          inline
        />
      </PopoverContent>
    </Popover>
  );
};