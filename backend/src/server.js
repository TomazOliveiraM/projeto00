const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente do arquivo .env na pasta pai (backend/)
// CORREÇÃO: Mova esta linha para o topo para garantir que as variáveis sejam carregadas antes de qualquer outro código.
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./config/db');
const app = require('./app'); // Importa a configuração do Express
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Conecta ao banco de dados e espera a conexão ser concluída
    await connectDB();
    console.log('Conectado ao MongoDB com sucesso!');

    // 2. Configura o servidor para produção (se aplicável)
    if (process.env.NODE_ENV === 'production') {
      // Define a pasta de build do frontend como estática
      app.use(express.static(path.join(__dirname, '../../frontend/build')));

      // Para qualquer rota que não seja da API, serve o index.html do frontend
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
      });
    }

    // 3. Inicia o servidor Express
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`));

  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1); // Encerra a aplicação em caso de erro crítico
  }
};

startServer();
