import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, Printer, Receipt, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { OrderWithItems, DishCategory } from "@shared/schema";
import { DISH_CATEGORIES } from "@shared/schema";
import { printKitchenReceipt, printCustomerReceipt } from "./receipt-templates";

export default function ActiveOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activeOrders = [], isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders/active"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const completeOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiRequest("PUT", `/api/orders/${orderId}/complete`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ordine completato",
        description: "L'ordine è stato completato con successo",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nel completamento dell'ordine",
        variant: "destructive",
      });
    },
  });



  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border">
        <CardContent className="p-6">
          <div className="text-center">Caricamento ordini...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="text-accent mr-3" />
          Ordini Attivi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activeOrders.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Nessun ordine attivo
            </div>
          ) : (
            activeOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Tavolo {order.tableNumber}
                    </span>
                    <p className="text-gray-600 mt-1">{order.customerName}</p>
                    <p className="text-gray-500 text-sm">Coperti: {order.covers}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-secondary">
                      €{parseFloat(order.total).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString('it-IT', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {order.items.map(item => `${item.quantity}x ${item.dish.name}`).join(', ')}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-secondary hover:bg-green-700 text-white"
                    onClick={() => printKitchenReceipt(order)}
                  >
                    <Printer className="w-4 h-4 mr-1" />
                    Cucina
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-blue-700 text-white"
                    onClick={() => printCustomerReceipt(order)}
                  >
                    <Receipt className="w-4 h-4 mr-1" />
                    Cliente
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => completeOrderMutation.mutate(order.id)}
                    disabled={completeOrderMutation.isPending}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
