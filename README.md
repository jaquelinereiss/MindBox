<div align="center">
  
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo" />

</div>



# 🧠 MindBox

> Uma plataforma mobile para organização pessoal, gestão de objetivos e planejamento de atividades baseada em boxes personalizadas.

O MindBox é um produto em evolução desenvolvido para centralizar rotinas, tarefas, metas, ideias e projetos em uma única experiência mobile.

A proposta da aplicação é permitir que cada usuário organize diferentes áreas da vida por meio de boxes personalizadas, criando uma estrutura flexível para acompanhamento de atividades, planejamento e tomada de decisões no dia a dia.

O projeto foi estruturado com foco em escalabilidade, componentização e separação de responsabilidades, permitindo a evolução contínua de funcionalidades sem comprometer a experiência do usuário ou a manutenção do código.


## ✨ Visão Geral

O crescimento constante da quantidade de informações que gerenciamos diariamente torna cada vez mais importante a existência de ferramentas simples, rápidas e eficientes para organização pessoal.

O MindBox foi concebido para atender essa necessidade através de uma abordagem centrada em:

* Organização por contexto
* Planejamento de curto e longo prazo
* Facilidade de navegação
* Experiência mobile intuitiva
* Escalabilidade funcional

Cada Box funciona como um espaço independente onde o usuário pode armazenar tarefas, objetivos e informações relacionadas a uma área específica da sua rotina.

A arquitetura do produto foi projetada para permitir evolução contínua sem comprometer manutenibilidade, reutilização de código ou experiência do usuário.

## 🚀 Principais Funcionalidades

### Gestão de Boxes

* Criação de Boxes personalizadas
* Organização por contexto, área da vida ou projeto
* Atualização e gerenciamento de informações
* Persistência em banco de dados

### Gerenciamento de Itens

* Criação de atividades vinculadas a uma Box
* Definição de informações como título, descrição e prioridade
* Edição e exclusão de registros
* Estrutura preparada para evolução de metadados adicionais

### Tela Inicial

* Exibição da semana atual
* Identificação do dia corrente
* Área para ações rápidas
* Dashboard com o progresso atual
* Componentização voltada para expansão futura

### Integração com Calendário

A aplicação consome uma API responsável por fornecer informações relacionadas ao calendário e à composição da visão temporal utilizada pelo app.

### Autenticação

* Cadastro de usuários
* Login seguro
* Integração com Supabase Authentication

### Persistência de Dados

Todos os dados relacionados às Boxes e seus respectivos itens e perfil de usuário são armazenados e sincronizados através do Supabase.


## 🏗️ Arquitetura da Solução

O MindBox adota uma arquitetura baseada em separação de responsabilidades, favorecendo legibilidade, escalabilidade e manutenção de longo prazo.

## Camada de Apresentação

Responsável pela experiência do usuário.

Características:

* React Native + TypeScript
* Componentes reutilizáveis
* Navegação desacoplada
* Design orientado a componentes
* Estrutura preparada para crescimento de funcionalidades

## Camada de Lógica

Implementada por meio de hooks customizados e serviços especializados.

Responsabilidades:

* Regras de negócio
* Tratamento de formulários
* Controle de carregamento
* Integração com APIs

## Camada de Dados

Responsável pela comunicação com serviços externos.

Inclui:

* Supabase Client
* Serviços de autenticação
* Persistência de dados
* Consumo de APIs REST
* Tratamento de erros e respostas

## ⚙️ Stack Tecnológica

### Mobile

* React Native
* TypeScript
* React Navigation
* Expo

### Arquitetura e Engenharia

* Componentização de UI
* Hooks Customizados
* Separação de responsabilidades
* Tipagem forte
* Reutilização de código
* Padronização de interfaces e contratos

### Backend e Serviços

* APIs REST desenvolvidas em Node.js e Express
* Supabase como plataforma de autenticação e persistência
* Serviços desacoplados para integração entre aplicações

