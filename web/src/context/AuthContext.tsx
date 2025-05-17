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
  deactivateUser: (userId: string) => Promise<void>;
  activateUser: (userId: string) => Promise<void>;
  loadUsers: () => Promise<void>;
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
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há um token e usuário salvos no localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      loadUsers(); // Carrega usuários se houver um token
    }
    setIsLoading(false);
  }, []);

  const loadUsers = async () => {
    try {
      const loadedUsers = await auth.getUsers();
      setUsers(loadedUsers.map(user => ({
        ...user,
        isAdmin: user.role === 'ADMIN'
      })));
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erro ao carregar lista de usuários');
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await auth.login({ username, password });
      
      const userData = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        isAdmin: response.user.role === 'ADMIN',
        status: response.user.status
      };

      if (response.user.status === 'INACTIVE') {
        toast.error('Sua conta está inativa. Por favor, entre em contato para renovar seu contrato.');
        throw new Error('INACTIVE_USER');
      }

      setUser(userData);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirecionar com base no tipo de usuário
      if (userData.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'INACTIVE_USER') {
        // Já exibimos a mensagem específica acima
        return;
      }
      toast.error('Usuário ou senha inválidos!');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
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
        email: response.user.email,
        password: password, // Keep password for local auth
        isAdmin: response.user.role === 'ADMIN',
        status: response.user.status
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

  const deactivateUser = async (userId: string) => {
    try {
      await auth.deactivateUser(userId);
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'INACTIVE' }
          : user
      ));
      toast.success('Usuário desativado com sucesso!');
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error('Erro ao desativar usuário');
    }
  };

  const activateUser = async (userId: string) => {
    try {
      await auth.activateUser(userId);
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'ACTIVE' }
          : user
      ));
      toast.success('Usuário ativado com sucesso!');
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error('Erro ao ativar usuário');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users,
      login, 
      logout, 
      isLoading,
      addUser,
      removeUser,
      deactivateUser,
      activateUser,
      loadUsers
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
