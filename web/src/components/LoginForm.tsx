import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

   const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <Card className="w-[350px] bg-primary-dark">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-text-primary">Login</CardTitle>
        <CardDescription className="text-text-primary">
          Entre com suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username" className="text-text-primary">Usuário</Label>
            <Input
              id="username"
              type="text"
              placeholder="Seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              ref={inputRef}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-text-primary">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
