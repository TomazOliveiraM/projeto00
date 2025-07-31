// Dados mocados que antes estavam nos componentes
const mockEvents = [
  {
    id: 'evt1',
    title: 'Conferência de Tecnologia 2025',
    date: '2025-10-26T19:00:00Z',
    location: 'Centro de Convenções, Pernambuco',
    description: 'A maior conferência de tecnologia da América Latina, com palestras, workshops e networking. Junte-se a nós para explorar as últimas tendências em IA, desenvolvimento de software, cibersegurança e muito mais. Uma oportunidade única para aprender com os melhores e expandir sua rede de contatos.',
    imageUrl: 'https://i0.wp.com/blog.portaleducacao.com.br/wp-content/uploads/2022/02/365-O-que-e%CC%81-tecnologia_.jpg?fit=740%2C416&ssl=1',
    isSubscribed: false,
  },
  {
    id: 'evt2',
    title: 'Workshop de Design UX/UI',
    date: '2025-11-12T14:00:00Z',
    location: 'Online',
    description: 'Aprenda na prática os fundamentos de UX/UI com designers renomados do mercado. Este workshop intensivo cobrirá desde a pesquisa de usuário até a prototipação e testes de usabilidade. Ideal para iniciantes e profissionais que desejam aprimorar suas habilidades.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
    isSubscribed: true,
  },
  {
    id: 'evt3',
    title: 'Festival de Música Indie',
    date: '2025-12-05T18:00:00Z',
    location: 'Recife, Pernambuco',
    description: 'Um dia inteiro de música com as melhores bandas da cena indie nacional e internacional. Além dos shows, o festival contará com food trucks, feira de vinil e atividades culturais. Traga seus amigos e venha curtir!',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    isSubscribed: false,
  },
];

// Simula a busca de um evento pelo ID
export const getEventById = (eventId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const event = mockEvents.find(e => e.id === eventId);
      if (event) {
        resolve(event);
      } else {
        reject(new Error('Evento não encontrado.'));
      }
    }, 500); // Simula delay da rede
  });
};

