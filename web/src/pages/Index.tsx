
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/LoginForm";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirecionar para a página apropriada com base no tipo de usuário
  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Cash Alto</h1>
        <p className="text-muted-foreground">Sistema de gerenciamento de apostas esportivas</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Index;
