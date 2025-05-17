
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
      if (user.tipo === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Index;
