import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import "./calendar-styles.css";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "on_time" | "delayed" | "overdue";
  progress_percentage: number | null;
}

interface ProjectScheduleCalendarProps {
  projectId: string;
  milestones: Milestone[];
  onMilestoneUpdate: () => void;
}

export function ProjectScheduleCalendar({
  projectId,
  milestones,
  onMilestoneUpdate,
}: ProjectScheduleCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Transform milestones into FullCalendar events
  const events = milestones
    .filter((m) => m.start_date && m.end_date)
    .map((milestone) => ({
      id: milestone.id,
      title: milestone.title,
      start: milestone.start_date!,
      end: milestone.end_date!,
      backgroundColor: getStatusColor(milestone.status),
      borderColor: getStatusColor(milestone.status),
      extendedProps: {
        description: milestone.description,
        progress: milestone.progress_percentage,
        status: milestone.status,
      },
    }));

  // Handle drag and drop
  const handleEventDrop = async (info: any) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    const newStart = info.event.start?.toISOString().split("T")[0];
    const newEnd = info.event.end?.toISOString().split("T")[0];

    try {
      // Calculate new status based on dates
      const now = new Date();
      const endDate = new Date(newEnd!);
      const startDate = new Date(newStart!);
      
      let newStatus: "on_time" | "delayed" | "overdue" = "on_time";
      if (now > endDate) {
        newStatus = "overdue";
      } else if (now > startDate && now <= endDate) {
        const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        const daysElapsed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        const expectedProgress = (daysElapsed / totalDays) * 100;
        const actualProgress = info.event.extendedProps.progress || 0;
        
        if (actualProgress < expectedProgress - 10) {
          newStatus = "delayed";
        }
      }

      // Update milestone dates and status
      const { error } = await supabase
        .from("project_updates")
        .update({
          start_date: newStart,
          end_date: newEnd,
          status: newStatus,
        })
        .eq("id", info.event.id);

      if (error) throw error;

      // Update project progress
      await updateProjectProgress(projectId);
      
      toast.success("Milestone dates updated successfully");
      onMilestoneUpdate();
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast.error("Failed to update milestone dates");
      info.revert();
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle event resize
  const handleEventResize = async (info: any) => {
    await handleEventDrop(info);
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Project Schedule</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span>On Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span>Overdue</span>
          </div>
        </div>
      </div>
      
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventContent={(eventInfo) => (
          <div className="p-1 text-xs">
            <div className="font-semibold truncate">{eventInfo.event.title}</div>
            {eventInfo.event.extendedProps.progress !== null && (
              <div className="text-[10px] opacity-90">
                {eventInfo.event.extendedProps.progress}% complete
              </div>
            )}
          </div>
        )}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
      />
    </Card>
  );
}

function getStatusColor(status: "on_time" | "delayed" | "overdue"): string {
  switch (status) {
    case "on_time":
      return "hsl(var(--success))";
    case "delayed":
      return "hsl(var(--warning))";
    case "overdue":
      return "hsl(var(--destructive))";
    default:
      return "hsl(var(--primary))";
  }
}

async function updateProjectProgress(projectId: string) {
  // Fetch all milestones for the project
  const { data: milestones, error } = await supabase
    .from("project_updates")
    .select("progress_percentage")
    .eq("project_id", projectId)
    .eq("update_type", "milestone");

  if (error || !milestones || milestones.length === 0) return;

  // Calculate average progress
  const totalProgress = milestones.reduce(
    (sum, m) => sum + (m.progress_percentage || 0),
    0
  );
  const averageProgress = Math.round(totalProgress / milestones.length);

  // Update project progress
  await supabase
    .from("projects")
    .update({ progress: averageProgress })
    .eq("id", projectId);
}
