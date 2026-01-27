import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updatePayment } from "@/lib/api";

interface Payment {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  due_date: string;
  payment_percentage: number | null;
  unit_id: string | null;
  client_id: string | null;
  status: string;
}

interface PaymentEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  units: Array<{ id: string; unit_number: string }>;
  clients: Array<{ id: string; name: string }>;
  onPaymentUpdated: () => void;
}

export function PaymentEditDialog({
  open,
  onOpenChange,
  payment,
  units,
  clients,
  onPaymentUpdated,
}: PaymentEditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    due_date: "",
    payment_percentage: "",
    unit_id: "",
    client_id: "",
    status: "pending",
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        title: payment.title,
        description: payment.description || "",
        amount: String(payment.amount),
        due_date: payment.due_date,
        payment_percentage: payment.payment_percentage ? String(payment.payment_percentage) : "",
        unit_id: payment.unit_id || "",
        client_id: payment.client_id || "",
        status: payment.status,
      });
    }
  }, [payment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment) return;

    setLoading(true);

    try {
      const result = await updatePayment(payment.id, {
        title: formData.title,
        description: formData.description || null,
        amount: parseFloat(formData.amount),
        due_date: formData.due_date,
        payment_percentage: formData.payment_percentage ? parseInt(formData.payment_percentage) : null,
        unit_id: formData.unit_id || null,
        client_id: formData.client_id || null,
        status: formData.status,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Paiement modifié avec succès");
      onOpenChange(false);
      onPaymentUpdated();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le paiement</DialogTitle>
          <DialogDescription>
            Modifiez les informations du paiement
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_payment_title">Titre *</Label>
            <Input
              id="edit_payment_title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Acompte initial 20%"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_payment_description">Description</Label>
            <Textarea
              id="edit_payment_description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Détails du paiement..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_payment_amount">Montant (MAD) *</Label>
              <Input
                id="edit_payment_amount"
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="500000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_payment_percentage">Pourcentage (%)</Label>
              <Input
                id="edit_payment_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.payment_percentage}
                onChange={(e) =>
                  setFormData({ ...formData, payment_percentage: e.target.value })
                }
                placeholder="20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_payment_status">Statut *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="edit_payment_status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_payment_due_date">Date d'échéance *</Label>
            <Input
              id="edit_payment_due_date"
              type="date"
              required
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_payment_unit">Lot (optionnel)</Label>
              <Select
                value={formData.unit_id || "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, unit_id: value === "none" ? "" : value })
                }
              >
                <SelectTrigger id="edit_payment_unit">
                  <SelectValue placeholder="Sélectionner un lot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.unit_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_payment_client">Client (optionnel)</Label>
              <Select
                value={formData.client_id || "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, client_id: value === "none" ? "" : value })
                }
              >
                <SelectTrigger id="edit_payment_client">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Modification..." : "Modifier le paiement"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
