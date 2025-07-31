// backend/src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // A variável de ambiente MONGODB_URI é carregada a partir do server.js
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    // Encerra o processo com falha
    process.exit(1);
  }
};

module.exports = connectDB;