import { OrderWithItems } from '@shared/schema';

const DISH_CATEGORIES = {
  'antipasti': 'ANTIPASTI',
  'primi': 'PRIMI PIATTI', 
  'secondi': 'SECONDI PIATTI',
  'contorni': 'CONTORNI',
  'dolci': 'DOLCI',
  'bevande': 'BEVANDE'
};

export const printKitchenReceipt = (order: OrderWithItems) => {
  const receiptContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Scontrino Cucina</title>
        <style>
          @media print {
            @page { margin: 1mm; size: 58mm auto; }
            body { margin: 0; padding: 0; }
          }
          body {
            font-family: 'Courier New', monospace;
            font-size: 8px;
            line-height: 1.0;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 2mm;
            width: 54mm;
          }
          .header {
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 4px;
            margin-bottom: 6px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
            font-weight: bold;
            font-size: 9px;
          }
          .footer {
            border-top: 1px dashed #000;
            padding-top: 4px;
            text-align: center;
            margin-top: 6px;
            font-size: 7px;
          }
          .category {
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            padding-bottom: 1px;
            margin: 4px 0 2px 0;
            font-size: 7px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="font-weight: bold; font-size: 9px;">🍽️ CUCINA 🍽️</div>
          <div style="font-size: 8px; margin-top: 2px;">CRCS BERGEGGI</div>
          <div style="margin-top: 3px;">
            <div style="font-weight: bold;">T.${order.tableNumber} - ${order.customerName}</div>
            <div style="font-size: 7px;">Coperti: ${order.covers}</div>
            <div style="font-size: 6px;">
              ${new Date(order.createdAt).toLocaleDateString('it-IT')} ${new Date(order.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        
        <div>
          ${Object.entries(DISH_CATEGORIES).map(([categoryKey, categoryLabel]) => {
            const categoryItems = order.items.filter(item => item.dish.category === categoryKey);
            if (categoryItems.length === 0) return '';
            
            return `
              <div class="category">${categoryLabel}</div>
              ${categoryItems.map(item => `
                <div class="item">
                  <span>${item.dish.name}</span>
                  <span>x${item.quantity}</span>
                </div>
              `).join('')}
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

  const printWindow = window.open('', '_blank', 'width=220,height=400');
  if (printWindow) {
    printWindow.document.write(receiptContent);
    printWindow.document.close();
  }
};

export const printCustomerReceipt = (order: OrderWithItems) => {
  const receiptContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Scontrino Cliente</title>
        <style>
          @media print {
            @page { margin: 1mm; size: 58mm auto; }
            body { margin: 0; padding: 0; }
          }
          body {
            font-family: 'Courier New', monospace;
            font-size: 8px;
            line-height: 1.0;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 2mm;
            width: 54mm;
          }
          .header {
            text-align: center;
            margin-bottom: 4px;
            border-bottom: 1px solid #000;
            padding-bottom: 4px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1px;
            font-size: 7px;
          }
          .total {
            border-top: 1px solid #000;
            padding-top: 4px;
            margin-top: 4px;
          }
          .footer {
            text-align: center;
            border-top: 1px solid #000;
            padding-top: 4px;
            margin-top: 4px;
            font-size: 6px;
          }
          .category {
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px dashed #666;
            padding-bottom: 1px;
            margin: 3px 0 1px 0;
            font-size: 6px;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="font-size: 9px; font-weight: bold;">CRCS BERGEGGI</div>
          <div style="font-size: 6px; margin-top: 1px;">Circolo Ricreativo Culturale Sportivo</div>
        </div>
        
        <div style="margin-bottom: 4px; font-size: 7px;">
          <div>Tavolo: ${order.tableNumber}</div>
          <div>Cliente: ${order.customerName}</div>
          <div>Coperti: ${order.covers}</div>
          <div style="font-size: 6px;">
            ${new Date(order.createdAt).toLocaleDateString('it-IT')} - ${new Date(order.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <div style="border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 4px;">
          ${Object.entries(DISH_CATEGORIES).map(([categoryKey, categoryLabel]) => {
            const categoryItems = order.items.filter(item => item.dish.category === categoryKey);
            if (categoryItems.length === 0) return '';
            
            return `
              <div class="category">${categoryLabel}</div>
              ${categoryItems.map(item => `
                <div class="item">
                  <div style="flex: 1;">
                    <span>${item.dish.name}</span>
                    <span style="font-size: 6px;"> x${item.quantity}</span>
                  </div>
                  <span>€${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
            `;
          }).filter(section => section).join('')}
        </div>
        
        <div class="total">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 9px; margin-bottom: 1px;">
            <span>TOTALE:</span>
            <span>€${parseFloat(order.total).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 7px;">
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

  const printWindow = window.open('', '_blank', 'width=220,height=400');
  if (printWindow) {
    printWindow.document.write(receiptContent);
    printWindow.document.close();
  }
};