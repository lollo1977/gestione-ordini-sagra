import { useState } from "react";
import { Utensils, Receipt, List, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderForm from "@/components/order-form";
import ActiveOrders from "@/components/active-orders";
import MenuManagement from "@/components/menu-management";
import Reports from "@/components/reports";
import ReceiptTemplates from "@/components/receipt-templates";

type TabType = "ordini" | "menu" | "report";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("ordini");

  const tabs = [
    { id: "ordini" as const, label: "Ordini", icon: Receipt },
    { id: "menu" as const, label: "Menù", icon: List },
    { id: "report" as const, label: "Report", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Utensils className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Gestione Ordini</h1>
            </div>
            <nav className="flex space-x-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "ordini" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderForm />
            <ActiveOrders />
          </div>
        )}

        {activeTab === "menu" && <MenuManagement />}

        {activeTab === "report" && <Reports />}
      </main>

      <ReceiptTemplates />
    </div>
  );
}
