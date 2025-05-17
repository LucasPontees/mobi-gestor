import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { auth } from '@/http/api';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  addUser: (username: string, email: string, password: string, isAdmin: boolean) => Promise<void>;
  removeUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários mockados para demonstração
const DEFAULT_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    isAdmin: true
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    isAdmin: false
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<(User & { password: string })[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há usuários salvos no localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(DEFAULT_USERS);
      localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
    }

    // Verificar se há um usuário salvo no localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Simulando uma chamada de API
    setIsLoading(true);
    
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = users.find(
        u => u.username === username && u.password === password
      );
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        // Redirecionar com base no tipo de usuário
        if (userWithoutPassword.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
        
        toast.success('Login realizado com sucesso!');
      } else {
        toast.error('Usuário ou senha inválidos!');
      }
    } catch (error) {
      toast.error('Erro ao tentar fazer login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
    toast.info('Você foi desconectado');
  };

  const addUser = async (username: string, email: string, password: string, isAdmin: boolean) => {
    try {
      const response = await auth.register({
        username,
        email,
        password
      });
      
      // Add the new user to the local state with password for local auth
      const newUser = {
        id: response.user.id,
        username: response.user.username,
        password: password, // Keep password for local auth
        isAdmin: response.user.role === 'ADMIN'
      };
      
      setUsers(prev => [...prev, newUser]);
      toast.success(`Usuário ${username} registrado com sucesso!`);
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('Erro ao registrar usuário. Por favor, tente novamente.');
      throw error; // Re-throw to handle in the component
    }
  };

  const removeUser = (userId: string) => {
    if (userId === '1') {
      toast.error('Não é possível remover o usuário admin principal');
      return;
    }
    
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('Usuário removido com sucesso!');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users: users.map(({password, ...user}) => user), 
      login, 
      logout, 
      isLoading,
      addUser,
      removeUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
