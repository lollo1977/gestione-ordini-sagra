import type { DishCategory } from "@shared/schema";
import { DISH_CATEGORIES } from "@shared/schema";

export default function ReceiptTemplates() {
  return (
    <>
      {/* Kitchen Receipt Template (Hidden) */}
      <div id="kitchen-receipt-template" className="print-only">
        <div className="max-w-md mx-auto bg-white p-4 text-black">
          <div className="text-center border-b-2 border-dashed border-gray-400 pb-2 mb-4">
            <h2 className="text-lg font-bold">CUCINA</h2>
            <p className="text-sm">Tavolo: <span id="kitchen-table">5</span></p>
            <p className="text-sm">Cliente: <span id="kitchen-customer">Famiglia Bianchi</span></p>
            <p className="text-xs text-gray-600" id="kitchen-time">15/11/2024 - 14:32</p>
          </div>
          
          <div className="space-y-2" id="kitchen-items">
            <div className="flex justify-between items-center">
              <span className="font-medium">Spaghetti Carbonara</span>
              <span className="font-bold text-lg">x2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Pizza Margherita</span>
              <span className="font-bold text-lg">x1</span>
            </div>
          </div>
          
          <div className="border-t-2 border-dashed border-gray-400 mt-4 pt-2 text-center">
            <p className="text-xs text-gray-600">Ordine #<span id="kitchen-order-number">127</span></p>
          </div>
        </div>
      </div>

      {/* Customer Receipt Template (Hidden) */}
      <div id="customer-receipt-template" className="print-only">
        <div className="max-w-md mx-auto bg-white p-4 text-black">
          <div className="text-center border-b border-gray-300 pb-3 mb-4">
            <h1 className="text-xl font-bold">SAGRA DEL PAESE</h1>
            <p className="text-sm text-gray-600">Via Roma, 123 - Tel. 123-456-789</p>
            <p className="text-xs text-gray-600">P.IVA: 12345678901</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm">Tavolo: <span id="customer-table">5</span></p>
            <p className="text-sm">Cliente: <span id="customer-name">Famiglia Bianchi</span></p>
            <p className="text-xs text-gray-600" id="customer-time">15/11/2024 - 14:32</p>
          </div>
          
          <div className="border-b border-gray-300 pb-3 mb-3" id="customer-items">
            <div className="flex justify-between items-center mb-1">
              <div className="flex-1">
                <span>Spaghetti Carbonara</span>
                <span className="text-sm text-gray-600"> x2</span>
              </div>
              <span>€24.00</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex-1">
                <span>Pizza Margherita</span>
                <span className="text-sm text-gray-600"> x1</span>
              </div>
              <span>€8.50</span>
            </div>
          </div>
          
          <div className="space-y-1 mb-4">
            <div className="flex justify-between font-bold text-lg">
              <span>TOTALE:</span>
              <span id="customer-total">€32.50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pagamento:</span>
              <span id="customer-payment">Contanti</span>
            </div>
          </div>
          
          <div className="text-center border-t border-gray-300 pt-3">
            <p className="text-xs text-gray-600">Grazie per la visita!</p>
            <p className="text-xs text-gray-600">Ordine #<span id="customer-order-number">127</span></p>
          </div>
        </div>
      </div>
    </>
  );
}
