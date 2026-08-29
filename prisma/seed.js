import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma.js';

const ARTISTS_COUNT = 20;
const PUBLICATIONS_PER_ARTIST = 4;
const SHOWS_PER_ARTIST = 2;
const QUOTES_COUNT = 12;
const ORDERS_COUNT = 6;
const TEST_PASSWORD = 'Password123!';

const publicationTypes = ['music', 'digital_product', 'service', 'portfolio'];
const quoteStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
const requestTypes = ['quote', 'booking'];

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function futureDate(days = 365) {
  return faker.date.soon({ days });
}

async function main() {
  console.log('Limpiando base de datos...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.show.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.artistProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
  const artists = [];
  const publications = [];

  console.log('Creando artistas y perfiles...');

  for (let i = 0; i < ARTISTS_COUNT; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const artistName = faker.helpers.arrayElement([
      `${firstName} ${lastName}`,
      `${firstName} ${faker.word.adjective()}`,
      faker.music.artist(),
    ]);
    const username = `${slugify(artistName).slice(0, 23)}-${i + 1}`;

    const artist = await prisma.user.create({
      data: {
        name: fullName,
        email: `artist${i + 1}@musync.test`,
        passwordHash,
        artistProfile: {
          create: {
            artistName,
            username,
            bio: faker.lorem.paragraph(),
            specialty: faker.helpers.arrayElement([
              'Cantautor',
              'Banda en vivo',
              'Productor musical',
              'DJ',
              'Músico de sesión',
              'Compositor',
            ]),
            city: faker.helpers.arrayElement([
              'Santiago',
              'Valparaíso',
              'Concepción',
              'La Serena',
              'Temuco',
              'Puerto Montt',
            ]),
            country: 'Chile',
            avatarUrl: `https://i.pravatar.cc/400?u=artist-${i + 1}`,
            coverUrl: `https://picsum.photos/seed/musync-cover-${i + 1}/1200/500`,
            spotifyUrl: 'https://open.spotify.com/',
            youtubeUrl: 'https://www.youtube.com/',
            instagramUrl: `https://instagram.com/${username}`,
            tiktokUrl: `https://tiktok.com/@${username}`,
          },
        },
      },
      include: {
        artistProfile: true,
      },
    });

    artists.push(artist);
  }

  console.log('Creando publicaciones y shows...');

  for (const artist of artists) {
    const profileId = artist.artistProfile.id;

    for (let j = 0; j < PUBLICATIONS_PER_ARTIST; j++) {
      const type = faker.helpers.arrayElement(publicationTypes);
      const isPaid = type === 'digital_product' || type === 'service';

      const publication = await prisma.publication.create({
        data: {
          artistProfileId: profileId,
          type,
          title:
            type === 'music'
              ? faker.music.songName()
              : faker.lorem.sentence({ min: 3, max: 7 }),
          description: faker.lorem.paragraph(),
          price: isPaid ? faker.number.int({ min: 15000, max: 350000 }) : null,
          imageUrl: `https://picsum.photos/seed/publication-${faker.string.uuid()}/900/600`,
          externalUrl:
            type === 'music' ? 'https://open.spotify.com/' : 'https://musync.test/',
          isActive: faker.datatype.boolean({ probability: 0.9 }),
        },
      });

      publications.push(publication);
    }

    await prisma.show.createMany({
      data: Array.from({ length: SHOWS_PER_ARTIST }, () => ({
        artistProfileId: profileId,
        name: faker.helpers.arrayElement([
          'Concierto en vivo',
          'Sesión acústica',
          'Show privado',
          'Festival musical',
          'Presentación especial',
        ]),
        venue: faker.company.name(),
        city: faker.helpers.arrayElement([
          'Santiago',
          'Valparaíso',
          'Viña del Mar',
          'Concepción',
          'Rancagua',
        ]),
        showDate: futureDate(365),
      })),
    });
  }

  console.log('Creando solicitudes de cotización...');

  for (let i = 0; i < QUOTES_COUNT; i++) {
    const artist = faker.helpers.arrayElement(artists);
    const artistPublications = publications.filter(
      (publication) => publication.artistProfileId === artist.artistProfile.id
    );
    const publication = faker.helpers.arrayElement([null, ...artistPublications]);

    await prisma.quote.create({
      data: {
        artistProfileId: artist.artistProfile.id,
        publicationId: publication?.id ?? null,
        requestType: faker.helpers.arrayElement(requestTypes),
        clientName: faker.person.fullName(),
        clientEmail: faker.internet.email(),
        budget: faker.number.int({ min: 50000, max: 800000 }),
        eventDate: futureDate(240),
        message: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(quoteStatuses),
      },
    });
  }

  console.log('Creando órdenes y sus ítems...');

  for (let i = 0; i < ORDERS_COUNT; i++) {
    const artist = faker.helpers.arrayElement(artists);
    const artistPublications = publications.filter(
      (publication) =>
        publication.artistProfileId === artist.artistProfile.id &&
        publication.price !== null
    );

    if (artistPublications.length === 0) continue;

    const selectedPublications = faker.helpers.arrayElements(
      artistPublications,
      Math.min(2, artistPublications.length)
    );

    const items = selectedPublications.map((publication) => {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const unitPrice = publication.price;

      return {
        publicationId: publication.id,
        quantity,
        unitPrice,
        lineTotal: quantity * unitPrice,
      };
    });

    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

    await prisma.order.create({
      data: {
        artistProfileId: artist.artistProfile.id,
        buyerName: faker.person.fullName(),
        buyerEmail: faker.internet.email(),
        status: faker.helpers.arrayElement(['created', 'cancelled']),
        total,
        items: {
          create: items,
        },
      },
    });
  }

  console.log('Seed completado correctamente.');
  console.log(`Artistas: ${artists.length}`);
  console.log(`Publicaciones: ${publications.length}`);
  console.log(`Contraseña de prueba: ${TEST_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error('Error ejecutando el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
