import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, Printer, Receipt, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { OrderWithItems, DishCategory } from "@shared/schema";
import { DISH_CATEGORIES } from "@shared/schema";

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

  const printKitchenReceipt = (order: OrderWithItems) => {
    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Scontrino Cucina</title>
          <style>
            @media print {
              @page { margin: 5mm; size: 80mm auto; }
              body { margin: 0; padding: 0; }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.2;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 10px;
              max-width: 300px;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 8px;
              margin-bottom: 10px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
              font-weight: bold;
            }
            .footer {
              border-top: 2px dashed #000;
              padding-top: 8px;
              text-align: center;
              margin-top: 10px;
              font-size: 10px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">

            <div style="font-weight: bold; font-size: 14px; text-align: center;">🍽️ CUCINA - CRCS BERGEGGI 🍽️</div>
            <div style="margin-top: 6px;">
              <div style="font-weight: bold; font-size: 13px;">Tavolo: ${order.tableNumber}</div>
              <div>Cliente: ${order.customerName}</div>
              <div>Coperti: ${order.covers}</div>
              <div style="font-size: 10px; color: #666;">
                ${new Date(order.createdAt).toLocaleDateString('it-IT')} - ${new Date(order.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          
          <div class="content">
            ${Object.entries(DISH_CATEGORIES).map(([categoryKey, categoryLabel]) => {
              const categoryItems = order.items.filter(item => item.dish.category === categoryKey);
              if (categoryItems.length === 0) return '';
              
              return `
                <div style="margin-bottom: 8px;">
                  <div style="font-weight: bold; text-transform: uppercase; border-bottom: 1px dashed #000; padding-bottom: 2px; margin-bottom: 4px; font-size: 10px;">
                    ${categoryLabel}
                  </div>
                  ${categoryItems.map(item => `
                    <div class="item">
                      <span>${item.dish.name}</span>
                      <span>x${item.quantity}</span>
                    </div>
                  `).join('')}
                </div>
              `;
            }).filter(section => section).join('')}
          </div>
          
          <div class="footer">
            Ordine #${order.id.slice(-6)}
          </div>
          
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=320,height=600');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
    }
  };

  const printCustomerReceipt = (order: OrderWithItems) => {
    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Scontrino Cliente</title>
          <style>
            @media print {
              @page { margin: 5mm; size: 80mm auto; }
              body { margin: 0; padding: 0; }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.2;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 10px;
              max-width: 300px;
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
              font-size: 11px;
            }
            .total {
              border-top: 1px solid #000;
              padding-top: 8px;
              margin-top: 8px;
            }
            .footer {
              text-align: center;
              border-top: 1px solid #000;
              padding-top: 8px;
              margin-top: 8px;
              font-size: 10px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">

            <h1 style="font-size: 16px; margin: 0; font-weight: bold;">CRCS BERGEGGI</h1>
            <div style="font-size: 11px; margin-top: 2px; color: #666;">Circolo Ricreativo Culturale Sportivo</div>
          </div>
          
          <div style="margin-bottom: 8px; font-size: 10px;">
            <div>Tavolo: ${order.tableNumber}</div>
            <div>Cliente: ${order.customerName}</div>
            <div>Coperti: ${order.covers}</div>
            <div style="color: #666;">
              ${new Date(order.createdAt).toLocaleDateString('it-IT')} - ${new Date(order.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div style="border-bottom: 1px solid #000; padding-bottom: 8px; margin-bottom: 8px;">
            ${Object.entries(DISH_CATEGORIES).map(([categoryKey, categoryLabel]) => {
              const categoryItems = order.items.filter(item => item.dish.category === categoryKey);
              if (categoryItems.length === 0) return '';
              
              return `
                <div style="margin-bottom: 6px;">
                  <div style="font-weight: bold; text-transform: uppercase; border-bottom: 1px dashed #666; padding-bottom: 1px; margin-bottom: 3px; font-size: 9px; color: #333;">
                    ${categoryLabel}
                  </div>
                  ${categoryItems.map(item => `
                    <div class="item">
                      <div style="flex: 1;">
                        <span>${item.dish.name}</span>
                        <span style="font-size: 10px; color: #666;"> x${item.quantity}</span>
                      </div>
                      <span>€${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  `).join('')}
                </div>
              `;
            }).filter(section => section).join('')}
          </div>
          
          <div class="total">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin-bottom: 3px;">
              <span>TOTALE:</span>
              <span>€${parseFloat(order.total).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 10px;">
              <span>Pagamento:</span>
              <span>${order.paymentMethod === 'cash' ? 'Contanti' : 'POS'}</span>
            </div>
          </div>
          
          <div class="footer">
            <div>Grazie per la visita!</div>
            <div>Ordine #${order.id.slice(-6)}</div>
          </div>
          
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=320,height=600');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
    }
  };

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
