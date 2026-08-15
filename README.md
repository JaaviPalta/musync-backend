# MUSYNC Backend

Backend del MVP de MUSYNC, desarrollado con Node.js, Express y Prisma para PostgreSQL.

## Descripción

MUSYNC es una plataforma para que músicos y artistas independientes gestionen su identidad profesional, publiquen contenido, ofrezcan servicios y reciban cotizaciones o pedidos desde un único perfil público.

Este repositorio contiene la API REST del backend del proyecto.

## Stack tecnológico

- Node.js
- Express
- PostgreSQL
- Prisma
- JWT
- Zod
- CORS

## Requisitos

- Node.js 18+
- PostgreSQL
- npm o pnpm

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/JaaviPalta/musync-backend.git
cd musync-backend
```
2. Instala las dependencias:
```bash
npm install
```
3. Crea un archivo .env en la raíz con tu configuración:
```bash
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/musync_dev?schema=public"
NODE_ENV="development"
JWT_SECRET="musync-dev-secret"
PORT=3000
```
4. Genera la base de datos con Prisma:
```bash
npx prisma migrate dev --name init
```
5. npm run dev:
```bash
npm run dev
```
## Estructura del proyecto
```bash
src/
  app.js
  server.js
  lib/
  middlewares/
  modules/
prisma/
  schema.prisma
```
## Endpoints principales
| Método | Ruta | Acceso | Función |
|---|---|---|---|
| ![POST](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/auth/register` | Público | Registrar artista. |
| ![POST](https://img.shields.io/badge/POST-49cc90?style=flat-square) | `/api/auth/login` | Público | Iniciar sesión. |
| ![GET](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/auth/me` | Privado | Obtener sesión actual. |
| ![GET](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/artists/:username` | Público | Obtener perfil público completo. |
| ![GET](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/profile` | Privado | Obtener perfil propio. |
| ![PUT](https://img.shields.io/badge/PUT-fca130?style=flat-square) | `/api/profile` | Privado | Crear o actualizar perfil propio. |
| ![GET](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/publications/:id` | Público | Ver detalle de publicación activa. |
| ![GET](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/artists/:username/publications` | Público | Listar publicaciones del artista. |
| ![GET](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/publications` | Privado | Listar publicaciones propias. |
| ![POST](https://img.shields.io/badge/POST-49cc90?style=flat-square) | `/api/publications` | Privado | Crear publicación. |
| ![PUT](https://img.shields.io/badge/PUT-fca130?style=flat-square) | `/api/publications/:id` | Privado | Editar publicación propia. |
| ![DELETE](https://img.shields.io/badge/DELETE-f93e3e?style=flat-square) | `/api/publications/:id` | Privado | Eliminar o desactivar publicación propia. |
| ![GET](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/artists/:username/shows` | Público | Listar shows del artista. |
| ![GET](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/shows` | Privado | Listar shows propios. |
| ![POST](https://img.shields.io/badge/POST-49cc90?style=flat-square) | `/api/shows` | Privado | Crear show. |
| ![PUT](https://img.shields.io/badge/PUT-fca130?style=flat-square) | `/api/shows/:id` | Privado | Editar show propio. |
| ![DELETE](https://img.shields.io/badge/DELETE-f93e3e?style=flat-square) | `/api/shows/:id` | Privado | Eliminar show propio. |
| ![POST](https://img.shields.io/badge/POST-49cc90?style=flat-square) | `/api/quotes` | Público | Enviar cotización o contratación. |
| ![GET](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/quotes` | Privado | Listar solicitudes recibidas. |
| ![PATCH](https://img.shields.io/badge/PATCH-50e3c2?style=flat-square) | `/api/quotes/:id/status` | Privado | Cambiar estado de una solicitud. |
| ![POST](https://img.shields.io/badge/POST-49cc90?style=flat-square) | `/api/orders` | Público | Crear orden simulada. |
| ![GET](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/orders` | Privado | Listar pedidos recibidos por el artista. |
| ![GET](https://img.shields.io/badge/GET-61affe?style=flat-square) | `/api/orders/:id` | Privado | Ver detalle de un pedido relacionado. |

Estado del proyecto
Actualmente en desarrollo del MVP backend.

Licencia
ISC
