# Sistema de Gerenciamento de Eventos

Este é um projeto Full-Stack que inclui um backend robusto construído com Node.js e Express, e um frontend moderno desenvolvido com React e Vite.

## 🚀 Stack de Tecnologias

O projeto utiliza uma variedade de tecnologias modernas para garantir performance, segurança e uma ótima experiência de desenvolvimento.

### Backend

*   **[Node.js](https://nodejs.org/)**: Ambiente de execução JavaScript no servidor.
*   **[Express.js](https://expressjs.com/)**: Framework web minimalista para a criação da API REST.
*   **[MongoDB](https://www.mongodb.com/)**: Banco de dados NoSQL orientado a documentos.
*   **[Mongoose](https://mongoosejs.com/)**: ODM (Object Data Modeling) para modelar os dados da aplicação para o MongoDB.
*   **Autenticação**:
    *   **[Passport.js](http://www.passportjs.org/)**: Middleware de autenticação modular.
    *   **[JSON Web Tokens (JWT)](https://jwt.io/)**: Para autenticação segura baseada em tokens.
    *   **[Passport-Local](https://github.com/jaredhanson/passport-local)**: Estratégia para autenticação com usuário e senha.
    *   **[Passport-Google-OAuth20](https://github.com/jaredhanson/passport-google-oauth2)**: Estratégia para login com contas Google.
    *   **[Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)**: Para hashing e segurança de senhas.
*   **[Express Validator](https://express-validator.github.io/docs/)**: Middleware para validação e sanitização de dados de entrada.
*   **[CORS](https://github.com/expressjs/cors)**: Middleware para habilitar o Cross-Origin Resource Sharing.
*   **[Dotenv](https://github.com/motdotla/dotenv)**: Para gerenciar variáveis de ambiente.

### Frontend

*   **[React](https://react.dev/)**: Biblioteca para construção de interfaces de usuário.
*   **[Vite](https://vitejs.dev/)**: Ferramenta de build e servidor de desenvolvimento extremamente rápido.
*   **[ESLint](https://eslint.org/)**: Ferramenta para análise estática de código, garantindo qualidade e padronização.

### Testes (Backend)

*   **[Jest](https://jestjs.io/)**: Framework de testes para JavaScript.
*   **[Supertest](https://github.com/ladjs/supertest)**: Biblioteca para testar endpoints de API HTTP.
*   **[MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)**: Inicia uma instância do MongoDB em memória para executar testes de forma isolada e rápida.

## 📂 Estrutura do Projeto

O projeto está organizado em duas pastas principais na raiz:

```
./
├── backend/         # Contém todo o código da API Node.js/Express
├── frontend/        # Contém a aplicação React
├── package.json     # Gerencia as dependências e scripts de ambos
└── README.md
```

## ⚙️ Pré-requisitos

*   **[Node.js](https://nodejs.org/)** (versão 18 ou superior)
*   **[NPM](https://www.npmjs.com/)** (geralmente vem com o Node.js)


