import { Calendar, DateLocalizer } from 'react-big-calendar'

interface DynamicCalendarProps {
  localizer: DateLocalizer;
}

export default function DynamicCalendar({ localizer }: DynamicCalendarProps) {
  return (
    <Calendar
      localizer={localizer}
      events={[]}
      startAccessor="start"
      endAccessor="end"
      views={['week', 'day']}
      defaultView="week"
      min={new Date(0, 0, 0, 9, 0, 0)} // 9:00 AM
      max={new Date(0, 0, 0, 21, 0, 0)} // 9:00 PM
      step={60}
      timeslots={1}
      className="rounded-lg"
    />
  )
} 