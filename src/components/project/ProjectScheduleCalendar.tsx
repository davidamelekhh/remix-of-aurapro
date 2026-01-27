import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
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

interface PaymentSchedule {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  due_date: string;
  payment_date: string | null;
  status: "pending" | "paid" | "overdue" | "partial";
  payment_percentage: number | null;
  unit_id: string | null;
  client_id: string | null;
}

interface ProjectScheduleCalendarProps {
  projectId: string;
  milestones: Milestone[];
  payments: PaymentSchedule[];
  onMilestoneUpdate: () => void;
  onPaymentUpdate: () => void;
}

export function ProjectScheduleCalendar({
  projectId,
  milestones,
  payments,
  onMilestoneUpdate,
  onPaymentUpdate,
}: ProjectScheduleCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Transform milestones into FullCalendar events
  const milestoneEvents = milestones
    .filter((m) => m.start_date && m.end_date)
    .map((milestone) => ({
      id: `milestone-${milestone.id}`,
      title: `🏗️ ${milestone.title}`,
      start: milestone.start_date!,
      end: milestone.end_date!,
      backgroundColor: getStatusColor(milestone.status),
      borderColor: getStatusColor(milestone.status),
      extendedProps: {
        type: 'milestone',
        realId: milestone.id,
        description: milestone.description,
        progress: milestone.progress_percentage,
        status: milestone.status,
      },
    }));

  // Transform payments into FullCalendar events
  const paymentEvents = payments.map((payment) => ({
    id: `payment-${payment.id}`,
    title: `💰 ${payment.title}`,
    start: payment.due_date,
    allDay: true,
    backgroundColor: getPaymentStatusColor(payment.status),
    borderColor: getPaymentStatusColor(payment.status),
    extendedProps: {
      type: 'payment',
      realId: payment.id,
      description: payment.description,
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.payment_date,
      percentage: payment.payment_percentage,
    },
  }));

  const events = [...milestoneEvents, ...paymentEvents];

  // Handle drag and drop
  const handleEventDrop = async (info: any) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    const eventType = info.event.extendedProps.type;
    const realId = info.event.extendedProps.realId;

    try {
      if (eventType === 'milestone') {
        const newStart = info.event.start?.toISOString().split("T")[0];
        const newEnd = info.event.end?.toISOString().split("T")[0];

        // TODO: Replace with actual API call to update milestone
        console.log('TODO: Update milestone dates', { realId, newStart, newEnd, projectId });
        
        toast.success("Jalon mis à jour avec succès");
        onMilestoneUpdate();
      } else if (eventType === 'payment') {
        const newDueDate = info.event.start?.toISOString().split("T")[0];
        
        // TODO: Replace with actual API call to update payment
        console.log('TODO: Update payment due date', { realId, newDueDate });
        
        toast.success("Paiement mis à jour avec succès");
        onPaymentUpdate();
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Erreur lors de la mise à jour");
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
        <h3 className="text-lg font-semibold mb-2">Planning du projet</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="font-medium">Jalons:</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span>À temps</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span>En retard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span>Dépassé</span>
          </div>
          <div className="font-medium ml-4">Paiements:</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}></div>
            <span>Payé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(45, 93%, 47%)' }}></div>
            <span>En attente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(0, 84%, 60%)' }}></div>
            <span>En retard</span>
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
            {eventInfo.event.extendedProps.type === 'milestone' && eventInfo.event.extendedProps.progress !== null && (
              <div className="text-[10px] opacity-90">
                {eventInfo.event.extendedProps.progress}% terminé
              </div>
            )}
            {eventInfo.event.extendedProps.type === 'payment' && eventInfo.event.extendedProps.amount && (
              <div className="text-[10px] opacity-90">
                {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(eventInfo.event.extendedProps.amount)}
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

function getPaymentStatusColor(status: "pending" | "paid" | "overdue" | "partial"): string {
  switch (status) {
    case "paid":
      return "hsl(142, 76%, 36%)"; // Green
    case "pending":
      return "hsl(45, 93%, 47%)"; // Yellow/Gold
    case "partial":
      return "hsl(200, 80%, 50%)"; // Blue
    case "overdue":
      return "hsl(0, 84%, 60%)"; // Red
    default:
      return "hsl(var(--primary))";
  }
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
