const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    // Sair do processo com falha
    process.exit(1);
  }
};

module.exports = connectDB;

