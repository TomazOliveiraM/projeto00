const request = require('supertest');
const app = require('./src/app'); // Supondo que seu app express seja exportado de src/app.js
const mongoose = require('mongoose');
const Event = require('./src/models/Event');
const User = require('./src/models/User');
const jwt = require('jsonwebtoken');

let organizerToken;
let organizerUser;
let participantToken;
let participantUser;
let adminToken;
let adminUser;
let mongoServer;

// Conectar ao banco de dados de teste antes de todos os testes
beforeAll(async () => {
  // Usar um banco de dados em memória para os testes
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Criar um usuário organizador para os testes
  organizerUser = new User({
    name: 'Test Organizer',
    email: 'organizer@test.com',
    password: 'password123',
    role: 'organizador',
  });
  await organizerUser.save();

  // Gerar um token para o organizador
  organizerToken = jwt.sign({ user: { id: organizerUser.id, role: organizerUser.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Criar um usuário participante para os testes
  participantUser = new User({
    name: 'Test Participant',
    email: 'participant@test.com',
    password: 'password123',
    role: 'participante',
  });
  await participantUser.save();
  participantToken = jwt.sign({ user: { id: participantUser.id, role: participantUser.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Criar um usuário admin para os testes
  adminUser = new User({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
  });
  await adminUser.save();
  adminToken = jwt.sign({ user: { id: adminUser.id, role: adminUser.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

// Limpar o banco após cada teste
afterEach(async () => {
  await Event.deleteMany();
});

// Fechar a conexão após todos os testes
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Event API', () => {
  it('GET /api/events -> deve retornar um array de eventos', async () => {
    await request(app)
      .get('/api/events')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('POST /api/events -> deve criar um novo evento com um organizador autenticado', async () => {
    const newEvent = {
      title: 'Evento de Teste',
      description: 'Descrição do evento de teste.',
      date: '2025-12-31T19:00:00.000Z',
      location: 'Online',
      category: 'Tecnologia',
    };

    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send(newEvent)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe(newEvent.title);
    expect(response.body.organizer).toBe(organizerUser.id.toString());
  });

  it('POST /api/events -> deve retornar 401 se não estiver autenticado', async () => {
    const newEvent = {
      title: 'Evento de Teste',
      description: 'Descrição do evento de teste.',
      date: '2025-12-31T19:00:00.000Z',
      location: 'Online',
      category: 'Tecnologia',
    };

    await request(app)
      .post('/api/events')
      .send(newEvent)
      .expect(401);
  });

  it('GET /api/events/:id -> deve retornar um evento específico', async () => {
    const event = new Event({
      title: 'Evento para Buscar',
      description: 'Descrição.',
      date: new Date(),
      location: 'Local',
      category: 'Categoria',
      organizer: organizerUser._id,
    });
    await event.save();

    await request(app)
      .get(`/api/events/${event.id}`)
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('PUT /api/events/:id -> deve atualizar um evento se for o organizador', async () => {
    const event = new Event({ title: 'Original', description: '...', date: new Date(), location: 'Local', category: 'Cat', organizer: organizerUser._id });
    await event.save();

    const updatedData = { title: 'Evento Atualizado' };
    const response = await request(app)
      .put(`/api/events/${event.id}`)
      .set('Authorization', `Bearer ${organizerToken}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.title).toBe('Evento Atualizado');
  });

  it('PUT /api/events/:id -> não deve atualizar um evento se não for o organizador', async () => {
    const event = new Event({ title: 'Original', description: '...', date: new Date(), location: 'Local', category: 'Cat', organizer: organizerUser._id });
    await event.save();

    const updatedData = { title: 'Evento Atualizado' };
    await request(app)
      .put(`/api/events/${event.id}`)
      .set('Authorization', `Bearer ${participantToken}`)
      .send(updatedData)
      .expect(403);
  });

  it('DELETE /api/events/:id -> deve deletar um evento se for o organizador', async () => {
    const event = new Event({ title: 'A ser deletado', description: '...', date: new Date(), location: 'Local', category: 'Cat', organizer: organizerUser._id });
    await event.save();

    await request(app)
      .delete(`/api/events/${event.id}`)
      .set('Authorization', `Bearer ${organizerToken}`)
      .expect(200);

    const deletedEvent = await Event.findById(event.id);
    expect(deletedEvent).toBeNull();
  });

  it('POST /api/events/:id/subscribe -> um participante deve conseguir se inscrever em um evento', async () => {
    const event = new Event({ title: 'Evento para inscrição', description: '...', date: new Date(), location: 'Local', category: 'Cat', organizer: organizerUser._id });
    await event.save();

    const response = await request(app)
      .post(`/api/events/${event.id}/subscribe`)
      .set('Authorization', `Bearer ${participantToken}`)
      .expect(200);

    expect(response.body.participants).toContain(participantUser.id.toString());
  });

  it('DELETE /api/events/:id/subscribe -> um participante deve conseguir cancelar a inscrição', async () => {
    const event = new Event({ title: 'Evento para cancelar', description: '...', date: new Date(), location: 'Local', category: 'Cat', organizer: organizerUser._id, participants: [participantUser._id] });
    await event.save();

    const response = await request(app)
      .delete(`/api/events/${event.id}/subscribe`)
      .set('Authorization', `Bearer ${participantToken}`)
      .expect(200);

    expect(response.body.participants).not.toContain(participantUser.id.toString());
  });

  it('GET /api/events/:id/participants -> o organizador deve conseguir ver a lista de participantes', async () => {
    const event = new Event({ title: 'Evento com Participantes', description: '...', date: new Date(), location: 'Local', category: 'Cat', organizer: organizerUser._id, participants: [participantUser._id] });
    await event.save();

    const response = await request(app)
      .get(`/api/events/${event.id}/participants`)
      .set('Authorization', `Bearer ${organizerToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].email).toBe(participantUser.email);
  });
});
