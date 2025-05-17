// Arquivo que contém as configurações e funções de API para autenticação e gerenciamento de usuários
import ky from 'ky';

// Cria uma instância configurada do cliente HTTP ky
// Define a URL base e adiciona o token de autenticação automaticamente nas requisições
export const api = ky.create({
  prefixUrl: 'http://localhost:3333', // URL base do backend
  hooks: {
    beforeRequest: [
      request => {
        const token = localStorage.getItem('token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ]
  }
});

// Interface que define os dados necessários para fazer login
export interface LoginData {
  username: string;
  password: string;
}

// Interface que define a resposta do servidor ao fazer login
export interface LoginResponse {
  access_token: string; // Token JWT para autenticação
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    status: 'ACTIVE' | 'INACTIVE';
  };
}

// Interface que define os dados necessários para registrar um novo usuário
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Interface que define a resposta do servidor ao registrar um usuário
export interface RegisterResponse {
  access_token: string; // Token JWT para autenticação
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    status: 'ACTIVE' | 'INACTIVE';
  };
}

// Interface que define a estrutura de dados de um usuário
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Objeto que agrupa todas as funções de autenticação e gerenciamento de usuários
export const auth = {
  // Função para realizar login
  login: (data: LoginData) =>
    api.post('auth/login', { json: data }).json<LoginResponse>(),
  
  // Função para registrar novo usuário
  register: (data: RegisterData) => 
    api.post('auth/register', { json: data }).json<RegisterResponse>(),
  
  // Função para desativar um usuário específico
  deactivateUser: (userId: string) =>
    api.patch(`users/${userId}/deactivate`).json(),
  
  // Função para ativar um usuário específico
  activateUser: (userId: string) =>
    api.patch(`users/${userId}/activate`).json(),
  
  // Função para obter lista de todos os usuários
  getUsers: () => 
    api.get('users').json<User[]>(),
};