### Banco de Dados e Autenticação

* Supabase Database
* Supabase Authentication

### Integração

* Fetch API
* Serviços assíncronos
* Comunicação entre aplicações

## 📂 Estrutura do Projeto

```text
src
├── components
│
├── screens
│
├── hooks
│
├── services
│
├── navigation
│
├── types
│
└── utils
```

A organização busca manter responsabilidades bem definidas, reduzindo acoplamento entre camadas e facilitando a evolução do produto.

## 🔗 Integrações Externas

### 🔹 Calendar API

API desenvolvida de forma independente e integrada ao ecossistema do MindBox.

Responsável por fornecer:

* Semana atual
* Índice do dia corrente

Repositório:

▸ https://github.com/jaquelinereiss/CalendarApi

### 🔹 Supabase

Utilizado como plataforma principal de backend para:

* Persistência de dados
* Autenticação
* Gerenciamento de usuários
* Sincronização de informações

## 🎯 Princípios de Arquitetura

O desenvolvimento do MindBox segue alguns princípios para garantir escalabilidade e manutenibilidade:

- Separação clara entre UI, regras de negócio e acesso a dados
- Componentes reutilizáveis e desacoplados
- Tipagem forte utilizando TypeScript
- Centralização de integrações externas em serviços dedicados
- Organização orientada a funcionalidades
- Evolução incremental baseada em pequenas entregas

# 🛣️ Roadmap

O MindBox está em evolução contínua.

Próximas funcionalidades planejadas:

### ∴ Curto Prazo

* Checklist independente
* Planejamento estratégico por metas
* Lembretes e notificações
* Favoritos
* Melhorias de UX
* Refinamento visual

### ∴ Médio Prazo

* Integração com calendário do dispositivo físico
* Expandir indicadores de produtividade no dashboard

### ∴ Longo Prazo

* Estatísticas de uso e/ou Gamificação
* Sincronização entre usuários por compartilhamento de boxes
* Planejamento estratégico para equipes

## 📱 Preview da Aplicação
#### ‧ Organização e Planejamento

<p align="center">
  <img width="240" alt="mindbox-home" src="https://github.com/user-attachments/assets/714103c5-c896-4949-a245-625a001c2ef3" />
  <img width="240" alt="mindbox-calendar" src="https://github.com/user-attachments/assets/aa05337b-59c6-459b-804f-e165396e2f0d" />
  <img width="240" alt="mindbox-dashboard" src="https://github.com/user-attachments/assets/87ee2018-bf62-4a91-b0ac-4ba013b143d5" />
</p>

#### ‧ Gestão de Boxes e Itens

<p align="center">
  <img width="240" alt="mindbox-add" src="https://github.com/user-attachments/assets/8d016bbf-4a07-4137-998c-5d808a0ae2f8" />
  <img width="240" alt="mindbox-boxes" src="https://github.com/user-attachments/assets/b3ee0dd5-f026-47e0-902c-ffefbb3bb15d" />
  <img width="240" alt="mindbox-details" src="https://github.com/user-attachments/assets/36c2d776-4c9f-4f6e-900d-831ad16d8b38" />
</p>

## 👩‍💻 Sobre a Desenvolvedora

O MindBox é idealizado e desenvolvido por Jaqueline Reis.

Desde a concepção da solução até sua implementação, todas as etapas do produto são conduzidas de forma independente, incluindo definição de requisitos, arquitetura da aplicação, desenvolvimento mobile, construção de APIs, modelagem de dados, autenticação e evolução contínua da experiência do usuário.

O projeto reflete uma abordagem full stack orientada à construção de produtos digitais escaláveis, priorizando qualidade de código, organização arquitetural, experiência do usuário e entregas incrementais.

<div align="center">
  <a href="https://github.com/jaquelinereiss">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/jaquelinereiz">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
</div>
