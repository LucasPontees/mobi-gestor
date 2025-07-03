# Plataforma de Logística Urbana e Gestão de Entregas

## 💡 Visão Geral

A Plataforma de Logística Urbana e Gestão de Entregas é uma solução SaaS voltada para empresas que atuam com entregas rápidas, centros de distribuição, transportadoras, franquias e marketplaces de entregas. O objetivo é centralizar, organizar e otimizar a gestão de múltiplos perfis logísticos sob uma única administradora, facilitando a operação, o monitoramento e a tomada de decisão.

---

## 🔍 Contexto

O crescimento do e-commerce e a demanda por entregas de última milha criaram desafios para empresas que precisam coordenar diferentes agentes logísticos. A plataforma propõe:

- Conectar centros de distribuição, transportadoras, entregadores autônomos e clientes finais.
- Oferecer uma interface única para administração, acompanhamento e análise de entregas.
- Permitir a gestão de múltiplas empresas ou filiais (multi-tenancy).

---

## 🎯 Funcionalidades Principais

- **Cadastro e Gestão de Perfis**: Administradora, Franquias, Transportadoras, Entregadores, Clientes.
- **Gestão de Entregas**: Criação, atribuição, roteirização e acompanhamento em tempo real.
- **Painel de Controle**: Dashboard com KPIs logísticos, status de entregas, mapas e relatórios.
- **Gestão de Veículos e Frotas**: Cadastro, manutenção e alocação de veículos.
- **Relatórios e Analytics**: Relatórios customizáveis sobre desempenho, SLA, custos e produtividade.
- **Notificações**: Alertas automáticos para eventos críticos (atrasos, falhas, entregas concluídas).
- **Integração via API**: Permite integração com ERPs, marketplaces e outros sistemas.
- **Controle de Acesso**: Permissões baseadas em papéis (RBAC) e autenticação segura.

---

## 🏗️ Arquitetura & Tecnologias

- **Backend**: NestJS, Prisma ORM, Docker, Swagger, Argon2 (hash de senhas), testes com Vitest.
- **Frontend**: React 18, Next.js 15, Tailwind CSS v4, Shadcn UI, Cypress para testes E2E.
- **Comunicação**: API RESTful com validação via Zod, consumo via Ky.
- **Autenticação**: Cookies HttpOnly, JWT, RBAC.
- **Boas Práticas**: SOLID, arquitetura MVC, documentação automática via Swagger.

---

## 📁 Organização do Projeto

```
api/         # Backend (NestJS, Prisma, Docker)
web/         # Frontend (React, Next.js, Tailwind)
```

---

## 🚀 Como Contribuir

1. Clone o repositório e instale as dependências.
2. Siga o padrão de organização das pastas e boas práticas do projeto.
3. Utilize PRs para propor melhorias ou correções.
4. Documente suas alterações.

---

## 📈 Roadmap Inicial

- [ ] Cadastro de usuários e perfis logísticos
- [ ] CRUD de entregas e roteirização
- [ ] Dashboard administrativo
- [ ] Relatórios e exportação de dados
- [ ] Integração com sistemas externos (API)
- [ ] Testes automatizados (unitários e E2E)

---

## 📝 Licença

Este projeto está sob a licença MIT.
