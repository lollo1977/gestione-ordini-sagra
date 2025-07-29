import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useWebSocket } from "@/hooks/use-websocket";
import RegisterSelector from "@/components/register-selector";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function Router() {
  const [registerId, setRegisterId] = useState<1 | 2 | null>(() => {
    // Load from localStorage on startup
    const saved = localStorage.getItem('registerId');
    return saved ? parseInt(saved) as 1 | 2 : null;
  });
  
  // Initialize WebSocket connection for real-time sync
  useWebSocket(registerId || undefined);
  
  // Save to localStorage when changed
  const handleRegisterSelect = (id: 1 | 2) => {
    setRegisterId(id);
    localStorage.setItem('registerId', id.toString());
  };
  
  // Reset register selection
  const resetRegister = () => {
    setRegisterId(null);
    localStorage.removeItem('registerId');
  };
  
  // Show register selector if not selected
  if (!registerId) {
    return <RegisterSelector onRegisterSelect={handleRegisterSelect} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Register indicator */}
      <div className="bg-primary text-white px-4 py-2 flex justify-between items-center text-sm font-semibold">
        <span>🏪 CASSA {registerId} - Sincronizzazione Attiva</span>
        <button 
          onClick={resetRegister}
          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs transition-colors"
        >
          Cambia Cassa
        </button>
      </div>
      
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
