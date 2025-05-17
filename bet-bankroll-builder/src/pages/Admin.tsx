
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { UserManagement } from "@/components/admin/UserManagement";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { AdminRoute } from "@/components/AdminRoute";
import { useAuth } from "@/context/AuthContext";
import { Bet } from "@/types";
import { useAdminStats } from "@/hooks/useAdminStats";

const Admin = () => {
  const { users } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);

  // Carregar apostas do localStorage
  useEffect(() => {
    const savedBets = localStorage.getItem("bets");
    if (savedBets) {
      setBets(JSON.parse(savedBets));
    }
  }, []);

  // Calcular estatísticas administrativas
  const stats = useAdminStats({ bets, users });

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container py-6 flex-1">
          <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <StatsOverview stats={stats} />
            </TabsContent>
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;
