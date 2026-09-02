# MUSYNC Backend

Backend del MVP de MUSYNC, desarrollado con Node.js, Express, Prisma y PostgreSQL.

## Descripción

MUSYNC es una plataforma para que músicos y artistas independientes gestionen su identidad profesional, publiquen contenido, ofrezcan servicios y reciban cotizaciones o solicitudes de contratación desde un único perfil público.

Este repositorio contiene la API REST del backend del proyecto.

## Stack tecnológico

- Node.js 18+
- Express
- PostgreSQL
- Prisma ORM
- JWT
- Zod
- CORS

## Requisitos

- Node.js 18 o superior.
- PostgreSQL.
- npm o pnpm.
- Una base de datos PostgreSQL disponible para el proyecto.

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/JaaviPalta/musync-backend.git
cd musync-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/musync_dev?schema=public"
NODE_ENV="development"
JWT_SECRET="reemplaza-este-valor-por-un-secreto-seguro"
PORT=3000
```

Asegúrate de que PostgreSQL esté ejecutándose y que la base de datos `musync_dev` exista.

> El valor de `JWT_SECRET` es únicamente de ejemplo. En producción debes utilizar un secreto largo, aleatorio y almacenado de forma segura.

### 4. Ejecutar las migraciones

```bash
npx prisma migrate dev --name init
```

Opcionalmente, puedes generar el cliente de Prisma:

```bash
npx prisma generate
```

### 5. Iniciar el servidor

Modo desarrollo:

```bash
npm run dev
```

La API estará disponible en:

```text
http://localhost:3000/api
```

El estado del servidor puede comprobarse en:

```text
http://localhost:3000/health
```

## Estructura del proyecto

```text
src/
├── app.js
├── server.js
├── lib/
├── middlewares/
└── modules/

prisma/
└── schema.prisma
```

## Endpoints principales

| Método | Ruta | Acceso | Función |
|---|---|---|---|
| GET | `/health` | Público | Comprobar que el backend está funcionando. |
| POST | `/api/auth/register` | Público | Registrar un artista. |
| POST | `/api/auth/login` | Público | Iniciar sesión. |
| GET | `/api/auth/me` | Privado | Obtener la sesión actual. |
| GET | `/api/artists/:username` | Público | Obtener el perfil público completo de un artista. |
| GET | `/api/profile` | Privado | Obtener el perfil propio. |
| PATCH | `/api/profile` | Privado | Crear o actualizar el perfil propio. |
| GET | `/api/publications/:id` | Público | Ver el detalle de una publicación activa. |
| GET | `/api/artists/:username/publications` | Público | Listar las publicaciones de un artista. |
| GET | `/api/publications` | Privado | Listar las publicaciones propias. |
| POST | `/api/publications` | Privado | Crear una publicación. |
| PATCH | `/api/publications/:id` | Privado | Editar una publicación propia. |
| DELETE | `/api/publications/:id` | Privado | Eliminar o desactivar una publicación propia. |
| GET | `/api/artists/:username/shows` | Público | Listar los shows de un artista. |
| GET | `/api/shows` | Privado | Listar los shows propios. |
| POST | `/api/shows` | Privado | Crear un show. |
| PATCH | `/api/shows/:id` | Privado | Editar un show propio. |
| DELETE | `/api/shows/:id` | Privado | Eliminar un show propio. |
| POST | `/api/quotes` | Público | Enviar una cotización o solicitud de contratación. |
| GET | `/api/quotes` | Privado | Listar las solicitudes recibidas. |
| PATCH | `/api/quotes/:id/status` | Privado | Cambiar el estado de una solicitud. |
| POST | `/api/orders` | Público | Crear una orden simulada. |
| GET | `/api/orders` | Privado | Listar los pedidos recibidos por el artista. |
| GET | `/api/orders/:id` | Privado | Ver el detalle de un pedido relacionado. |

## Autenticación

Los endpoints privados requieren un token JWT en el encabezado:

```http
Authorization: Bearer <token>
```

## Códigos de respuesta

- `200 OK`: Solicitud procesada correctamente.
- `201 Created`: Recurso creado correctamente.
- `400 Bad Request`: Datos inválidos.
- `401 Unauthorized`: Falta autenticación o el token no es válido.
- `403 Forbidden`: El usuario no tiene permisos suficientes.
- `404 Not Found`: Recurso no encontrado.
- `409 Conflict`: El recurso ya existe.
- `500 Internal Server Error`: Error inesperado del servidor.

## Estado del proyecto

Actualmente se encuentra en desarrollo como MVP del backend.

## Licencia

ISC
