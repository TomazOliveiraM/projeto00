// ... outras importações
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/auth'); // Ajuste o caminho se necessário
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

// --- Criação da Instância do App ---
// CORREÇÃO: A instância do app precisa ser criada antes de ser usada.
const app = express();

// --- Middlewares ---
// Habilita CORS para permitir requisições do seu frontend
app.use(cors());

// Habilita o parsing de JSON no corpo das requisições
app.use(express.json());

// --- Configuração do Passport.js ---
// Inicializa o Passport
app.use(passport.initialize());
// Carrega as estratégias de autenticação (local, google, etc.)
// CORREÇÃO: O caminho deve ser relativo à pasta `src`, onde `app.js` está.
require('./config/passport')(passport);

// --- Rotas da API ---
// Define as rotas de autenticação sob o prefixo /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// --- Exportação ---
// Exporta o app configurado para ser usado pelo server.js
module.exports = app;

// ... app.listen
