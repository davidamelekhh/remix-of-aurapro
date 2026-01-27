import { useState } from "react";
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
import { createPayment } from "@/lib/api";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  units: Array<{ id: string; unit_number: string }>;
  clients: Array<{ id: string; name: string }>;
  onPaymentAdded: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  projectId,
  units,
  clients,
  onPaymentAdded,
}: PaymentDialogProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Get actual user ID from your auth system
      const userId = 'mock-user-id';

      const result = await createPayment({
        project_id: projectId,
        title: formData.title,
        description: formData.description || null,
        amount: parseFloat(formData.amount),
        due_date: formData.due_date,
        payment_date: null,
        payment_percentage: formData.payment_percentage ? parseInt(formData.payment_percentage) : null,
        unit_id: formData.unit_id || null,
        client_id: formData.client_id || null,
        status: formData.status,
        created_by: userId,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Paiement ajouté avec succès");
      setFormData({
        title: "",
        description: "",
        amount: "",
        due_date: "",
        payment_percentage: "",
        unit_id: "",
        client_id: "",
        status: "pending",
      });
      onOpenChange(false);
      onPaymentAdded();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un paiement</DialogTitle>
          <DialogDescription>
            Créez un nouveau paiement dans le planning du projet
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment_title">Titre *</Label>
            <Input
              id="payment_title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Acompte initial 20%"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_description">Description</Label>
            <Textarea
              id="payment_description"
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
              <Label htmlFor="payment_amount">Montant (MAD) *</Label>
              <Input
                id="payment_amount"
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
              <Label htmlFor="payment_percentage">Pourcentage (%)</Label>
              <Input
                id="payment_percentage"
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
            <Label htmlFor="payment_status">Statut *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="payment_status">
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
            <Label htmlFor="payment_due_date">Date d'échéance *</Label>
            <Input
              id="payment_due_date"
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
              <Label htmlFor="payment_unit">Lot (optionnel)</Label>
              <Select
                value={formData.unit_id || "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, unit_id: value === "none" ? "" : value })
                }
              >
                <SelectTrigger id="payment_unit">
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
              <Label htmlFor="payment_client">Client (optionnel)</Label>
              <Select
                value={formData.client_id || "none"}
                onValueChange={(value) =>
                  setFormData({ ...formData, client_id: value === "none" ? "" : value })
                }
              >
                <SelectTrigger id="payment_client">
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
              {loading ? "Ajout..." : "Ajouter le paiement"}
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
