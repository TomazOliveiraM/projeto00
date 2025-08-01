const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscribedAt: { type: Date, default: Date.now },
});

// Garante que um usuário só pode se inscrever uma vez em cada evento
SubscriptionSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);