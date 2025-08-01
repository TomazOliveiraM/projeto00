const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Event = require('../models/Event');
const Comment = require('../models/Comment');

let adminToken, participantToken, otherParticipantToken;
let adminUser, participantUser, otherParticipantUser;
let testEvent;
let mongoServer;

beforeAll(async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Criar usuários
  [adminUser, participantUser, otherParticipantUser] = await User.create([
    { name: 'Admin', email: 'admin_comment@test.com', password: 'password123', role: 'admin' },
    { name: 'Participant', email: 'participant_comment@test.com', password: 'password123', role: 'participante' },
    { name: 'Other Participant', email: 'other_participant@test.com', password: 'password123', role: 'participante' }
  ]);

  // Criar tokens
  const createToken = (user) => jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
  adminToken = createToken(adminUser);
  participantToken = createToken(participantUser);
  otherParticipantToken = createToken(otherParticipantUser);

  // Criar um evento
  testEvent = new Event({
    title: 'Event for Comments',
    description: 'An event to test comments and ratings.',
    date: new Date(),
    location: 'Test Location',
    category: 'Testing',
    organizer: adminUser._id, // um admin pode ser organizador para simplificar
    participants: [participantUser._id, otherParticipantUser._id]
  });
  await testEvent.save();
});

afterEach(async () => {
  await Comment.deleteMany();
});

afterAll(async () => {
  await User.deleteMany();
  await Event.deleteMany();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Comment API', () => {
  // === POST /api/events/:eventId/comments ===
  describe('POST /api/events/:eventId/comments', () => {
    it('deve permitir que um participante adicione um comentário', async () => {
      const res = await request(app)
        .post(`/api/events/${testEvent.id}/comments`)
        .set('Authorization', `Bearer ${participantToken}`)
        .send({ text: 'This is a great event!', rating: 5 })
        .expect(201);

      expect(res.body).toHaveProperty('text', 'This is a great event!');
      expect(res.body).toHaveProperty('rating', 5);
      expect(res.body.author._id).toBe(participantUser.id.toString());
    });

    it('não deve permitir que um usuário não autenticado comente', async () => {
      await request(app)
        .post(`/api/events/${testEvent.id}/comments`)
        .send({ text: 'Trying to comment without login' })
        .expect(401);
    });

    it('não deve permitir que um usuário que não é participante comente', async () => {
      const nonParticipant = await User.create({ name: 'Non Participant', email: 'non@participant.com', password: 'password123', role: 'participante' });
      const nonParticipantToken = jwt.sign({ user: { id: nonParticipant.id, role: nonParticipant.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

      await request(app)
        .post(`/api/events/${testEvent.id}/comments`)
        .set('Authorization', `Bearer ${nonParticipantToken}`)
        .send({ text: 'I was not invited' })
        .expect(403); // Forbidden
    });

    it('deve retornar um erro de validação para um comentário vazio', async () => {
      await request(app)
        .post(`/api/events/${testEvent.id}/comments`)
        .set('Authorization', `Bearer ${participantToken}`)
        .send({ text: '' })
        .expect(400);
    });

    it('deve impedir que um usuário comente duas vezes no mesmo evento', async () => {
      // Primeiro comentário
      await request(app)
        .post(`/api/events/${testEvent.id}/comments`)
        .set('Authorization', `Bearer ${otherParticipantToken}`)
        .send({ text: 'My first comment' })
        .expect(201);

      // Segunda tentativa
      await request(app)
        .post(`/api/events/${testEvent.id}/comments`)
        .set('Authorization', `Bearer ${otherParticipantToken}`)
        .send({ text: 'My second comment' })
        .expect(400); // Bad Request - já comentou
    });
  });

  // === GET /api/events/:eventId/comments ===
  describe('GET /api/events/:eventId/comments', () => {
    it('deve retornar todos os comentários para um evento específico', async () => {
      await new Comment({
        text: 'A test comment for GET',
        event: testEvent.id,
        author: participantUser.id
      }).save();

      const res = await request(app)
        .get(`/api/events/${testEvent.id}/comments`)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(1);
      expect(res.body[0].text).toBe('A test comment for GET');
    });
  });

  // === DELETE /api/events/:eventId/comments/:commentId ===
  describe('DELETE /api/events/:eventId/comments/:commentId', () => {
    let commentToDelete;

    beforeEach(async () => {
      commentToDelete = await new Comment({
        text: 'This comment will be deleted',
        event: testEvent.id,
        author: participantUser.id
      }).save();
    });

    it('deve permitir que o autor delete seu próprio comentário', async () => {
      await request(app)
        .delete(`/api/events/${testEvent.id}/comments/${commentToDelete.id}`)
        .set('Authorization', `Bearer ${participantToken}`)
        .expect(200);

      const foundComment = await Comment.findById(commentToDelete.id);
      expect(foundComment).toBeNull();
    });

    it('deve permitir que um admin delete qualquer comentário', async () => {
      await request(app)
        .delete(`/api/events/${testEvent.id}/comments/${commentToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const foundComment = await Comment.findById(commentToDelete.id);
      expect(foundComment).toBeNull();
    });

    it('não deve permitir que um usuário delete o comentário de outro usuário', async () => {
      await request(app)
        .delete(`/api/events/${testEvent.id}/comments/${commentToDelete.id}`)
        .set('Authorization', `Bearer ${otherParticipantToken}`)
        .expect(403); // Forbidden
    });
  });
});
