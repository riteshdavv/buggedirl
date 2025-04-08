import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// ✅ Import or define CustomNav here
function CustomNav({
  previousMonth,
  nextMonth,
  onPreviousClick,
  onNextClick,
}: {
  previousMonth?: Date
  nextMonth?: Date
  onPreviousClick?: React.MouseEventHandler<HTMLButtonElement>
  onNextClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <div className="space-x-1 flex items-center">
      {previousMonth && (
        <button
          type="button"
          onClick={onPreviousClick}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      {nextMonth && (
        <button
          type="button"
          onClick={onNextClick}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        // ...your existing classNames config
        nav: "relative flex items-center justify-between",
        ...classNames,
      }}
      components={{
        // ✅ Inject CustomNav here
        Nav: CustomNav,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }