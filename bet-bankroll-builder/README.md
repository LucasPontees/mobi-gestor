
# Bet Manager - Sistema de Gerenciamento de Apostas Esportivas

![Bet Manager](https://github.com/user/bet-manager/raw/main/public/favicon.ico)

## Sobre o Sistema

O Bet Manager é uma aplicação web desenvolvida para gerenciar apostas esportivas de forma eficiente e organizada. O sistema permite que usuários acompanhem suas apostas, monitorem o desempenho da banca e visualizem estatísticas detalhadas para tomada de decisões mais assertivas.

## Funcionalidades Principais

### Para Usuários Comuns
- **Gerenciamento de Apostas**: Registro e acompanhamento de apostas esportivas
- **Controle de Banca**: Monitoramento do saldo da banca e sugestões de valor para apostas
- **Histórico de Apostas**: Visualização completa do histórico de apostas com filtros
- **Estatísticas de Desempenho**: Taxa de acerto, lucro/prejuízo total, crescimento da banca

### Para Administradores
- **Visão Geral do Sistema**: Estatísticas consolidadas de todos os usuários
- **Gerenciamento de Usuários**: Adicionar/remover usuários e definir permissões
- **Análise de Dados**: Visualização de times mais apostados, tipos de apostas mais populares
- **Monitoramento de Performance**: Acompanhamento do desempenho de cada usuário

## Tecnologias Utilizadas

O sistema foi desenvolvido utilizando as seguintes tecnologias:

- **Frontend**: React, TypeScript, Tailwind CSS
- **Biblioteca de UI**: shadcn/ui
- **Gerenciamento de Estado**: React Context API, React Query
- **Roteamento**: React Router
- **Visualização de Dados**: Recharts
- **Notificações**: Sonner (toast notifications)

## Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── admin/         # Componentes específicos para administração
│   ├── layout/        # Componentes de layout (Header, etc)
│   └── ui/            # Componentes de UI (shadcn)
├── context/           # Contextos React (AuthContext, etc)
├── hooks/             # Hooks personalizados
├── lib/               # Funções utilitárias
├── pages/             # Páginas principais da aplicação
└── types/             # Definições de tipos TypeScript
```

## Autenticação e Autorização

O sistema possui dois tipos de usuários:

1. **Usuário Comum**: Acesso ao dashboard pessoal para gerenciar suas próprias apostas
2. **Administrador**: Acesso ao painel administrativo com visão geral do sistema e gerenciamento de usuários

A autenticação é feita através de um sistema de login simples com nome de usuário e senha.
Após o login, o usuário é redirecionado automaticamente para sua respectiva área:
- Administradores são direcionados para `/admin`
- Usuários comuns são direcionados para `/dashboard`

## Gerenciamento da Banca

O sistema utiliza uma abordagem matemática para gerenciar a banca do usuário:

- **Valor Inicial da Banca**: Definido nas configurações do usuário
- **Percentual de Risco Diário**: Porcentagem da banca que o usuário está disposto a arriscar por dia
- **Multiplicador de Retorno Esperado**: Fator que define o retorno esperado para cada aposta

Com base nesses parâmetros, o sistema calcula automaticamente:

- **Valor Sugerido para Aposta**: Porcentagem da banca atual
- **Lucro Esperado**: Valor sugerido multiplicado pelo multiplicador de retorno
- **Taxa de Crescimento da Banca**: Crescimento percentual desde o valor inicial

## Fluxo de Trabalho

### Para Usuários Comuns:

1. Faça login no sistema
2. Visualize o estado atual da sua banca e estatísticas no dashboard
3. Adicione uma nova aposta com os detalhes do confronto e valor
4. Acompanhe o resultado da aposta e atualize seu status (green/red/pendente)
5. Analise o histórico de apostas e performance geral

### Para Administradores:

1. Faça login com credenciais de administrador
2. Acesse o painel administrativo
3. Visualize estatísticas gerais do sistema
4. Gerencie usuários (adicionar novos, remover existentes)
5. Analise o desempenho de cada usuário e padrões de apostas

## Conceitos de Apostas

- **Green**: Aposta ganha (lucro)
- **Red**: Aposta perdida (prejuízo)
- **Pendente**: Aposta ainda não finalizada

## Instalação e Execução Local

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm, yarn ou bun

### Passos para Instalação

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>

# 2. Entre no diretório do projeto
cd bet-manager

# 3. Instale as dependências
npm install

# 4. Execute o projeto em modo de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173/`

### Credenciais de Demonstração

- **Administrador**: 
  - Usuário: admin
  - Senha: admin123

- **Usuário comum**:
  - Usuário: user
  - Senha: user123

## Implementações Futuras

- Integração com APIs de odds esportivas
- Sistema de notificações para apostas pendentes
- Exportação de relatórios em PDF
- Recurso de importação em massa de apostas
- Versão mobile com aplicativo nativo

## Contribuição

Contribuições são bem-vindas! Por favor, sinta-se à vontade para enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
