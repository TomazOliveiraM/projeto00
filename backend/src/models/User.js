const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    // A senha não é obrigatória, pois o usuário pode se cadastrar via Google
    required: false, 
  },
  role: {
    type: String,
    enum: ['participante', 'organizador', 'admin'],
    default: 'participante',
  },
  googleId: {
    type: String,
    // ID do Google não é obrigatório
    required: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para criptografar a senha antes de salvar
UserSchema.pre('save', async function (next) {
  // Só criptografa a senha se ela foi modificada (ou é nova) e não é um login social
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
