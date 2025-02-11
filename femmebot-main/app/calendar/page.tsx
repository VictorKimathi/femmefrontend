"use client"
import React, { useState, useEffect } from 'react'
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, differenceInDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

type DayType = 'normal' | 'period' | 'fertile' | 'ovulation';

export default function FertilityWindow() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);

  const getDayType = (date: Date): DayType => {
    if (!selectedDate) return 'normal';
    const daysSinceStart = differenceInDays(date, selectedDate);
    if (daysSinceStart % cycleLength < periodLength) return 'period';
    const ovulationDay = cycleLength - 14;
    if (daysSinceStart % cycleLength === ovulationDay) return 'ovulation';
    if (daysSinceStart % cycleLength >= ovulationDay - 5 && daysSinceStart % cycleLength <= ovulationDay + 2) return 'fertile';
    return 'normal';
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = monthStart;
    const endDate = monthEnd;

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dayType = getDayType(cloneDay);
        days.push(
          <div
            className={`py-2 px-3 ${
              !isSameMonth(day, monthStart)
                ? "text-gray-400"
                : isSameDay(day, selectedDate)
                ? "bg-purple-500 text-white rounded-full"
                : dayType === 'period'
                ? "bg-red-100"
                : dayType === 'fertile'
                ? "bg-green-100"
                : dayType === 'ovulation'
                ? "bg-blue-100"
                : ""
            }`}
            key={day.toString()}
          >
            <span className="text-sm">{formattedDate}</span>
            {dayType === 'period' && <div className="w-1 h-1 bg-red-500 rounded-full mx-auto mt-1"></div>}
            {dayType === 'fertile' && <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mt-1"></div>}
            {dayType === 'ovulation' && <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mt-4">{rows}</div>;
  };

  useEffect(() => {
    renderCalendar();
  }, [selectedDate, cycleLength, periodLength, currentDate]);

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-pink-50 to-purple-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-700">Fertility Window</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addDays(currentDate, -30))}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold text-purple-700">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addDays(currentDate, 30))}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {renderCalendar()}

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="lastPeriod" className="text-purple-700">Last Period Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${
                    !selectedDate && "text-muted-foreground"
                  } border-purple-300 hover:border-purple-500 focus:border-purple-500`}
                >
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="rounded-md border border-purple-200"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="cycleLength" className="text-purple-700">Average Cycle Length</Label>
            <Select value={cycleLength.toString()} onValueChange={(value) => setCycleLength(parseInt(value))}>
              <SelectTrigger className="border-purple-300 focus:border-purple-500">
                <SelectValue placeholder="Select cycle length" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, i) => i + 21).map((days) => (
                  <SelectItem key={days} value={days.toString()}>
                    {days} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="periodLength" className="text-purple-700">Average Period Length</Label>
            <Select value={periodLength.toString()} onValueChange={(value) => setPeriodLength(parseInt(value))}>
              <SelectTrigger className="border-purple-300 focus:border-purple-500">
                <SelectValue placeholder="Select period length" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((days) => (
                  <SelectItem key={days} value={days.toString()}>
                    {days} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <h3 className="font-semibold text-purple-700">Legend</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 border border-red-500 rounded-full"></div>
            <span className="text-red-700">Period Days</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 border border-green-500 rounded-full"></div>
            <span className="text-green-700">Fertile Window</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-500 rounded-full"></div>
            <span className="text-blue-700">Ovulation Day</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
