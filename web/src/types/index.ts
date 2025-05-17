// Interface que representa um usuário no sistema, contendo suas informações básicas e status
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
}