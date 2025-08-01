const dotenv = require('dotenv');
const path = require('path');

// Carrega as variáveis de ambiente do arquivo .env na raiz da pasta do backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

