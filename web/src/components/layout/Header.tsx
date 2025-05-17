
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-card text-card-foreground">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">
            Bet Manager
          </h1>
          {user && (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              {user.isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Bem-vindo, <span className="font-medium text-foreground">{user.username}</span>
              {user.isAdmin && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Admin</span>}
            </span>
            <Button variant="outline" onClick={logout} size="sm">
              Sair
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
