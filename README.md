# 🧠 MindBox

Um aplicativo mobile para organizar rotinas, ideias, tarefas e objetivos em Boxes personalizadas. O MindBox oferece uma experiência fluida com visão por calendário, dashboards e ferramentas para criação e gerenciamento de itens.

O projeto está em desenvolvimento contínuo, com foco em evolução técnica, componentização e boas práticas de código.


## ⚙️ Tecnologias Utilizadas

### **Frontend (Aplicativo Mobile)**
- **React Native**: base do app mobile, responsável pela interface, telas e navegação
- **TypeScript**: tipagem estática para maior segurança, padronização e previsibilidade no código
- **React Hooks**: controle de estado e efeitos, deixando a lógica do app simples e reutilizável
- **Componentização de UI**: estrutura modular com componentes reutilizáveis (formulários, modais, botões e cards)

### **Backend e Serviços**
- **CalendarApi (Node.js + Express)**  
  API própria consumida pelo app para fornecer dados de calendário, como semana atual e índice do dia.
  - Confira no repositório: **[CalendarApi](https://github.com/jaquelinereiss/CalendarApi)**  
- **Supabase**  
  Utilizado para:  
  - banco de dados  
  - persistência de boxes e itens  
  - autenticação  

### **Comunicação e Manipulação de Dados**
- **Async Requests (Fetch / Supabase Client)**  
  Utilizados para:  
  - consumir a CalendarApi  
  - inserir, listar, excluir e atualizar dados no Supabase


## 💡 Funcionalidades Atuais

- 📦 **Boxes personalizadas**  
  Criadas pelo usuário, cada box representa uma área da vida, rotina ou projeto.

- 📝 **Itens dentro das boxes**  
  Cada item pertencente a um box pode ter título, descrição, prazos e outros metadados relevantes.

- 🧭 **Menu inferior funcional**  
  Mantém navegação fluida entre Home, Boxes e outras seções.

- 📅 **Dashboard e Calendário**  
  A tela inicial é estruturada em componentes para exibir:  
  - Semana corrente  
  - Atividades do dia  
  - Cards de ações rápidas 


## 🧩 Arquitetura e Componentização

A arquitetura do MindBox é pensada para crescer com o projeto:

- Componentes reutilizáveis  
- Formulários componentizados  
- Navegação organizada  
- Placeholders e textos com identidade própria  
- Código limpo e fácil de manter  


## 🚀 Melhorias Futuras

- ⚡ Perfil de usuário 
- ⭐ Favoritos e Metas
- 🔔 Sistema de lembretes e notificações  
- 🔮 Painel de métricas expandido


## 👩‍💻 Autora

Desenvolvido por **[Jaqueline Reis](https://github.com/jaquelinereiss)**  - desenvolvedora full-stack responsável pela concepção do produto, desenvolvimento do aplicativo mobile em React Native, construção da API em Node.js/Express, integração com banco de dados e autenticação via Supabase, além da definição da arquitetura e aplicação de boas práticas de código.


## Preview
<div style="display: flex; gap: 10px;">
  <img width="280" alt="mindbox-tela1" src="https://github.com/user-attachments/assets/023f9586-d4d3-447c-91e5-fae6505a9917" />
  <img width="280" alt="mindbox-tela2" src="https://github.com/user-attachments/assets/528b1056-b0ca-4597-a6e7-92190b75b0f0" />
  <img width="280" alt="mindbox-tela3" src="https://github.com/user-attachments/assets/9b17df83-68cc-43e3-bac9-41ced783c06d" />
</div>

